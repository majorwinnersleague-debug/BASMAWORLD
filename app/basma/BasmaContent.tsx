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
        <section className="max-w-4xl mx-auto px-4 pt-12 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 uppercase tracking-widest">
            🎵 Singing · Piano · Guitar · Vocal Coaching · All Ages
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            BASMA{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Music Academy
            </span>
          </h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto leading-relaxed mb-4">
            Professional music lessons in Las Vegas. Singing, piano, guitar &amp; more. Gamified learning with XP. <strong className="text-purple-300">$29 trial lesson.</strong>
          </p>
          <p className="text-white/55 text-sm mb-10">
            Founded by Basma Awada · 300K+ TikTok · 100+ students taught · In-person &amp; online
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <StripeCheckoutButton />
            <a href="https://www.tiktok.com/@basma_singer" target="_blank" rel="noopener noreferrer"
              className="border border-white/20 hover:border-purple-400/50 text-white/60 hover:text-white px-6 py-3 rounded-xl font-semibold transition">
              🎵 Watch on TikTok
            </a>
          </div>
        </section>

        {/* ── What We Offer ───────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 pb-8">
          <div className="bg-purple-500/5 border border-purple-500/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-3 text-center">What Do We Teach?</h2>
            <p className="text-white/50 max-w-2xl mx-auto leading-relaxed text-center mb-6">
              From 5-year-olds picking up their first instrument to adults who always believed it was &quot;too late&quot; to sing — we meet you where you are and take you further than you thought possible.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: '🎤', title: 'Singing & Vocals', desc: 'Technique, breath control, performance — beginner to advanced.' },
                { icon: '🎹', title: 'Piano & Keys', desc: 'Classical to contemporary. Read music, play songs, compose.' },
                { icon: '🎸', title: 'Guitar', desc: 'Acoustic & electric. Chords, fingerpicking, your favorite songs.' },
                { icon: '🎻', title: 'Violin & Viola', desc: 'String technique for beginners and intermediate players.' },
                { icon: '🥁', title: 'Drums & Rhythm', desc: 'Rock, pop, jazz. Beat keeping, fills, full kit coordination.' },
                { icon: '🤖', title: 'AI Mentor (Billy)', desc: 'Practice guidance, XP tracking, and personalized recommendations.' },
              ].map((p) => (
                <div key={p.title} className="bg-white/[0.03] border border-purple-500/10 rounded-xl p-4 hover:border-purple-400/30 transition">
                  <span className="text-2xl">{p.icon}</span>
                  <h3 className="text-sm font-bold text-white mt-2">{p.title}</h3>
                  <p className="text-white/65 text-xs mt-1 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Real Photo Galleries ──────────────────────────── */}

        {/* Performance Gallery */}
        <section className="max-w-5xl mx-auto px-4 pb-8">
          <h2 className="text-2xl font-black text-white text-center mb-2">
            Basma Live 🎤
          </h2>
          <p className="text-white/55 text-center text-sm mb-6">From intimate clubs to full orchestras</p>

          {/* Featured student moment */}
          <div className="relative rounded-3xl overflow-hidden mb-4 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/basma/basma-broadway-kids-academy.jpg"
              alt="Basma with student outside Broadway Kids Academy"
              className="w-full object-cover max-h-[420px] object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-1">🌟 Real Students. Real Results.</p>
              <p className="text-white text-xl font-black">Broadway Kids Academy — Annie cast night 🎭</p>
              <p className="text-white/65 text-sm mt-1">Musical Theater · Singing · Dance · Las Vegas</p>
            </div>
          </div>

          {/* Recital performance — full width */}
          <div className="relative rounded-3xl overflow-hidden mb-4 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/basma/students-recital-performance.jpg"
              alt="Students performing on stage at recital — Basma's students"
              className="w-full object-cover max-h-[400px] object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-1">🎤 Student Recital</p>
              <p className="text-white text-xl font-black">From the classroom to the stage</p>
              <p className="text-white/65 text-sm mt-1">Every student deserves a moment to shine ✨</p>
            </div>
          </div>

          {/* 2-photo classroom row */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="relative rounded-2xl overflow-hidden group aspect-video">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/basma/basma-teaching-classroom.jpg" alt="Basma teaching music with virtual piano on screen" className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs font-bold text-white">🎹 Virtual Piano Lessons</div>
            </div>
            <div className="relative rounded-2xl overflow-hidden group aspect-video">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/basma/basma-teaching-classroom-2.jpg" alt="Students engaged in music class, hand raised" className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs font-bold text-white">🙋 Students love it</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { src: '/images/basma/basma-live-music-stage.jpg', alt: 'Basma singing live with Live Music neon sign' },
              { src: '/images/basma/basma-orchestra.jpg', alt: 'Basma performing with full orchestra' },
              { src: '/images/basma/basma-performing-stage-3.jpg', alt: 'Basma on stage with wide audience' },
              { src: '/images/basma/basma-performing-stage-4.jpg', alt: 'Basma singing, speakers backdrop' },
            ].map((img) => (
              <div key={img.src} className="relative aspect-square rounded-2xl overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            ))}
          </div>
        </section>

        {/* Studio + Billy Gallery */}
        <section className="max-w-5xl mx-auto px-4 pb-8">
          <h2 className="text-2xl font-black text-white text-center mb-2">
            Inside the Studio 🎸
          </h2>
          <p className="text-white/55 text-center text-sm mb-6">Where the magic happens — and Billy hangs out</p>

          {/* Featured pianist hero */}
          <div className="relative rounded-3xl overflow-hidden mb-4 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/studio/pianist-spotlight.jpg"
              alt="Pianist performing on grand piano under stage spotlight"
              className="w-full object-cover max-h-[380px] object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-1">🎹 Piano & Keys</p>
              <p className="text-white text-xl font-black">From first chord to concert stage</p>
              <p className="text-white/60 text-sm mt-1">Classical · Contemporary · All levels</p>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {/* Studio wide shots */}
            <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/studio/studio-setup-3.jpg"
                alt="Music studio with guitars, keyboards and instruments"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {/* Billy photos */}
            <div className="relative rounded-2xl overflow-hidden group aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/billy/billy-closeup-smile.jpg" alt="Billy the puppet smiling" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="relative rounded-2xl overflow-hidden group aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/billy/billy-solo-scarf.jpg" alt="Billy puppet with scarf" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="col-span-2 relative rounded-2xl overflow-hidden group aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/basma/basma-with-billy.jpg" alt="Basma with Billy the puppet" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs font-bold text-white">Basma & Billy 🧡</div>
            </div>
            {/* More studio */}
            <div className="relative rounded-2xl overflow-hidden group aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/studio/studio-whiteboard-notes.jpg" alt="Music notes on whiteboard" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="relative rounded-2xl overflow-hidden group aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/studio/studio-setup-1.jpg" alt="Studio setup with orange chairs" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="col-span-2 relative rounded-2xl overflow-hidden group aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/basma/basma-teaching-classroom.jpg" alt="Basma teaching music in modern classroom with virtual piano" className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs font-bold text-white">Teaching the next generation 🎹</div>
            </div>
          </div>
        </section>

        {/* ── Expandable Sections ─────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 pb-16 space-y-4">

          <ExpandableSection
            title="About Basma Awada"
            preview="Las Vegas singer, songwriter, and vocal coach. 300K+ TikTok followers. Founder of BasmaWorld."
            icon="✦"
            accentColor="#EC4899"
            defaultOpen
          >
            <div className="space-y-4 text-white/60 text-sm leading-relaxed">
              <p>
                <strong className="text-white">Basma Awada</strong> is a Las Vegas-based singer, songwriter, and vocal coach with 8+ years of experience. With over <strong className="text-white">300,000 TikTok followers</strong>, she has built one of the most engaged music education communities online.
              </p>
              <p>
                As the founder of <strong className="text-white">Become A Singer Music Academy</strong>, Basma created a gamified learning ecosystem where students earn XP, unlock skills, and work toward real performances. Her upcoming album <strong className="text-pink-400">Masqued</strong> explores identity, performance, and the courage to be truly seen.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {[
                  { stat: '300K+', label: 'TikTok Followers' },
                  { stat: '8+', label: 'Years Teaching' },
                  { stat: '100+', label: 'Students' },
                  { stat: 'Las Vegas', label: 'Home Base' },
                ].map((item) => (
                  <div key={item.label} className="bg-white/[0.05] rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-purple-400">{item.stat}</p>
                    <p className="text-white/55 text-xs">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  { href: 'https://www.tiktok.com/@basma_singer', label: '🎵 TikTok' },
                  { href: 'https://www.instagram.com/basma.tea', label: '📸 Instagram' },
                  { href: 'https://www.youtube.com/channel/UChszcJ6HQ4u1NoTs4-06H3w', label: '📺 YouTube' },
                  { href: 'https://open.spotify.com/artist/1PA6WUf27E53oaHmWPVNBt', label: '🎧 Spotify' },
                  { href: 'https://itunes.apple.com/us/artist/1543777421', label: '🍎 Apple Music' },
                  { href: 'https://discord.gg/4nzX2Wb5HW', label: '💬 Discord' },
                ].map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-full text-xs transition">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </ExpandableSection>

          <ExpandableSection
            title="How It Works — Gamified Learning"
            preview="Earn XP, unlock skills, level up your Skill Tree. Learning feels like a game."
            icon="🎮"
            accentColor="#8B5CF6"
          >
            <div className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { step: '1', title: 'Book a Trial', desc: '$29 · 30 min · Any instrument', color: '#8B5CF6' },
                  { step: '2', title: 'Get Your Skill Tree', desc: 'Personalized path based on your level and goals', color: '#EC4899' },
                  { step: '3', title: 'Earn XP & Level Up', desc: 'Complete quests, unlock nodes, perform at the Gateway Festival', color: '#F59E0B' },
                ].map((s) => (
                  <div key={s.step} className="bg-white/[0.03] border border-white/10 rounded-xl p-5 text-center">
                    <span className="text-3xl font-bold" style={{ color: s.color }}>{s.step}</span>
                    <h4 className="text-sm font-bold text-white mt-2">{s.title}</h4>
                    <p className="text-white/65 text-xs mt-1">{s.desc}</p>
                  </div>
                ))}
              </div>
              <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-5 font-mono text-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-purple-400 font-sans font-semibold">Billy AI Mentor</span>
                </div>
                <p className="text-white/70 mb-2">&quot;Hey! You just earned <span className="text-yellow-400 font-bold">+50 XP</span> for completing Lesson 3! 🎉&quot;</p>
                <p className="text-white/70 mb-2">&quot;Next quest: <span className="text-purple-400">Chest Voice Resonance</span>. Ready?&quot;</p>
                <p className="text-white/50">&quot;You&apos;re 120 XP away from the <span className="text-yellow-400">Performance Stage</span> node 🌟&quot;</p>
              </div>
            </div>
          </ExpandableSection>

          <ExpandableSection
            title="Pricing & Packages"
            preview="Trial lesson $29. Monthly packages for ongoing lessons."
            icon="💰"
            accentColor="#22C55E"
          >
            <div className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-white/[0.03] border border-green-500/20 rounded-xl p-5 text-center">
                  <h4 className="text-sm font-bold text-white">Trial Lesson</h4>
                  <p className="text-3xl font-bold text-green-400 mt-2">$29</p>
                  <p className="text-white/55 text-xs mt-1">One 30-min lesson · Any instrument</p>
                </div>
                <div className="bg-green-500/5 border-2 border-green-500/30 rounded-xl p-5 text-center">
                  <span className="inline-block bg-green-500 text-black text-xs font-bold px-2 py-0.5 rounded-full mb-2">Popular</span>
                  <h4 className="text-sm font-bold text-white">Monthly (4 lessons)</h4>
                  <p className="text-3xl font-bold text-green-400 mt-2">$120</p>
                  <p className="text-white/55 text-xs mt-1">4 × 30-min lessons · $30/lesson</p>
                </div>
                <div className="bg-white/[0.03] border border-green-500/20 rounded-xl p-5 text-center">
                  <h4 className="text-sm font-bold text-white">Monthly (4 lessons)</h4>
                  <p className="text-3xl font-bold text-green-400 mt-2">$220</p>
                  <p className="text-white/55 text-xs mt-1">4 × 60-min lessons · $55/lesson</p>
                </div>
              </div>
              <p className="text-center text-white/55 text-xs">✓ In-person (Las Vegas) or online · ✓ All ages · ✓ No experience needed</p>
              <div className="text-center pt-2">
                <StripeCheckoutButton />
              </div>
            </div>
          </ExpandableSection>

          <ExpandableSection
            title="Student Wins & Testimonials"
            preview="From first notes to full performances. Real results from real students."
            icon="⭐"
            accentColor="#F59E0B"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { name: 'Maria L.', role: 'Las Vegas parent', quote: 'My daughter went from never singing to performing at her school recital in 3 months!', result: '3 months → Performance' },
                { name: 'James T.', role: 'Parent of 8-year-old', quote: 'The gamified lessons kept my son engaged. He actually ASKS to practice now!', result: 'Refuses practice → Daily practice' },
                { name: 'Sofia R.', role: 'Adult beginner, age 34', quote: 'I felt so welcome. No judgment, just pure encouragement and real results.', result: 'Started at 34 → Singing in 60 days' },
                { name: 'Marcus D.', role: 'Adult vocalist', quote: 'I had stage fright for years. After 12 weeks I performed at an open mic.', result: '12 weeks → Open mic performance' },
              ].map((w) => (
                <div key={w.name} className="bg-white/[0.03] border border-yellow-500/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm italic mb-3">&ldquo;{w.quote}&rdquo;</p>
                  <p className="text-white font-semibold text-xs">{w.name}</p>
                  <p className="text-white/55 text-xs">{w.role}</p>
                  <span className="inline-block mt-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                    ✓ {w.result}
                  </span>
                </div>
              ))}
            </div>
          </ExpandableSection>

          <ExpandableSection
            title="Masqued — Upcoming Album"
            preview="Basma's debut album. Theatrical jazz meets modern pop. Coming soon."
            icon="🎭"
            accentColor="#EC4899"
          >
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
                Coming Soon
              </div>
              <h3 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Masqued</span>
              </h3>
              <p className="text-white/50 text-sm max-w-lg mx-auto leading-relaxed">
                A cinematic album about identity, performance, and the courage to be truly seen. Theatrical jazz meets modern pop — a sonic unmasking.
              </p>
              <a href="https://www.tiktok.com/@basma_singer" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition hover:opacity-90">
                Follow for Updates →
              </a>
            </div>
          </ExpandableSection>

          <ExpandableSection
            title="Free Tips & Resources"
            preview="Vocal warmups, beginner guides, and tips for parents."
            icon="📖"
            accentColor="#8B5CF6"
          >
            <div className="space-y-3">
              {[
                { title: '5 Things Every Beginner Singer Needs to Know', tips: ['Warm up every time', 'Breathe from your diaphragm', 'Record yourself', 'Don\'t push your voice', 'Be patient with yourself'] },
                { title: 'The 10-Minute Vocal Warmup', tips: ['2 min lip trills', '2 min humming scales', '2 min vowel slides', '2 min sirens (low to high)', '2 min gentle song phrases'] },
                { title: 'When Should Kids Start Music Lessons?', tips: ['Ages 5-6: Great for piano & singing', 'Ages 7-8: Guitar & violin', 'Any age: Rhythm & music appreciation', 'Key: Find a patient, fun teacher', 'Gamification keeps kids engaged'] },
              ].map((article) => (
                <div key={article.title} className="bg-white/[0.03] border border-purple-500/10 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-white mb-2">{article.title}</h4>
                  <ul className="space-y-1">
                    {article.tips.map((tip, i) => (
                      <li key={i} className="text-white/65 text-xs flex items-start gap-2">
                        <span className="text-purple-400 shrink-0">✓</span>
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
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <BotPackageCard
            botName="Become A Singer Bot"
            botEmoji="🎵"
            description="Your AI music mentor. Practice guidance, lesson recommendations, and vocal coaching — available 24/7."
            accentColor="#8B5CF6"
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
        <section className="max-w-3xl mx-auto px-4 pb-20 text-center">
          <p className="text-white/55 text-sm mb-2">📍 9205 W Russell Rd Bldg 3, Las Vegas NV 89148</p>
          <p className="text-white/55 text-sm mb-6">📞 (702) 788-7369 · In-person &amp; online</p>
          <h2 className="text-2xl font-bold text-white mb-3">Your music journey starts here</h2>
          <p className="text-white/65 mb-6">$29 trial · No experience needed · All ages welcome</p>
          <StripeCheckoutButton />
        </section>

      </main>
      
    </>
  )
}
