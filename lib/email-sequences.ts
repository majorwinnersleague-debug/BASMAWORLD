// ── BillyChat Email Nurture Sequences ─────────────────────────────────────────
// 3 funnels, 7 emails total
// On-brand: dark bg, neon purple #9333ea, gold #f59e0b

export interface EmailTemplate {
  id: string
  funnel: 'academy' | 'mwl' | 'hopes'
  delayDays: number
  subject: string
  htmlBody: string
  textBody: string
}

// ─── Shared HTML helpers ───────────────────────────────────────────────────────
const htmlWrap = (content: string, bgAccent = '#9333ea') => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#111111;border-radius:16px;overflow:hidden;border:1px solid #1f1f1f;">
          <!-- Header bar -->
          <tr>
            <td style="background:linear-gradient(135deg,${bgAccent} 0%,#7c3aed 100%);padding:8px 0;text-align:center;">
            </td>
          </tr>
          <!-- Logo/Brand -->
          <tr>
            <td style="padding:32px 40px 0 40px;text-align:center;">
              <p style="margin:0;font-size:28px;font-weight:900;letter-spacing:-0.5px;">
                <span style="color:#ffffff;">BASMA</span><span style="color:#9333ea;">WORLD</span>
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:24px 40px 40px 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #1f1f1f;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#555555;">BasmaWorld · Las Vegas, NV</p>
              <p style="margin:0;font-size:11px;color:#444444;">
                You're receiving this because you connected with Billy 🎭<br/>
                <a href="https://basmaworld.com/unsubscribe" style="color:#555555;text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

const ctaButton = (label: string, href: string, color = '#9333ea') =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto 0;">
    <tr>
      <td style="background-color:${color};border-radius:10px;padding:0;">
        <a href="${href}" style="display:inline-block;padding:14px 32px;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.3px;">${label}</a>
      </td>
    </tr>
  </table>`

// ── FUNNEL A: Academy ──────────────────────────────────────────────────────────

const academyEmail1Body = htmlWrap(`
  <p style="margin:0 0 8px;font-size:32px;text-align:center;">🎭🎵</p>
  <h1 style="margin:0 0 20px;font-size:26px;font-weight:900;color:#ffffff;text-align:center;line-height:1.2;">
    YOOO! Billy here! Your music<br/>journey starts <span style="color:#f59e0b;">RIGHT NOW!</span>
  </h1>
  <p style="margin:0 0 16px;font-size:16px;color:#cccccc;line-height:1.6;">
    OH. MY. STRINGS. 🎉 I am SO pumped you're here! I'm Billy — Basma's favorite (and only) puppet — and I've been waiting to meet a rockstar like <strong style="color:#ffffff;">YOU</strong>.
  </p>
  <p style="margin:0 0 16px;font-size:16px;color:#cccccc;line-height:1.6;">
    You just took the first step toward something seriously epic. At the <strong style="color:#9333ea;">Become A Singer Music Academy</strong>, Basma and I work with kids and teens to unlock their inner musician — whether that's voice, piano, guitar, violin, or drums. 🥁🎹🎸🎻🎤
  </p>
  <p style="margin:0 0 24px;font-size:16px;color:#cccccc;line-height:1.6;">
    No experience needed. No pressure. Just pure musical magic. ✨
  </p>
  <div style="background-color:#1a1a1a;border-left:4px solid #9333ea;border-radius:8px;padding:20px 24px;margin:0 0 24px;">
    <p style="margin:0;font-size:15px;color:#aaaaaa;line-height:1.6;">
      <strong style="color:#f59e0b;">🎯 What's inside the Academy?</strong><br/>
      → Live lessons with Basma & the team<br/>
      → AI-powered practice tools (Echo is WILD 🤖)<br/>
      → A community of rockstars just like you<br/>
      → Performances, showcases & real-world skills
    </p>
  </div>
  <p style="margin:0 0 4px;font-size:16px;color:#cccccc;line-height:1.6;">
    Jump in and explore — I'll be right there with you every step of the way! 🪆
  </p>
  ${ctaButton('🎵 Explore the Academy →', 'https://basmaworld.com/academy')}
  <p style="margin:32px 0 0;font-size:14px;color:#666666;text-align:center;">
    Keep an eye on your inbox — I've got more surprises coming your way! 🎉<br/>
    — Billy 🎭 (and Basma too 😄)
  </p>
