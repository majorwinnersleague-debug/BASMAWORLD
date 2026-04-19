import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

// Airtable helpers
async function createAirtableRecord(data: Record<string, unknown>) {
  const baseId = process.env.AIRTABLE_SOCIAL_BASE
  const apiKey = process.env.AIRTABLE_PAT
  if (!baseId || !apiKey) return null

  const res = await fetch(`https://api.airtable.com/v0/${baseId}/Social%20Media%20Clients`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields: data }),
  })
  const json = await res.json()
  return json.id ?? null
}

// Upload-Post: create a profile for this client
async function createUploadPostProfile(username: string): Promise<boolean> {
  const apiKey = process.env.UPLOAD_POST_API_KEY
  if (!apiKey) return false

  const res = await fetch('https://api.upload-post.com/api/uploadposts/users', {
    method: 'POST',
    headers: {
      Authorization: `Apikey ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  })
  return res.ok
}

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const sig = req.headers.get('stripe-signature')
  const rawBody = await req.text()

  const stripe = new Stripe(secretKey, { apiVersion: '2026-03-25.dahlia' })
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, webhookSecret)
  } catch (err) {
    console.error('Stripe webhook signature failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const meta = session.metadata ?? {}

    try {
      // Create the Airtable record
      const recordId = await createAirtableRecord({
        'Name': session.customer_details?.name ?? 'Unknown',
        'Email': session.customer_details?.email ?? '',
        'Package': meta.tier ? (meta.tier.charAt(0).toUpperCase() + meta.tier.slice(1)) : '',
        'Platforms': JSON.parse(meta.platforms ?? '[]'),
        'Niche': meta.niche ?? '',
        'Frequency': meta.frequency ?? '',
        'Tone': meta.tone ?? '',
        'Captions': meta.captions === 'true',
        'Branded Templates': meta.brandedTemplates === 'true',
        'Brand Description': meta.brandDesc ?? '',
        'Stripe Customer ID': session.customer as string ?? '',
        'Stripe Session ID': session.id,
        'Status': 'Active',
        'Videos Processed': 0,
        'Posts Published': 0,
      })

      // Create Upload-Post profile using Airtable record ID as username
      if (recordId) {
        await createUploadPostProfile(recordId)
        // Store the Upload-Post user ID back to Airtable
        const baseId = process.env.AIRTABLE_SOCIAL_BASE
        const apiKey = process.env.AIRTABLE_PAT
        if (baseId && apiKey) {
          await fetch(`https://api.airtable.com/v0/${baseId}/Social%20Media%20Clients/${recordId}`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ fields: { 'Upload Post User ID': recordId } }),
          })
        }
      }
    } catch (err) {
      console.error('Post-checkout processing error:', err)
      // Don't return 500 — Stripe needs a 200 or it retries indefinitely
    }
  }

  return NextResponse.json({ received: true })
}
