import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, company, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'name, email and message required' }, { status: 400 })
    }

    // Post to Slack #basma-world-ops
    const slackToken = process.env.SLACK_BOT_TOKEN
    if (slackToken) {
      await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${slackToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'C0ATLUAGUU9',
          text: `🏆 *New MWL Lead!*\n*Name:* ${name}\n*Email:* ${email}\n*Company:* ${company || 'N/A'}\n*Message:* ${message}`
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
            firstname: name.split(' ')[0],
            lastname: name.split(' ').slice(1).join(' ') || '',
            email,
            company: company || '',
            message,
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
