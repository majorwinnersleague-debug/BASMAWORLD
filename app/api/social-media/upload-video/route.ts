import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'

export const dynamic = 'force-dynamic'

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
      return NextResponse.json({ error: 'Invalid file type. Use MP4, MOV, or AVI.' }, { status: 400 })
    }

    // Validate file size — 2GB limit
    if (file.size > 2 * 1024 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 2GB.' }, { status: 400 })
    }

    // Write to tmp — in production, swap this for S3/R2 upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${sessionId}-${Date.now()}-${file.name.replace(/[^a-z0-9.-]/gi, '_')}`
    const tmpPath = join(tmpdir(), filename)
    await writeFile(tmpPath, buffer)

    // TODO: Upload to S3/Cloudflare R2 and return the public URL
    // For now return a local path placeholder — replace with real storage URL
    const videoUrl = `https://basmaworld.com/uploads/${filename}`

    // Store video URL in Airtable
    const baseId = process.env.AIRTABLE_BASE_ID
    const apiKey = process.env.AIRTABLE_API_KEY
    if (baseId && apiKey) {
      const searchRes = await fetch(
        `https://api.airtable.com/v0/${baseId}/Social%20Media%20Clients?filterByFormula=${encodeURIComponent(`{Stripe Session ID}="${sessionId}"`)}`,
        { headers: { Authorization: `Bearer ${apiKey}` } }
      )
      const searchData = await searchRes.json()
      const recordId = searchData.records?.[0]?.id

      if (recordId) {
        await fetch(`https://api.airtable.com/v0/${baseId}/Social%20Media%20Clients/${recordId}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ fields: { 'Last Video URL': videoUrl, 'Status': 'Processing' } }),
        })
      }
    }

    return NextResponse.json({ videoUrl, filename })
  } catch (err) {
    console.error('Video upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
