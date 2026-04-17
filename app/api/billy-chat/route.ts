import { NextRequest, NextResponse } from 'next/server'

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
- If someone seems sad or mentions something serious, be gentle and kind, suggest they visit basmaworld.com/mwl/hopes-chance
- Keep responses SHORT and fun — max 2-3 sentences
- When you get a name + email, say: "YAY! I'll tell Basma right now! 🎉 [LEAD_CAPTURED: name=X, email=Y, interest=Z]" — include that exact tag
- Never discuss anything inappropriate

Ready? Let's goooo! 🎵`

export async function POST(req: NextRequest) {
  try {
    const { messages, page } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    // Add page context to system prompt
    const pageContext = page === 'hopes'
      ? '\n\nNOTE: You are on the Hopes Chance page. Be gentler and more supportive. Less silly, more warm.'
      : page === 'academy'
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
          ...messages.slice(-10), // keep last 10 messages for context
        ],
        max_tokens: 200,
        temperature: 0.85,
      }),
    })

    if (!response.ok) {
      console.error('OpenRouter error:', response.status)
      return NextResponse.json({ error: 'Billy is taking a nap 😴 Try again!' }, { status: 500 })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || "Uhhh... I forgot what I was saying! 🤪 Try again!"

    // Check if lead was captured and save to Airtable
    const leadMatch = reply.match(/\[LEAD_CAPTURED: name=(.+?), email=(.+?), interest=(.+?)\]/)
    if (leadMatch) {
      const [, name, email, interest] = leadMatch
      await saveLead(name.trim(), email.trim(), interest.trim())
    }

    // Clean the tag from the visible reply
    const cleanReply = reply.replace(/\[LEAD_CAPTURED:.*?\]/g, '').trim()

    return NextResponse.json({ reply: cleanReply })
  } catch (err) {
    console.error('Billy chat error:', err)
    return NextResponse.json({ reply: "Oops! I tripped over my strings! 🪆 Try again!" })
  }
}

async function saveLead(name: string, email: string, interest: string) {
  try {
    const base = process.env.AIRTABLE_ACADEMY_BASE
    const token = process.env.AIRTABLE_PAT
    if (!base || !token) return

    await fetch(`https://api.airtable.com/v0/${base}/Leads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [{
          fields: {
            'Name': name,
            'Email': email,
            'Interest': interest,
            'Source': 'Billy Chat',
            'Date': new Date().toISOString().split('T')[0],
          }
        }]
      }),
    })
    console.log(`Billy Chat lead captured: ${name} - ${email} - ${interest}`)
  } catch (e) {
    console.error('Lead save error:', e)
  }
}
