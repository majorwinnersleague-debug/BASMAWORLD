import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sql } from '@/lib/db'
import { ensurePhase0Tables } from '@/lib/phase0-schema'
import { getWebhookSecrets, verifyStripeEvent } from '@/lib/stripe-webhook'
import { airtableString, escapeHtml } from '@/lib/escape'
import { sendResendEmail } from '@/lib/auth-email'

/**
 * Academy Stripe webhook (private lesson packages).
 *
 * Delivery guarantees (Phase 0):
 * - Signature checked with STRIPE_WEBHOOK_SECRET_ACADEMY (legacy shared secret as fallback).
 * - Every handled event is logged in Neon stripe_events; an event that was
 *   already processed is acknowledged without re-running side effects.
 * - If the Neon write fails we return 500, so Stripe retries (for up to 3 days).
 * - Only the Airtable request row for THIS checkout session is marked Paid.
 * - The admin "purchase" email is sent here, after payment, not at checkout start.
 */

const ACADEMY_INBOX = 'becomeasingermusicacademy@gmail.com'

// NOTE: prices are duplicated in the checkout route and page; Phase 1 moves
// them to one lib/pricing.ts.
const PACKAGES: Record<string, { name: string; duration: string; sessions: number; total: number }> = {
  'individual-30min': { name: 'Individual 30-Minute Lesson', duration: '30 min', sessions: 1, total: 45 },
  'individual-60min': { name: 'Individual 60-Minute Lesson', duration: '1 hour', sessions: 1, total: 70 },
  'monthly-4x30min': { name: 'Monthly 4 × 30-Minute Lessons', duration: '30 min', sessions: 4, total: 135 },
  'monthly-4x60min': { name: 'Monthly 4 × 60-Minute Lessons', duration: '1 hour', sessions: 4, total: 200 },
}

const HANDLED_EVENTS = new Set(['checkout.session.completed', 'checkout.session.async_payment_succeeded'])

type Pkg = (typeof PACKAGES)[string]
type Db = NonNullable<typeof sql>

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey || getWebhookSecrets('academy').length === 0) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }
  const stripe = new Stripe(secretKey, { apiVersion: '2026-03-25.dahlia' })

  const body = await req.text()
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Webhook signature verification is required' }, { status: 400 })
  }
  const event = verifyStripeEvent(stripe, body, signature, 'academy')
  if (!event) {
    console.error('[stripe-webhook] Signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (!HANDLED_EVENTS.has(event.type)) return NextResponse.json({ received: true })
  const session = event.data.object as Stripe.Checkout.Session
  if (session.payment_status !== 'paid') return NextResponse.json({ received: true })
  const meta = session.metadata || {}
  if (meta.type !== 'private_lesson_package') return NextResponse.json({ received: true })

  const pkg = PACKAGES[meta.packageId || '']
  if (!pkg) {
    console.error(`[stripe-webhook] Unknown packageId "${meta.packageId}" on paid session ${session.id}; not recorded`)
    return NextResponse.json({ received: true })
  }

  // Neon is required for idempotency and the operational record. If it is
  // unavailable, fail so Stripe retries rather than losing the payment.
  if (!sql) {
    console.error('[stripe-webhook] DATABASE_URL not configured; asking Stripe to retry')
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }
  const db = sql

  try {
    await ensurePhase0Tables()
    const [logged] = await db`
      INSERT INTO stripe_events (event_id, type, endpoint)
      VALUES (${event.id}, ${event.type}, 'academy')
      ON CONFLICT (event_id) DO UPDATE SET attempts = stripe_events.attempts + 1
      RETURNING processed_at
    `
    if (logged?.processed_at) {
      return NextResponse.json({ received: true, duplicate: true })
    }
  } catch (error) {
    console.error('[stripe-webhook] Could not log event; asking Stripe to retry:', error)
    return NextResponse.json({ error: 'Event log unavailable' }, { status: 500 })
  }

  const email = meta.email || session.customer_details?.email || ''
  const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id || ''
  const amountCents = typeof session.amount_total === 'number' ? session.amount_total : Math.round(pkg.total * 100)

  try {
    await recordPaymentInNeon(db, { session, meta, pkg, email, paymentIntentId, amountCents })
  } catch (error) {
    console.error('[stripe-webhook] Neon operational update failed; asking Stripe to retry:', error)
    try {
      await db`UPDATE stripe_events SET last_error = ${String(error).slice(0, 1000)} WHERE event_id = ${event.id}`
    } catch { /* ignore */ }
    return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 })
  }

  // Airtable is the marketing/history copy: best-effort, never blocks.
  await markAirtableRequestPaid({ sessionId: session.id, paymentIntentId, email, studentName: meta.studentName || '' })

  try {
    await db`UPDATE stripe_events SET processed_at = NOW(), last_error = NULL WHERE event_id = ${event.id}`
  } catch (error) {
    // The payment is recorded; a retry would only re-run idempotent writes.
    console.error('[stripe-webhook] Could not mark event processed:', error)
  }

  await sendPurchaseEmail({ meta, pkg, email, amountCents, sessionId: session.id })

  console.log(`[stripe-webhook] Private lesson payment confirmed: ${pkg.name} — ${session.id}`)
  return NextResponse.json({ received: true })
}

