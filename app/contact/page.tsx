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
  alternates: { canonical: 'https://basmaworld.com/contact' },
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16">
        <section className="max-w-5xl mx-auto px-6 pt-16 pb-20">

          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-xs text-[#c9a84c]/50 tracking-[0.3em] uppercase mb-4">Get In Touch</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-5 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Contact <span className="gradient-gold">BasmaWorld</span>
            </h1>
            <p className="text-white/30 max-w-md mx-auto text-sm">
              Marketing help, music lessons, community partnerships — we&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">

            {/* Left — quick options */}
            <div className="space-y-3">
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-5">How Can We Help</h2>

              {[
                { title: 'Marketing Consultation', desc: 'Grow your brand with MWL', href: '/mwl', accent: 'border-[#c9a84c]/20 hover:border-[#c9a84c]/40' },
                { title: 'Book a Music Lesson', desc: '$29 trial — voice, piano, guitar & more', href: '/basma', accent: 'border-white/[0.06] hover:border-white/15' },
                { title: 'Community Partnership', desc: 'Work with Major Winners League', href: '/mwl', accent: 'border-white/[0.06] hover:border-white/15' },
                { title: 'Youth Resources', desc: 'Hopes Chance — free help for ages 16–30', href: '/hopes', accent: 'border-white/[0.06] hover:border-white/15' },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`flex items-center gap-4 card-minimal border ${item.accent} rounded-xl p-5 transition-all duration-200 group`}
                >
                  <div className="flex-1">
                    <p className="font-medium text-white text-sm group-hover:text-[#c9a84c] transition-colors">{item.title}</p>
                    <p className="text-white/25 text-xs mt-0.5">{item.desc}</p>
                  </div>
                  <span className="text-white/15 group-hover:text-white/40 transition-colors text-sm">→</span>
                </Link>
              ))}

              {/* Direct contact */}
              <div className="card-minimal rounded-xl p-5 mt-4">
                <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Direct Contact</p>
                <div className="space-y-2 text-sm text-white/35">
                  <p>(702) 788-7369</p>
                  <p>9205 W Russell Rd Bldg 3, Las Vegas NV 89148</p>
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
