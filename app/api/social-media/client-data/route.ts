import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

// ─── Sanitize ──────────────────────────────────────────────────────────────────

function sanitizeForFormula(input: string): string {
  return input.replace(/["\\]/g, '')
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ClientResponse {
  id: string
  name: string
  email: string
  package: string
  platforms: string[]
  niche: string
  frequency: string
  tone: string
  brandDescription: string
  status: string
  subscriptionStatus: string
  videosProcessed: number
  postsPublished: number
  videosAllowed: number
  uploadPostUserId: string
  subscribedAt: string
  lastProcessedAt: string
  connectedAccounts: Array<{ platform: string; accountName: string }>
  videos: Array<{
    id: string
    videoUrl: string
    status: string
    clipsPosted: number
    platforms: string[]
    processedAt: string
  }>
}

// ─── Package limits ────────────────────────────────────────────────────────────

const PACKAGE_LIMITS: Record<string, number> = {
  Starter: 4,
  Growth: 8,
  Elite: 999, // effectively unlimited
}

// ─── Connected accounts from Upload-Post ───────────────────────────────────────

async function getConnectedAccounts(
  username: string
): Promise<Array<{ platform: string; accountName: string }>> {
  const apiKey = process.env.UPLOAD_POST_API_KEY
  if (!apiKey) return []

  try {
    const res = await fetch(
      `https://api.upload-post.com/api/uploadposts/users/${encodeURIComponent(username)}/accounts`,
      { headers: { Authorization: `Apikey ${apiKey}` } }
    )
    if (!res.ok) return []

    const data = await res.json()
    const accounts = data.accounts ?? data.data ?? data ?? []
    if (!Array.isArray(accounts)) return []

    return accounts.map((a: Record<string, unknown>) => ({
      platform: (a.platform as string) ?? 'unknown',
      accountName: (a.account_name as string) ?? (a.username as string) ?? '',
    }))
  } catch {
    return []
  }
}

// ─── Main handler ──────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // Rate limit: 30 requests per minute
  const ip = getClientIp(req)
  const { allowed } = checkRateLimit(`client-data:${ip}`, 30, 60 * 1000)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  const sessionId = req.nextUrl.searchParams.get('session_id')
  const clientId = req.nextUrl.searchParams.get('client_id')

  if (!sessionId && !clientId) {
    return NextResponse.json(
      { error: 'Missing session_id or client_id parameter' },
      { status: 400 }
    )
  }

  const baseId = process.env.AIRTABLE_SOCIAL_BASE
  const apiKey = process.env.AIRTABLE_PAT
  if (!baseId || !apiKey) {
    return NextResponse.json({ error: 'Airtable not configured' }, { status: 503 })
  }

  try {
    let record: Record<string, unknown> | null = null

    // Fetch by record ID directly if provided
    if (clientId?.startsWith('rec')) {
      const res = await fetch(
        `https://api.airtable.com/v0/${baseId}/Social%20Media%20Clients/${clientId}`,
        { headers: { Authorization: `Bearer ${apiKey}` } }
      )
      if (res.ok) {
        record = await res.json()
      }
    }

    // Fall back to session ID search
    if (!record && (sessionId || clientId)) {
      const safe = sanitizeForFormula(sessionId ?? clientId ?? '')
      const formula = sessionId
        ? `{Stripe Session ID}="${safe}"`
        : `OR({Upload Post User ID}="${safe}",{Stripe Session ID}="${safe}")`

      const res = await fetch(
        `https://api.airtable.com/v0/${baseId}/Social%20Media%20Clients?filterByFormula=${encodeURIComponent(formula)}`,
        { headers: { Authorization: `Bearer ${apiKey}` } }
      )
      const data = await res.json()
      record = data.records?.[0] ?? null
    }

    if (!record) {
      return NextResponse.json({ client: null, videos: [] })
    }

    const id = (record as { id: string }).id
    const f = (record as { fields: Record<string, unknown> }).fields

    // Get connected accounts from Upload-Post
    const uploadPostUserId = (f['Upload Post User ID'] as string) ?? id
    const connectedAccounts = await getConnectedAccounts(uploadPostUserId)

    // Calculate package limits
    const pkg = (f['Package'] as string) ?? 'Growth'
    const videosAllowed = PACKAGE_LIMITS[pkg] ?? 8

    // Build comprehensive client response
    const client: ClientResponse = {
      id,
      name: (f['Name'] as string) ?? '',
      email: (f['Email'] as string) ?? '',
      package: pkg,
      platforms: (f['Platforms'] as string[]) ?? [],
      niche: (f['Niche'] as string) ?? '',
      frequency: (f['Frequency'] as string) ?? '',
      tone: (f['Tone'] as string) ?? '',
      brandDescription: (f['Brand Description'] as string) ?? '',
      status: (f['Status'] as string) ?? 'Active',
      subscriptionStatus: (f['Subscription Status'] as string) ?? (f['Status'] as string) ?? 'Active',
      videosProcessed: (f['Videos Processed'] as number) ?? 0,
      postsPublished: (f['Posts Published'] as number) ?? 0,
      videosAllowed,
      uploadPostUserId,
      subscribedAt: (f['Subscribed At'] as string) ?? '',
      lastProcessedAt: (f['Last Processed At'] as string) ?? '',
      connectedAccounts,
      // Build video history from the record
      videos: f['Last Video URL']
        ? [
            {
              id,
              videoUrl: f['Last Video URL'] as string,
              status: (f['Status'] as string) ?? 'Active',
              clipsPosted: (f['Posts Published'] as number) ?? 0,
              platforms: (f['Platforms'] as string[]) ?? [],
              processedAt: (f['Last Processed At'] as string) ?? '',
            },
          ]
        : [],
    }

    return NextResponse.json({ client })
  } catch (err) {
    console.error('[client-data] Error:', err)
    return NextResponse.json({ error: 'Failed to load client data' }, { status: 500 })
  }
}
