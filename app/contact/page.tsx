export const dynamic = 'force-static'
export const revalidate = 86400

import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MWLContactForm from '@/components/MWLContactForm'
import Link from 'next/link'

// Keep these short. Add CES photos/videos and new social links when ready.
const HIGHLIGHTS = [
  { icon: '🎤', title: 'CES 2027', desc: 'We’ll be performing at the Ikarao booth at CES 2027. Photos and videos coming soon!' },
  { icon: '🎮', title: 'EVO Convention', desc: 'We got free EVO Convention tickets for all of our students.' },
  { icon: '🩰', title: 'Synergy Dance', desc: 'We work with Synergy Dance — our studio home in Las Vegas.' },
  { icon: '🎶', title: 'Community classes', desc: 'We hosted free music classes for local families.' },
  { icon: '🎓', title: 'Recitals', desc: 'Our students perform at recitals alongside Synergy’s dance shows.' },
  { icon: '📱', title: 'Social media', desc: 'We share music and motivation with 260K+ followers. Follow along below!' },
]

export const metadata: Metadata = {
  title: 'Contact BASMA | Music Lessons & Artist Services | Las Vegas',
  description: 'Contact BASMA (Become A Singer Music Academy). Book private music lessons or a free trial, or request live singers and hosts for your event. Las Vegas, NV.',
  keywords: ['contact basma', 'book music lessons las vegas', 'event singers las vegas', 'event host las vegas', 'basma awada contact'],
  openGraph: {
    title: 'Contact BASMA | Las Vegas',
    description: 'Book lessons, request event talent, or just say hi.',
    url: 'https://basmaworld.com/contact',
    siteName: 'BasmaWorld',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/basma-about.jpg', width: 1200, height: 630, alt: 'Contact BasmaWorld' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@basma_singer',
    creator: '@basma_singer',
    title: 'Contact BASMA',
    description: 'Book lessons or request event talent. Las Vegas.',
    images: ['/images/basma-about.jpg'],
  },
  alternates: { canonical: 'https://basmaworld.com/contact' },
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ paddingTop: 'calc(var(--ann-bar-height, 0px) + 64px)' }}>
        <section className="max-w-5xl mx-auto px-6 pt-16 pb-20">

          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-xs text-[#c9a84c]/50 tracking-[0.3em] uppercase mb-4">Get In Touch</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-5 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Contact <span className="gradient-gold">BasmaWorld</span>
            </h1>
            <p className="text-white/30 max-w-md mx-auto text-sm">
              Music lessons, event talent, partnerships — we&apos;d love to hear from you.
            </p>
          </div>

          {/* What we've done */}
          <div className="mb-16">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-5 text-center">What we&apos;ve done</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {HIGHLIGHTS.map(h => (
                <div key={h.title} className="card-minimal border border-white/[0.06] rounded-xl p-5">
                  <div className="text-2xl mb-2">{h.icon}</div>
                  <p className="font-medium text-white text-sm">{h.title}</p>
                  <p className="text-white/35 text-xs mt-1 leading-relaxed">{h.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-white/30 text-sm mt-6 italic">
              Our mission: help people believe they can achieve anything they set their minds to. 💜
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">

            {/* Left — quick options */}
            <div className="space-y-3">
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-5">How Can We Help</h2>

              {/* Private lessons */}
              <Link
                href="/private-lessons"
                className="flex items-center gap-4 card-minimal border border-[#c9a84c]/20 hover:border-[#c9a84c]/40 rounded-xl p-5 transition-all duration-200 group"
              >
                <div className="flex-1">
                  <p className="font-medium text-white text-sm group-hover:text-[#c9a84c] transition-colors">Private Lessons & Free Trial</p>
                  <p className="text-white/25 text-xs mt-0.5">8 instruments · All ages · Free 15-minute trial lesson</p>
                </div>
                <span className="text-white/15 group-hover:text-white/40 transition-colors text-sm">→</span>
              </Link>

              {/* Artist Services */}
              <Link
                href="/artist-services"
                className="flex items-center gap-4 card-minimal border border-white/[0.06] hover:border-white/15 rounded-xl p-5 transition-all duration-200 group"
              >
                <div className="flex-1">
                  <p className="font-medium text-white text-sm group-hover:text-[#c9a84c] transition-colors">Artist Services & Event Talent</p>
                  <p className="text-white/25 text-xs mt-0.5">Live singers and hosts for your event · Artist coaching</p>
                </div>
                <span className="text-white/15 group-hover:text-white/40 transition-colors text-sm">→</span>
              </Link>

              {/* Youth Resources — Coming Soon */}
              <div className="card-minimal border border-white/[0.06] rounded-xl p-5 opacity-60">
                <p className="font-medium text-white text-sm">Youth Resources</p>
                <p className="text-white/25 text-xs mt-0.5">🚧 Coming Soon</p>
              </div>

              {/* Direct contact */}
              <div className="card-minimal rounded-xl p-5 mt-4">
                <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Direct Contact</p>
                <div className="space-y-2 text-sm text-white/35">
                  <p><a href="mailto:becomeasingermusicacademy@gmail.com" className="text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors">becomeasingermusicacademy@gmail.com</a></p>
                  <p>(702) 788-7369</p>
                  <p>9512 W Flamingo Rd, Ste 100, Las Vegas, NV 89147</p>
                  <div className="flex flex-wrap gap-2 pt-3">
                    {[
                      { href: 'https://www.tiktok.com/@basma_singer', label: 'TikTok' },
                      { href: 'https://www.instagram.com/basma.tea', label: 'Instagram' },
                      { href: 'https://www.youtube.com/channel/UChszcJ6HQ4u1NoTs4-06H3w', label: 'YouTube' },
                      { href: 'https://discord.gg/4nzX2Wb5HW', label: 'Discord' },
                      { href: 'https://linktr.ee/BASMATea', label: 'All Links' },
                    ].map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] px-3 py-1.5 rounded-full text-xs transition-all duration-200"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right — contact form */}
            <div>
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-5">Send a Message</h2>
              <MWLContactForm />
            </div>

          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
