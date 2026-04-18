import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'

// Set SLACK_BOT_TOKEN and SLACK_CHANNEL_OPS in your .env.local / deployment env vars
const SLACK_TOKEN   = process.env.SLACK_BOT_TOKEN   || ''
const SLACK_CHANNEL = process.env.SLACK_CHANNEL_OPS || 'C0ATLUAGUU9'
const LEADS_FILE = '/tmp/billy-leads.json'

// ── Save lead to JSON log ────────────────────────────────────────────────────
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

// ── Post to Slack ────────────────────────────────────────────────────────────
async function postSlackNotification(name: string, email: string, source: string) {
  const text = `:tada: New BillyChat lead! *${name}* (${email}) from ${source}`

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
  } else {
    console.log(`Slack notified for lead: ${name} <${email}>`)
  }
}

// ── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, source } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'name and email are required' }, { status: 400 })
    }

    const sourcePage = source || 'unknown'

    // Run both operations in parallel — don't let one block the other
    await Promise.allSettled([
      saveLeadToFile(name.trim(), email.trim(), sourcePage),
      postSlackNotification(name.trim(), email.trim(), sourcePage),
    ])

    console.log(`BillyChat lead captured: ${name} <${email}> from ${sourcePage}`)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('billy-lead route error:', err)
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }
}
