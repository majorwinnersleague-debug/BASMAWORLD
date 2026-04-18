import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BillyChat from '@/components/BillyChat'
import Link from 'next/link'

export const metadata = {
  title: 'BASMA — Become A Singer Music Academy | Online Singing Lessons',
  description: 'Join Become A Singer Music Academy. Gamified music lessons, XP system, Skill Tree, and Echo AI mentor. Professional vocal coaching online with Basma.',
}

const musicSchoolSchema = {
  '@context': 'https://schema.org',
  '@type': 'MusicSchool' as const,
  name: 'BASMA — Become A Singer Music Academy',
  url: 'https://basmaworld.com/basma/academy',
  description: 'Gamified online music lessons with XP system, Skill Tree, and Echo AI mentor. Professional vocal coaching with Basma.',
  provider: {
    '@type': 'Organization',
    name: 'BASMA LLC',
    url: 'https://basmaworld.com',
  },
  telephone: '+1-702-788-7369',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '9205 W Russell Rd Building 3',
    addressLocality: 'Las Vegas',
    addressRegion: 'NV',
    postalCode: '89148',
    addressCountry: 'US',
  },
  areaServed: 'Worldwide',
  teaches: ['Singing', 'Vocal Technique', 'Music Theory', 'Performance Skills'],
  image: 'https://basmaworld.com/images/basma-academy.jpg',
}

export default function Academy() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(musicSchoolSchema) }}
      />
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-16">

        {/* Hero with photo */}
        <section className="relative h-[70vh] flex items-center px-4">
          <div className="absolute inset-0">
            <img src="/images/basma-academy.jpg" alt="BASMA music academy professional singing lessons"
              className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <p className="text-purple-400 font-bold uppercase tracking-widest text-sm mb-3">Become A Singer Music Academy</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">Learn Music.<br/>Earn XP.<br/>Unlock Your Potential.</h1>
            <p className="text-gray-300 text-lg mb-8">Guided by Echo, your personal AI music mentor. Three paths — Music, Branding & Health.</p>
            <Link href="/basma/lessons" className="bg-purple-600 hover:bg-purple-500 px-8 py-4 rounded-full font-bold text-lg transition hover:scale-105 shadow-lg shadow-purple-500/30">
              🎓 Start Your Journey
            </Link>
          </div>
        </section>

        {/* Learning paths */}
        <section className="max-w-5xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Path</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🎸', title: 'Music Path', desc: 'Core instrument & vocal technique, music theory, performance skills', color: 'purple' },
              { icon: '🎨', title: 'Branding Path', desc: 'Music marketing, social media strategy, personal brand building for artists', color: 'pink' },
              { icon: '💚', title: 'Health Path', desc: 'Artist wellness, performance mindset, vocal health & longevity', color: 'green' },
            ].map(p => (
              <div key={p.title} className="bg-purple-900/20 border border-purple-800 rounded-2xl p-6 hover:border-purple-600 transition hover:bg-purple-900/30">
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Echo AI mentor */}
        <section className="bg-gradient-to-r from-purple-900/20 to-black border-y border-purple-800/30 py-16">
          <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-purple-400 font-bold uppercase tracking-widest text-sm mb-3">Your AI Mentor</p>
              <h2 className="text-4xl font-bold mb-4">Meet Echo 🤖</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Echo is your personal AI music guide. She tracks your XP, recommends your next quest, 
                celebrates every win, and helps you unlock new levels on your Skill Tree.
              </p>
              <p className="text-gray-400 text-sm">Available 24/7. No judgment. Pure encouragement.</p>
            </div>
            <div className="bg-purple-900/30 border border-purple-700 rounded-2xl p-6 font-mono text-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse"></div>
                <span className="text-purple-400 font-sans font-semibold">Echo</span>
              </div>
              <p className="text-gray-300 mb-3">"Hey! You just earned <span className="text-yellow-400 font-bold">+50 XP</span> for completing Lesson 3! 🎉"</p>
              <p className="text-gray-300 mb-3">"Your next quest: <span className="text-purple-400">Chest Voice Resonance</span>. Ready?"</p>
              <p className="text-gray-400">"You're 120 XP away from unlocking the <span className="text-yellow-400">Performance Stage</span> node 🌟"</p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <BillyChat page="academy" />
    </>
  )
}

