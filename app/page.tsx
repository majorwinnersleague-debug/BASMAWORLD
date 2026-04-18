import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'BasmaWorld — Music Academy, Community & Youth Resources | Las Vegas, NV',
  description: 'BasmaWorld is home to BASMA Become A Singer Music Academy, Major Winners League community content, and Hopes Chance youth resources. Music lessons in Las Vegas, NV. Singing lessons, piano, guitar, vocal coaching.',
  keywords: ['music lessons las vegas', 'singing lessons las vegas', 'kids music academy', 'basma music school', 'vocal coach las vegas', 'piano lessons las vegas', 'guitar lessons las vegas', 'las vegas music academy', 'become a singer', 'basmaworld'],
  openGraph: {
    title: 'BasmaWorld — Music Academy, Community & Youth Resources | Las Vegas, NV',
    description: 'BASMA Music Academy, Major Winners League & Hopes Chance — changing lives through music, community, and opportunity in Las Vegas, NV.',
    url: 'https://basmaworld.com',
    siteName: 'BasmaWorld',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'BasmaWorld — Music Academy Las Vegas' }],
  },
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white">

        {/* HERO — full bleed photo with Las Vegas mention */}
        <section className="relative min-h-screen flex items-end pb-20 px-4">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="/images/basma-hero.jpg"
              alt="Basma — artist, educator, community leader based in Las Vegas"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
            {/* Las Vegas badge */}
            <span className="inline-block bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              📍 Las Vegas, NV
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-white to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
              BasmaWorld
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-3 font-light">
              Music Academy · Community · Youth Resources
            </p>
            <p className="text-gray-400 mb-10 text-base max-w-xl mx-auto">
              One platform connecting the BASMA Music Academy, Major Winners League, and Hopes Chance — changing lives through music, community, and opportunity.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/mwl" className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-full font-bold text-lg transition hover:scale-105 shadow-lg shadow-yellow-500/20">
                🏆 Major Winners League
              </Link>
              <Link href="/basma/academy" className="bg-purple-600 hover:bg-purple-500 px-8 py-4 rounded-full font-bold text-lg transition hover:scale-105 shadow-lg shadow-purple-500/20">
                🎵 BASMA Academy
              </Link>
              <Link href="/hopes" className="bg-green-700 hover:bg-green-600 px-8 py-4 rounded-full font-bold text-lg transition hover:scale-105 shadow-lg shadow-green-500/20">
                🤝 Hopes Chance
              </Link>
            </div>
          </div>
        </section>

        {/* THREE PILLARS */}
        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-14">
            <p className="text-yellow-400 font-semibold uppercase tracking-widest text-sm mb-3">What Is BasmaWorld?</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">Three Worlds. One Mission.</h2>
            <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
              Built in Las Vegas, reaching the world — BasmaWorld unites music education, community impact, and youth support under one roof.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Pillar 1 — MWL (Gold) */}
            <div className="relative rounded-2xl overflow-hidden group border border-yellow-500/20 hover:border-yellow-500/50 transition-all duration-300 bg-gradient-to-b from-yellow-950/30 to-black">
              <img src="/images/basma-mwl.jpg" alt="Major Winners League community events Las Vegas"
                className="w-full h-52 object-cover group-hover:scale-105 transition duration-500 opacity-80" />
              <div className="absolute top-0 left-0 right-0 h-52 bg-gradient-to-b from-transparent to-black/80" />
              <div className="p-6">
                <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">Community & Social Impact</span>
                <h3 className="text-2xl font-bold text-white mt-2 mb-3">Major Winners League</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  Events, interviews, motivation, gaming, BasmaTeach Me, and social impact initiatives — all under the MWL banner.
                </p>
                <ul className="text-gray-500 text-xs space-y-1 mb-5">
                  <li className="flex items-center gap-2"><span className="text-yellow-500">→</span> BasmaTeach Me</li>
                  <li className="flex items-center gap-2"><span className="text-yellow-500">→</span> I Am Positive</li>
                  <li className="flex items-center gap-2"><span className="text-yellow-500">→</span> Gaming & Podcast</li>
                </ul>
                <Link href="/mwl" className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2.5 rounded-full text-sm transition">
                  Explore MWL →
                </Link>
              </div>
            </div>

            {/* Pillar 2 — Academy (Purple) */}
            <div className="relative rounded-2xl overflow-hidden group border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 bg-gradient-to-b from-purple-950/30 to-black">
              <img src="/images/basma-singer.jpg" alt="BASMA Become A Singer Music Academy Las Vegas"
                className="w-full h-52 object-cover group-hover:scale-105 transition duration-500 opacity-80" />
              <div className="absolute top-0 left-0 right-0 h-52 bg-gradient-to-b from-transparent to-black/80" />
              <div className="p-6">
                <span className="text-purple-400 text-xs font-bold uppercase tracking-widest">Music Academy & Artist</span>
                <h3 className="text-2xl font-bold text-white mt-2 mb-3">BASMA Music Academy</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  Become A Singer — gamified music lessons, live vocal coaching, piano, guitar, and artist mentorship in Las Vegas and online.
                </p>
                <ul className="text-gray-500 text-xs space-y-1 mb-5">
                  <li className="flex items-center gap-2"><span className="text-purple-500">→</span> Singing Lessons</li>
                  <li className="flex items-center gap-2"><span className="text-purple-500">→</span> Piano & Guitar</li>
                  <li className="flex items-center gap-2"><span className="text-purple-500">→</span> Live Coaching</li>
                </ul>
                <Link href="/basma/academy" className="inline-block bg-purple-600 hover:bg-purple-500 font-bold px-5 py-2.5 rounded-full text-sm transition">
                  Explore Academy →
                </Link>
              </div>
            </div>

            {/* Pillar 3 — Hopes Chance (Green) */}
            <div className="relative rounded-2xl overflow-hidden group border border-green-500/20 hover:border-green-500/50 transition-all duration-300 bg-gradient-to-b from-green-950/30 to-black">
              <img src="/images/hopes-chance.jpg" alt="Hopes Chance youth resources Las Vegas"
                className="w-full h-52 object-cover group-hover:scale-105 transition duration-500 opacity-80"
              />
              <div className="absolute top-0 left-0 right-0 h-52 bg-gradient-to-b from-transparent to-black/80" />
              <div className="p-6">
                <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Youth Resources</span>
                <h3 className="text-2xl font-bold text-white mt-2 mb-3">Hopes Chance</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  Connecting youth and families in Las Vegas to resources, support systems, and community programs that create real opportunity.
                </p>
                <ul className="text-gray-500 text-xs space-y-1 mb-5">
                  <li className="flex items-center gap-2"><span className="text-green-500">→</span> Youth Support</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">→</span> Community Resources</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">→</span> Las Vegas Outreach</li>
                </ul>
                <Link href="/hopes" className="inline-block bg-green-700 hover:bg-green-600 font-bold px-5 py-2.5 rounded-full text-sm transition">
                  Explore Hopes →
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* ABOUT BASMA — photo + text */}
        <section className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center border-t border-white/10">
          <div className="relative">
            <img
              src="/images/basma-about.jpg"
              alt="Basma Awada — Music educator and community leader in Las Vegas"
              className="rounded-2xl w-full object-cover shadow-2xl shadow-purple-900/30"
              style={{maxHeight: '500px', objectFit: 'cover'}}
            />
            <div className="absolute -bottom-4 -right-4 bg-yellow-500 text-black font-bold px-4 py-2 rounded-xl text-sm shadow-lg">
              300k+ Students Worldwide 🌍
            </div>
          </div>
          <div>
            <p className="text-yellow-400 font-semibold uppercase tracking-widest text-sm mb-3">Meet Basma</p>
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">Singer. Educator.<br/>Community Leader.</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              Basma is a multi-instrumentalist, MPA, professional vocal coach, and community activist based in <strong className="text-white">Las Vegas, Nevada</strong>.
            </p>
            <p className="text-gray-400 leading-relaxed mb-6">
              With 300k+ students learning music through her content, she brings artistry, education, and social impact together under one roof — <span className="text-white font-semibold">BasmaWorld</span>.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/basma/artist" className="bg-purple-700 hover:bg-purple-600 px-6 py-3 rounded-full text-sm font-semibold transition">🎤 Basma The Artist</Link>
              <Link href="/mwl" className="bg-yellow-600 hover:bg-yellow-500 text-black px-6 py-3 rounded-full text-sm font-semibold transition">🏆 Community Work</Link>
            </div>
          </div>
        </section>

        {/* QUICK LINKS ROW */}
        <section className="border-t border-white/10 py-12 bg-white/[0.02]">
          <div className="max-w-5xl mx-auto px-4">
            <p className="text-center text-gray-500 text-xs uppercase tracking-widest mb-6">Explore BasmaWorld</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/mwl/basmateachme" className="bg-yellow-900/30 hover:bg-yellow-800/50 border border-yellow-700/40 px-5 py-3 rounded-full text-sm font-medium transition">🎓 BasmaTeach Me</Link>
              <Link href="/mwl/i-am-positive" className="bg-yellow-900/30 hover:bg-yellow-800/50 border border-yellow-700/40 px-5 py-3 rounded-full text-sm font-medium transition">✨ I Am Positive</Link>
              <Link href="/hopes" className="bg-green-900/40 hover:bg-green-800/60 border border-green-700/40 px-5 py-3 rounded-full text-sm font-medium transition">🤝 Hopes Chance</Link>
              <Link href="/vegan-survivors" className="bg-orange-900/40 hover:bg-orange-800/60 border border-orange-700/40 px-5 py-3 rounded-full text-sm font-medium transition">🥦 Vegan Survivors</Link>
              <Link href="/mwl/gaming" className="bg-blue-900/40 hover:bg-blue-800/60 border border-blue-700/40 px-5 py-3 rounded-full text-sm font-medium transition">🎮 Gaming</Link>
              <Link href="/mwl/podcast" className="bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700/40 px-5 py-3 rounded-full text-sm font-medium transition">🎙️ Podcast</Link>
              <a href="https://linktr.ee/BASMATea" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-3 rounded-full text-sm font-medium transition">🌍 All Links</a>
            </div>
          </div>
        </section>

        {/* SEO footer text */}
        <section className="border-t border-white/10 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Las Vegas Music Academy &amp; Community Hub</h2>
            <p className="text-gray-500 leading-relaxed text-sm max-w-2xl mx-auto">
              BasmaWorld brings together BASMA Music Academy — offering singing, piano, and guitar lessons in Las Vegas and online — the Major Winners League community platform, and Hopes Chance youth resources. Founded by Basma Awada, educator, singer, and community leader in Las Vegas, NV.
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