`)

const academyEmail2Body = htmlWrap(`
  <p style="margin:0 0 8px;font-size:32px;text-align:center;">🎸🥁🎹🎻🎤</p>
  <h1 style="margin:0 0 20px;font-size:26px;font-weight:900;color:#ffffff;text-align:center;line-height:1.2;">
    Psst… <span style="color:#f59e0b;">which instrument</span><br/>is calling your name?
  </h1>
  <p style="margin:0 0 16px;font-size:16px;color:#cccccc;line-height:1.6;">
    Hey superstar! It's Billy again! 🎭 Quick question — and I need you to really <em style="color:#9333ea;">feel</em> this one…
  </p>
  <p style="margin:0 0 24px;font-size:22px;color:#ffffff;text-align:center;font-weight:700;line-height:1.4;">
    When you close your eyes and imagine yourself on stage… <span style="color:#f59e0b;">what are you playing?</span>
  </p>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;">
    <tr>
      <td width="50%" style="padding:8px;">
        <div style="background-color:#1a1a1a;border:1px solid #9333ea;border-radius:10px;padding:16px;text-align:center;">
          <p style="margin:0;font-size:24px;">🎤</p>
          <p style="margin:4px 0 0;font-size:14px;font-weight:700;color:#ffffff;">Voice / Singing</p>
        </div>
      </td>
      <td width="50%" style="padding:8px;">
        <div style="background-color:#1a1a1a;border:1px solid #f59e0b;border-radius:10px;padding:16px;text-align:center;">
          <p style="margin:0;font-size:24px;">🎹</p>
          <p style="margin:4px 0 0;font-size:14px;font-weight:700;color:#ffffff;">Piano / Keys</p>
        </div>
      </td>
    </tr>
    <tr>
      <td width="50%" style="padding:8px;">
        <div style="background-color:#1a1a1a;border:1px solid #9333ea;border-radius:10px;padding:16px;text-align:center;">
          <p style="margin:0;font-size:24px;">🎸</p>
          <p style="margin:4px 0 0;font-size:14px;font-weight:700;color:#ffffff;">Guitar</p>
        </div>
      </td>
      <td width="50%" style="padding:8px;">
        <div style="background-color:#1a1a1a;border:1px solid #f59e0b;border-radius:10px;padding:16px;text-align:center;">
          <p style="margin:0;font-size:24px;">🎻</p>
          <p style="margin:4px 0 0;font-size:14px;font-weight:700;color:#ffffff;">Violin / Viola</p>
        </div>
      </td>
    </tr>
    <tr>
      <td colspan="2" style="padding:8px;">
        <div style="background-color:#1a1a1a;border:1px solid #9333ea;border-radius:10px;padding:16px;text-align:center;">
          <p style="margin:0;font-size:24px;">🥁</p>
          <p style="margin:4px 0 0;font-size:14px;font-weight:700;color:#ffffff;">Drums & Percussion</p>
        </div>
      </td>
    </tr>
  </table>
  <p style="margin:0 0 16px;font-size:16px;color:#cccccc;line-height:1.6;">
    Whatever it is — we've got you covered at the Academy! Basma and the team teach ALL of these, and there's literally zero judgment. Just vibes, progress, and a LOT of fun. 🎉
  </p>
  <p style="margin:0 0 24px;font-size:16px;color:#cccccc;line-height:1.6;">
    Hop over to the Academy page, pick your instrument track, and let's get you STARTED! 🚀
  </p>
  ${ctaButton('🎵 Find Your Instrument Track →', 'https://basmaworld.com/academy')}
  <p style="margin:32px 0 0;font-size:14px;color:#666666;text-align:center;">
    See you there, rockstar! 🌟<br/>
    — Billy 🎭
  </p>
