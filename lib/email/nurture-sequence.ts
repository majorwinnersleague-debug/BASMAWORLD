// BillyChat Lead Nurture — 7-Email Sequence
// Triggered when a lead is captured via /api/billy-lead

export interface NurtureEmail {
  subject: string
  html: string
  text: string
  delayDays: number // days after lead capture to send
}

export function buildNurtureSequence(firstName: string): NurtureEmail[] {
  const name = firstName || 'there'

  return [
    // Email 1 — Immediate (day 0): Welcome + quick win
    {
      delayDays: 0,
      subject: `Welcome, ${name}! Here's your first win with BillyChat 🎉`,
      text: `Hi ${name},\n\nThank you for chatting with Billy! You're now officially in the BasmaWorld community — a place where bold moves, financial wins, and real connections happen.\n\nHere's your first action: Visit basmaworld.com and explore the three pillars of what we do:\n\n1. Major Winners League (MWL) — competitive community for achievers\n2. BasmaTeach Me — learn to build wealth on your terms\n3. Hope's Chance — stories of real people winning\n\nReply to this email with your #1 goal right now. I read every one.\n\nLet's build something great,\nBasma`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0a; color: #ffffff;">
  <div style="text-align: center; padding: 20px 0;">
    <h1 style="color: #fbbf24; font-size: 28px; margin: 0;">Welcome to BasmaWorld 🎉</h1>
    <p style="color: #9ca3af; margin-top: 8px;">Hi ${name}, you're in!</p>
  </div>
  <div style="background: #1a1a1a; border-radius: 12px; padding: 24px; margin: 20px 0;">
    <p style="color: #e5e7eb; line-height: 1.6;">You just chatted with Billy — which means you're ready to take action. That's exactly who BasmaWorld is built for.</p>
    <p style="color: #e5e7eb; line-height: 1.6;">Here's what we're about:</p>
    <ul style="color: #e5e7eb; line-height: 1.8;">
      <li><strong style="color: #fbbf24;">Major Winners League</strong> — competitive community for achievers</li>
      <li><strong style="color: #fbbf24;">BasmaTeach Me</strong> — learn to build wealth on your terms</li>
      <li><strong style="color: #fbbf24;">Hope's Chance</strong> — real people, real wins</li>
    </ul>
  </div>
  <div style="text-align: center; padding: 20px 0;">
    <a href="https://basmaworld.com" style="background: #fbbf24; color: #0a0a0a; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Explore BasmaWorld →</a>
  </div>
  <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 24px;">Reply with your #1 goal — Basma reads every email.<br>BasmaWorld · <a href="https://basmaworld.com" style="color: #fbbf24;">basmaworld.com</a></p>
</div>`,
    },

    // Email 2 — Day 2: Value delivery — MWL story
    {
      delayDays: 2,
      subject: `${name}, this is what winning looks like 🏆`,
      text: `Hi ${name},\n\nTwo days ago you connected with Billy. Since then, I've been thinking about what you need to know.\n\nMajor Winners League isn't just a community — it's a movement of people who refuse to settle. Members compete, grow, and hold each other accountable.\n\nThe #1 thing I hear from MWL members: "I didn't know what I was capable of until I was surrounded by people who expected more."\n\nAre you ready to find out what you're capable of?\n\nBasma\n\nP.S. BillyChat is available 24/7 at basmaworld.com/mwl — ask him anything about the league.`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0a; color: #ffffff;">
  <div style="text-align: center; padding: 20px 0;">
    <h1 style="color: #fbbf24; font-size: 28px; margin: 0;">What Winning Looks Like 🏆</h1>
  </div>
  <div style="background: #1a1a1a; border-radius: 12px; padding: 24px; margin: 20px 0;">
    <p style="color: #e5e7eb; line-height: 1.6;">Hi ${name},</p>
    <p style="color: #e5e7eb; line-height: 1.6;">Major Winners League isn't just a community — it's a movement of people who refuse to settle.</p>
    <blockquote style="border-left: 4px solid #fbbf24; margin: 20px 0; padding-left: 16px; color: #d1d5db; font-style: italic;">"I didn't know what I was capable of until I was surrounded by people who expected more."</blockquote>
    <p style="color: #e5e7eb; line-height: 1.6;">Members compete, grow, and hold each other accountable. That's the MWL difference.</p>
  </div>
  <div style="text-align: center; padding: 20px 0;">
    <a href="https://basmaworld.com/mwl" style="background: #fbbf24; color: #0a0a0a; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Explore MWL →</a>
  </div>
  <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 24px;">BasmaWorld · <a href="https://basmaworld.com" style="color: #fbbf24;">basmaworld.com</a></p>
</div>`,
    },

    // Email 3 — Day 4: Education — BasmaTeach Me
    {
      delayDays: 4,
      subject: `The skill gap is costing you money, ${name}`,
      text: `Hi ${name},\n\nHere's a hard truth: most people don't have a money problem. They have a knowledge gap.\n\nBasmaTeach Me was built to close that gap — with real strategies, not theories. Whether you're building a business, growing investments, or learning to negotiate — the curriculum is practical and results-focused.\n\nThis week's focus: building income streams that work while you sleep.\n\nVisit basmaworld.com/basmateachme to see what's possible.\n\nLet's learn,\nBasma`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0a; color: #ffffff;">
  <div style="text-align: center; padding: 20px 0;">
    <h1 style="color: #fbbf24; font-size: 28px; margin: 0;">Close the Knowledge Gap 📚</h1>
  </div>
  <div style="background: #1a1a1a; border-radius: 12px; padding: 24px; margin: 20px 0;">
    <p style="color: #e5e7eb; line-height: 1.6;">Hi ${name},</p>
    <p style="color: #e5e7eb; line-height: 1.6;"><strong style="color: #fbbf24;">Hard truth:</strong> most people don't have a money problem. They have a knowledge gap.</p>
    <p style="color: #e5e7eb; line-height: 1.6;">BasmaTeach Me was built to close that gap — real strategies, not theories. Practical. Results-focused.</p>
    <div style="background: #262626; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="color: #fbbf24; font-weight: bold; margin: 0 0 8px 0;">This week's focus:</p>
      <p style="color: #e5e7eb; margin: 0;">Building income streams that work while you sleep.</p>
    </div>
  </div>
  <div style="text-align: center; padding: 20px 0;">
    <a href="https://basmaworld.com/basmateachme" style="background: #fbbf24; color: #0a0a0a; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Start Learning →</a>
  </div>
  <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 24px;">BasmaWorld · <a href="https://basmaworld.com" style="color: #fbbf24;">basmaworld.com</a></p>
</div>`,
    },

    // Email 4 — Day 7: Social proof — Hope's Chance story
    {
      delayDays: 7,
      subject: `${name}, someone just like you did it`,
      text: `Hi ${name},\n\nI want to share a story.\n\nHope's Chance is our series about real people who changed their trajectory. Not celebrities. Not overnight successes. People who started exactly where you are — and decided to move.\n\nThe common thread? They didn't wait for the perfect moment. They started with what they had.\n\nRead the stories at basmaworld.com/mwl/hopes-chance\n\nYou might see yourself in one of them.\n\nBasma`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0a; color: #ffffff;">
  <div style="text-align: center; padding: 20px 0;">
    <h1 style="color: #fbbf24; font-size: 28px; margin: 0;">Real People. Real Wins. 💫</h1>
  </div>
  <div style="background: #1a1a1a; border-radius: 12px; padding: 24px; margin: 20px 0;">
    <p style="color: #e5e7eb; line-height: 1.6;">Hi ${name},</p>
    <p style="color: #e5e7eb; line-height: 1.6;"><strong style="color: #fbbf24;">Hope's Chance</strong> is our series about real people who changed their trajectory.</p>
    <p style="color: #e5e7eb; line-height: 1.6;">Not celebrities. Not overnight successes. People who started exactly where you are — and decided to move.</p>
    <blockquote style="border-left: 4px solid #fbbf24; margin: 20px 0; padding-left: 16px; color: #d1d5db; font-style: italic;">"They didn't wait for the perfect moment. They started with what they had."</blockquote>
  </div>
  <div style="text-align: center; padding: 20px 0;">
    <a href="https://basmaworld.com/mwl/hopes-chance" style="background: #fbbf24; color: #0a0a0a; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Read Their Stories →</a>
  </div>
  <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 24px;">BasmaWorld · <a href="https://basmaworld.com" style="color: #fbbf24;">basmaworld.com</a></p>
</div>`,
    },

    // Email 5 — Day 10: Objection handler / FAQ
    {
      delayDays: 10,
      subject: `${name}, I want to answer your questions`,
      text: `Hi ${name},\n\nI know you've been exploring BasmaWorld, and I want to address the questions I hear most often:\n\n"Is this right for me?" — If you want more: more income, more community, more clarity — yes.\n\n"How much time does it take?" — As much or as little as you give it. The resources are there when you're ready.\n\n"What makes this different?" — Basma is in the trenches with you. This isn't a faceless platform. It's a community led by someone who has done the work.\n\nHave another question? Reply to this email — I'll answer personally.\n\nBasma`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0a; color: #ffffff;">
  <div style="text-align: center; padding: 20px 0;">
    <h1 style="color: #fbbf24; font-size: 28px; margin: 0;">Let's Answer Your Questions ❓</h1>
  </div>
  <div style="background: #1a1a1a; border-radius: 12px; padding: 24px; margin: 20px 0;">
    <p style="color: #e5e7eb; line-height: 1.6;">Hi ${name},</p>
    <div style="margin: 16px 0;">
      <p style="color: #fbbf24; font-weight: bold; margin: 0 0 4px 0;">"Is this right for me?"</p>
      <p style="color: #e5e7eb; margin: 0 0 16px 0;">If you want more — more income, more community, more clarity — yes.</p>
      <p style="color: #fbbf24; font-weight: bold; margin: 0 0 4px 0;">"How much time does it take?"</p>
      <p style="color: #e5e7eb; margin: 0 0 16px 0;">As much or as little as you give it. Resources are there when you're ready.</p>
      <p style="color: #fbbf24; font-weight: bold; margin: 0 0 4px 0;">"What makes this different?"</p>
      <p style="color: #e5e7eb; margin: 0;">Basma is in the trenches with you. A community led by someone who has done the work.</p>
    </div>
  </div>
  <div style="text-align: center; padding: 20px 0;">
    <a href="https://basmaworld.com" style="background: #fbbf24; color: #0a0a0a; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Explore BasmaWorld →</a>
  </div>
  <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 24px;">Reply — Basma reads every email.<br>BasmaWorld · <a href="https://basmaworld.com" style="color: #fbbf24;">basmaworld.com</a></p>
</div>`,
    },

    // Email 6 — Day 14: Urgency / offer
    {
      delayDays: 14,
      subject: `${name}, this is your moment`,
      text: `Hi ${name},\n\nTwo weeks ago you took the first step. You chatted with Billy. That shows curiosity — and curiosity is the beginning of every transformation.\n\nBut curiosity without action stays curiosity.\n\nHere's what I want you to do today — just one thing:\n\nVisit basmaworld.com and pick ONE area to go deeper. MWL, BasmaTeach Me, or Hope's Chance. Just one.\n\nThat's it. One click. One decision. One step forward.\n\nI'm here when you're ready.\n\nBasma`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0a; color: #ffffff;">
  <div style="text-align: center; padding: 20px 0;">
    <h1 style="color: #fbbf24; font-size: 28px; margin: 0;">This Is Your Moment ⚡</h1>
  </div>
  <div style="background: #1a1a1a; border-radius: 12px; padding: 24px; margin: 20px 0;">
    <p style="color: #e5e7eb; line-height: 1.6;">Hi ${name},</p>
    <p style="color: #e5e7eb; line-height: 1.6;">Two weeks ago you took the first step. Curiosity is the beginning of every transformation.</p>
    <p style="color: #e5e7eb; line-height: 1.6;"><strong style="color: #fbbf24;">But curiosity without action stays curiosity.</strong></p>
    <div style="background: #262626; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: center;">
      <p style="color: #fbbf24; font-weight: bold; font-size: 18px; margin: 0 0 8px 0;">One action. Right now.</p>
      <p style="color: #e5e7eb; margin: 0;">Pick ONE area to go deeper — MWL, BasmaTeach Me, or Hope's Chance.</p>
    </div>
  </div>
  <div style="text-align: center; padding: 20px 0;">
    <a href="https://basmaworld.com" style="background: #fbbf24; color: #0a0a0a; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Take the Next Step →</a>
  </div>
  <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 24px;">BasmaWorld · <a href="https://basmaworld.com" style="color: #fbbf24;">basmaworld.com</a></p>
</div>`,
    },

    // Email 7 — Day 21: Final touch / community CTA
    {
      delayDays: 21,
      subject: `${name} — still thinking about you`,
      text: `Hi ${name},\n\nThree weeks since we first connected. I still think about the people who chat with Billy — because they're not random. They're searching for something real.\n\nI built BasmaWorld for people like you. People who are done with average. Who want to compete, grow, and connect with others who are serious.\n\nThe community is growing. New opportunities are coming. I'd love for you to be part of what we're building.\n\nWhenever you're ready — I'm here.\n\nWith respect,\nBasma\n\nP.S. BillyChat is always at basmaworld.com — he never sleeps and always has time for you.`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0a; color: #ffffff;">
  <div style="text-align: center; padding: 20px 0;">
    <h1 style="color: #fbbf24; font-size: 28px; margin: 0;">Still Thinking About You 💛</h1>
  </div>
  <div style="background: #1a1a1a; border-radius: 12px; padding: 24px; margin: 20px 0;">
    <p style="color: #e5e7eb; line-height: 1.6;">Hi ${name},</p>
    <p style="color: #e5e7eb; line-height: 1.6;">Three weeks since we first connected. I built BasmaWorld for people like you — done with average, ready to compete, grow, and connect with others who are serious.</p>
    <p style="color: #e5e7eb; line-height: 1.6;">The community is growing. New opportunities are coming.</p>
    <p style="color: #fbbf24; font-weight: bold; line-height: 1.6;">I'd love for you to be part of what we're building.</p>
  </div>
  <div style="text-align: center; padding: 20px 0;">
    <a href="https://basmaworld.com" style="background: #fbbf24; color: #0a0a0a; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Join the Community →</a>
  </div>
  <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 24px;">BasmaWorld · <a href="https://basmaworld.com" style="color: #fbbf24;">basmaworld.com</a><br>
  <a href="https://basmaworld.com/unsubscribe" style="color: #4b5563;">Unsubscribe</a></p>
</div>`,
    },
  ]
}
