import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Artist Services — Live Singers & Hosts for Events | BASMA Las Vegas',
  description:
    'BASMA Artist Services: professional singers and hosts for corporate events, trade-show booths and private parties in Las Vegas — matched, prepped and run on site by BASMA. Plus artist coaching and performance prep.',
  keywords: ['event singers las vegas', 'event host las vegas', 'live entertainment trade show booth', 'CES entertainment', 'artist development', 'performance coaching', 'basma'],
  openGraph: {
    title: 'Artist Services — BASMA',
    description: 'Live singers and hosts for your event, run on site by BASMA. Plus artist coaching and performance prep.',
    url: 'https://basmaworld.com/artist-services',
    siteName: 'BasmaWorld',
    type: 'website',
    locale: 'en_US',
  },
  alternates: { canonical: 'https://basmaworld.com/artist-services' },
}

const gold = '#c9a84c'

const EVENT_STEPS = [
  { n: '1', title: 'Tell us about your event', desc: 'Send the date, venue and the style you want — upbeat booth energy, an elegant evening, a party crowd.' },
  { n: '2', title: 'We match the talent', desc: 'We pick singers and hosts who fit your event. You review and approve the lineup.' },
  { n: '3', title: 'One agreement, one payment', desc: 'You sign one services agreement with BASMA and pay once. We take care of the performers.' },
  { n: '4', title: 'We run the day', desc: 'We prep the team beforehand and run the event on site as lead host and coordinator.' },
]

const OFFERS = [
  { icon: '🎤', title: 'Live singers', desc: 'Professional vocalists for booths, launches, receptions and private events.' },
  { icon: '🎙️', title: 'Hosts & emcees', desc: 'Energetic hosts who work a crowd, run games and keep your audience engaged.' },
  { icon: '🧭', title: 'On-site coordination', desc: 'BASMA leads the team on the day, so you deal with one point of contact.' },
  { icon: '🌟', title: 'Artist coaching', desc: 'Vocal technique, stage presence, performance prep, portfolio and resume building.' },
]

export default function ArtistServicesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen text-white" style={{ paddingTop: 'calc(var(--ann-bar-height, 0px) + 64px)' }}>
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'rgba(201,168,76,0.6)' }}>Become A Singer · Artist Services</p>
          <h1 className="text-4xl md:text-5xl font-semibold mb-5 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Live Talent for Your <span className="gradient-gold">Event</span>
          </h1>
          <p className="text-white/50 max-w-2xl mx-auto text-base leading-relaxed">
            Professional singers and hosts for corporate events, trade-show booths and private parties —
            matched to your event, prepped by BASMA, and run on site by our team.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <a
              href="mailto:becomeasingermusicacademy@gmail.com?subject=Event%20talent%20request"
              className="px-7 py-3 rounded-full text-sm font-bold transition hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #c9a84c, #FFE07A)', color: '#0D0118' }}
            >
              Request Event Talent →
            </a>
            <a href="tel:+17027887369" className="px-7 py-3 rounded-full text-sm font-semibold" style={{ border: `1px solid ${gold}66`, color: gold }}>
              📞 (702) 788-7369
            </a>
          </div>
        </section>

        {/* Highlight */}
        <section className="max-w-3xl mx-auto px-6 pb-12">
          <div className="rounded-2xl p-6 text-center" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.10), rgba(201,168,76,0.02))', border: '1px solid rgba(201,168,76,0.2)' }}>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: gold }}>Coming up</p>
            <p className="text-white text-lg font-semibold">We&apos;ll be performing at the Ikarao booth at CES 2027</p>
            <p className="text-white/40 text-sm mt-1">Photos and videos coming soon!</p>
          </div>
        </section>

        {/* What we offer */}
        <section className="max-w-5xl mx-auto px-6 pb-14">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {OFFERS.map(o => (
              <div key={o.title} className="card-minimal rounded-xl p-5 border border-white/[0.06]">
                <div className="text-3xl mb-3">{o.icon}</div>
                <p className="font-semibold text-white mb-1">{o.title}</p>
                <p className="text-white/40 text-sm leading-relaxed">{o.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-4xl mx-auto px-6 pb-14">
          <h2 className="text-2xl font-semibold text-center mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>How booking works</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {EVENT_STEPS.map(s => (
              <div key={s.n} className="card-minimal rounded-xl p-5 border border-white/[0.06] flex gap-4">
                <div className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-bold" style={{ background: 'rgba(201,168,76,0.15)', color: gold }}>{s.n}</div>
                <div>
                  <p className="font-semibold text-white mb-1">{s.title}</p>
                  <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Artist development */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <div className="card-minimal rounded-2xl p-8 border border-white/[0.06] text-center">
            <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Artist development</h2>
            <p className="text-white/45 max-w-2xl mx-auto text-sm leading-relaxed mb-6">
              Getting ready to perform? Basma works one-on-one with singers on technique, stage presence and
              performance prep, and helps build a portfolio and resume — through private lessons at our studio
              inside Synergy Dance.
            </p>
            <Link href="/private-lessons" className="inline-block px-6 py-2.5 rounded-full text-sm font-semibold" style={{ border: `1px solid ${gold}66`, color: gold }}>
              See private lessons & free trial →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
