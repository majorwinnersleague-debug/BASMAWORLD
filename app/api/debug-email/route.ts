import { NextRequest, NextResponse } from 'next/server'

const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const FROM_EMAIL = 'BASMA Academy <onboarding@resend.dev>'

export async function GET(req: NextRequest) {
  // Only allow with secret
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== '1515debug') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const hasKey = !!RESEND_API_KEY
  const keyPrefix = RESEND_API_KEY ? RESEND_API_KEY.substring(0, 6) + '...' : 'MISSING'

  // Check Resend domains
  let domains = null
  let domainsError = null
  try {
    const res = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
    })
    if (res.ok) {
      domains = await res.json()
    } else {
      domainsError = `${res.status}: ${await res.text()}`
    }
  } catch (e: unknown) {
    domainsError = String(e)
  }

  // Try sending a test email
  let sendResult = null
  let sendError = null
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: 'becomeasingermusicacademy@gmail.com',
        subject: 'BASMA Debug Test',
        html: '<p>Test email - if you see this, Resend is working!</p>',
      }),
    })
    const body = await res.text()
    sendResult = { status: res.status, body }
  } catch (e: unknown) {
    sendError = String(e)
  }

  return NextResponse.json({
    hasKey,
    keyPrefix,
    fromEmail: FROM_EMAIL,
    domains,
    domainsError,
    sendResult,
    sendError,
  })
}
