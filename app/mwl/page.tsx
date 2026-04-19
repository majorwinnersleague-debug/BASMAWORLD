export const dynamic = 'force-static'
export const revalidate = 86400

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BillyChat from '@/components/BillyChat'
import MWLContactForm from '@/components/MWLContactForm'
import Link from 'next/link'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Major Winners League — Community Events & Social Impact | Las Vegas, NV',
  description: 'Major Winners League by BasmaWorld — Las Vegas community events, business interviews, youth programs, and social impact. Gaming, podcast, BasmaTeach Me & more.',
  keywords: ['major winners league', 'las vegas community events', 'basmaworld mwl', 'las vegas youth programs', 'social impact las vegas', 'community content las vegas', 'basma singer community'],
  openGraph: {
    title: 'Major Winners League — Community Events & Social Impact | Las Vegas',
    description: 'Las Vegas community events, interviews & social impact. Gaming, podcast, BasmaTeach Me & more.',
    url: 'https://basmaworld.com/mwl',
    siteName: 'BasmaWorld',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/basma-mwl.jpg', width: 1200, height: 630, alt: 'Major Winners League — community events and social impact in Las Vegas' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@basma_singer',
    creator: '@basma_singer',
    title: 'Major Winners League — Las Vegas Community',
    description: 'Events, interviews, gaming, podcast & social impact from BasmaWorld.',
    images: ['/images/basma-mwl.jpg'],
  },
  alternates: {
    canonical: 'https://basmaworld.com/mwl',
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Major Winners League',
  url: 'https://basmaworld.com/mwl',
  description: 'Major Winners League covers Las Vegas community events, interviews with businesses and nonprofits, motivational talks, and social impact.',
  image: 'https://basmaworld.com/images/basma-mwl.jpg',
  telephone: '+1-702-788-7369',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '9205 W Russell Rd Building 3',
    addressLocality: 'Las Vegas',
    addressRegion: 'NV',
    postalCode: '89148',
    addressCountry: 'US',
  },
  parentOrganization: {
    '@type': 'Organization',
    name: 'BASMA LLC',
    url: 'https://basmaworld.com',
  },
  sameAs: [
    'https://www.tiktok.com/@basma_singer',
    'https://www.tiktok.com/@basmateachme',
    'https://www.instagram.com/basma.tea',
  ],
}

export default function MWL() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-16">

        {/* Hero with photo */}
        <section className="relative h-[70vh] flex items-end pb-16 px-4">
          <div className="absolute inset-0">
            <img src="/images/basma-mwl.jpg" alt="Major Winners League community events Las Vegas"
              className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center w-full">
            <p className="text-yellow-400 font-bold uppercase tracking-widest text-sm mb-3">Community • Impact • Motivation</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Major Winners League</h1>
            <p className="text-gray-300 text-lg mb-6">Covering Las Vegas from Historic Westside to Nevada Partners — one community at a time.</p>
            <a href="#contact" className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded-full transition hover:scale-105 text-sm">
              🏆 Get In Touch
            </a>
          </div>
        </section>

        {/* Sub-section cards */}
        <section className="max-w-5xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-6">
          {[
            { href: '/mwl/basmateachme', icon: '🪆', title: 'BasmaTeach Me', desc: 'Billy the Puppet and Basma make learning sassy, funny, and genuinely fun for kids on TikTok.' },
            { href: '/mwl/i-am-positive', icon: '💛', title: 'I Am Positive', desc: 'Motivational talks, spoken word poetry, and inspiration for the community.' },
            { href: '/mwl/podcast', icon: '🎙️', title: 'Mildly Interesting', desc: 'The podcast with Wesley. Real conversations, real topics. Posted on BasmaWorld YouTube.' },
            { href: '/mwl/gaming', icon: '🎮', title: 'Gaming', desc: 'Youth gaming community — streams, challenges, tips, and culture from MWL.' },
            { href: '/mwl/hopes-chance', icon: '🤝', title: 'Hopes Chance', desc: 'Free resource navigator connecting youth 16-30 to housing, jobs, and mental health services.' },
            { href: '/mwl/vegan-survivors', icon: '🥦', title: 'Vegan Survivors', desc: 'Plant-based recipes, health tips, and wellness content for the whole community.' },
          ].map(s => (
            <Link key={s.href} href={s.href}
              className="bg-gray-900/50 border border-white/10 hover:border-yellow-500/50 rounded-2xl p-6 flex gap-4 items-start transition group hover:bg-yellow-900/10">
              <div className="text-4xl">{s.icon}</div>
              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-yellow-400 transition mb-2">{s.title}</h2>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </Link>
          ))}
        </section>

        {/* Community photo strip */}
        <section className="max-w-5xl mx-auto px-4 pb-20 grid grid-cols-2 md:grid-cols-3 gap-4">
          <img src="/images/basma-community.jpg" alt="Basma in the community" className="rounded-xl w-full h-48 object-cover" />
          <img src="/images/basma-mwl.jpg" alt="MWL community event" className="rounded-xl w-full h-48 object-cover" />
          <img src="/images/basma-about.jpg" alt="Basma Awada community leader" className="rounded-xl w-full h-48 object-cover md:block hidden" />
        </section>

        {/* Contact Form — client component */}
        <MWLContactForm />

      </main>
      <Footer />
      <BillyChat page="basmateachme" />
    </>
  )
}
