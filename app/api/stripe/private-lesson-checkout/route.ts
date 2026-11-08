import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { sql } from '@/lib/db'
import { getPackage, getPrice, STANDARD_PRICES } from '@/lib/pricing'

export async function POST(req: NextRequest) {
  // Rate limit: 5 checkout attempts per IP per 10 minutes
  const ip = getClientIp(req)
  const { allowed } = checkRateLimit(`stripe-private-lesson:${ip}`, 5, 10 * 60 * 1000)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many checkout attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '600' } }
    )
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const stripe = new Stripe(secretKey, { apiVersion: '2026-03-25.dahlia' })

  try {
    const body = await req.json()

    const {
      packageId,
      parentName,
      email,
      phone,
      studentName,
      studentAge,
      instrument,
      preferredDay,
      preferredTime,
      notes,
    } = body

    if (!packageId || !parentName || !email || !phone || !studentName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Server-side pricing from lib/pricing.ts (the only price list). Any price
    // sent by the browser is ignored.
    const pkg = getPackage(packageId)
    if (!pkg) {
      return NextResponse.json({ error: 'Invalid lesson option' }, { status: 400 })
    }
    const { name: packageName, duration, sessions } = pkg
    const now = new Date()
    let total: number
    try {
      total = getPrice(pkg.id, now)
    } catch (error) {
      console.error('[private-lesson-checkout] Pricing refused:', error)
      return NextResponse.json({ error: 'This lesson option is temporarily unavailable. Please call us.' }, { status: 500 })
    }
    const regularTotal = STANDARD_PRICES[pkg.id]

    // Record the request in Neon when the operational database is available.
    // This is best-effort so Neon cannot take down the existing Stripe checkout flow.
    let requestId = ''
    if (sql) {
      try {
        const [request] = await sql`
          INSERT INTO lesson_requests (
            parent_name, email, phone, student_name, student_age, instrument,
            preferred_day, preferred_time, notes, package_id, package_name, amount_cents, status
          ) VALUES (
            ${parentName}, ${email}, ${phone}, ${studentName}, ${studentAge || null}, ${instrument || null},
            ${preferredDay || 'Flexible'}, ${preferredTime || 'Flexible'}, ${notes || null},
            ${packageId}, ${packageName}, ${Math.round(total * 100)}, 'Payment Pending'
          )
          RETURNING id
        `
        requestId = String(request.id)
      } catch (error) {
        console.error('[private-lesson-checkout] Neon request save failed:', error)
      }
    }

    const metadata: Record<string, string> = {
      type: 'private_lesson_package',
      packageId,
      packageName: packageName || '',
      duration: duration || '',
      sessions: String(sessions || 4),
      parentName: parentName || '',
      email: email || '',
      phone: phone || '',
      studentName: studentName || '',
      studentAge: studentAge || '',
      instrument: instrument || '',
      preferredDay: preferredDay || 'Flexible',
      preferredTime: preferredTime || 'Flexible',
      notes: notes || '',
      priceUsd: String(total),
      regularPriceUsd: String(regularTotal),
      ...(total < regularTotal ? { discount: 'holiday-special' } : {}),
      ...(requestId ? { requestId } : {}),
    }

    // Return to the site the parent started from (production or a preview).
    const origin = new URL(req.url).origin

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Private Lesson Package — ${packageName}`,
              description: `${sessions} × ${duration} private lessons for ${studentName}. Instrument: ${instrument || 'TBD'}. Includes 1 makeup lesson (must be used by 2nd week of following month). Preferred: ${preferredDay || 'Flexible'} at ${preferredTime || 'Flexible'}.`,
            },
            unit_amount: Math.round(total * 100), // cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email || undefined,
      metadata,
      // The success page confirms payment with Stripe using this session id
      // before showing "Payment Successful" or recording a Google Ads conversion.
      success_url: `${origin}/private-lessons?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/private-lessons`,
    })

    // Attach the Stripe session to the Neon request when it was recorded.
    if (sql && requestId) {
      try {
        await sql`
          UPDATE lesson_requests
          SET stripe_session_id = ${session.id}
          WHERE id = ${requestId}
        `
      } catch (error) {
        console.error('[private-lesson-checkout] Neon session update failed:', error)
      }
    }

    // Also save to Airtable if configured
    const AIRTABLE_PAT = process.env.AIRTABLE_PAT || ''
    const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'

    if (AIRTABLE_PAT) {
      const fields: Record<string, string> = {
        'Parent Name': parentName,
        'Email': email,
        'Phone': phone,
        'Student Name': studentName,
        'Student Age': studentAge || '',
        'Instrument': instrument || 'Any',
        'Preferred Day': preferredDay || 'Flexible',
        'Preferred Time': preferredTime || 'Flexible',
        'Notes': `Package: ${packageName} (${sessions}×${duration}, $${total}). ${notes || ''}`,
        'Status': 'Payment Pending',
        'Request Date': new Date().toISOString().split('T')[0],
        // Lets the webhook mark exactly this row as Paid.
        'Stripe Session': session.id,
      }
      const createRow = (f: Record<string, string>) =>
        fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent('Private Lesson Requests')}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${AIRTABLE_PAT}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ records: [{ fields: f }] }),
        })
      try {
        const res = await createRow(fields)
        if (!res.ok) {
          // If the "Stripe Session" column is missing, still record the request.
          console.error('Airtable create error:', res.status, await res.text())
          const { ['Stripe Session']: _omit, ...withoutSession } = fields
          await createRow(withoutSession)
        }
      } catch (err) {
        console.error('Airtable create error:', err)
        // Non-fatal — payment can still proceed
      }
    }

    // The admin "💰 Purchase" email is now sent by /api/stripe/webhook after
    // Stripe confirms payment, so abandoned checkouts no longer look like sales.

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe private lesson checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
