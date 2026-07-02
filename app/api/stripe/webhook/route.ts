import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import * as nodemailer from 'nodemailer'

export async function GET() {
  return NextResponse.json({ status: 'Stripe webhook endpoint active', method: 'POST only' })
}

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || ''
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
const SUMMER_TABLE = 'tblfOnRDkfgZoCF9X' // Summer 2026 Registrations
const LEADS_TABLE = 'tbl1diIEhM9MtKViE' // Marketing Leads

// Gmail SMTP credentials
const GMAIL_USER = process.env.GMAIL_USER || 'becomeasingermusicacademy@gmail.com'
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || ''

/* ─── Product → email-content map ─── */
interface ProductEmailInfo {
  category: 'scholarship' | 'private_lesson' | 'single_class' | 'weekly_bundle' | 'monthly_pass' | 'multi_child' | 'monthly_all_access' | 'private_4pack' | 'camp_enrollment'
  heading: string
  emoji: string
  whatToExpect: string[]
  schedule: string
  location: string
}

const SUMMER_CAMP_LOCATION = 'Synergy Dance — 9512 W Flamingo Rd STE 100, Las Vegas, NV 89147'

/**
 * Match a Stripe product name to a specific email template.
 * Falls back to a generic confirmation if no match found.
 */
function getProductInfo(productName: string, productId: string): ProductEmailInfo {
  const name = productName.toLowerCase()

  // Scholarship
  if (name.includes('scholarship') || productId === 'prod_UoD9zKsGYiuna0') {
    return {
      category: 'scholarship',
      heading: 'Welcome to the BASMA World Scholarship! 🎓',
      emoji: '🎓',
      whatToExpect: [
        'Your whole family can attend classes — all children included',
        '1 hour of classes per day (Mon–Thu) for $250/mo, or 2 hours for $500/mo',
        'Choose from: Tiny Tots (ages 2–5), Kids Music (ages 5–17), Piano, and Recording',
        'This is a monthly subscription — cancel anytime',
        'Program runs through August 2026',
      ],
      schedule: 'Mon–Thu · 9:00 AM – 2:00 PM (class times vary)',
      location: SUMMER_CAMP_LOCATION,
    }
  }

  // Private Lessons 4-Pack
  if (name.includes('4-pack') || name.includes('4 pack') || productId === 'prod_UkSCyE7uS0E0j1') {
    return {
      category: 'private_4pack',
      heading: 'Your Private Lessons Are Booked! 🎶',
      emoji: '🎵',
      whatToExpect: [
        'You have 4 private one-hour lessons with your instructor',
        'Lessons are with Miss Basma (voice, piano, guitar, bass, ukulele) or Miss Sarah (violin, viola, cello, piano)',
        '1 makeup lesson is allowed within 2 weeks if you need to reschedule',
        'We will reach out to schedule your lesson times',
      ],
      schedule: 'Scheduled individually — we\'ll contact you to set up times',
      location: SUMMER_CAMP_LOCATION,
    }
  }

  // Private Lesson — Single 30-min
  if (name.includes('private') && name.includes('30')) {
    return {
      category: 'private_lesson',
      heading: 'Your Private Lesson Is Confirmed! 🎶',
      emoji: '🎵',
      whatToExpect: [
        'You\'ve booked a 30-minute private lesson',
        'Lessons are with Miss Basma (voice, piano, guitar, bass, ukulele) or Miss Sarah (violin, viola, cello, piano)',
        'We will reach out to schedule your lesson time',
      ],
      schedule: 'Scheduled individually — we\'ll contact you',
      location: SUMMER_CAMP_LOCATION,
    }
  }

  // Private Lesson — Single 60-min
  if (name.includes('private') && name.includes('60')) {
    return {
      category: 'private_lesson',
      heading: 'Your Private Lesson Is Confirmed! 🎶',
      emoji: '🎵',
      whatToExpect: [
        'You\'ve booked a 60-minute private lesson',
        'Lessons are with Miss Basma (voice, piano, guitar, bass, ukulele) or Miss Sarah (violin, viola, cello, piano)',
        'We will reach out to schedule your lesson time',
      ],
      schedule: 'Scheduled individually — we\'ll contact you',
      location: SUMMER_CAMP_LOCATION,
    }
  }

  // Tiny Tots (single class)
  if (name.includes('tiny tots') && !name.includes('bundle')) {
    return {
      category: 'single_class',
      heading: 'Tiny Tots Class Confirmed! 👶🎵',
      emoji: '👶',
      whatToExpect: [
        'Fun, interactive music class for ages 2–5',
        'Singing, rhythm games, and instrument exploration',
        'Check in at the front desk when you arrive',
        'Wear comfortable clothes your child can move in',
      ],
      schedule: 'Mon–Thu · 9:00 – 9:45 AM',
      location: SUMMER_CAMP_LOCATION,
    }
  }

  // Tiny Tots Weekly Bundle
  if (name.includes('tiny tots') && name.includes('bundle')) {
    return {
      category: 'weekly_bundle',
      heading: 'Tiny Tots Weekly Bundle — You\'re All Set! 👶🎵',
      emoji: '👶',
      whatToExpect: [
        '4 Tiny Tots classes for the price of 3 — great value!',
        'Fun, interactive music class for ages 2–5',
        'Singing, rhythm games, and instrument exploration',
        'Check in at the front desk each day',
      ],
      schedule: 'Mon–Thu · 9:00 – 9:45 AM',
      location: SUMMER_CAMP_LOCATION,
    }
  }

  // Kids Music (single class)
  if (name.includes('kids music') && !name.includes('bundle')) {
    return {
      category: 'single_class',
      heading: 'Kids Music Class Confirmed! 🎤',
      emoji: '🎤',
      whatToExpect: [
        'Group music class for ages 5–17',
        'Vocal training, performance skills, and group activities',
        'Check in at the front desk when you arrive',
        'Wear comfortable clothes and bring water',
      ],
      schedule: 'Mon–Thu · 10:00 – 11:30 AM',
      location: SUMMER_CAMP_LOCATION,
    }
  }

  // Kids Music Weekly Bundle
  if (name.includes('kids music') && name.includes('bundle')) {
    return {
      category: 'weekly_bundle',
      heading: 'Kids Music Weekly Bundle — You\'re All Set! 🎤',
      emoji: '🎤',
      whatToExpect: [
        '4 Kids Music classes for the price of 3 — great value!',
        'Group music class for ages 5–17',
        'Vocal training, performance skills, and group activities',
        'Check in at the front desk each day',
      ],
      schedule: 'Mon–Thu · 10:00 – 11:30 AM',
      location: SUMMER_CAMP_LOCATION,
    }
  }

  // Piano (single class)
  if (name.includes('piano') && !name.includes('bundle')) {
    return {
      category: 'single_class',
      heading: 'Piano Class Confirmed! 🎹',
      emoji: '🎹',
      whatToExpect: [
        'Group piano class for all ages',
        'Learn fundamentals, technique, and how to read music',
        'Keyboards are provided — just show up!',
        'Check in at the front desk when you arrive',
      ],
      schedule: 'Mon–Thu · 12:00 – 1:30 PM',
      location: SUMMER_CAMP_LOCATION,
    }
  }

  // Piano Weekly Bundle
  if (name.includes('piano') && name.includes('bundle')) {
    return {
      category: 'weekly_bundle',
      heading: 'Piano Weekly Bundle — You\'re All Set! 🎹',
      emoji: '🎹',
      whatToExpect: [
        '4 Piano classes for the price of 3 — great value!',
        'Group piano class for all ages',
        'Learn fundamentals, technique, and how to read music',
        'Check in at the front desk each day',
      ],
      schedule: 'Mon–Thu · 12:00 – 1:30 PM',
      location: SUMMER_CAMP_LOCATION,
    }
  }

  // Teens Recording (single class)
  if ((name.includes('recording') || name.includes('teens recording')) && !name.includes('bundle')) {
    return {
      category: 'single_class',
      heading: 'Recording Class Confirmed! 🎙️',
      emoji: '🎙️',
      whatToExpect: [
        'Recording and production class for teens',
        'Learn how to record, mix, and produce your own music',
        'Studio equipment is provided',
        'Check in at the front desk when you arrive',
      ],
      schedule: 'Mon–Thu · 2:45 – 4:00 PM',
      location: SUMMER_CAMP_LOCATION,
    }
  }

  // Teens Recording Weekly Bundle
  if ((name.includes('recording') || name.includes('teens recording')) && name.includes('bundle')) {
    return {
      category: 'weekly_bundle',
      heading: 'Recording Weekly Bundle — You\'re All Set! 🎙️',
      emoji: '🎙️',
      whatToExpect: [
        '4 Recording classes for the price of 3 — great value!',
        'Recording and production class for teens',
        'Learn how to record, mix, and produce your own music',
        'Check in at the front desk each day',
      ],
      schedule: 'Mon–Thu · 2:45 – 4:00 PM',
      location: SUMMER_CAMP_LOCATION,
    }
  }

  // Monthly Class Pass
  if (name.includes('monthly class pass') || name.includes('monthly pass')) {
    return {
      category: 'monthly_pass',
      heading: 'Monthly Class Pass Activated! 🎵',
      emoji: '🎵',
      whatToExpect: [
        'Pick 1 class and attend Mon–Thu every week for the entire month',
        'Valid for July or August 2026',
        '50% off the regular price — amazing deal!',
        'Check in at the front desk each day',
      ],
      schedule: 'Mon–Thu · Class time depends on your selection',
      location: SUMMER_CAMP_LOCATION,
    }
  }

  // Multi-Child Package (1st child)
  if (name.includes('1st child') || name.includes('first child') || productId === 'prod_UkSCDioFSQJBKr') {
    return {
      category: 'multi_child',
      heading: 'Multi-Child Package — 1st Child Enrolled! 👨‍👩‍👧‍👦',
      emoji: '👨‍👩‍👧‍👦',
      whatToExpect: [
        'Your first child gets 1 class Mon–Thu for the entire month',
        'Valid for July or August 2026',
        'Additional children can be added at discounted rates',
        'Check in at the front desk each day',
      ],
      schedule: 'Mon–Thu · Class time depends on your selection',
      location: SUMMER_CAMP_LOCATION,
    }
  }

  // Multi-Child Package (2nd child)
  if (name.includes('2nd child') || name.includes('second child') || productId === 'prod_UkSCO7aMHBVODl') {
    return {
      category: 'multi_child',
      heading: 'Multi-Child Package — 2nd Child Added! 👨‍👩‍👧‍👦',
      emoji: '👨‍👩‍👧‍👦',
      whatToExpect: [
        'Your second child is enrolled for 1 class Mon–Thu for the entire month',
        'Must be purchased together with the 1st Child package',
        'Check in at the front desk each day',
      ],
      schedule: 'Mon–Thu · Class time depends on your selection',
      location: SUMMER_CAMP_LOCATION,
    }
  }

  // Multi-Child Package (3rd+ child)
  if (name.includes('3rd child') || name.includes('additional child') || productId === 'prod_UkSCkwuTHK3aBe') {
    return {
      category: 'multi_child',
      heading: 'Multi-Child Package — Additional Child Added! 👨‍👩‍👧‍👦',
      emoji: '👨‍👩‍👧‍👦',
      whatToExpect: [
        'Your additional child is enrolled for 1 class Mon–Thu for the entire month',
        'Must be purchased together with the 1st Child package',
        'Check in at the front desk each day',
      ],
      schedule: 'Mon–Thu · Class time depends on your selection',
      location: SUMMER_CAMP_LOCATION,
    }
  }

  // Monthly All-Access Bundle
  if (name.includes('all classes') || name.includes('all-access') || name.includes('monthly bundle') || productId === 'prod_Uh6oZt2FTtxgir') {
    return {
      category: 'monthly_all_access',
      heading: 'All-Access Monthly Pass — You\'re In! 🌟',
      emoji: '🌟',
      whatToExpect: [
        'Full monthly access to ALL BASMA classes',
        'Includes Tiny Tots, Kids Music, Piano, and Recording',
        'Attend as many classes as you want, Mon–Thu',
        'Best value package — enjoy everything we offer!',
        'Check in at the front desk each day',
      ],
      schedule: 'Mon–Thu · 9:00 AM – 4:00 PM (all class times)',
      location: SUMMER_CAMP_LOCATION,
    }
  }

  // Generic / camp enrollment fallback
  return {
    category: 'camp_enrollment',
    heading: 'You\'re Enrolled! 🎵',
    emoji: '🎵',
    whatToExpect: [
      'Your enrollment is confirmed',
      'Check in at the front desk when you arrive',
      'Wear comfortable clothes and bring water',
      'We can\'t wait to see you!',
    ],
    schedule: 'Mon–Thu · See your enrollment details for specific times',
    location: SUMMER_CAMP_LOCATION,
  }
}