`)

const academyEmail3Body = htmlWrap(`
  <p style="margin:0 0 8px;font-size:32px;text-align:center;">🤖🎵</p>
  <h1 style="margin:0 0 20px;font-size:26px;font-weight:900;color:#ffffff;text-align:center;line-height:1.2;">
    Meet <span style="color:#9333ea;">Echo</span> — your personal<br/>AI music mentor!
  </h1>
  <p style="margin:0 0 16px;font-size:16px;color:#cccccc;line-height:1.6;">
    What's UP, superstar! Billy here, dropping the BIGGEST news of the week! 🎭🎉
  </p>
  <p style="margin:0 0 16px;font-size:16px;color:#cccccc;line-height:1.6;">
    Have you heard about <strong style="color:#9333ea;">Echo</strong>? Because if you haven't — buckle up, because your mind is about to be BLOWN. 🤯
  </p>
  <div style="background:linear-gradient(135deg,#1a0a2e 0%,#0d1f1f 100%);border:1px solid #9333ea;border-radius:12px;padding:28px;margin:0 0 24px;">
    <p style="margin:0 0 12px;font-size:18px;font-weight:900;color:#9333ea;text-align:center;">✨ Echo is your AI music mentor ✨</p>
    <p style="margin:0 0 12px;font-size:15px;color:#bbbbbb;line-height:1.6;">
      🎯 <strong style="color:#ffffff;">Personalized practice plans</strong> — Echo studies how YOU play and builds a practice schedule just for you.<br/><br/>
      🎧 <strong style="color:#ffffff;">Instant feedback</strong> — Echo listens and tells you exactly what to work on (no more guessing!).<br/><br/>
      📈 <strong style="color:#ffffff;">Progress tracking</strong> — see yourself improve week by week.<br/><br/>
      🌙 <strong style="color:#ffffff;">Available 24/7</strong> — practice at 2am if you want. Echo doesn't sleep. 🤖
    </p>
  </div>
  <p style="margin:0 0 16px;font-size:16px;color:#cccccc;line-height:1.6;">
    Echo is built right into the Academy — so when you book your first lesson with Basma, you get access to Echo too. It's like having TWO music teachers for the price of one! 🙌
  </p>
  <p style="margin:0 0 24px;font-size:16px;color:#f59e0b;font-weight:700;text-align:center;">
    Ready to meet Echo? Book your first lesson now! 👇
  </p>
  ${ctaButton('🎵 Book My First Lesson →', 'https://basmaworld.com/academy', '#f59e0b')}
  <p style="margin:32px 0 0;font-size:14px;color:#666666;text-align:center;">
    You've got this, rockstar. I believe in you! 💜<br/>
    — Billy 🎭 (Echo says hi too! 🤖)
  </p>
`)

// ── FUNNEL B: MWL / General ────────────────────────────────────────────────────

const mwlEmail1Body = htmlWrap(`
  <p style="margin:0 0 8px;font-size:32px;text-align:center;">🏆</p>
  <h1 style="margin:0 0 20px;font-size:26px;font-weight:900;color:#ffffff;text-align:center;line-height:1.2;">
    Welcome to the<br/><span style="color:#f59e0b;">Major Winners League</span>
  </h1>
  <p style="margin:0 0 16px;font-size:16px;color:#cccccc;line-height:1.6;">
    Hi there — I'm so glad you found us. 🙏
  </p>
  <p style="margin:0 0 16px;font-size:16px;color:#cccccc;line-height:1.6;">
    I'm <strong style="color:#ffffff;">Basma</strong> — artist, educator, and founder of BasmaWorld. For the past decade, I've been helping <strong style="color:#f59e0b;">creators, artists, and entrepreneurs</strong> build brands that people actually remember. Las Vegas is my home base, but the work we do here reaches everywhere.
  </p>
  <div style="background-color:#1a1a1a;border-radius:12px;padding:24px;margin:0 0 24px;">
    <p style="margin:0 0 12px;font-size:16px;font-weight:700;color:#f59e0b;">What the Major Winners League does:</p>
    <p style="margin:0;font-size:15px;color:#aaaaaa;line-height:1.8;">
      🎯 <strong style="color:#ffffff;">Brand Strategy</strong> — clarity, positioning & storytelling<br/>
      📱 <strong style="color:#ffffff;">Social Media Growth</strong> — content that converts, not just collects likes<br/>
      🎬 <strong style="color:#ffffff;">Content Production</strong> — video, photo & multimedia<br/>
      🤝 <strong style="color:#ffffff;">Partnership & Visibility</strong> — getting you in the right rooms<br/>
      🎓 <strong style="color:#ffffff;">Coaching & Mentorship</strong> — personalized to where you are NOW
    </p>
  </div>
  <p style="margin:0 0 24px;font-size:16px;color:#cccccc;line-height:1.6;">
    Whether you're just starting out or looking to level up, MWL exists to help you go from hidden gem to household name. 💎 I'd love to learn more about your goals.
  </p>
  ${ctaButton('🏆 Explore MWL →', 'https://basmaworld.com/mwl')}
  <p style="margin:32px 0 0;font-size:14px;color:#666666;text-align:center;">
    More soon — keep an eye on your inbox! ✨<br/>
    — Basma
  </p>
