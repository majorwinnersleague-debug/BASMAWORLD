import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || ''
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
const SUMMER_TABLE = 'tblfOnRDkfgZoCF9X' // Summer 2026 Registrations
const LEADS_TABLE = 'tbl1diIEhM9MtKViE' // Marketing Leads

/**
 * Stripe webhook for camp enrollment payments.
 * When checkout.session.completed fires, update Airtable payment status
 * so teacher portal and parent portal show accurate paid/confirmed counts.
 */
export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secretKey) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const stripe = new Stripe(secretKey, { apiVersion: '2026-03-25.dahlia' })
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  let event: Stripe.Event

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } else {
      // Fallback: parse without signature verification (dev mode)
      event = JSON.parse(body)
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const meta = session.metadata || {}
    const email = meta.email || session.customer_details?.email || ''
    const studentsList = meta.students || '' // "Name (age X) - Class @ Time | ..."

    if (email) {
      try {
        // Update all Summer 2026 records for this email to Paid
        await updateAirtablePaymentStatus(SUMMER_TABLE, 'Parent Email', email, {
          'Payment Status': 'Paid',
          'Stripe Session': session.id,
          'Amount Paid': String((session.amount_total || 0) / 100),
          'Payment Date': new Date().toISOString().split('T')[0],
        })

        // Also update Marketing Leads status
        await updateAirtablePaymentStatus(LEADS_TABLE, 'Email', email, {
          'Status': 'Enrolled — Paid',
        })

        console.log(`[stripe-webhook] Payment confirmed for ${email}: $${(session.amount_total || 0) / 100}`)
      } catch (err) {
        console.error('[stripe-webhook] Airtable update error:', err)
      }
    }

    // Send confirmation email
    try {
      const parentName = meta.parentName || session.customer_details?.name || 'Parent'
      const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
      if (RESEND_API_KEY && email) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'BASMA Academy <onboarding@resend.dev>',
            to: email,
            subject: '🎵 Enrollment Confirmed — BASMA Summer Camp 2026',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #4a0e78, #6b21a8); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
                  <h2 style="color: #ffd700; margin: 0;">✅ You're In!</h2>
                </div>
                <div style="background: #fff; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
                  <p>Hi ${parentName},</p>
                  <p>Your enrollment is confirmed! Here are the details:</p>
                  <div style="background: #f9fafb; padding: 14px; border-radius: 8px; margin: 16px 0;">
                    <p style="margin: 0; font-size: 14px;"><strong>Students:</strong> ${studentsList.replace(/\|/g, '<br>')}</p>
                    <p style="margin: 8px 0 0; font-size: 14px;"><strong>Month:</strong> ${meta.month === 'july' ? 'July' : 'August'} 2026</p>
                    <p style="margin: 4px 0 0; font-size: 14px;"><strong>Days:</strong> ${meta.days || 'See enrollment details'}</p>
                    <p style="margin: 4px 0 0; font-size: 14px;"><strong>Amount:</strong> $${(session.amount_total || 0) / 100}</p>
                  </div>
                  <p><strong>📍 Location:</strong> Synergy Dance — 9512 W Flamingo Rd STE 100, Las Vegas, NV 89147</p>
                  <p><strong>📞 Questions?</strong> Call (702) 788-7369</p>
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                  <p style="font-size: 12px; color: #999; text-align: center;">
                    BASMA — Become A Singer Music Academy · <a href="https://basmaworld.com">basmaworld.com</a>
                  </p>
                </div>
              </div>
            `,
          }),
        })
      }
    } catch (emailErr) {
      console.error('[stripe-webhook] Email error:', emailErr)
    }
  }

  return NextResponse.json({ received: true })
}

async function updateAirtablePaymentStatus(
  tableId: string,
  emailField: string,
  email: string,
  fields: Record<string, string>
) {
  if (!AIRTABLE_PAT || !email) return

  // Find all records with this email
  const formula = `{${emailField}} = '${email.replace(/'/g, "\\'")}'`
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${tableId}?filterByFormula=${encodeURIComponent(formula)}&maxRecords=50`

  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` },
  })
  const data = await res.json()
  const records = data.records || []

  if (records.length === 0) return

  // Update all matching records
  const updates = records.map((r: { id: string }) => ({
    id: r.id,
    fields,
  }))

  // Airtable batch update (max 10 per request)
  for (let i = 0; i < updates.length; i += 10) {
    const batch = updates.slice(i, i + 10)
    await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${tableId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ records: batch }),
    })
  }
}
