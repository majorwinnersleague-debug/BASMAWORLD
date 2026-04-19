import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface PublishRequest {
  /** Airtable record ID or Upload-Post username for the client */
  clientId: string
  /** Array of clip objects from Opus Clip */
  clips: Array<{
    url: string
    caption: string
    platforms?: string[]
  }>
  /** Override platforms for all clips (optional — falls back to client's connected platforms) */
  platforms?: string[]
}

interface PublishResult {
  clipUrl: string
  platform: string
  success: boolean
  error?: string
}

// ─── Sanitize ──────────────────────────────────────────────────────────────────

function sanitizeForFormula(input: string): string {
  return input.replace(/["\\]/g, '')
}

// ─── Airtable helpers ──────────────────────────────────────────────────────────

async function getClientRecord(clientId: string) {
  const baseId = process.env.AIRTABLE_SOCIAL_BASE
  const apiKey = process.env.AIRTABLE_PAT
  if (!baseId || !apiKey) return null

  // Try by record ID first (starts with "rec")
  if (clientId.startsWith('rec')) {
    const res = await fetch(
      `https://api.airtable.com/v0/${baseId}/Social%20Media%20Clients/${clientId}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    )
    if (res.ok) {
      const record = await res.json()
      return { id: record.id, fields: record.fields }
    }
  }

  // Fall back to searching by Upload Post User ID or Stripe Session ID
  const safe = sanitizeForFormula(clientId)
  const formula = `OR({Upload Post User ID}="${safe}",{Stripe Session ID}="${safe}")`
  const res = await fetch(
    `https://api.airtable.com/v0/${baseId}/Social%20Media%20Clients?filterByFormula=${encodeURIComponent(formula)}`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  )
  const data = await res.json()
  const record = data.records?.[0]
  if (!record) return null
  return { id: record.id, fields: record.fields }
}

async function updatePostCounts(recordId: string, newPosts: number, currentPosts: number) {
  const baseId = process.env.AIRTABLE_SOCIAL_BASE
  const apiKey = process.env.AIRTABLE_PAT
  if (!baseId || !apiKey) return

  await fetch(
    `https://api.airtable.com/v0/${baseId}/Social%20Media%20Clients/${recordId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          'Posts Published': currentPosts + newPosts,
          'Last Processed At': new Date().toISOString(),
        },
      }),
    }
  )
}

// ─── Upload-Post integration ───────────────────────────────────────────────────

/**
 * Downloads a video from a URL and uploads it to Upload-Post for the client.
 * This is the core publish step: Opus clip → download → push to social accounts.
 */
async function publishClipToUploadPost(
  clipUrl: string,
  caption: string,
  uploadPostUsername: string,
  platforms: string[]
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.UPLOAD_POST_API_KEY
  if (!apiKey) {
    return { success: false, error: 'UPLOAD_POST_API_KEY not configured. Add it to Vercel env vars.' }
  }

  try {
    // Step 1: Download the clip from Opus Clip's export URL
    const clipRes = await fetch(clipUrl)
    if (!clipRes.ok) {
      return { success: false, error: `Failed to download clip: ${clipRes.status} ${clipRes.statusText}` }
    }

    const clipBlob = await clipRes.blob()
    if (clipBlob.size === 0) {
      return { success: false, error: 'Downloaded clip is empty' }
    }

    // Step 2: Build multipart form for Upload-Post
    const formData = new FormData()
    formData.append('video', clipBlob, 'clip.mp4')
    formData.append('title', caption)
    formData.append('user', uploadPostUsername)

    // Map platform names to Upload-Post identifiers
    const platformMap: Record<string, string> = {
      'TikTok': 'tiktok',
      'Instagram Reels': 'instagram',
      'Instagram': 'instagram',
      'YouTube Shorts': 'youtube',
      'YouTube': 'youtube',
      'Facebook': 'facebook',
      'LinkedIn': 'linkedin',
      'Twitter': 'twitter',
      'X': 'twitter',
    }

    for (const p of platforms) {
      const mapped = platformMap[p] ?? p.toLowerCase().replace(/\s+/g, '_')
      formData.append('platform[]', mapped)
    }

    // Step 3: Push to Upload-Post
    const uploadRes = await fetch('https://api.upload-post.com/api/upload', {
      method: 'POST',
      headers: { Authorization: `Apikey ${apiKey}` },
      body: formData,
    })

    if (!uploadRes.ok) {
      const errText = await uploadRes.text().catch(() => 'Unknown error')
      return { success: false, error: `Upload-Post returned ${uploadRes.status}: ${errText}` }
    }

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[publish] Error publishing clip:', message)
    return { success: false, error: message }
  }
}

// ─── Main handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Rate limit: 10 publish requests per minute per IP
  const ip = getClientIp(req)
  const { allowed } = checkRateLimit(`publish:${ip}`, 10, 60 * 1000)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait before publishing more clips.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  try {
    const body: PublishRequest = await req.json()
    const { clientId, clips, platforms: overridePlatforms } = body

    if (!clientId || !clips?.length) {
      return NextResponse.json(
        { error: 'Missing clientId or clips array' },
        { status: 400 }
      )
    }

    // Look up client to get their Upload-Post username and platforms
    const client = await getClientRecord(clientId)
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const uploadPostUsername = client.fields['Upload Post User ID'] ?? client.id
    const clientPlatforms = (client.fields['Platforms'] as string[]) ?? []
    const currentPosts = (client.fields['Posts Published'] as number) ?? 0

    // Publish each clip to each platform
    const results: PublishResult[] = []
    let successCount = 0

    for (const clip of clips) {
      // Use clip-level platforms, override, or client defaults
      const targetPlatforms = clip.platforms ?? overridePlatforms ?? clientPlatforms
      if (targetPlatforms.length === 0) {
        results.push({
          clipUrl: clip.url,
          platform: 'none',
          success: false,
          error: 'No platforms specified and client has no connected platforms',
        })
        continue
      }

      const result = await publishClipToUploadPost(
        clip.url,
        clip.caption,
        uploadPostUsername as string,
        targetPlatforms
      )

      // Record a result per platform
      for (const p of targetPlatforms) {
        results.push({
          clipUrl: clip.url,
          platform: p,
          success: result.success,
          error: result.error,
        })
        if (result.success) successCount++
      }
    }

    // Update Airtable counters
    if (successCount > 0) {
      await updatePostCounts(client.id, successCount, currentPosts)
    }

    return NextResponse.json({
      success: successCount > 0,
      published: successCount,
      total: results.length,
      results,
    })
  } catch (err) {
    console.error('[publish] Error:', err)
    return NextResponse.json({ error: 'Publish failed' }, { status: 500 })
  }
}
