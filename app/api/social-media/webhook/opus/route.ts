import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Sanitize user input for Airtable filterByFormula
function sanitizeForFormula(input: string): string {
  return input.replace(/["\\]/g, '')
}

// Receives Opus Clip webhook when processing is complete
// Opus sends: { project_id, status, clips: [...] }

export async function POST(req: NextRequest) {
  try {
    // ── Auth: verify shared secret (optional but recommended) ──────────────
    const secret = process.env.OPUS_WEBHOOK_SECRET
    if (secret) {
      const provided =
        req.headers.get('x-webhook-secret') ??
        req.nextUrl.searchParams.get('secret')
      if (provided !== secret) {
        console.warn('[opus-webhook] Invalid or missing webhook secret')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const body = await req.json()
    const { project_id, status } = body

    if (!project_id || status !== 'completed') {
      return NextResponse.json({ received: true })
    }

    // Look up client by Opus project ID
    const baseId = process.env.AIRTABLE_SOCIAL_BASE
    const apiKey = process.env.AIRTABLE_PAT
    if (!baseId || !apiKey) return NextResponse.json({ received: true })

    const safeProjectId = sanitizeForFormula(project_id)
    const searchRes = await fetch(
      `https://api.airtable.com/v0/${baseId}/Social%20Media%20Clients?filterByFormula=${encodeURIComponent(
        `{Opus Clip Project ID}="${safeProjectId}"`
      )}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    )
    const searchData = await searchRes.json()
    const record = searchData.records?.[0]
    if (!record) {
      console.warn(
        `[opus-webhook] No Airtable record for project_id: ${project_id}`
      )
      return NextResponse.json({ received: true })
    }

    // Guard: skip if already processed (prevents double-trigger)
    const currentStatus = record.fields['Status']
    if (currentStatus === 'Posted' || currentStatus === 'No Clips Found') {
      console.log(
        `[opus-webhook] Skipping already-processed project ${project_id} (status: ${currentStatus})`
      )
      return NextResponse.json({ received: true })
    }

    const sessionId = record.fields['Stripe Session ID']
    const videoUrl = record.fields['Last Video URL']

    if (!sessionId || !videoUrl) return NextResponse.json({ received: true })

    // Trigger the posting pipeline with skipOpus: true
    const host = req.headers.get('host') ?? 'basmaworld.com'
    const protocol = host.includes('localhost') ? 'http' : 'https'

    // Fire and forget — don't await so webhook returns fast
    fetch(`${protocol}://${host}/api/social-media/process-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        videoUrl,
        skipOpus: true,
        projectId: project_id,
      }),
    }).catch(console.error)

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Opus webhook error:', err)
    return NextResponse.json({ received: true }) // Always return 200 to Opus
  }
}
