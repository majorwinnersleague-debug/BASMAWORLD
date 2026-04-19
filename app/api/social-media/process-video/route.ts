import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface ClientRecord {
  id: string
  uploadPostUserId: string
  platforms: string[]
  tone: string
  captions: boolean
  brandedTemplates: boolean
  email: string
  package: string
}

// ─── Airtable ─────────────────────────────────────────────────────────────────

async function getClientBySessionId(sessionId: string): Promise<ClientRecord | null> {
  const baseId = process.env.AIRTABLE_SOCIAL_BASE
  const apiKey = process.env.AIRTABLE_PAT
  if (!baseId || !apiKey) return null

  const res = await fetch(
    `https://api.airtable.com/v0/${baseId}/Social%20Media%20Clients?filterByFormula=${encodeURIComponent(`{Stripe Session ID}="${sessionId}"`)}`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  )
  const data = await res.json()
  const record = data.records?.[0]
  if (!record) return null

  const f = record.fields
  return {
    id: record.id,
    uploadPostUserId: f['Upload Post User ID'] ?? record.id,
    platforms: f['Platforms'] ?? [],
    tone: f['Tone'] ?? 'Funny / Casual',
    captions: f['Captions'] ?? true,
    brandedTemplates: f['Branded Templates'] ?? false,
    email: f['Email'] ?? '',
    package: f['Package'] ?? 'Growth',
  }
}

async function updateAirtableRecord(recordId: string, fields: Record<string, unknown>) {
  const baseId = process.env.AIRTABLE_SOCIAL_BASE
  const apiKey = process.env.AIRTABLE_PAT
  if (!baseId || !apiKey) return

  await fetch(`https://api.airtable.com/v0/${baseId}/Social%20Media%20Clients/${recordId}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  })
}

// ─── Opus Clip ─────────────────────────────────────────────────────────────────

async function submitToOpusClip(videoUrl: string): Promise<string | null> {
  const apiKey = process.env.OPUS_CLIP_API_KEY
  if (!apiKey) return null

  const res = await fetch('https://api.opus.pro/api/create-project', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      video_url: videoUrl,
      language: 'en',
      preferred_clip_duration: [30, 60],
      num_clips: 5,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Opus Clip submit error:', err)
    return null
  }

  const data = await res.json()
  return data.project_id ?? data.id ?? null
}

async function getOpusClips(projectId: string) {
  const apiKey = process.env.OPUS_CLIP_API_KEY
  if (!apiKey) return []

  const res = await fetch(
    `https://api.opus.pro/api/exportable-clips?q=findByProjectId&projectId=${projectId}&pageNum=1&pageSize=10`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  )

  if (!res.ok) return []
  const data = await res.json()
  // Sort by score descending, take top 3
  const clips = (data.clips ?? data.data ?? []) as Array<{
    id: string
    uriForExport: string
    title: string
    hashtags: string
    description: string
    score?: number
    viralityScore?: number
  }>
  return clips
    .sort((a, b) => (b.viralityScore ?? b.score ?? 0) - (a.viralityScore ?? a.score ?? 0))
    .slice(0, 3)
}

// ─── Caption generation ────────────────────────────────────────────────────────

const PLATFORM_RULES: Record<string, string> = {
  'TikTok': 'Max 150 chars. Hook in first 3 words. 3-5 hashtags. Punchy and conversational.',
  'Instagram Reels': 'Max 300 chars. Storytelling tone. 5-10 hashtags. Engaging and visual.',
  'YouTube Shorts': 'Title-style caption, keyword-rich, max 100 chars. No hashtags in caption.',
  'Facebook': 'Friendly and shareable, max 200 chars. 2-3 hashtags.',
  'LinkedIn': 'Professional insight-first, max 250 chars. 2-3 industry hashtags. No emoji spam.',
}

async function generateCaption(platform: string, clipTitle: string, hashtags: string, tone: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return `${clipTitle} ${hashtags}`

  const rules = PLATFORM_RULES[platform] ?? 'Max 200 chars. 3-5 hashtags.'
  const toneMap: Record<string, string> = {
    'Funny / Casual': 'funny, casual, and relatable',
    'Professional': 'professional and authoritative',
    'Inspirational': 'inspiring and motivating',
    'Educational': 'educational and informative',
  }
  const toneDesc = toneMap[tone] ?? 'engaging'

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: `Write a ${toneDesc} ${platform} caption for this video clip.
Clip title: "${clipTitle}"
Suggested hashtags: ${hashtags}
Platform rules: ${rules}
Return ONLY the caption text, nothing else.`,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    })
    const data = await res.json()
    return data.choices?.[0]?.message?.content?.trim() ?? `${clipTitle} ${hashtags}`
  } catch {
    return `${clipTitle} ${hashtags}`
  }
}