`, '#f59e0b')

const mwlEmail2Body = htmlWrap(`
  <p style="margin:0 0 8px;font-size:32px;text-align:center;">👀✨</p>
  <h1 style="margin:0 0 20px;font-size:26px;font-weight:900;color:#ffffff;text-align:center;line-height:1.2;">
    How we helped creators in<br/><span style="color:#f59e0b;">Las Vegas</span> get seen
  </h1>
  <p style="margin:0 0 16px;font-size:16px;color:#cccccc;line-height:1.6;">
    Hey — Basma here again. 👋 I want to share something real with you today.
  </p>
  <p style="margin:0 0 24px;font-size:16px;color:#cccccc;line-height:1.6;">
    Las Vegas is one of the most competitive entertainment markets in the world. The talent here is unreal — but talent alone doesn't get you seen. <strong style="color:#ffffff;">Strategy does.</strong>
  </p>
  <div style="background-color:#1a1a1a;border-left:4px solid #f59e0b;border-radius:8px;padding:20px 24px;margin:0 0 20px;">
    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#f59e0b;text-transform:uppercase;letter-spacing:1px;">Real Results</p>
    <p style="margin:0;font-size:16px;color:#ffffff;font-style:italic;line-height:1.6;">
      "Before MWL, I had the skills but zero visibility. Six months later, I had brand partnerships, a growing social following, and my first paid showcase. Basma didn't just coach me — she changed how I see myself as a business."
    </p>
    <p style="margin:12px 0 0;font-size:14px;color:#888888;">— MWL Creator, Las Vegas</p>
  </div>
  <div style="background-color:#1a1a1a;border-left:4px solid #9333ea;border-radius:8px;padding:20px 24px;margin:0 0 24px;">
    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#9333ea;text-transform:uppercase;letter-spacing:1px;">How It Works</p>
    <p style="margin:0;font-size:15px;color:#aaaaaa;line-height:1.7;">
      ① We assess where you are and where you want to go<br/>
      ② We build a custom brand + content strategy<br/>
      ③ We execute together — with real accountability<br/>
      ④ We measure, refine, and scale what works
    </p>
  </div>
  <p style="margin:0 0 24px;font-size:16px;color:#cccccc;line-height:1.6;">
    It's not magic — it's a system. And it works because it's built specifically for <em style="color:#f59e0b;">you</em>, not copy-pasted from a template. 🎯
  </p>
  ${ctaButton('🏆 See What MWL Offers →', 'https://basmaworld.com/mwl', '#f59e0b')}
  <p style="margin:32px 0 0;font-size:14px;color:#666666;text-align:center;">
    One more email coming your way — I think you'll want to hear this. 💎<br/>
    — Basma
  </p>
