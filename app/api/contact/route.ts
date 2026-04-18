import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp, isValidEmail, sanitizeString } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  // Rate limit: 5 contact form submissions per IP per 10 minutes
  const ip = getClientIp(req)
  const { allowed } = checkRateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '600' } }
    )
  }

  try {
    const body = await req.json()
    const { name, email, company, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'name, email and message required' }, { status: 400 })
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Sanitize all inputs
    const safeName = sanitizeString(String(name), 100)
    const safeEmail = email.trim().toLowerCase().slice(0, 254)
    const safeCompany = company ? sanitizeString(String(company), 200) : ''
    const safeMessage = sanitizeString(String(message), 2000)

    // Post to Slack #basma-world-ops
    const slackToken = process.env.SLACK_BOT_TOKEN
    const slackChannel = process.env.SLACK_CHANNEL_OPS
    if (slackToken && slackChannel) {
      await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${slackToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: slackChannel,
          text: `🏆 *New MWL Lead!*\n*Name:* ${safeName}\n*Email:* ${safeEmail}\n*Company:* ${safeCompany || 'N/A'}\n*Message:* ${safeMessage}`
        })
      })
    }

    // Post to HubSpot if configured
    const hubspotKey = process.env.HUBSPOT_API_KEY
    if (hubspotKey) {
      await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${hubspotKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          properties: {
            firstname: safeName.split(' ')[0],
            lastname: safeName.split(' ').slice(1).join(' ') || '',
            email: safeEmail,
            company: safeCompany,
            message: safeMessage,
            hs_lead_status: 'NEW'
          }
        })
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
