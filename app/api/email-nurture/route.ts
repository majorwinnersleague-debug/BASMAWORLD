import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp, isValidEmail } from '@/lib/rate-limit'

// Resend email nurture — triggered by /api/billy-lead or scheduled cron
// Requires RESEND_API_KEY environment variable

const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const FROM_EMAIL = process.env.EMAIL_FROM || 'BillyChat <billy@basmaworld.com>'

// Internal secret for server-to-server calls — protects this endpoint from public abuse
const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET || ''

interface SendEmailParams {
  to: string
  subject: string
  html: string
  text: string
}

async function sendViaResend({ to, subject, html, text }: SendEmailParams): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — email not sent')
    return false
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    console.error('Resend error:', data)
    return false
  }

  console.log(`Email sent via Resend: ${subject}`)
  return true
}

/**
 * Verify internal API secret header.
 * Server-to-server calls must include: x-internal-secret: <INTERNAL_API_SECRET>
 */
function verifyInternalSecret(req: NextRequest): boolean {
  if (!INTERNAL_SECRET) {
    // If no secret is configured, only allow in development
    return process.env.NODE_ENV === 'development'
  }
  return req.headers.get('x-internal-secret') === INTERNAL_SECRET
}

// POST /api/email-nurture
// Body: { email: string, name: string, emailIndex: number }
// Requires x-internal-secret header (server-to-server only)
export async function POST(req: NextRequest) {
  // Verify this is an internal server-to-server call
  if (!verifyInternalSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rate limit: 10 email sends per origin IP per minute
  const ip = getClientIp(req)
  const { allowed } = checkRateLimit(`email-nurture:${ip}`, 10, 60 * 1000)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  try {
    const body = await req.json()
    const { email, name, emailIndex } = body

    if (!email || emailIndex === undefined) {
      return NextResponse.json({ error: 'email and emailIndex are required' }, { status: 400 })
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Dynamic import of templates
    const { buildNurtureSequence } = await import('@/lib/email/nurture-sequence')
    const sequence = buildNurtureSequence(name || 'there')

    if (emailIndex < 0 || emailIndex >= sequence.length) {
      return NextResponse.json({ error: `emailIndex must be 0–${sequence.length - 1}` }, { status: 400 })
    }

    const emailData = sequence[emailIndex]
    const sent = await sendViaResend({
      to: email,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
    })

    return NextResponse.json({
      success: sent,
      emailIndex,
      subject: emailData.subject,
      message: sent ? 'Email sent' : 'RESEND_API_KEY not configured — email queued',
    })
  } catch (err) {
    console.error('email-nurture route error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}

// GET /api/email-nurture — disabled in production, only for local dev preview
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Rate limit even in dev
  const ip = getClientIp(req)
  const { allowed } = checkRateLimit(`email-nurture-get:${ip}`, 5, 60 * 1000)
  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const name = searchParams.get('name') || 'there'
  const index = parseInt(searchParams.get('index') || '0', 10)

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'valid email param required' }, { status: 400 })
  }

  const { buildNurtureSequence } = await import('@/lib/email/nurture-sequence')
  const sequence = buildNurtureSequence(name)

  return NextResponse.json({
    totalEmails: sequence.length,
    schedule: sequence.map((e, i) => ({ index: i, subject: e.subject, delayDays: e.delayDays })),
    preview: sequence[index],
  })
}
