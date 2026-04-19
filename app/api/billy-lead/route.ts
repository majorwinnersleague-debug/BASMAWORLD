import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { sendEmail } from '@/lib/send-email'
import { getFunnelForSource, getEmail1ForFunnel } from '@/lib/email-sequences'
import { checkRateLimit, getClientIp, isValidEmail, sanitizeString } from '@/lib/rate-limit'

// Set SLACK_BOT_TOKEN and SLACK_CHANNEL_OPS in your .env.local / deployment env vars
const SLACK_TOKEN = process.env.SLACK_BOT_TOKEN || ''
const SLACK_CHANNEL = process.env.SLACK_CHANNEL_OPS || ''
const LEADS_FILE = '/tmp/billy-leads.json'

// ── Save lead to JSON log ─────────────────────────────────────────────────────
async function saveLeadToFile(name: string, email: string, source: string) {
  let leads: object[] = []

  try {
    const raw = await fs.readFile(LEADS_FILE, 'utf-8')
    leads = JSON.parse(raw)
  } catch {
    // File doesn't exist yet — start fresh
    leads = []
  }

  leads.push({
    name,
    email,
    source,
    capturedAt: new Date().toISOString(),
  })

  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8')
}

// ── Save lead to Airtable ─────────────────────────────────────────────────────
async function saveLeadToAirtable(name: string, email: string, source: string) {
  const base = process.env.AIRTABLE_ACADEMY_BASE
  const token = process.env.AIRTABLE_PAT
  if (!base || !token) {
    console.warn('saveLeadToAirtable: AIRTABLE_ACADEMY_BASE or AIRTABLE_PAT not set — skipping')
    return
  }

  try {
    const res = await fetch(`https://api.airtable.com/v0/${base}/Leads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [{
          fields: {
            'Name': name,
            'Email': email,
            'Source': source,
            'Date': new Date().toISOString().split('T')[0],
          },
        }],
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      console.error('Airtable save failed:', data)
    } else {
      console.log(`Airtable lead saved: ${name.slice(0, 2)}*** from ${source}`)
    }
  } catch (err) {
    console.error('Airtable save error:', err)
  }
}

// ── Post to Slack ─────────────────────────────────────────────────────────────
async function postSlackNotification(name: string, email: string, source: string) {
  if (!SLACK_TOKEN || !SLACK_CHANNEL) {
    console.warn('postSlackNotification: SLACK_BOT_TOKEN or SLACK_CHANNEL_OPS not set — skipping')
    return
  }

  const text = `:tada: New BillyChat lead! *${name}* from ${source}`

  const res = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SLACK_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      channel: SLACK_CHANNEL,
      text,
    }),
  })

  const data = await res.json()
  if (!data.ok) {
    console.error('Slack notification failed:', data.error)
  }
}

// ── Send welcome email (Email 1 of nurture sequence) ─────────────────────────
async function sendWelcomeEmail(name: string, email: string, source: string) {
  try {
    const funnel = getFunnelForSource(source)
    const template = getEmail1ForFunnel(funnel)

    // MWL funnel uses basma@, everything else uses billy@
    const from = funnel === 'mwl' ? 'basma@basmaworld.com' : 'billy@basmaworld.com'

    const result = await sendEmail({
      to: email,
      subject: template.subject,
      html: template.htmlBody,
      text: template.textBody,
      from,
    })

    if (result.success) {
      console.log(`Welcome email sent: funnel=${funnel} id=${result.id}`)
    } else {
      console.error(`Welcome email failed: funnel=${funnel} error=${result.error}`)
    }
  } catch (err) {
    console.error('sendWelcomeEmail error:', err)
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Rate limit: 5 lead submissions per IP per 10 minutes
  const ip = getClientIp(req)
  const { allowed, remaining } = checkRateLimit(`billy-lead:${ip}`, 5, 10 * 60 * 1000)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '600' } }
    )
  }

  try {
    const body = await req.json()
    const { name, email, source } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'name and email are required' }, { status: 400 })
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Sanitize inputs
    const safeName = sanitizeString(String(name), 100)
    const safeEmail = email.trim().toLowerCase().slice(0, 254)
    const sourcePage = sanitizeString(String(source || 'unknown'), 100)

    // Run all operations in parallel — don't let one block the response
    await Promise.allSettled([
      saveLeadToFile(safeName, safeEmail, sourcePage),
      saveLeadToAirtable(safeName, safeEmail, sourcePage),
      postSlackNotification(safeName, safeEmail, sourcePage),
      sendWelcomeEmail(safeName, safeEmail, sourcePage),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('billy-lead route error:', err)
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }
}
