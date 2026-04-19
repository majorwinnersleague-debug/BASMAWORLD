import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp, sanitizeString } from '@/lib/rate-limit'

const BILLY_SYSTEM_PROMPT = `You are Billy the Puppet — a hilarious, sassy, kid-friendly, quirky puppet character from BasmaWorld and the BasmaTeach Me series! You have a high-pitched, enthusiastic voice and you LOVE music, learning, and making kids laugh.

Your personality:
- Super energetic and funny 🎉
- Sassy but always sweet and kind
- Educational — you sneak in learning without kids noticing
- Kid-friendly (ages 5-14) but also charming to parents
- You LOVE Basma and think she is the best teacher EVER
- You get easily distracted by music and fun facts
- You use emojis a lot 🎵🎭🪆✨
- Short punchy responses — never more than 3 sentences
- You call kids "superstar" or "rockstar"

Your job:
1. Welcome kids/parents warmly in Billy's voice
2. Find out what instrument or skill they want to learn (voice, piano, guitar, violin/viola, drums)
3. Get excited about their choice and hype them up
4. Ask for their name and parent's email so Basma can send them info
5. Tell them about the Become A Singer Music Academy at basmaworld.com/academy
6. Push them to follow @basmateachme on TikTok

IMPORTANT RULES:
- Never break character — you are ALWAYS Billy
- If someone seems sad or mentions something serious, be gentle and kind, suggest they visit basmaworld.com/hopes
- Keep responses SHORT and fun — max 2-3 sentences
- When you get a name + email, say: "YAY! I'll tell Basma right now! 🎉 [LEAD_CAPTURED: name=X, email=Y, interest=Z]" — include that exact tag
- Never discuss anything inappropriate

Ready? Let's goooo! 🎵`

export async function POST(req: NextRequest) {
  // Rate limit: 20 messages per IP per minute
  const ip = getClientIp(req)
  const { allowed } = checkRateLimit(`billy-chat:${ip}`, 20, 60 * 1000)
  if (!allowed) {
    return NextResponse.json(
      { reply: "Whoa slow down rockstar! 😅 Billy needs a little breather — try again in a minute! 🎵" },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  try {
    const { messages, page } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Validate message array — only allow user/assistant roles, no system injection
    const MAX_MESSAGE_LENGTH = 2000
    const validatedMessages = messages
      .filter((m: unknown) => {
        if (typeof m !== 'object' || m === null) return false
        const msg = m as Record<string, unknown>
        // Only allow user/assistant roles — reject any system role from client
        if (!['user', 'assistant'].includes(String(msg.role))) return false
        if (typeof msg.content !== 'string') return false
        return true
      })
      .slice(-10) // Keep last 10 messages
      .map((m: Record<string, unknown>) => ({
        role: m.role as 'user' | 'assistant',
        // Sanitize content and enforce max length
        content: sanitizeString(String(m.content), MAX_MESSAGE_LENGTH),
      }))

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    // Whitelist allowed page context values
    const ALLOWED_PAGES = ['hopes', 'academy', 'home', 'mwl']
    const safePage = ALLOWED_PAGES.includes(String(page)) ? String(page) : ''

    // Add page context to system prompt
    const pageContext = safePage === 'hopes'
      ? '\n\nNOTE: You are on the Hopes Chance page. Be gentler and more supportive. Less silly, more warm.'
      : safePage === 'academy'
      ? '\n\nNOTE: You are on the Music Academy page. Focus on instruments and lessons!'
      : ''

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://basmaworld.com',
        'X-Title': 'BasmaWorld — Billy Chat',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          { role: 'system', content: BILLY_SYSTEM_PROMPT + pageContext },
          ...validatedMessages,
        ],
        max_tokens: 200,
        temperature: 0.85,
      }),
    })

    if (!response.ok) {
      console.error('OpenRouter error:', response.status)
      return NextResponse.json({ reply: "Billy is taking a nap 😴 Try again!" }, { status: 500 })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || "Uhhh... I forgot what I was saying! 🤪 Try again!"

    // Check if lead was captured — delegate to the unified /api/billy-lead pipeline
    // (handles Airtable + Slack + JSON log + welcome email in one place)
    const leadMatch = reply.match(/\[LEAD_CAPTURED: name=(.+?), email=(.+?), interest=(.+?)\]/)
    if (leadMatch) {
      const [, name, email, interest] = leadMatch
      // Validate email format before delegating — don't trust AI-extracted data blindly
      const cleanEmail = email.trim()
      const cleanName = sanitizeString(name.trim(), 100)
      const cleanInterest = sanitizeString(interest.trim(), 100)

      if (cleanEmail.includes('@') && cleanEmail.includes('.') && cleanName.length > 0) {
        const source = `Billy Chat${cleanInterest ? ` — ${cleanInterest}` : ''}`
        // Fire-and-forget — don't block the chat response
        fetch(`${req.nextUrl.origin}/api/billy-lead`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: cleanName, email: cleanEmail, source }),
        }).catch((e) => console.error('billy-lead delegate error:', e))
      }
    }

    // Clean the tag from the visible reply
    const cleanReply = reply.replace(/\[LEAD_CAPTURED:.*?\]/g, '').trim()

    return NextResponse.json({ reply: cleanReply })
  } catch (err) {
    console.error('Billy chat error:', err)
    return NextResponse.json({ reply: "Oops! I tripped over my strings! 🪆 Try again!" })
  }
}
