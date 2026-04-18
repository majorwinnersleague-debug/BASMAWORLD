import { NextRequest, NextResponse } from 'next/server'

// Resend email nurture — triggered by /api/billy-lead or scheduled cron
// Requires RESEND_API_KEY environment variable

const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const FROM_EMAIL = process.env.EMAIL_FROM || 'BillyChat <billy@basmaworld.com>'

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

  console.log(`Email sent via Resend: ${subject} → ${to}`)
  return true
}

// POST /api/email-nurture
// Body: { email: string, name: string, emailIndex: number }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, name, emailIndex } = body

    if (!email || emailIndex === undefined) {
      return NextResponse.json({ error: 'email and emailIndex are required' }, { status: 400 })
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

// GET /api/email-nurture?email=x&name=y&index=0
// Convenience endpoint for testing
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const name = searchParams.get('name') || 'there'
  const index = parseInt(searchParams.get('index') || '0', 10)

  if (!email) {
    return NextResponse.json({ error: 'email param required' }, { status: 400 })
  }

  const { buildNurtureSequence } = await import('@/lib/email/nurture-sequence')
  const sequence = buildNurtureSequence(name)

  return NextResponse.json({
    totalEmails: sequence.length,
    schedule: sequence.map((e, i) => ({ index: i, subject: e.subject, delayDays: e.delayDays })),
    preview: sequence[index],
  })
}