`, '#f59e0b')

const mwlEmail3Body = htmlWrap(`
  <p style="margin:0 0 8px;font-size:32px;text-align:center;">📞💎</p>
  <h1 style="margin:0 0 20px;font-size:26px;font-weight:900;color:#ffffff;text-align:center;line-height:1.2;">
    Ready to grow your brand?<br/><span style="color:#f59e0b;">Let's talk.</span>
  </h1>
  <p style="margin:0 0 16px;font-size:16px;color:#cccccc;line-height:1.6;">
    Hey — Basma here. This is my last email in this series, and I want to keep it simple. 🙏
  </p>
  <p style="margin:0 0 16px;font-size:16px;color:#cccccc;line-height:1.6;">
    If you've been reading along, you know what MWL does and what we stand for. But here's the truth — the best way to know if we're the right fit for you is a <strong style="color:#ffffff;">real conversation</strong>.
  </p>
  <div style="background:linear-gradient(135deg,#1a1000 0%,#1a0a00 100%);border:1px solid #f59e0b;border-radius:12px;padding:28px;margin:0 0 24px;text-align:center;">
    <p style="margin:0 0 8px;font-size:18px;font-weight:900;color:#f59e0b;">Free 20-Minute Strategy Call</p>
    <p style="margin:0 0 16px;font-size:15px;color:#bbbbbb;line-height:1.6;">
      No pitch. No pressure. Just an honest conversation about your goals and whether MWL can help you get there faster.
    </p>
    <p style="margin:0;font-size:14px;color:#888888;">
      📅 Pick a time that works for you<br/>
      🎯 Tell me where you're at and where you want to go<br/>
      💡 Walk away with at least one actionable idea
    </p>
  </div>
  <p style="margin:0 0 24px;font-size:16px;color:#cccccc;line-height:1.6;">
    Spots are limited — I only take on a handful of new clients each month so I can give real attention to the people I work with. If now's not the right time, no worries at all. But if you're ready to make moves — I'd love to connect. 🤝
  </p>
  ${ctaButton('📞 Book Your Free Call →', 'https://calendly.com/basmaworld', '#f59e0b')}
  <p style="margin:32px 0 0;font-size:14px;color:#666666;text-align:center;">
    Looking forward to hearing your story. 💛<br/>
    — Basma
  </p>
`, '#f59e0b')

// ── FUNNEL C: Hopes Chance ─────────────────────────────────────────────────────

const hopesEmail1Body = htmlWrap(`
  <p style="margin:0 0 8px;font-size:32px;text-align:center;">💙🕊️</p>
  <h1 style="margin:0 0 20px;font-size:24px;font-weight:900;color:#ffffff;text-align:center;line-height:1.35;">
    You're not alone. 💙<br/><span style="color:#9333ea;">We're glad you reached out.</span>
  </h1>
  <p style="margin:0 0 16px;font-size:16px;color:#cccccc;line-height:1.7;">
    Hi — I'm so glad you found us. Whatever brought you here today, I want you to know: <strong style="color:#ffffff;">you matter, your story matters, and you are not alone in this.</strong>
  </p>
  <p style="margin:0 0 16px;font-size:16px;color:#cccccc;line-height:1.7;">
    Hopes Chance was created because I know firsthand how hard it can be to ask for help — and how life-changing it is when you find a community that actually shows up for you. 🤍
  </p>
  <div style="background-color:#0d1220;border:1px solid #4c1d95;border-radius:12px;padding:24px;margin:0 0 24px;">
    <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#9333ea;">Resources available to you:</p>
    <p style="margin:0;font-size:15px;color:#aaaaaa;line-height:1.9;">
      💜 <strong style="color:#ffffff;">Community support</strong> — connect with others who understand<br/>
      📚 <strong style="color:#ffffff;">Resources & guides</strong> — practical tools for where you are now<br/>
      🌟 <strong style="color:#ffffff;">Stories of hope</strong> — real people, real journeys<br/>
      🤝 <strong style="color:#ffffff;">Direct support</strong> — reach a real human who cares
    </p>
  </div>
  <p style="margin:0 0 16px;font-size:16px;color:#cccccc;line-height:1.7;">
    There's no pressure, no expectations — just an open door whenever you're ready. Take your time. We'll be here. 💙
  </p>
  <p style="margin:0 0 24px;font-size:16px;color:#cccccc;line-height:1.7;">
    When you feel ready, visit the Hopes Chance page for resources, community, and connection.
  </p>
  ${ctaButton('💙 Visit Hopes Chance →', 'https://basmaworld.com/mwl/hopes-chance', '#4c1d95')}
  <p style="margin:32px 0 0;font-size:15px;color:#777777;text-align:center;line-height:1.7;">
    With care and hope,<br/>
    <strong style="color:#9333ea;">Basma & the BasmaWorld Team</strong> 💙
  </p>
  <p style="margin:16px 0 0;font-size:13px;color:#555555;text-align:center;">
    If you are in immediate crisis, please call or text <strong style="color:#ffffff;">988</strong> (Suicide &amp; Crisis Lifeline) or text HOME to <strong style="color:#ffffff;">741741</strong> (Crisis Text Line).
  </p>
