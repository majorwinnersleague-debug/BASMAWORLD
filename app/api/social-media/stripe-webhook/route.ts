import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

// ─── Airtable helpers ─────────────────────────────────────────────────────────

const TABLE = 'Social%20Media%20Clients'

function airtableHeaders() {
  return {
    Authorization: `Bearer ${process.env.AIRTABLE_PAT}`,
    'Content-Type': 'application/json',
  }
}

function airtableUrl(path = '') {
  const baseId = process.env.AIRTABLE_SOCIAL_BASE
  return `https://api.airtable.com/v0/${baseId}/${TABLE}${path}`
}

async function createAirtableRecord(
  data: Record<string, unknown>
): Promise<string | null> {
  const baseId = process.env.AIRTABLE_SOCIAL_BASE
  const apiKey = process.env.AIRTABLE_PAT
  if (!baseId || !apiKey) return null

  const res = await fetch(airtableUrl(), {
    method: 'POST',
    headers: airtableHeaders(),
    body: JSON.stringify({ fields: data }),
  })
  const json = await res.json()
  return json.id ?? null
}

async function findRecordByStripeCustomer(
  customerId: string
): Promise<{ recordId: string; fields: Record<string, unknown> } | null> {
  const baseId = process.env.AIRTABLE_SOCIAL_BASE
  const apiKey = process.env.AIRTABLE_PAT
  if (!baseId || !apiKey) return null

  const formula = encodeURIComponent(`{Stripe Customer ID}="${customerId}"`)
  const res = await fetch(airtableUrl(`?filterByFormula=${formula}`), {
    headers: airtableHeaders(),
  })
  const data = await res.json()
  const record = data.records?.[0]
  if (!record) return null
  return { recordId: record.id, fields: record.fields }
}

async function updateAirtableRecord(
  recordId: string,
  fields: Record<string, unknown>
) {
  const baseId = process.env.AIRTABLE_SOCIAL_BASE
  const apiKey = process.env.AIRTABLE_PAT
  if (!baseId || !apiKey) return

  await fetch(airtableUrl(`/${recordId}`), {
    method: 'PATCH',
    headers: airtableHeaders(),
    body: JSON.stringify({ fields }),
  })
}

// ─── Upload-Post: create a profile for a new client ──────────────────────────

async function createUploadPostProfile(
  username: string
): Promise<boolean> {
  const apiKey = process.env.UPLOAD_POST_API_KEY
  if (!apiKey) return false

  const res = await fetch(
    'https://api.upload-post.com/api/uploadposts/users',
    {
      method: 'POST',
      headers: {
        Authorization: `Apikey ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    }
  )
  return res.ok
}

// ─── Map Stripe price → tier name ────────────────────────────────────────────

const PRICE_TO_TIER: Record<number, string> = {
  9700: 'Starter',
  19700: 'Growth',
  49700: 'Elite',
}

function tierFromAmount(amountCents: number | null | undefined): string {
  if (!amountCents) return ''
  return PRICE_TO_TIER[amountCents] ?? `Custom ($${(amountCents / 100).toFixed(0)})`
}

// ─── Event handlers ──────────────────────────────────────────────────────────

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const meta = session.metadata ?? {}

  // Create the Airtable client record
  const recordId = await createAirtableRecord({
    Name: session.customer_details?.name ?? 'Unknown',
    Email: session.customer_details?.email ?? '',
    Package: meta.tier
      ? meta.tier.charAt(0).toUpperCase() + meta.tier.slice(1)
      : '',
    Platforms: (() => {
      try { return JSON.parse(meta.platforms ?? '[]') }
      catch { return [] }
    })(),
    Niche: meta.niche ?? '',
    Frequency: meta.frequency ?? '',
    Tone: meta.tone ?? '',
    Captions: meta.captions === 'true',
    'Branded Templates': meta.brandedTemplates === 'true',
    'Brand Description': meta.brandDesc ?? '',
    'Stripe Customer ID': (session.customer as string) ?? '',
    'Stripe Session ID': session.id,
    'Stripe Subscription ID': (session.subscription as string) ?? '',
    Status: 'Active',
    'Videos Processed': 0,
    'Posts Published': 0,
    'Subscribed At': new Date().toISOString(),
  })

  // Create Upload-Post profile using Airtable record ID as username
  if (recordId) {
    await createUploadPostProfile(recordId)
    await updateAirtableRecord(recordId, {
      'Upload Post User ID': recordId,
    })
  }

  console.log(
    `[stripe-webhook] checkout.session.completed — client="${session.customer_details?.name}", tier=${meta.tier}, record=${recordId}`
  )
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer.id

  const record = await findRecordByStripeCustomer(customerId)
  if (!record) {
    console.warn(
      `[stripe-webhook] subscription.updated — no Airtable record for customer ${customerId}`
    )
    return
  }

  // Determine new tier from the first line item
  const item = subscription.items?.data?.[0]
  const newAmount = item?.price?.unit_amount ?? null
  const newTier = tierFromAmount(newAmount)

  // Map Stripe subscription status → our Status field
  const statusMap: Record<string, string> = {
    active: 'Active',
    past_due: 'Past Due',
    unpaid: 'Past Due',
    trialing: 'Active',
    paused: 'Paused',
    canceled: 'Cancelled',
    incomplete: 'Pending',
    incomplete_expired: 'Cancelled',
  }
  const newStatus = statusMap[subscription.status] ?? 'Active'

  const updates: Record<string, unknown> = {
    Status: newStatus,
    'Stripe Subscription ID': subscription.id,
  }

  // Only update package if we can map it
  if (newTier) {
    updates.Package = newTier
  }

  // Track cancellation schedule
  if (subscription.cancel_at_period_end) {
    updates.Status = 'Cancelling'
    updates['Cancel At'] = subscription.cancel_at
      ? new Date(subscription.cancel_at * 1000).toISOString()
      : ''
  }

  await updateAirtableRecord(record.recordId, updates)

  console.log(
    `[stripe-webhook] subscription.updated — customer=${customerId}, status=${newStatus}, tier=${newTier || 'unchanged'}`
  )
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer.id

  const record = await findRecordByStripeCustomer(customerId)
  if (!record) {
    console.warn(
      `[stripe-webhook] subscription.deleted — no Airtable record for customer ${customerId}`
    )
    return
  }

  await updateAirtableRecord(record.recordId, {
    Status: 'Cancelled',
    'Cancelled At': new Date().toISOString(),
  })

  console.log(
    `[stripe-webhook] subscription.deleted — customer=${customerId}, record=${record.recordId}`
  )
}

// ─── Main POST handler ──────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secretKey || !webhookSecret) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 503 }
    )
  }

  // ── Verify signature ──────────────────────────────────────────────────────
  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  const rawBody = await req.text()
  const stripe = new Stripe(secretKey, { apiVersion: '2026-03-25.dahlia' })
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    console.error('[stripe-webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // ── Route event ───────────────────────────────────────────────────────────
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session
        )
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        )
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        )
        break

      default:
        // Log unhandled events at debug level for future expansion
        console.log(`[stripe-webhook] Unhandled event type: ${event.type}`)
    }
  } catch (err) {
    console.error(`[stripe-webhook] Error processing ${event.type}:`, err)
    // Always return 200 so Stripe doesn't endlessly retry
  }

  return NextResponse.json({ received: true })
}
