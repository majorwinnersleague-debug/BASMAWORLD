import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Receives Opus Clip webhook when processing is complete
// Opus sends: { project_id, status, clips: [...] }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { project_id, status } = body

    if (!project_id || status !== 'completed') {
      return NextResponse.json({ received: true })
    }

    // Look up client by Opus project ID
    const baseId = process.env.AIRTABLE_BASE_ID
    const apiKey = process.env.AIRTABLE_API_KEY
    if (!baseId || !apiKey) return NextResponse.json({ received: true })

    const searchRes = await fetch(
      `https://api.airtable.com/v0/${baseId}/Social%20Media%20Clients?filterByFormula=${encodeURIComponent(`{Opus Clip Project ID}="${project_id}"`)}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    )
    const searchData = await searchRes.json()
    const record = searchData.records?.[0]
    if (!record) return NextResponse.json({ received: true })

    const sessionId = record.fields['Stripe Session ID']
    const videoUrl = record.fields['Last Video URL']

    if (!sessionId || !videoUrl) return NextResponse.json({ received: true })

    // Trigger the full posting pipeline
    const host = req.headers.get('host') ?? 'basmaworld.com'
    const protocol = host.includes('localhost') ? 'http' : 'https'

    // Fire and forget — don't await so webhook returns fast
    fetch(`${protocol}://${host}/api/social-media/process-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, videoUrl, skipOpus: true, projectId: project_id }),
    }).catch(console.error)

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Opus webhook error:', err)
    return NextResponse.json({ received: true }) // Always return 200 to Opus
  }
}
