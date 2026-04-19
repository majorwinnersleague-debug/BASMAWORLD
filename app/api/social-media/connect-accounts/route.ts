import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

// ─── Sanitize ──────────────────────────────────────────────────────────────────

function sanitizeForFormula(input: string): string {
  return input.replace(/["\\]/g, '')
}

// ─── Upload-Post helpers ───────────────────────────────────────────────────────

/**
 * Creates a new Upload-Post profile for a client.
 * Each client gets their own profile — social accounts link to this profile.
 */
async function createUploadPostProfile(
  username: string
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.UPLOAD_POST_API_KEY
  if (!apiKey) {
    return { success: false, error: 'UPLOAD_POST_API_KEY not configured. Add it to Vercel env vars.' }
  }

  try {
    const res = await fetch('https://api.upload-post.com/api/uploadposts/users', {
      method: 'POST',
      headers: {
        Authorization: `Apikey ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    })

    if (!res.ok) {
      // 409 = profile already exists — that's fine
      if (res.status === 409) {
        return { success: true }
      }
      const errText = await res.text().catch(() => 'Unknown error')
      return { success: false, error: `Upload-Post returned ${res.status}: ${errText}` }
    }

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: message }
  }
}

/**
 * Generates a white-label JWT URL for the client to connect their social accounts.
 * Upload-Post shows a branded OAuth page — client logs into TikTok/IG/YouTube,
 * and their accounts link to the profile. They never leave our branding.
 */
async function generateJwtConnectUrl(
  username: string,
  redirectUrl: string,
  branding?: { logoUrl?: string; title?: string; description?: string }
): Promise<{ url: string | null; error?: string }> {
  const apiKey = process.env.UPLOAD_POST_API_KEY
  if (!apiKey) {
    return { url: null, error: 'UPLOAD_POST_API_KEY not configured. Add it to Vercel env vars.' }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://basmaworld.com'

  try {
    const res = await fetch(
      'https://api.upload-post.com/api/uploadposts/users/generate-jwt',
      {
        method: 'POST',
        headers: {
          Authorization: `Apikey ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          redirect_url: redirectUrl,
          logo_image: branding?.logoUrl ?? `${siteUrl}/images/basma-hero.jpg`,
          connect_title: branding?.title ?? 'Connect Your Social Accounts',
          connect_description:
            branding?.description ??
            'Link the platforms where you want your content posted automatically.',
          show_calendar: true,
          readonly_calendar: false,
        }),
      }
    )

    const data = await res.json()

    if (!res.ok || !data.access_url) {
      console.error('[connect-accounts] JWT generation failed:', data)
      return { url: null, error: 'Could not generate connection URL' }
    }

    return { url: data.access_url }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { url: null, error: message }
  }
}

/**
 * Fetches the list of social accounts connected to an Upload-Post profile.
 */
async function getConnectedAccounts(
  username: string
): Promise<Array<{ platform: string; accountName: string; connected: boolean }>> {
  const apiKey = process.env.UPLOAD_POST_API_KEY
  if (!apiKey) return []

  try {
    const res = await fetch(
      `https://api.upload-post.com/api/uploadposts/users/${encodeURIComponent(username)}/accounts`,
      {
        headers: { Authorization: `Apikey ${apiKey}` },
      }
    )

    if (!res.ok) return []

    const data = await res.json()
    const accounts = data.accounts ?? data.data ?? data ?? []

    if (!Array.isArray(accounts)) return []

    return accounts.map((a: Record<string, unknown>) => ({
      platform: (a.platform as string) ?? 'unknown',
      accountName: (a.account_name as string) ?? (a.username as string) ?? '',
      connected: true,
    }))
  } catch {
    return []
  }
}

// ─── Main handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Rate limit: 5 connect requests per 5 minutes
  const ip = getClientIp(req)
  const { allowed } = checkRateLimit(`connect-accounts:${ip}`, 5, 5 * 60 * 1000)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before trying again.' },
      { status: 429, headers: { 'Retry-After': '300' } }
    )
  }

  try {
    const body = await req.json()
    const { sessionId, clientId } = body

    if (!sessionId && !clientId) {
      return NextResponse.json(
        { error: 'Missing sessionId or clientId' },
        { status: 400 }
      )
    }

    const baseId = process.env.AIRTABLE_SOCIAL_BASE
    const apiKey = process.env.AIRTABLE_PAT
    if (!baseId || !apiKey) {
      return NextResponse.json({ error: 'Airtable not configured' }, { status: 503 })
    }

    // Look up client in Airtable
    const identifier = sanitizeForFormula(clientId ?? sessionId)
    let formula: string
    if (clientId?.startsWith('rec')) {
      // Direct record lookup
      const directRes = await fetch(
        `https://api.airtable.com/v0/${baseId}/Social%20Media%20Clients/${clientId}`,
        { headers: { Authorization: `Bearer ${apiKey}` } }
      )
      if (!directRes.ok) {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 })
      }
      const record = await directRes.json()
      const fields = record.fields
      const uploadPostUsername = fields['Upload Post User ID'] ?? record.id
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://basmaworld.com'

      // Ensure profile exists
      await createUploadPostProfile(uploadPostUsername)

      // Generate JWT URL
      const redirectUrl = `${siteUrl}/social-media/connect?client_id=${record.id}&connected=true`
      const { url, error } = await generateJwtConnectUrl(uploadPostUsername, redirectUrl)
      if (!url) {
        return NextResponse.json({ error: error ?? 'Failed to generate URL' }, { status: 500 })
      }

      // Get connected accounts
      const accounts = await getConnectedAccounts(uploadPostUsername)

      return NextResponse.json({
        connectUrl: url,
        uploadPostUsername,
        connectedAccounts: accounts,
      })
    }

    // Search by session ID
    formula = `{Stripe Session ID}="${identifier}"`
    const searchRes = await fetch(
      `https://api.airtable.com/v0/${baseId}/Social%20Media%20Clients?filterByFormula=${encodeURIComponent(formula)}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    )
    const searchData = await searchRes.json()
    const record = searchData.records?.[0]

    if (!record) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const uploadPostUsername = record.fields['Upload Post User ID'] ?? record.id
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://basmaworld.com'

    // Step 1: Create Upload-Post profile (idempotent)
    const profileResult = await createUploadPostProfile(uploadPostUsername)
    if (!profileResult.success) {
      console.error('[connect-accounts] Profile creation failed:', profileResult.error)
      // Continue anyway — profile might already exist
    }

    // Step 2: Store the Upload-Post username in Airtable if not set
    if (!record.fields['Upload Post User ID']) {
      await fetch(
        `https://api.airtable.com/v0/${baseId}/Social%20Media%20Clients/${record.id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fields: { 'Upload Post User ID': uploadPostUsername },
          }),
        }
      )
    }

    // Step 3: Generate white-label JWT connect URL
    const redirectUrl = sessionId
      ? `${siteUrl}/social-media/connect?session_id=${sanitizeForFormula(sessionId)}&connected=true`
      : `${siteUrl}/social-media/connect?client_id=${record.id}&connected=true`

    const { url, error } = await generateJwtConnectUrl(
      uploadPostUsername,
      redirectUrl
    )

    if (!url) {
      return NextResponse.json(
        { error: error ?? 'Could not generate connection URL' },
        { status: 500 }
      )
    }

    // Step 4: Get currently connected accounts
    const accounts = await getConnectedAccounts(uploadPostUsername)

    return NextResponse.json({
      connectUrl: url,
      uploadPostUsername,
      connectedAccounts: accounts,
    })
  } catch (err) {
    console.error('[connect-accounts] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
