import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sql } from '@/lib/db'

const PACKAGES: Record<string, { name: string; duration: string; sessions: number; total: number }> = {
  'individual-30min': { name: 'Individual 30-Minute Lesson', duration: '30 min', sessions: 1, total: 45 },
  'individual-60min': { name: 'Individual 60-Minute Lesson', duration: '1 hour', sessions: 1, total: 70 },
  'monthly-4x30min': { name: 'Monthly 4 × 30-Minute Lessons', duration: '30 min', sessions: 4, total: 135 },
  'monthly-4x60min': { name: 'Monthly 4 × 60-Minute Lessons', duration: '1 hour', sessions: 4, total: 200 },
}

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  const stripe = new Stripe(secretKey, { apiVersion: '2026-03-25.dahlia' })
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  let event: Stripe.Event
  try {
    if (!signature || !webhookSecret) return NextResponse.json({ error: 'Webhook signature verification is required' }, { status: 400 })
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('[stripe-webhook] Signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
  if (event.type !== 'checkout.session.completed') return NextResponse.json({ received: true })
  const session = event.data.object as Stripe.Checkout.Session
  if (session.payment_status !== 'paid') return NextResponse.json({ received: true })
  const meta = session.metadata || {}
  if (meta.type !== 'private_lesson_package') return NextResponse.json({ received: true })
  const pkg = PACKAGES[meta.packageId || '']
  if (!pkg) return NextResponse.json({ received: true })
  const email = meta.email || session.customer_details?.email || ''
  const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id || ''

  // Update the operational Neon database when it is available.
  // Failures here must not prevent Stripe from receiving a successful webhook response
  // or stop the existing Airtable reconciliation.
  if (sql) {
    try {
      const requestId = Number(meta.requestId || 0)
      let requests = requestId
        ? await sql`SELECT * FROM lesson_requests WHERE id = ${requestId} LIMIT 1`
        : await sql`SELECT * FROM lesson_requests WHERE stripe_session_id = ${session.id} LIMIT 1`
      let request = requests[0]

      // If checkout could not write Neon, reconstruct the request from trusted
      // Stripe metadata so a successful payment can still activate the student.
      if (!request) {
        const [created] = await sql`
          INSERT INTO lesson_requests (
            parent_name, email, phone, student_name, student_age, instrument,
            preferred_day, preferred_time, notes, package_id, package_name,
            amount_cents, status, stripe_session_id, stripe_payment_id, paid_at
          ) VALUES (
            ${meta.parentName || ''}, ${email}, ${meta.phone || null}, ${meta.studentName || ''},
            ${meta.studentAge || null}, ${meta.instrument || null},
            ${meta.preferredDay || 'Flexible'}, ${meta.preferredTime || 'Flexible'}, ${meta.notes || null},
            ${meta.packageId || null}, ${pkg.name}, ${Math.round(pkg.total * 100)}, 'Paid',
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
        await sql`
          UPDATE lesson_requests
          SET status = 'Paid',
              stripe_session_id = ${session.id},
              stripe_payment_id = ${paymentIntentId || null},
              paid_at = COALESCE(paid_at, NOW())
          WHERE id = ${request.id}
        `
      }

      const existing = await sql`
        SELECT id FROM active_students
        WHERE LOWER(email) = LOWER(${request.email})
          AND LOWER(student_name) = LOWER(${request.student_name})
        LIMIT 1
      `

      if (existing.length) {
        await sql`
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
        await sql`
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
    } catch (error) {
      console.error('[stripe-webhook] Neon operational update failed:', error)
      // Airtable reconciliation below remains independent.
    }
  }
  const pat = process.env.AIRTABLE_PAT || ''
  const base = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
  if (pat && email) {
    try {
      const formula = `{Email} = '${email.replace(/'/g, "\\'")}'`
      const table = encodeURIComponent('Private Lesson Requests')
      const url = `https://api.airtable.com/v0/${base}/${table}?filterByFormula=${encodeURIComponent(formula)}&maxRecords=20`
      const response = await fetch(url, { headers: { Authorization: `Bearer ${pat}` } })
      const data = await response.json()
      for (const record of data.records || []) {
        await fetch(`https://api.airtable.com/v0/${base}/${table}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${pat}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ records: [{ id: record.id, fields: { Status: 'Paid', 'Stripe Session': session.id, 'Stripe Payment ID': paymentIntentId, 'Payment Date': new Date().toISOString().split('T')[0] } }] }),
        })
      }
    } catch (error) { console.error('[stripe-webhook] Airtable update failed:', error) }
  }
  console.log(`[stripe-webhook] Private lesson payment confirmed: ${pkg.name} — $${pkg.total} — ${email}`)
  return NextResponse.json({ received: true })
}