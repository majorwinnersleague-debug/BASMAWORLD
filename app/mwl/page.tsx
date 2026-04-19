export const dynamic = 'force-static'
export const revalidate = 86400

import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BillyChat from '@/components/BillyChat'
import MWLContactForm from '@/components/MWLContactForm'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Major Winners League — Community, Gaming & Social Impact | Las Vegas, NV',
  description: 'Major Winners League by BasmaWorld — Las Vegas community events, youth gaming, motivational content, podcasts, and social impact. BasmaTeach Me, Mildly Interesting podcast & more.',
  keywords: ['major winners league', 'las vegas community events', 'basmaworld mwl', 'las vegas youth programs', 'social impact las vegas', 'youth gaming las vegas', 'motivational talks las vegas', 'basma singer community'],
  openGraph: {
    title: 'Major Winners League — Community, Gaming & Social Impact | Las Vegas',
    description: 'Las Vegas community events, youth gaming, motivational content, podcasts & social impact.',
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
    description: 'Events, gaming, motivation, podcast & social impact from BasmaWorld.',
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
  description: 'Major Winners League covers Las Vegas community events, interviews with businesses and nonprofits, motivational talks, gaming, and social impact.',
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
            <p className="text-yellow-400 font-bold uppercase tracking-widest text-sm mb-3">Community • Impact • Motivation • Gaming</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Major Winners League</h1>
            <p className="text-gray-300 text-lg mb-6">Covering Las Vegas from Historic Westside to Nevada Partners — one community at a time.</p>
            <a href="#contact" className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded-full transition hover:scale-105 text-sm">
              🏆 Get In Touch
            </a>
          </div>
        </section>

        {/* Sub-section cards — kept pages */}
        <section className="max-w-5xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Programs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { href: '/mwl/basmateachme', icon: '🪆', title: 'BasmaTeach Me', desc: 'Billy the Puppet and Basma make learning sassy, funny, and genuinely fun for kids on TikTok.' },
              { href: '/mwl/podcast', icon: '🎙️', title: 'Mildly Interesting', desc: 'The podcast with Wesley. Real conversations, real topics. Posted on BasmaWorld YouTube.' },
              { href: '/hopes', icon: '🤝', title: 'Hopes Chance', desc: 'Free resource navigator connecting youth 16-30 to housing, jobs, and mental health services.' },
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
          </div>
        </section>

        {/* Gaming Section (folded from /mwl/gaming) */}
        <section className="max-w-5xl mx-auto px-4 pb-20" id="gaming">
          <div className="text-center mb-10">
            <p className="font-bold uppercase tracking-widest text-sm mb-3" style={{ color: '#BF5FFF' }}>
              Major Winners League · Youth Gaming
            </p>
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#BF5FFF' }}>🎮 Gaming</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Real gaming. Real community. Real winners. MWL brings gaming together with purpose, connection, and next-level energy for youth.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { emoji: '🎮', title: 'Gaming Streams', desc: 'Live gaming sessions, commentary, and reactions. Real gameplay, real energy.' },
              { emoji: '🏆', title: 'Community Challenges', desc: 'Weekly challenges where MWL youth compete, collaborate, and claim bragging rights.' },
              { emoji: '🧠', title: 'Game Skills = Life Skills', desc: 'Strategy, teamwork, resilience under pressure — gaming builds real-world winners.' },
              { emoji: '📱', title: 'Mobile Gaming', desc: 'Not just console — mobile gaming content that meets youth where they actually play.' },
              { emoji: '🎯', title: 'Tips & Tutorials', desc: 'Level up your skills. Pro-tips, game guides, and beginner-friendly walkthroughs.' },
              { emoji: '🌐', title: 'Gaming Community', desc: 'A positive, inclusive space for youth gamers to connect, compete, and grow together.' },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl p-5 border transition hover:scale-[1.02]"
                style={{ background: 'rgba(191,95,255,0.05)', borderColor: 'rgba(191,95,255,0.2)' }}>
                <div className="text-3xl mb-2">{item.emoji}</div>
                <h3 className="text-lg font-bold mb-1" style={{ color: '#BF5FFF' }}>{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <a href="https://www.tiktok.com/@basma_singer" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full text-white transition hover:brightness-110"
              style={{ background: '#BF5FFF' }}>
              🎮 Follow @basma_singer on TikTok
            </a>
          </div>
        </section>

        {/* I Am Positive Section (folded from /mwl/i-am-positive) */}
        <section className="max-w-5xl mx-auto px-4 pb-20" id="positive">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-yellow-400 mb-4">✦ I Am Positive</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Motivational talks, spoken word poetry, and stories of resilience. Shift your mindset. Claim your power.
            </p>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-2xl p-8 mb-10 text-center">
            <blockquote className="text-2xl font-semibold text-yellow-300 italic leading-relaxed">
              &quot;You are not your circumstances. You are your choices. And today, you choose to rise.&quot;
            </blockquote>
            <p className="text-gray-500 mt-3 text-sm">— I Am Positive, Major Winners League</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { title: 'I Choose to Rise', excerpt: 'Every morning is a declaration. Every breath is a choice. I am not defined by my past — I am powered by my purpose.', author: 'BasmaWorld' },
              { title: "The Winner\u2019s Mindset", excerpt: "Winners aren\u2019t born in gyms. They\u2019re forged in silence. In the quiet moments when no one\u2019s watching — and you still choose to show up.", author: 'MWL Community' },
              { title: 'Positive Is A Practice', excerpt: "Positivity isn\u2019t ignoring the hard. It\u2019s facing it anyway. With your chin up, your heart open, and your vision locked on what\u2019s possible.", author: 'BasmaWorld' },
            ].map((poem, i) => (
              <div key={i} className="bg-yellow-900/10 border border-yellow-800/50 hover:border-yellow-600 rounded-2xl p-6 transition">
                <h3 className="text-lg font-bold text-yellow-400 mb-3">&quot;{poem.title}&quot;</h3>
                <p className="text-gray-300 text-sm leading-relaxed italic mb-3">&quot;{poem.excerpt}&quot;</p>
                <p className="text-gray-500 text-xs">— {poem.author}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: '🧠', title: 'Mindset Resets', desc: 'Short powerful sessions to rewire how you think about success, failure, and your own potential.' },
              { icon: '💪', title: 'Resilience Stories', desc: 'Real people from the Las Vegas community sharing how they survived and thrived.' },
              { icon: '🎯', title: 'Goal Architecture', desc: 'How to build goals that actually stick — and the mindset to see them through.' },
              { icon: '⭐', title: 'Community Spotlights', desc: 'Honoring local heroes making a quiet difference every day.' },
            ].map((item, i) => (
              <div key={i} className="bg-black border border-yellow-800/30 hover:border-yellow-600/60 rounded-xl p-4 transition">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Vegan Survivors mention */}
        <section className="max-w-4xl mx-auto px-4 pb-16" id="vegan">
          <div className="bg-green-900/10 border border-green-800/30 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">🥦</div>
            <h2 className="text-2xl font-bold text-[#22C55E] mb-3">Vegan Survivors</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-4">
              A Major Winners League community initiative — plant-based recipes, health tips, and wellness content. More coming soon!
            </p>
            <a href="https://www.tiktok.com/@basma_singer" target="_blank" rel="noopener noreferrer"
              className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-6 py-3 rounded-xl font-semibold transition inline-block">
              Follow @basma_singer for Updates
            </a>
          </div>
        </section>

        {/* Community photo strip */}
        <section className="max-w-5xl mx-auto px-4 pb-20 grid grid-cols-2 md:grid-cols-3 gap-4">
          <img src="/images/basma-community.jpg" alt="Basma in the community" className="rounded-xl w-full h-48 object-cover" />
          <img src="/images/basma-mwl.jpg" alt="MWL community event" className="rounded-xl w-full h-48 object-cover" />
          <img src="/images/basma-about.jpg" alt="Basma Awada community leader" className="rounded-xl w-full h-48 object-cover md:block hidden" />
        </section>

        {/* Contact Form */}
        <MWLContactForm />

      </main>
      <Footer />
      <BillyChat page="basmateachme" />
    </>
  )
}