// ─── Upload-Post ───────────────────────────────────────────────────────────────

async function postClipToSocial(
  clipUrl: string,
  caption: string,
  uploadPostUserId: string,
  platforms: string[]
): Promise<boolean> {
  const apiKey = process.env.UPLOAD_POST_API_KEY
  if (!apiKey) return false

  // Build form data
  const formData = new FormData()
  formData.append('title', caption)
  formData.append('user', uploadPostUserId)

  // Download clip and attach as blob
  try {
    const clipRes = await fetch(clipUrl)
    if (!clipRes.ok) return false
    const clipBlob = await clipRes.blob()
    formData.append('video', clipBlob, 'clip.mp4')
    platforms.forEach(p => formData.append('platform[]', p.toLowerCase().replace(' ', '_').replace(' reels', '').replace(' shorts', '')))

    const uploadRes = await fetch('https://api.upload-post.com/api/upload', {
      method: 'POST',
      headers: { Authorization: `Apikey ${apiKey}` },
      body: formData,
    })

    return uploadRes.ok
  } catch (err) {
    console.error('Upload-Post error:', err)
    return false
  }
}

// ─── Send notification email ───────────────────────────────────────────────────

async function sendNotificationEmail(email: string, clipsPosted: number, platforms: string[]) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey || !email) return

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'BasmaWorld <noreply@basmaworld.com>',
      to: email,
      subject: `✅ ${clipsPosted} clips posted to your social media`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;">
          <h2 style="color:#8B5CF6;">Your content is live! 🎉</h2>
          <p>We just posted <strong>${clipsPosted} clip${clipsPosted !== 1 ? 's' : ''}</strong> to your accounts:</p>
          <p style="color:#666;">${platforms.join(', ')}</p>
          <p>Log into your dashboard to see what was posted and upload your next video.</p>
          <a href="https://basmaworld.com/social-media/dashboard"
             style="display:inline-block;background:#8B5CF6;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:16px;">
            View Dashboard →
          </a>
        </div>
      `,
    }),
  })
}

// ─── Main handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { sessionId, videoUrl } = await req.json()
    if (!sessionId || !videoUrl) {
      return NextResponse.json({ error: 'Missing sessionId or videoUrl' }, { status: 400 })
    }

    // 1. Get client record
    const client = await getClientBySessionId(sessionId)
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // 2. Submit to Opus Clip
    const projectId = await submitToOpusClip(videoUrl)
    if (!projectId) {
      return NextResponse.json({ error: 'Opus Clip submission failed' }, { status: 500 })
    }

    // Store project ID in Airtable and return immediately
    // Webhook will handle the rest when Opus finishes
    await updateAirtableRecord(client.id, {
      'Opus Clip Project ID': projectId,
      'Status': 'Clipping',
    })

    // Poll for completion (fallback if webhook not configured — max 5 min)
    let clips: Awaited<ReturnType<typeof getOpusClips>> = []
    for (let attempt = 0; attempt < 30; attempt++) {
      await new Promise(r => setTimeout(r, 10000)) // wait 10s between polls
      clips = await getOpusClips(projectId)
      if (clips.length > 0) break
    }

    if (clips.length === 0) {
      // Webhook will pick this up when done
      return NextResponse.json({ status: 'processing', projectId })
    }

    // 3. For each clip: generate caption + post
    let clipsPosted = 0
    for (const clip of clips) {
      for (const platform of client.platforms) {
        const caption = await generateCaption(platform, clip.title, clip.hashtags, client.tone)
        const posted = await postClipToSocial(clip.uriForExport, caption, client.uploadPostUserId, [platform])
        if (posted) clipsPosted++
      }
    }

    // 4. Update Airtable
    await updateAirtableRecord(client.id, {
      'Status': 'Posted',
      'Videos Processed': 1,
      'Posts Published': clipsPosted,
      'Last Processed At': new Date().toISOString(),
    })

    // 5. Notify client
    await sendNotificationEmail(client.email, clipsPosted, client.platforms)

    return NextResponse.json({ success: true, clipsPosted, projectId })
  } catch (err) {
    console.error('Process video error:', err)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
