import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

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