/* ───────────────────────────── Neon ───────────────────────────── */

async function recordPaymentInNeon(
  db: Db,
  args: {
    session: Stripe.Checkout.Session
    meta: Record<string, string>
    pkg: Pkg
    email: string
    paymentIntentId: string
    amountCents: number
  }
) {
  const { session, meta, pkg, email, paymentIntentId, amountCents } = args
  const requestId = Number(meta.requestId || 0)
  const requests = requestId
    ? await db`SELECT * FROM lesson_requests WHERE id = ${requestId} LIMIT 1`
    : await db`SELECT * FROM lesson_requests WHERE stripe_session_id = ${session.id} LIMIT 1`
  let request = requests[0]

  // If checkout could not write Neon, reconstruct the request from trusted
  // Stripe metadata so a successful payment can still activate the student.
  if (!request) {
    const [created] = await db`
      INSERT INTO lesson_requests (
        parent_name, email, phone, student_name, student_age, instrument,
        preferred_day, preferred_time, notes, package_id, package_name,
        amount_cents, status, stripe_session_id, stripe_payment_id, paid_at
      ) VALUES (
        ${meta.parentName || ''}, ${email}, ${meta.phone || null}, ${meta.studentName || ''},
        ${meta.studentAge || null}, ${meta.instrument || null},
        ${meta.preferredDay || 'Flexible'}, ${meta.preferredTime || 'Flexible'}, ${meta.notes || null},
        ${meta.packageId || null}, ${pkg.name}, ${amountCents}, 'Paid',
        ${session.id}, ${paymentIntentId || null}, NOW()
      )
      ON CONFLICT (stripe_session_id) DO UPDATE SET
        status = 'Paid',
        stripe_payment_id = EXCLUDED.stripe_payment_id,
        paid_at = COALESCE(lesson_requests.paid_at, EXCLUDED.paid_at)
      RETURNING *
    `
    request = created
  } else {
    await db`
      UPDATE lesson_requests
      SET status = 'Paid',
          stripe_session_id = ${session.id},
          stripe_payment_id = ${paymentIntentId || null},
          paid_at = COALESCE(paid_at, NOW())
      WHERE id = ${request.id}
    `
  }

  const existing = await db`
    SELECT id FROM active_students
    WHERE LOWER(email) = LOWER(${request.email})
      AND LOWER(student_name) = LOWER(${request.student_name})
    LIMIT 1
  `

  if (existing.length) {
    await db`
      UPDATE active_students
      SET student_age = ${request.student_age},
          parent_name = ${request.parent_name},
          phone = ${request.phone},
          lesson_type = 'Private',
          instrument = ${request.instrument},
          status = 'Active',
          notes = ${request.notes},
          updated_at = NOW()
      WHERE id = ${existing[0].id}
    `
  } else {
    await db`
      INSERT INTO active_students (
        student_name, student_age, parent_name, email, phone, status,
        lesson_type, instrument, notes
      ) VALUES (
        ${request.student_name}, ${request.student_age}, ${request.parent_name},
        ${request.email}, ${request.phone}, 'Active', 'Private',
        ${request.instrument}, ${request.notes}
      )
    `
  }
}

/* ──────────────────────────── Airtable ─────────────────────────── */

const AIRTABLE_REQUESTS_TABLE = 'Private Lesson Requests'