/* ─── Email HTML builder ─── */
function buildConfirmationEmail(
  parentName: string,
  productInfo: ProductEmailInfo,
  amount: number,
  productName: string,
): string {
  const expectItems = productInfo.whatToExpect.map(item =>
    `<li style="margin-bottom: 8px; font-size: 14px; color: #374151;">${item}</li>`
  ).join('\n')

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 560px; margin: 0 auto; padding: 20px;">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1a0a2e 0%, #4a0e78 50%, #6b21a8 100%); padding: 32px 24px; border-radius: 16px 16px 0 0; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 8px;">${productInfo.emoji}</div>
      <h1 style="color: #ffd700; margin: 0; font-size: 22px; font-weight: 700;">${productInfo.heading}</h1>
      <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 14px;">Become A Singer Music Academy</p>
    </div>

    <!-- Body -->
    <div style="background: #ffffff; padding: 28px 24px; border: 1px solid #e5e7eb; border-top: none;">

      <p style="font-size: 15px; color: #1f2937; margin: 0 0 16px;">Hi ${parentName},</p>
      <p style="font-size: 15px; color: #1f2937; margin: 0 0 20px;">Thank you for your purchase! Here's everything you need to know:</p>

      <!-- Purchase details -->
      <div style="background: #faf5ff; padding: 16px; border-radius: 10px; border: 1px solid #e9d5ff; margin-bottom: 20px;">
        <p style="margin: 0 0 4px; font-size: 13px; color: #7c3aed; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Purchase Details</p>
        <p style="margin: 0 0 4px; font-size: 15px; color: #1f2937; font-weight: 600;">${productName}</p>
        <p style="margin: 0; font-size: 14px; color: #6b7280;">Amount: <strong style="color: #1f2937;">$${amount.toFixed(2)}</strong></p>
      </div>

      <!-- What to expect -->
      <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0 0 10px;">📋 What to Expect:</p>
      <ul style="padding-left: 20px; margin: 0 0 20px;">
        ${expectItems}
      </ul>

      <!-- Schedule & Location -->
      <div style="background: #f0fdf4; padding: 16px; border-radius: 10px; border: 1px solid #bbf7d0; margin-bottom: 20px;">
        <p style="margin: 0 0 8px; font-size: 14px; color: #1f2937;">
          📅 <strong>Schedule:</strong> ${productInfo.schedule}
        </p>
        <p style="margin: 0 0 8px; font-size: 14px; color: #1f2937;">
          📍 <strong>Location:</strong> ${productInfo.location}
        </p>
        <p style="margin: 0; font-size: 14px; color: #1f2937;">
          📞 <strong>Questions?</strong> Call or text <a href="tel:+17027887369" style="color: #7c3aed; text-decoration: none;">(702) 788-7369</a>
        </p>
      </div>

      <!-- Check-in reminder -->
      <div style="background: #fffbeb; padding: 14px 16px; border-radius: 10px; border: 1px solid #fde68a; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 14px; color: #92400e;">
          ⚡ <strong>Check-in tip:</strong> Please arrive 5–10 minutes early on your first day so we can get you checked in smoothly!
        </p>
      </div>

      <p style="font-size: 14px; color: #6b7280; margin: 0;">
        We're so excited to have you! See you soon 🎶
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #1a0a2e; padding: 20px 24px; border-radius: 0 0 16px 16px; text-align: center;">
      <p style="margin: 0 0 4px; font-size: 13px; color: rgba(255,255,255,0.6);">
        Become A Singer Music Academy
      </p>
      <p style="margin: 0 0 4px; font-size: 12px; color: rgba(255,255,255,0.4);">
        Summer Camp: 9512 W Flamingo Rd STE 100, Las Vegas, NV 89147
      </p>
      <p style="margin: 0 0 8px; font-size: 12px; color: rgba(255,255,255,0.4);">
        Main Office: 6787 W Tropicana Ave, Suite 260, Las Vegas, NV 89103
      </p>
      <a href="https://basmaworld.com" style="color: #ffd700; font-size: 12px; text-decoration: none;">basmaworld.com</a>
    </div>

  </div>
</body>
</html>`
}

/* ─── Gmail SMTP transport ─── */
function getMailTransport() {
  if (!GMAIL_APP_PASSWORD) {
    console.error('[stripe-webhook] GMAIL_APP_PASSWORD not set — cannot send confirmation emails')
    return null
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  })
}

/* ─── Main webhook handler ─── */
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
    const parentName = meta.parentName || session.customer_details?.name || ''
    const amount = (session.amount_total || 0) / 100

    // ── 1. Update Airtable payment status ──
    if (email) {
      try {
        await updateAirtablePaymentStatus(SUMMER_TABLE, 'Parent Email', email, {
          'Payment Status': 'Paid',
          'Stripe Session': session.id,
          'Amount Paid': String(amount),
          'Payment Date': new Date().toISOString().split('T')[0],
        })
        await updateAirtablePaymentStatus(LEADS_TABLE, 'Email', email, {
          'Status': 'Enrolled — Paid',
        })
        console.log(`[stripe-webhook] Payment confirmed for ${email}: $${amount}`)
      } catch (err) {
        console.error('[stripe-webhook] Airtable update error:', err)
      }
    }

    // ── 2. Retrieve line items to identify the product ──
    let productName = 'Music Class Enrollment'
    let productId = ''

    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 5 })
      if (lineItems.data.length > 0) {
        const firstItem = lineItems.data[0]
        productName = firstItem.description || productName

        // Get the actual product ID if available
        if (firstItem.price?.product) {
          const prodRef = firstItem.price.product
          if (typeof prodRef === 'string') {
            productId = prodRef
            // Fetch full product for the name (line item description may differ)
            try {
              const product = await stripe.products.retrieve(prodRef)
              if (product.name) productName = product.name
            } catch (_) { /* use line item description */ }
          } else if (typeof prodRef === 'object' && 'id' in prodRef) {
            productId = (prodRef as { id: string }).id
          }
        }
      }
    } catch (err) {
      console.error('[stripe-webhook] Error fetching line items:', err)
    }

    // ── 3. Send product-specific confirmation email via Gmail ──
    if (email) {
      try {
        const info = getProductInfo(productName, productId)
        const displayName = parentName || email.split('@')[0]
        const html = buildConfirmationEmail(displayName, info, amount, productName)

        const subjectPrefix = info.category === 'scholarship' ? '🎓' :
                              info.category === 'private_lesson' || info.category === 'private_4pack' ? '🎶' :
                              '🎵'

        const transport = getMailTransport()
        if (transport) {
          await transport.sendMail({
            from: `"Become A Singer Music Academy" <${GMAIL_USER}>`,
            to: email,
            subject: `${subjectPrefix} ${info.heading.replace(/!.*/, '')} — BASMA`,
            html,
          })
          console.log(`[stripe-webhook] Confirmation email sent to ${email} for "${productName}"`)
        } else {
          console.warn(`[stripe-webhook] No email transport available — skipped email for ${email}`)
        }
      } catch (emailErr) {
        console.error('[stripe-webhook] Email send error:', emailErr)
      }
    }
  }

  return NextResponse.json({ received: true })
}

/* ─── Airtable helpers ─── */
async function updateAirtablePaymentStatus(
  tableId: string,
  emailField: string,
  email: string,
  fields: Record<string, string>
) {
  if (!AIRTABLE_PAT || !email) return

  const formula = `{${emailField}} = '${email.replace(/'/g, "\\'")}'`
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${tableId}?filterByFormula=${encodeURIComponent(formula)}&maxRecords=50`

  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` },
  })
  const data = await res.json()
  const records = data.records || []

  if (records.length === 0) return

  const updates = records.map((r: { id: string }) => ({
    id: r.id,
    fields,
  }))

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
