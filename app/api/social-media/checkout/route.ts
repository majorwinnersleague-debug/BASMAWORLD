import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const TIERS = {
  starter: {
    name: 'Social Media Starter',
    description: '4 videos/month · 1 platform · AI captions · Opus Clip processing',
    amount: 9700, // $97.00
  },
  growth: {
    name: 'Social Media Growth',
    description: '8 videos/month · 3 platforms · AI captions · Scheduled posting · Dashboard',
    amount: 19700, // $197.00
  },
  elite: {
    name: 'Social Media Elite',
    description: 'Unlimited videos · All platforms · Branded templates · Priority processing',
    amount: 49700, // $497.00
  },
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const { allowed } = checkRateLimit(`social-checkout:${ip}`, 5, 10 * 60 * 1000)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '600' } }
    )
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  try {
    const body = await req.json()
    const { tier, surveyData } = body

    if (!tier || !TIERS[tier as keyof typeof TIERS]) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    const plan = TIERS[tier as keyof typeof TIERS]
    const stripe = new Stripe(secretKey, { apiVersion: '2026-03-25.dahlia' })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: plan.amount,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `https://basmaworld.com/social-media/onboarding?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
      cancel_url: 'https://basmaworld.com/social-media',
      metadata: {
        tier,
        platforms: JSON.stringify(surveyData?.platforms ?? []),
        niche: surveyData?.niche ?? '',
        frequency: surveyData?.frequency ?? '',
        tone: surveyData?.tone ?? '',
        captions: String(surveyData?.captions ?? true),
        brandedTemplates: String(surveyData?.brandedTemplates ?? false),
        brandDesc: (surveyData?.brandDesc ?? '').slice(0, 500),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Social media checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
