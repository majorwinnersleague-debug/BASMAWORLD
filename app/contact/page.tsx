export const dynamic = 'force-static'
export const revalidate = 86400

import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MWLContactForm from '@/components/MWLContactForm'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact BasmaWorld | Marketing, Music & Community | Las Vegas',
  description: 'Contact BasmaWorld. Book music lessons, get a marketing consultation, or connect with Major Winners League. Las Vegas, NV.',
  keywords: ['contact basmaworld', 'book music lessons las vegas', 'social media marketing contact', 'basma awada contact'],
  openGraph: {
    title: 'Contact BasmaWorld | Las Vegas',
    description: 'Book lessons, get a marketing consultation, or just say hi.',
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
    title: 'Contact BasmaWorld',
    description: 'Book lessons, marketing consultations & more. Las Vegas.',
    images: ['/images/basma-about.jpg'],
  },
  alternates: {
    canonical: 'https://basmaworld.com/contact',
  },
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0a0a0a] pt-16">
        <section className="max-w-5xl mx-auto px-4 pt-12 pb-16">

          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/60 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
              ✦ Get In Touch
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contact{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                BasmaWorld
              </span>
            </h1>
            <p className="text-white/40 max-w-md mx-auto">
              Marketing help, music lessons, community partnerships — we&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">

            {/* Left — quick options */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-4">How can we help?</h2>

              {[
                { emoji: '📱', title: 'Marketing Consultation', desc: 'Free — grow your brand with MWM', href: '/mwm', color: 'border-blue-500/30 hover:border-blue-400' },
                { emoji: '🎵', title: 'Book a Music Lesson', desc: '$29 trial — voice, piano, guitar & more', href: '/basma', color: 'border-purple-500/30 hover:border-purple-400' },
                { emoji: '🏆', title: 'Community Partnership', desc: 'Work with Major Winners League', href: '/mwl', color: 'border-yellow-500/30 hover:border-yellow-400' },
                { emoji: '🤝', title: 'Youth Resources', desc: 'Hopes Chance — free help for ages 16-30', href: '/mwl', color: 'border-green-500/30 hover:border-green-400' },
              ].map((item) => (
                <Link key={item.title} href={item.href}
                  className={`flex items-center gap-4 bg-white/[0.02] border ${item.color} rounded-xl p-4 transition group`}>
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <p className="font-semibold text-white text-sm group-hover:opacity-80 transition">{item.title}</p>
                    <p className="text-white/30 text-xs">{item.desc}</p>
                  </div>
                  <span className="ml-auto text-white/20 group-hover:text-white/60 transition">→</span>
                </Link>
              ))}

              {/* Direct contact */}
              <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 mt-4">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Direct Contact</p>
                <div className="space-y-2 text-sm text-white/60">
                  <p>📞 (702) 788-7369</p>
                  <p>📍 9205 W Russell Rd Bldg 3, Las Vegas NV 89148</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {[
                      { href: 'https://www.tiktok.com/@basma_singer', label: '🎵 TikTok' },
                      { href: 'https://www.instagram.com/basma.tea', label: '📸 Instagram' },
                      { href: 'https://www.youtube.com/channel/UChszcJ6HQ4u1NoTs4-06H3w', label: '📺 YouTube' },
                      { href: 'https://discord.gg/4nzX2Wb5HW', label: '💬 Discord' },
                      { href: 'https://twitter.com/BASMA_music', label: '🐦 Twitter/X' },
                      { href: 'https://www.facebook.com/share/y5V8Jm2dKTpCGbc4/', label: '📘 Facebook' },
                      { href: 'https://linktr.ee/BASMATea', label: '🌍 All Links' },
                    ].map((link) => (
                      <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                        className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-xs transition">
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right — contact form */}
            <div>
              <h2 className="text-lg font-bold text-white mb-4">Send a Message</h2>
              <MWLContactForm />
            </div>

          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
