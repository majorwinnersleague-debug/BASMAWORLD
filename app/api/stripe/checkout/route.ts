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
    const body = await req.json()

    // Support both legacy ($29 trial) and new dynamic checkout
    if (!body.students) {
      // Legacy: $29 trial lesson
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
              unit_amount: 2900,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'https://basmaworld.com/academy?success=true',
        cancel_url: 'https://basmaworld.com/academy',
      })
      return NextResponse.json({ url: session.url })
    }

    // New dynamic checkout
    const {
      students,
      month,
      passType,
      selectedDays,
      parentName,
      email,
      phone,
      allergies,
      emergencyName,
      emergencyPhone,
      total,
    } = body

    if (!students?.length || !month || !passType || !total) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Build line items — one per student
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lineItems: any[] = students.map((student: {
      name: string
      age: string
      classId: string
      className: string
      classTime: string
      dailyRate: number
    }, idx: number) => {
      const numDays = passType === 'daily' ? (selectedDays?.length || 1) : passType === 'weekly' ? 4 : 16
      let subtotal = student.dailyRate * numDays
      if (passType === 'weekly') subtotal = subtotal * 0.85
      if (passType === 'monthly') subtotal = subtotal * 0.75
      subtotal = Math.round(subtotal * 100) / 100

      const passLabel = passType === 'daily'
        ? `${numDays} day${numDays > 1 ? 's' : ''}`
        : passType === 'weekly'
        ? '1 week (Mon–Thu, 15% off)'
        : 'Full month (25% off)'

      const daysLabel = passType === 'daily' && selectedDays?.length
        ? ` · Days: ${selectedDays.join(', ')}`
        : ''

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${student.className} — ${student.name}`,
            description: `${month === 'july' ? 'July' : 'August'} 2026 · ${passLabel}${daysLabel} · ${student.classTime} · Age ${student.age}${idx > 0 ? ' · Additional child discount applied' : ''}`,
          },
          unit_amount: Math.round(subtotal * 100), // cents
        },
        quantity: 1,
      }
    })

    // Build metadata for Sarah to see in Stripe dashboard
    const metadata: Record<string, string> = {
      parentName: parentName || '',
      email: email || '',
      phone: phone || '',
      month: month,
      passType: passType,
      days: selectedDays?.join(', ') || 'Full month',
      allergies: allergies || 'None',
      emergencyContact: `${emergencyName || ''} - ${emergencyPhone || ''}`,
      students: students.map((s: { name: string; age: string; className: string; classTime: string }) =>
        `${s.name} (age ${s.age}) - ${s.className} @ ${s.classTime}`
      ).join(' | '),
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: email || undefined,
      metadata,
      success_url: `https://basmaworld.com/enroll?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'https://basmaworld.com/enroll',
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
