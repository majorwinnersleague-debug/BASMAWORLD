import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

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
      packageName,
      duration,
      sessions,
      total,
      pricePerSession,
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

    if (!packageId || !total || !parentName || !email || !phone || !studentName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate total matches expected pricing
    const expectedTotals: Record<string, number> = {
      '30min': 140,
      '60min': 200,
    }
    if (expectedTotals[packageId] !== total) {
      return NextResponse.json({ error: 'Invalid package pricing' }, { status: 400 })
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
    }

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
      success_url: `https://basmaworld.com/private-lessons?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'https://basmaworld.com/private-lessons',
    })

    // Also save to Airtable if configured
    const AIRTABLE_PAT = process.env.AIRTABLE_PAT || ''
    const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'

    if (AIRTABLE_PAT) {
      try {
        await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent('Private Lesson Requests')}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${AIRTABLE_PAT}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            records: [{
              fields: {
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
              },
            }],
          }),
        })
      } catch (err) {
        console.error('Airtable create error:', err)
        // Non-fatal — payment can still proceed
      }
    }

    // Email notification
    const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
    if (RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'BASMA Academy <onboarding@resend.dev>',
            to: 'becomeasingermusicacademy@gmail.com',
            subject: `💰 Private Lesson Package Purchase — ${studentName}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #4a0e78, #6b21a8); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
                  <h2 style="color: #ffd700; margin: 0;">💰 Lesson Package Purchase</h2>
                </div>
                <div style="background: #fff; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
                  <p><strong>Package:</strong> ${packageName} (${sessions} × ${duration})</p>
                  <p><strong>Total:</strong> $${total}</p>
                  <hr style="margin: 12px 0;">
                  <p><strong>Parent:</strong> ${parentName}</p>
                  <p><strong>Phone:</strong> ${phone}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Student:</strong> ${studentName} (age ${studentAge || 'N/A'})</p>
                  <p><strong>Instrument:</strong> ${instrument || 'Any'}</p>
                  <p><strong>Preferred:</strong> ${preferredDay || 'Flexible'} at ${preferredTime || 'Flexible'}</p>
                  ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
                  <p style="font-size: 13px; color: #666; margin-top: 16px;">
                    Payment is being processed via Stripe. Check your dashboard for confirmation.
                  </p>
                </div>
              </div>
            `,
          }),
        })
      } catch {
        // Non-fatal
      }
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe private lesson checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
