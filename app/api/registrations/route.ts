import { NextRequest, NextResponse } from 'next/server'

const CONVEX_URL = 'https://amiable-finch-612.convex.cloud'

export async function GET(req: NextRequest) {
  try {
    const resp = await fetch(`${CONVEX_URL}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: 'registrations:list',
        args: {},
        format: 'json',
      }),
      next: { revalidate: 60 }, // cache for 60s
    })

    if (!resp.ok) {
      return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 })
    }

    const data = await resp.json()
    const registrations = data.value || []

    return NextResponse.json({ registrations, count: registrations.length })
  } catch (err) {
    console.error('Error fetching registrations:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