async function markAirtableRequestPaid(args: {
  sessionId: string
  paymentIntentId: string
  email: string
  studentName: string
}) {
  const pat = process.env.AIRTABLE_PAT || ''
  const base = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
  if (!pat) return
  const table = encodeURIComponent(AIRTABLE_REQUESTS_TABLE)
  const headers = { Authorization: `Bearer ${pat}` }

  const findOne = async (formula: string, sortByRequestDate = false) => {
    const url = new URL(`https://api.airtable.com/v0/${base}/${table}`)
    url.searchParams.set('filterByFormula', formula)
    url.searchParams.set('maxRecords', '1')
    if (sortByRequestDate) {
      url.searchParams.set('sort[0][field]', 'Request Date')
      url.searchParams.set('sort[0][direction]', 'desc')
    }
    const res = await fetch(url.toString(), { headers, cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    return (data.records?.[0] as { id: string } | undefined) || null
  }

  try {
    // 1) The row created at checkout carries this session id.
    let record = await findOne(`{Stripe Session} = ${airtableString(args.sessionId)}`)

    // 2) Rows created before Phase 0 have no session id: take the single most
    //    recent still-pending request for this email AND student — never all rows.
    if (!record && args.email && args.studentName) {
      record = await findOne(
        `AND(LOWER({Email}) = ${airtableString(args.email.toLowerCase())}, ` +
          `LOWER({Student Name}) = ${airtableString(args.studentName.toLowerCase())}, ` +
          `{Status} = "Payment Pending")`,
        true
      )
    }

    if (!record) {
      console.error(`[stripe-webhook] No Airtable request row found for session ${args.sessionId}`)
      return
    }

    const patch = async (fields: Record<string, string>) =>
      fetch(`https://api.airtable.com/v0/${base}/${table}`, {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: [{ id: record!.id, fields }] }),
      })

    let res = await patch({
      Status: 'Paid',
      'Stripe Session': args.sessionId,
      'Stripe Payment ID': args.paymentIntentId,
      'Payment Date': new Date().toISOString().split('T')[0],
    })
    if (!res.ok) {
      // A missing optional column shouldn't stop the status update.
      console.error('[stripe-webhook] Airtable full update failed:', res.status, await res.text())
      res = await patch({ Status: 'Paid' })
      if (!res.ok) console.error('[stripe-webhook] Airtable status update failed:', res.status)
    }
  } catch (error) {
    console.error('[stripe-webhook] Airtable update failed:', error)
  }
}

/* ───────────────────────────── Email ───────────────────────────── */

async function sendPurchaseEmail(args: {
  meta: Record<string, string>
  pkg: Pkg
  email: string
  amountCents: number
  sessionId: string
}) {
  const { meta, pkg, email, amountCents, sessionId } = args
  const e = escapeHtml
  const ok = await sendResendEmail({
    to: ACADEMY_INBOX,
    subject: `💰 Paid: Private Lesson Package — ${(meta.studentName || 'student').slice(0, 80)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #4a0e78, #6b21a8); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h2 style="color: #ffd700; margin: 0;">💰 Lesson Package Paid</h2>
        </div>
        <div style="background: #fff; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
          <p><strong>Package:</strong> ${e(pkg.name)} (${pkg.sessions} × ${e(pkg.duration)})</p>
          <p><strong>Paid:</strong> $${(amountCents / 100).toFixed(2)}</p>
          <hr style="margin: 12px 0;">
          <p><strong>Parent:</strong> ${e(meta.parentName)}</p>
          <p><strong>Phone:</strong> ${e(meta.phone)}</p>
          <p><strong>Email:</strong> ${e(email)}</p>
          <p><strong>Student:</strong> ${e(meta.studentName)} (age ${e(meta.studentAge || 'N/A')})</p>
          <p><strong>Instrument:</strong> ${e(meta.instrument || 'Any')}</p>
          <p><strong>Preferred:</strong> ${e(meta.preferredDay || 'Flexible')} at ${e(meta.preferredTime || 'Flexible')}</p>
          ${meta.notes ? `<p><strong>Notes:</strong> ${e(meta.notes)}</p>` : ''}
          <p style="font-size: 12px; color: #666; margin-top: 16px;">Stripe session: ${e(sessionId)}</p>
        </div>
      </div>
    `,
  })
  if (!ok) console.error(`[stripe-webhook] Purchase email failed for ${sessionId}`)
}
