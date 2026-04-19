import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Sanitize user input for Airtable filterByFormula
function sanitizeForFormula(input: string): string {
  return input.replace(/["\\]/g, '')
}

// Generate a white-label Upload-Post JWT connect URL for the client
export async function POST(req: NextRequest) {
  const apiKey = process.env.UPLOAD_POST_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Upload-Post not configured' },
      { status: 503 }
    )
  }

  try {
    const { sessionId } = await req.json()
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
    }

    const safeSession = sanitizeForFormula(sessionId)
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://basmaworld.com'

    // Look up the client's Upload-Post username from Airtable
    const baseId = process.env.AIRTABLE_SOCIAL_BASE
    const airtableKey = process.env.AIRTABLE_PAT
    let uploadPostUsername = safeSession // fallback

    if (baseId && airtableKey) {
      const searchRes = await fetch(
        `https://api.airtable.com/v0/${baseId}/Social%20Media%20Clients?filterByFormula=${encodeURIComponent(
          `{Stripe Session ID}="${safeSession}"`
        )}`,
        { headers: { Authorization: `Bearer ${airtableKey}` } }
      )
      const searchData = await searchRes.json()
      const record = searchData.records?.[0]
      if (record?.fields?.['Upload Post User ID']) {
        uploadPostUsername = record.fields['Upload Post User ID']
      }
    }

    // Generate the white-label JWT connect URL
    const jwtRes = await fetch(
      'https://api.upload-post.com/api/uploadposts/users/generate-jwt',
      {
        method: 'POST',
        headers: {
          Authorization: `Apikey ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: uploadPostUsername,
          redirect_url: `${siteUrl}/social-media/onboarding?session_id=${safeSession}&connected=true`,
          logo_image: `${siteUrl}/images/basma-hero.jpg`,
          connect_title: 'Connect Your Social Accounts',
          connect_description:
            'Link the platforms where you want your content posted automatically.',
          show_calendar: true,
          readonly_calendar: false,
        }),
      }
    )

    const jwtData = await jwtRes.json()

    if (!jwtRes.ok || !jwtData.access_url) {
      console.error('Upload-Post JWT error:', jwtData)
      return NextResponse.json(
        { error: 'Could not generate connection URL' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: jwtData.access_url })
  } catch (err) {
    console.error('Connect URL error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
