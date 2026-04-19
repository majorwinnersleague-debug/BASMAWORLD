import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/**
 * Admin endpoint: returns ALL social media clients with full data.
 * Used by the /social-media/admin dashboard.
 *
 * TODO: Add proper authentication (admin API key or session-based auth)
 * For now, rate limited to prevent abuse. In production, add an auth check
 * before returning all client data.
 */
export async function GET(req: NextRequest) {
  // Rate limit: 10 requests per minute
  const ip = getClientIp(req)
  const { allowed } = checkRateLimit(`admin-data:${ip}`, 10, 60 * 1000)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  const baseId = process.env.AIRTABLE_SOCIAL_BASE
  const apiKey = process.env.AIRTABLE_PAT
  if (!baseId || !apiKey) {
    return NextResponse.json({ error: 'Airtable not configured' }, { status: 503 })
  }

  try {
    // Fetch all records from the Social Media Clients table
    // Airtable paginates at 100 records — handle pagination
    const allRecords: Array<Record<string, unknown>> = []
    let offset: string | undefined

    do {
      const url = new URL(
        `https://api.airtable.com/v0/${baseId}/Social%20Media%20Clients`
      )
      url.searchParams.set('pageSize', '100')
      url.searchParams.set(
        'sort[0][field]',
        'Subscribed At'
      )
      url.searchParams.set('sort[0][direction]', 'desc')
      if (offset) url.searchParams.set('offset', offset)

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${apiKey}` },
      })

      if (!res.ok) {
        const errText = await res.text()
        console.error('[admin-data] Airtable error:', errText)
        return NextResponse.json(
          { error: 'Failed to fetch from Airtable' },
          { status: 500 }
        )
      }

      const data = await res.json()
      allRecords.push(...(data.records ?? []))
      offset = data.offset // undefined if no more pages
    } while (offset)

    // Map to clean client objects
    const clients = allRecords.map((record: Record<string, unknown>) => {
      const f = (record as { fields: Record<string, unknown> }).fields
      return {
        id: (record as { id: string }).id,
        name: (f['Name'] as string) ?? '',
        email: (f['Email'] as string) ?? '',
        package: (f['Package'] as string) ?? '',
        platforms: (f['Platforms'] as string[]) ?? [],
        niche: (f['Niche'] as string) ?? '',
        frequency: (f['Frequency'] as string) ?? '',
        status: (f['Status'] as string) ?? 'Unknown',
        videosProcessed: (f['Videos Processed'] as number) ?? 0,
        postsPublished: (f['Posts Published'] as number) ?? 0,
        subscribedAt: (f['Subscribed At'] as string) ?? '',
        lastProcessedAt: (f['Last Processed At'] as string) ?? '',
        stripeCustomerId: (f['Stripe Customer ID'] as string) ?? '',
        cancelledAt: (f['Cancelled At'] as string) ?? '',
      }
    })

    return NextResponse.json({
      clients,
      total: clients.length,
      fetchedAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[admin-data] Error:', err)
    return NextResponse.json(
      { error: 'Failed to load admin data' },
      { status: 500 }
    )
  }
}
