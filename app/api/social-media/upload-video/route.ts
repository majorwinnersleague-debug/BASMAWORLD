import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export const dynamic = 'force-dynamic'

// Sanitize user input for Airtable filterByFormula (prevent formula injection)
function sanitizeForFormula(input: string): string {
  return input.replace(/["\\]/g, '')
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('video') as File | null
    const sessionId = formData.get('sessionId') as string | null

    if (!file || !sessionId) {
      return NextResponse.json({ error: 'Missing file or sessionId' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/avi']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Use MP4, MOV, or AVI.' },
        { status: 400 }
      )
    }

    // Validate file size — 500 MB (Vercel Blob server upload limit)
    if (file.size > 500 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 500 MB.' }, { status: 400 })
    }

    // Upload to Vercel Blob — returns a real, publicly-accessible URL
    const safeSession = sanitizeForFormula(sessionId)
    const safeName = file.name.replace(/[^a-z0-9.-]/gi, '_')
    const blobPath = `social-media/${safeSession}-${Date.now()}-${safeName}`

    const blob = await put(blobPath, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    const videoUrl = blob.url

    // Store video URL in Airtable
    const baseId = process.env.AIRTABLE_SOCIAL_BASE
    const apiKey = process.env.AIRTABLE_PAT
    if (baseId && apiKey) {
      const searchRes = await fetch(
        `https://api.airtable.com/v0/${baseId}/Social%20Media%20Clients?filterByFormula=${encodeURIComponent(
          `{Stripe Session ID}="${safeSession}"`
        )}`,
        { headers: { Authorization: `Bearer ${apiKey}` } }
      )
      const searchData = await searchRes.json()
      const recordId = searchData.records?.[0]?.id

      if (recordId) {
        await fetch(
          `https://api.airtable.com/v0/${baseId}/Social%20Media%20Clients/${recordId}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fields: { 'Last Video URL': videoUrl, Status: 'Processing' },
            }),
          }
        )
      }
    }

    return NextResponse.json({ videoUrl, filename: blob.pathname })
  } catch (err) {
    console.error('Video upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
