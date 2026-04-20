'use client'

import Link from 'next/link'
import ExpandableSection from '@/components/ExpandableSection'
import BotPackageCard from '@/components/BotPackageCard'
import StripeCheckoutButton from '@/components/StripeCheckoutButton'

export default function BasmaContent() {
  return (
    <>
      <main className="min-h-screen text-white pt-16">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 glass-gold rounded-full px-5 py-2 mb-10 text-xs font-medium text-[#c9a84c] tracking-widest uppercase">
            Singing · Piano · Guitar · Vocal Coaching · All Ages
          </div>
          <h1 className="text-5xl md:text-6xl font-semibold text-white mb-6 leading-tight tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            BASMA{' '}
            <span className="gradient-gold">Music Academy</span>
          </h1>
          <p className="text-white/45 text-lg max-w-2xl mx-auto leading-relaxed mb-4">
            Professional music lessons in Las Vegas. Singing, piano, guitar &amp; more. Gamified learning with XP. <strong className="text-[#c9a84c]">$29 trial lesson.</strong>
          </p>
          <p className="text-white/25 text-sm mb-12">
            Founded by Basma Awada · 300K+ TikTok · 100+ students taught · In-person &amp; online
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <StripeCheckoutButton />
            <a href="https://www.tiktok.com/@basma_singer" target="_blank" rel="noopener noreferrer"
              className="btn-outline px-6 py-3 rounded-full text-sm font-medium transition">
              Watch on TikTok
            </a>
          </div>
        </section>

        {/* ── What We Offer ───────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 pb-10">
          <div className="glass-gold rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl font-semibold text-white mb-3 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>What Do We Teach?</h2>
            <p className="text-white/35 max-w-2xl mx-auto leading-relaxed text-center mb-8 text-sm">
              From 5-year-olds picking up their first instrument to adults who always believed it was &quot;too late&quot; to sing — we meet you where you are and take you further than you thought possible.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { title: 'Singing & Vocals', desc: 'Technique, breath control, performance — beginner to advanced.' },
                { title: 'Piano & Keys', desc: 'Classical to contemporary. Read music, play songs, compose.' },
                { title: 'Guitar', desc: 'Acoustic & electric. Chords, fingerpicking, your favorite songs.' },
                { title: 'Violin & Viola', desc: 'String technique for beginners and intermediate players.' },
                { title: 'Drums & Rhythm', desc: 'Rock, pop, jazz. Beat keeping, fills, full kit coordination.' },
                { title: 'AI Mentor (Billy)', desc: 'Practice guidance, XP tracking, and personalized recommendations.' },
              ].map((p) => (
                <div key={p.title} className="card-premium rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-white mb-1">{p.title}</h3>
                  <p className="text-white/30 text-xs leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Performance Gallery ──────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 pb-10">
          <p className="text-xs text-[#c9a84c]/60 tracking-[0.3em] uppercase mb-3 font-medium text-center">Live Performances</p>
          <h2 className="text-2xl font-semibold text-white text-center mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            From Classroom to <span className="gradient-gold">Stage</span>
          </h2>

          <div className="relative rounded-2xl overflow-hidden mb-3 group" style={{ borderRadius: '4px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/basma/basma-broadway-kids-academy.jpg"
              alt="Basma with student outside Broadway Kids Academy"
              className="w-full object-cover max-h-[420px] object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-[#c9a84c] text-xs font-medium uppercase tracking-widest mb-1">Real Students. Real Results.</p>
              <p className="text-white text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>Broadway Kids Academy — Annie cast night</p>
              <p className="text-white/40 text-sm mt-1">Musical Theater · Singing · Dance · Las Vegas</p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden mb-3 group" style={{ borderRadius: '4px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/basma/students-recital-performance.jpg"
              alt="Students performing on stage at recital"
              className="w-full object-cover max-h-[400px] object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-[#c9a84c] text-xs font-medium uppercase tracking-widest mb-1">Student Recital</p>
              <p className="text-white text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>From the classroom to the stage</p>
              <p className="text-white/40 text-sm mt-1">Every student deserves a moment to shine</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="relative overflow-hidden group aspect-video" style={{ borderRadius: '4px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/basma/basma-teaching-classroom.jpg" alt="Music class" className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 glass rounded-lg px-3 py-1.5 text-xs font-medium text-white/70">Piano Lessons</div>
            </div>
            <div className="relative overflow-hidden group aspect-video" style={{ borderRadius: '4px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/basma/basma-teaching-classroom-2.jpg" alt="Students in class" className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 glass rounded-lg px-3 py-1.5 text-xs font-medium text-white/70">Interactive Learning</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { src: '/images/basma/basma-live-music-stage.jpg', alt: 'Live performance' },
              { src: '/images/basma/basma-orchestra.jpg', alt: 'Orchestra' },
              { src: '/images/basma/basma-performing-stage-3.jpg', alt: 'On stage' },
              { src: '/images/basma/basma-performing-stage-4.jpg', alt: 'Performing' },
            ].map((img) => (
              <div key={img.src} className="relative aspect-square overflow-hidden group" style={{ borderRadius: '4px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors duration-500" />
              </div>
            ))}
          </div>
        </section>

        {/* Studio + Billy Gallery */}
        <section className="max-w-5xl mx-auto px-6 pb-10">
          <p className="text-xs text-[#c9a84c]/60 tracking-[0.3em] uppercase mb-3 font-medium text-center">Behind the Scenes</p>
          <h2 className="text-2xl font-semibold text-white text-center mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            Inside the <span className="gradient-gold">Studio</span>
          </h2>

          <div className="relative rounded-2xl overflow-hidden mb-3 group" style={{ borderRadius: '4px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/studio/pianist-spotlight.jpg"
              alt="Pianist performing on grand piano"
              className="w-full object-cover max-h-[380px] object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-[#c9a84c] text-xs font-medium uppercase tracking-widest mb-1">Piano & Keys</p>
              <p className="text-white text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>From first chord to concert stage</p>
              <p className="text-white/40 text-sm mt-1">Classical · Contemporary · All levels</p>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            <div className="col-span-2 row-span-2 relative overflow-hidden group aspect-square" style={{ borderRadius: '4px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/studio/studio-setup-3.jpg" alt="Music studio" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="relative overflow-hidden group aspect-square" style={{ borderRadius: '4px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/billy/billy-closeup-smile.jpg" alt="Billy the puppet" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="relative overflow-hidden group aspect-square" style={{ borderRadius: '4px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/billy/billy-solo-scarf.jpg" alt="Billy with scarf" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="col-span-2 relative overflow-hidden group aspect-square" style={{ borderRadius: '4px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/basma/basma-with-billy.jpg" alt="Basma with Billy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute bottom-3 left-3 glass rounded-lg px-3 py-1.5 text-xs font-medium text-white/70">Basma & Billy</div>
            </div>
            <div className="relative overflow-hidden group aspect-square" style={{ borderRadius: '4px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/studio/studio-whiteboard-notes.jpg" alt="Music notes" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="relative overflow-hidden group aspect-square" style={{ borderRadius: '4px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/studio/studio-setup-1.jpg" alt="Studio" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="col-span-2 relative overflow-hidden group aspect-square" style={{ borderRadius: '4px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/basma/basma-teaching-classroom.jpg" alt="Teaching classroom" className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute bottom-3 left-3 glass rounded-lg px-3 py-1.5 text-xs font-medium text-white/70">Teaching the next generation</div>
            </div>
          </div>
        </section>

        {/* ── Expandable Sections ─────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 pb-16 space-y-4">

          <ExpandableSection
            title="About Basma Awada"
            preview="Las Vegas singer, songwriter, and vocal coach. 300K+ TikTok followers. Founder of BasmaWorld."
            icon="✦"
            accentColor="#c9a84c"
            defaultOpen
          >
            <div className="space-y-4 text-white/40 text-sm leading-relaxed">
              <p>
                <strong className="text-white">Basma Awada</strong> is a Las Vegas-based singer, songwriter, and vocal coach with 8+ years of experience. With over <strong className="text-white">300,000 TikTok followers</strong>, she has built one of the most engaged music education communities online.
              </p>
              <p>
                As the founder of <strong className="text-white">Become A Singer Music Academy</strong>, Basma created a gamified learning ecosystem where students earn XP, unlock skills, and work toward real performances. Her upcoming album <strong className="text-[#c9a84c]">Masqued</strong> explores identity, performance, and the courage to be truly seen.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {[
                  { stat: '300K+', label: 'TikTok Followers' },
                  { stat: '8+', label: 'Years Teaching' },
                  { stat: '100+', label: 'Students' },
                  { stat: 'Las Vegas', label: 'Home Base' },
                ].map((item) => (
                  <div key={item.label} className="glass rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-[#c9a84c]">{item.stat}</p>
                    <p className="text-white/30 text-xs">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  { href: 'https://www.tiktok.com/@basma_singer', label: 'TikTok' },
                  { href: 'https://www.instagram.com/basma.tea', label: 'Instagram' },
                  { href: 'https://www.youtube.com/channel/UChszcJ6HQ4u1NoTs4-06H3w', label: 'YouTube' },
                  { href: 'https://open.spotify.com/artist/1PA6WUf27E53oaHmWPVNBt', label: 'Spotify' },
                  { href: 'https://itunes.apple.com/us/artist/1543777421', label: 'Apple Music' },
                  { href: 'https://discord.gg/4nzX2Wb5HW', label: 'Discord' },
                ].map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                    className="glass hover:bg-white/[0.06] px-3 py-1.5 rounded-full text-xs transition-all duration-300">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </ExpandableSection>

          <ExpandableSection
            title="How It Works — Gamified Learning"
            preview="Earn XP, unlock skills, level up your Skill Tree. Learning feels like a game."
            icon="✦"
            accentColor="#c9a84c"
          >
            <div className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { step: '1', title: 'Book a Trial', desc: '$29 · 30 min · Any instrument', color: '#c9a84c' },
                  { step: '2', title: 'Get Your Skill Tree', desc: 'Personalized path based on your level and goals', color: '#c9a84c' },
                  { step: '3', title: 'Earn XP & Level Up', desc: 'Complete quests, unlock nodes, perform at the Gateway Festival', color: '#c9a84c' },
                ].map((s) => (
                  <div key={s.step} className="card-premium rounded-xl p-5 text-center">
                    <span className="text-3xl font-bold" style={{ color: s.color }}>{s.step}</span>
                    <h4 className="text-sm font-semibold text-white mt-2">{s.title}</h4>
                    <p className="text-white/30 text-xs mt-1">{s.desc}</p>
                  </div>
                ))}
              </div>
              <div className="glass-gold rounded-xl p-5 font-mono text-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#c9a84c] pulse-subtle" />
                  <span className="text-[#c9a84c] font-sans font-medium text-xs uppercase tracking-widest">Billy AI Mentor</span>
                </div>
                <p className="text-white/50 mb-2">&quot;Hey! You just earned <span className="text-[#c9a84c] font-bold">+50 XP</span> for completing Lesson 3!&quot;</p>
                <p className="text-white/50 mb-2">&quot;Next quest: <span className="text-white/70">Chest Voice Resonance</span>. Ready?&quot;</p>
                <p className="text-white/30">&quot;You&apos;re 120 XP away from the <span className="text-[#c9a84c]">Performance Stage</span> node&quot;</p>
              </div>
            </div>
          </ExpandableSection>

          <ExpandableSection
            title="Pricing & Packages"
            preview="Trial lesson $29. Monthly packages for ongoing lessons."
            icon="✦"
            accentColor="#c9a84c"
          >
            <div className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="card-premium rounded-xl p-5 text-center">
                  <h4 className="text-sm font-semibold text-white">Trial Lesson</h4>
                  <p className="text-3xl font-bold text-[#c9a84c] mt-2">$29</p>
                  <p className="text-white/30 text-xs mt-1">One 30-min lesson · Any instrument</p>
                </div>
                <div className="glass-gold rounded-xl p-5 text-center">
                  <span className="inline-block bg-[#c9a84c] text-black text-xs font-bold px-2 py-0.5 rounded-full mb-2">Popular</span>
                  <h4 className="text-sm font-semibold text-white">Monthly (4 lessons)</h4>
                  <p className="text-3xl font-bold text-[#c9a84c] mt-2">$120</p>
                  <p className="text-white/30 text-xs mt-1">4 × 30-min lessons · $30/lesson</p>
                </div>
                <div className="card-premium rounded-xl p-5 text-center">
                  <h4 className="text-sm font-semibold text-white">Monthly (4 lessons)</h4>
                  <p className="text-3xl font-bold text-[#c9a84c] mt-2">$220</p>
                  <p className="text-white/30 text-xs mt-1">4 × 60-min lessons · $55/lesson</p>
                </div>
              </div>
              <p className="text-center text-white/25 text-xs">In-person (Las Vegas) or online · All ages · No experience needed</p>
              <div className="text-center pt-2">
                <StripeCheckoutButton />
              </div>
            </div>
          </ExpandableSection>

          <ExpandableSection
            title="Student Wins & Testimonials"
            preview="From first notes to full performances. Real results from real students."
            icon="✦"
            accentColor="#c9a84c"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { name: 'Maria L.', role: 'Las Vegas parent', quote: 'My daughter went from never singing to performing at her school recital in 3 months!', result: '3 months → Performance' },
                { name: 'James T.', role: 'Parent of 8-year-old', quote: 'The gamified lessons kept my son engaged. He actually ASKS to practice now!', result: 'Refuses practice → Daily practice' },
                { name: 'Sofia R.', role: 'Adult beginner, age 34', quote: 'I felt so welcome. No judgment, just pure encouragement and real results.', result: 'Started at 34 → Singing in 60 days' },
                { name: 'Marcus D.', role: 'Adult vocalist', quote: 'I had stage fright for years. After 12 weeks I performed at an open mic.', result: '12 weeks → Open mic performance' },
              ].map((w) => (
                <div key={w.name} className="card-premium rounded-xl p-5">
                  <p className="text-white/40 text-sm italic mb-3">&ldquo;{w.quote}&rdquo;</p>
                  <p className="text-white font-medium text-xs">{w.name}</p>
                  <p className="text-white/25 text-xs">{w.role}</p>
                  <span className="inline-block mt-3 glass rounded-full text-[#c9a84c] text-xs px-3 py-1">
                    {w.result}
                  </span>
                </div>
              ))}
            </div>
          </ExpandableSection>

          <ExpandableSection
            title="Masqued — Upcoming Album"
            preview="Basma's debut album. Theatrical jazz meets modern pop. Coming soon."
            icon="✦"
            accentColor="#c9a84c"
          >
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 glass-gold rounded-full text-[#c9a84c] text-xs font-medium px-4 py-1.5 uppercase tracking-widest">
                Coming Soon
              </div>
              <h3 className="text-2xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                <span className="gradient-gold">Masqued</span>
              </h3>
              <p className="text-white/35 text-sm max-w-lg mx-auto leading-relaxed">
                A cinematic album about identity, performance, and the courage to be truly seen. Theatrical jazz meets modern pop — a sonic unmasking.
              </p>
              <a href="https://www.tiktok.com/@basma_singer" target="_blank" rel="noopener noreferrer"
                className="btn-gold inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition">
                Follow for Updates →
              </a>
            </div>
          </ExpandableSection>

          <ExpandableSection
            title="Free Tips & Resources"
            preview="Vocal warmups, beginner guides, and tips for parents."
            icon="✦"
            accentColor="#c9a84c"
          >
            <div className="space-y-3">
              {[
                { title: '5 Things Every Beginner Singer Needs to Know', tips: ['Warm up every time', 'Breathe from your diaphragm', 'Record yourself', 'Don\'t push your voice', 'Be patient with yourself'] },
                { title: 'The 10-Minute Vocal Warmup', tips: ['2 min lip trills', '2 min humming scales', '2 min vowel slides', '2 min sirens (low to high)', '2 min gentle song phrases'] },
                { title: 'When Should Kids Start Music Lessons?', tips: ['Ages 5-6: Great for piano & singing', 'Ages 7-8: Guitar & violin', 'Any age: Rhythm & music appreciation', 'Key: Find a patient, fun teacher', 'Gamification keeps kids engaged'] },
              ].map((article) => (
                <div key={article.title} className="card-premium rounded-xl p-5">
                  <h4 className="text-sm font-semibold text-white mb-3">{article.title}</h4>
                  <ul className="space-y-1.5">
                    {article.tips.map((tip, i) => (
                      <li key={i} className="text-white/30 text-xs flex items-start gap-2">
                        <span className="text-[#c9a84c] shrink-0">—</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ExpandableSection>
        </section>

        {/* ── BASMA Bot Package ───────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <BotPackageCard
            botName="Become A Singer Bot"
            botEmoji="✦"
            description="Your AI music mentor. Practice guidance, lesson recommendations, and vocal coaching — available 24/7."
            accentColor="#c9a84c"
            tiers={[
              {
                name: 'Student',
                price: '$19',
                period: '/mo',
                features: [
                  'AI vocal coaching tips',
                  'XP tracking & skill tree',
                  'Practice reminders',
                  'Song suggestions by level',
                  'Basic progress reports',
                ],
              },
              {
                name: 'Performer',
                price: '$49',
                period: '/mo',
                highlight: true,
                badge: 'Most Popular',
                features: [
                  'Everything in Student',
                  'AI warmup routines',
                  'Performance prep coaching',
                  'Video lesson library access',
                  'Weekly AI progress analysis',
                  'Community challenges',
                ],
              },
              {
                name: 'Academy Pro',
                price: '$99',
                period: '/mo',
                features: [
                  'Everything in Performer',
                  'Live lesson scheduling AI',
                  'Custom curriculum generator',
                  'Parent dashboard (for kids)',
                  'Priority booking',
                  'Gateway Festival prep track',
                ],
              },
            ]}
          />
        </section>

        {/* ── Location + CTA ──────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
          <p className="text-white/25 text-sm mb-2">9205 W Russell Rd Bldg 3, Las Vegas NV 89148</p>
          <p className="text-white/25 text-sm mb-8">(702) 788-7369 · In-person &amp; online</p>
          <h2 className="text-2xl font-semibold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Your music journey starts <span className="gradient-gold">here</span>
          </h2>
          <p className="text-white/30 mb-8 text-sm">$29 trial · No experience needed · All ages welcome</p>
          <StripeCheckoutButton />
        </section>

      </main>
    </>
  )
}