`, '#4c1d95')

// ─── Export all sequences ──────────────────────────────────────────────────────

export const emailSequences: EmailTemplate[] = [
  // Funnel A — Academy
  {
    id: 'academy-1',
    funnel: 'academy',
    delayDays: 0,
    subject: "Billy here! 🎭 Your music journey starts NOW",
    htmlBody: academyEmail1Body,
    textBody: `Hey rockstar! Billy here! 🎭

OH. MY. STRINGS — I am SO pumped you're here! I'm Billy, Basma's puppet pal, and you just took the first step toward something seriously epic.

At the Become A Singer Music Academy, Basma and I work with kids and teens to unlock their inner musician — voice, piano, guitar, violin, drums — you name it!

What's inside:
→ Live lessons with Basma & the team
→ AI-powered practice tools (Echo is incredible!)
→ A community of rockstars just like you
→ Performances, showcases & real-world skills

Jump in now: https://basmaworld.com/academy

Keep an eye on your inbox — I've got more surprises coming!
— Billy 🎭 (and Basma too 😄)

---
BasmaWorld · Las Vegas, NV
Unsubscribe: https://basmaworld.com/unsubscribe`,
  },
  {
    id: 'academy-2',
    funnel: 'academy',
    delayDays: 2,
    subject: "What instrument is calling your name? 🎸",
    htmlBody: academyEmail2Body,
    textBody: `Hey superstar! Billy here 🎭

Quick question — close your eyes and imagine yourself on stage. What are you playing?

🎤 Voice / Singing
🎹 Piano / Keys
🎸 Guitar
🎻 Violin / Viola
🥁 Drums

Whatever it is — we've got you covered at the Academy! Basma and the team teach ALL of these.

Find your instrument track: https://basmaworld.com/academy

See you there, rockstar! 🌟
— Billy 🎭

---
BasmaWorld · Las Vegas, NV
Unsubscribe: https://basmaworld.com/unsubscribe`,
  },
  {
    id: 'academy-3',
    funnel: 'academy',
    delayDays: 5,
    subject: "Meet Echo — your AI music mentor 🤖🎵",
    htmlBody: academyEmail3Body,
    textBody: `What's UP superstar! Billy here with the BIGGEST news 🎭🤖

Have you heard about Echo? Your personal AI music mentor built right into the Academy!

✨ Echo gives you:
→ Personalized practice plans based on how YOU play
→ Instant feedback on your playing
→ Progress tracking week by week
→ 24/7 availability (Echo doesn't sleep!)

It's like having TWO music teachers for the price of one. When you book your first lesson with Basma, you get Echo too. 🙌

Book your first lesson: https://basmaworld.com/academy

You've got this, rockstar! 💜
— Billy 🎭 (Echo says hi too! 🤖)

---
BasmaWorld · Las Vegas, NV
Unsubscribe: https://basmaworld.com/unsubscribe`,
  },

  // Funnel B — MWL
  {
    id: 'mwl-1',
    funnel: 'mwl',
    delayDays: 0,
    subject: "Welcome to the Major Winners League 🏆",
    htmlBody: mwlEmail1Body,
    textBody: `Hi there — I'm so glad you found us. 🙏

I'm Basma — artist, educator, and founder of BasmaWorld. For the past decade, I've been helping creators, artists, and entrepreneurs build brands that people actually remember.

What the Major Winners League does:
🎯 Brand Strategy — clarity, positioning & storytelling
📱 Social Media Growth — content that converts
🎬 Content Production — video, photo & multimedia
🤝 Partnership & Visibility — getting you in the right rooms
🎓 Coaching & Mentorship — personalized to where you are NOW

Whether you're just starting out or looking to level up, MWL exists to help you go from hidden gem to household name. 💎

Learn more: https://basmaworld.com/mwl

More soon — keep an eye on your inbox! ✨
— Basma

---
BasmaWorld · Las Vegas, NV
Unsubscribe: https://basmaworld.com/unsubscribe`,
  },
  {
    id: 'mwl-2',
    funnel: 'mwl',
    delayDays: 3,
    subject: "How we helped creators in Las Vegas get seen 👀",
    htmlBody: mwlEmail2Body,
    textBody: `Hey — Basma here again. 👋

Las Vegas is one of the most competitive entertainment markets in the world. The talent here is unreal — but talent alone doesn't get you seen. Strategy does.

"Before MWL, I had the skills but zero visibility. Six months later, I had brand partnerships, a growing social following, and my first paid showcase." — MWL Creator, Las Vegas

How it works:
① We assess where you are and where you want to go
② We build a custom brand + content strategy
③ We execute together — with real accountability
④ We measure, refine, and scale what works

It's not magic — it's a system built specifically for you. 🎯

See what MWL offers: https://basmaworld.com/mwl

One more email coming your way — I think you'll want to hear this. 💎
— Basma

---
BasmaWorld · Las Vegas, NV
Unsubscribe: https://basmaworld.com/unsubscribe`,
  },
  {
    id: 'mwl-3',
    funnel: 'mwl',
    delayDays: 7,
    subject: "Ready to grow your brand? Let's talk 📞",
    htmlBody: mwlEmail3Body,
    textBody: `Hey — Basma here. This is my last email in this series.

If you've been reading along, you know what MWL does and what we stand for. The best way to know if we're the right fit is a real conversation.

Free 20-Minute Strategy Call
No pitch. No pressure. Just an honest conversation about your goals and whether MWL can help you get there faster.

📅 Pick a time that works for you
🎯 Tell me where you're at and where you want to go
💡 Walk away with at least one actionable idea

Spots are limited — I only take on a handful of new clients each month. If you're ready to make moves, I'd love to connect. 🤝

Book your free call: https://calendly.com/basmaworld

Looking forward to hearing your story. 💛
— Basma

---
BasmaWorld · Las Vegas, NV
Unsubscribe: https://basmaworld.com/unsubscribe`,
  },

  // Funnel C — Hopes Chance
  {
    id: 'hopes-1',
    funnel: 'hopes',
    delayDays: 0,
    subject: "You're not alone 💙 — resources inside",
    htmlBody: hopesEmail1Body,
    textBody: `Hi — I'm so glad you found us. 💙

Whatever brought you here today, I want you to know: you matter, your story matters, and you are not alone in this.

Hopes Chance was created because I know firsthand how hard it can be to ask for help — and how life-changing it is when you find a community that actually shows up for you.

Resources available to you:
💜 Community support — connect with others who understand
📚 Resources & guides — practical tools for where you are now
🌟 Stories of hope — real people, real journeys
🤝 Direct support — reach a real human who cares

There's no pressure, no expectations — just an open door whenever you're ready. Take your time. We'll be here. 💙

Visit Hopes Chance: https://basmaworld.com/mwl/hopes-chance

With care and hope,
Basma & the BasmaWorld Team 💙

---
If you are in immediate crisis, please call or text 988 (Suicide & Crisis Lifeline) or text HOME to 741741 (Crisis Text Line).

BasmaWorld · Las Vegas, NV
Unsubscribe: https://basmaworld.com/unsubscribe`,
  },
]

// ─── Funnel helpers ────────────────────────────────────────────────────────────

export type FunnelKey = 'academy' | 'mwl' | 'hopes'

export function getFunnelForSource(source: string): FunnelKey {
  const s = source.toLowerCase()
  if (s.includes('hopes')) return 'hopes'
  if (s.includes('academy') || s.includes('basmateachme')) return 'academy'
  return 'mwl'
}

export function getEmail1ForFunnel(funnel: FunnelKey): EmailTemplate {
  const email = emailSequences.find((e) => e.funnel === funnel && e.delayDays === 0)
  if (!email) throw new Error(`No email found for funnel ${funnel}`)
  return email
}

export function getEmailsForFunnel(funnel: FunnelKey): EmailTemplate[] {
  return emailSequences.filter((e) => e.funnel === funnel).sort((a, b) => a.delayDays - b.delayDays)
}
