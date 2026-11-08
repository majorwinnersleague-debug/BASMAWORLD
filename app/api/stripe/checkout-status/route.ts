import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/**
 * GET /api/stripe/checkout-status?session_id=cs_...
 *
 * Used by the private-lessons success page to confirm with Stripe that a
 * Checkout Session was actually paid before showing "Payment Successful" or
 * recording a Google Ads conversion. Returns no personal information: only
 * whether it is paid, the amount, currency and package name.
 */
export async function GET(req: NextRequest) {
  const ip = getClientIp(req)
  const { allowed } = checkRateLimit(`checkout-status:${ip}`, 30, 10 * 60 * 1000)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const sessionId = req.nextUrl.searchParams.get('session_id') || ''
  if (!/^cs_(live|test)_[A-Za-z0-9]{10,200}$/.test(sessionId)) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 400 })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  try {
    const stripe = new Stripe(secretKey, { apiVersion: '2026-03-25.dahlia' })
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Only academy private-lesson sessions are reported here.
    if (session.metadata?.type !== 'private_lesson_package') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(
      {
        paid: session.payment_status === 'paid',
        status: session.status, // 'open' | 'complete' | 'expired'
        amountTotal: typeof session.amount_total === 'number' ? session.amount_total : null, // cents
        currency: (session.currency || 'usd').toUpperCase(),
        packageName: session.metadata?.packageName || '',
      },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    const status = (error as { statusCode?: number })?.statusCode
    if (status === 404) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    console.error('[checkout-status] Stripe lookup failed:', error)
    return NextResponse.json({ error: 'Could not check payment status' }, { status: 502 })
  }
}
