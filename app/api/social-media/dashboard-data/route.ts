import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
  }

  const baseId = process.env.AIRTABLE_BASE_ID
  const apiKey = process.env.AIRTABLE_API_KEY
  if (!baseId || !apiKey) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${baseId}/Social%20Media%20Clients?filterByFormula=${encodeURIComponent(`{Stripe Session ID}="${sessionId}"`)}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    )
    const data = await res.json()
    const record = data.records?.[0]

    if (!record) {
      return NextResponse.json({ client: null, videos: [] })
    }

    const f = record.fields

    return NextResponse.json({
      client: {
        name: f['Name'] ?? '',
        email: f['Email'] ?? '',
        package: f['Package'] ?? 'Growth',
        platforms: f['Platforms'] ?? [],
        videosProcessed: f['Videos Processed'] ?? 0,
        postsPublished: f['Posts Published'] ?? 0,
        status: f['Status'] ?? 'Active',
      },
      videos: f['Last Video URL'] ? [
        {
          id: record.id,
          videoUrl: f['Last Video URL'],
          status: f['Status'] ?? 'Active',
          clipsPosted: f['Posts Published'] ?? 0,
          platforms: f['Platforms'] ?? [],
          processedAt: f['Last Processed At'] ?? '',
        },
      ] : [],
    })
  } catch (err) {
    console.error('Dashboard data error:', err)
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 })
  }
}
