'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const SCHOLARSHIP_LINK = 'https://buy.stripe.com/bJe9AScy1c4De809EreEo0A'

const CLASSES = [
  { emoji: '👶', name: 'Tiny Tots', age: '5 & Under', time: '9:00 – 9:45 AM' },
  { emoji: '🎵', name: 'Kids Music', age: '5–10', time: '10:00 – 11:30 AM' },
  { emoji: '🎤', name: 'Kids Music', age: '10–17', time: '10:00 – 11:30 AM' },
  { emoji: '🎹', name: 'Piano', age: 'All Ages', time: '12:00 – 1:30 PM' },
  { emoji: '🎙️', name: 'Recording', age: 'All Ages', time: '12:00 – 1:30 PM' },
]

export default function ScholarshipContent() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen text-white pt-16" style={{ background: '#0D0118' }}>

        {/* ── Hero ── */}
        <section className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
          <div className="text-5xl mb-4">🎓</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            BASMA World{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
              Scholarship
            </span>
          </h1>
          <p className="text-white/50 text-lg mb-2">
            Affordable music education for the whole family
          </p>
          <div className="inline-block px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-bold mt-2 mb-1"
            style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}>
            Summer 2026 · July &amp; August Only
          </div>
          <p className="text-white/30 text-sm">
            📍 Synergy Dance · 9512 W Flamingo Rd STE 100, Las Vegas, NV 89147
          </p>
        </section>

        {/* ── Pricing Cards ── */}
        <section className="max-w-3xl mx-auto px-6 pb-12">
          <div className="grid md:grid-cols-2 gap-6">
            {/* 1-Hour Plan */}
            <div
              className="rounded-2xl p-8 text-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(236,72,153,0.05))',
                border: '2px solid rgba(168,85,247,0.3)',
              }}
            >
              <span className="absolute -top-3 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">
                Most Popular
              </span>
              <p className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-4">1-Hour Family Plan</p>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-5xl font-bold text-white">$250</span>
                <span className="text-white/30 text-sm">/month</span>
              </div>
              <p className="text-white/40 text-sm mb-6">1 hour of classes per day · Entire family · July &amp; August</p>
              <a
                href={SCHOLARSHIP_LINK}
                className="inline-block w-full py-4 rounded-full font-bold text-base transition hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: '#fff' }}
              >
                Enroll Now — $250/mo →
              </a>
              <p className="text-white/20 text-xs mt-3">Secure payment via Stripe · Cancel anytime</p>
            </div>

            {/* 2-Hour Plan */}
            <div
              className="rounded-2xl p-8 text-center"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <p className="text-yellow-400 text-xs uppercase tracking-widest font-bold mb-4">2-Hour Family Plan</p>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-5xl font-bold text-white">$500</span>
                <span className="text-white/30 text-sm">/month</span>
              </div>
              <p className="text-white/40 text-sm mb-6">2 hours of classes per day · Entire family · July &amp; August</p>
              <a
                href={SCHOLARSHIP_LINK}
                className="inline-block w-full py-4 rounded-full font-bold text-base transition hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #c9a84c, #FFE07A)', color: '#0D0118' }}
              >
                Enroll Now — $500/mo →
              </a>
              <p className="text-white/20 text-xs mt-3">Buy 2 scholarship plans · Double the class time</p>
            </div>
          </div>
        </section>

        {/* ── What's Included ── */}
        <section className="max-w-3xl mx-auto px-6 pb-12">
          <h2 className="text-lg font-bold text-white mb-6 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            What&apos;s Included
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { emoji: '👨‍👩‍👧‍👦', title: 'Whole Family', desc: 'One flat rate covers every child in your family — no per-student fees.' },
              { emoji: '🎵', title: 'Any Class', desc: 'Choose from Tiny Tots, Kids Music, Piano, Recording, and more.' },
              { emoji: '📅', title: 'July & August', desc: 'Attend classes Monday through Thursday, every week through August. Camps end when school starts.' },
              { emoji: '💰', title: 'Massive Savings', desc: 'Save 50%+ compared to per-day pricing. The more you come, the more you save.' },
            ].map(item => (
              <div key={item.title} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-2xl mb-2">{item.emoji}</div>
                <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-white/30 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Available Classes ── */}
        <section className="max-w-3xl mx-auto px-6 pb-12">
          <h2 className="text-lg font-bold text-white mb-6 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            Available Classes
          </h2>
          <div className="space-y-3">
            {CLASSES.map(cls => (
              <div key={`${cls.name}-${cls.age}`} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-2xl">{cls.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white text-sm">{cls.name} <span className="text-white/30 text-xs font-normal">({cls.age})</span></div>
                  <div className="text-white/30 text-xs">{cls.time}</div>
                </div>
                <span className="text-purple-300 text-xs font-semibold">Included ✓</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Priority Notice ── */}
        <section className="max-w-3xl mx-auto px-6 pb-12">
          <div className="rounded-2xl p-6 text-center" style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.15)' }}>
            <h3 className="text-purple-300 font-bold text-base mb-2">⭐ Priority for June Families</h3>
            <p className="text-white/40 text-sm leading-relaxed max-w-lg mx-auto">
              Families who registered and attended our June Discovery Camp get first priority for the scholarship.
              Other families are welcome to apply — spots are limited and offered on a first-come, first-served basis.
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-3xl mx-auto px-6 pb-12">
          <h2 className="text-lg font-bold text-white mb-6 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            Questions?
          </h2>
          <div className="space-y-4">
            {[
              { q: 'How many kids can I enroll?', a: 'As many as you like! The scholarship covers your entire family — all children attend under one flat rate.' },
              { q: 'What does "1 hour" mean?', a: 'Each $250 plan gives your family access to 1 class session per day (classes range from 45 min to 1.5 hours). Want more class time? Buy the 2-hour plan for $500/mo.' },
              { q: 'When are classes?', a: 'Monday through Thursday, 9 AM to 1:30 PM. The scholarship runs through July and August — camps end when school starts.' },
              { q: 'Can I cancel?', a: 'Yes — you can cancel your subscription anytime. The program runs through summer (July–August).' },
              { q: 'Do I need to have attended the June camp?', a: 'June families get priority, but anyone can apply. Spots are limited and offered first-come, first-served.' },
            ].map(item => (
              <div key={item.q} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h4 className="text-white font-semibold text-sm mb-2">{item.q}</h4>
                <p className="text-white/40 text-xs leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
          <a
            href={SCHOLARSHIP_LINK}
            className="inline-block px-12 py-5 rounded-full font-bold text-lg transition hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: '#fff', boxShadow: '0 0 30px rgba(168,85,247,0.3)' }}
          >
            Enroll in Scholarship — $250/mo →
          </a>
          <p className="text-white/25 text-sm mt-4">
            📞 Questions? Call <a href="tel:+17027887369" className="text-purple-300 hover:text-white transition">(702) 788-7369</a>
          </p>
        </section>

      </main>
      <Footer />
    </>
  )
}
