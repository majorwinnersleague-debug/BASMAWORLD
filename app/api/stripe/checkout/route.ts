import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  // Rate limit: 5 checkout attempts per IP per 10 minutes
  const ip = getClientIp(req)
  const { allowed } = checkRateLimit(`stripe-checkout:${ip}`, 5, 10 * 60 * 1000)
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
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Academy Music Lessons - Trial',
              description: 'One trial music lesson with BASMA — Become A Singer Music Academy. Las Vegas, NV & online.',
            },
            unit_amount: 2900, // $29.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://basmaworld.com/academy?success=true',
      cancel_url: 'https://basmaworld.com/academy',
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
