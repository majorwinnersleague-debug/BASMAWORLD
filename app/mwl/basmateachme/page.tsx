import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BillyChat from '@/components/BillyChat'

export const metadata: Metadata = {
  title: 'Billy the Puppet | BasmaTeach Me',
  description: 'Meet Billy! The sassy, funny, kid-friendly puppet from BasmaTeach Me. Learn with Billy and Basma!',
  keywords: 'Billy the Puppet, BasmaTeach Me, kids music, puppet teaching, learn with Billy, Basma TikTok, educational puppet',
  openGraph: {
    title: 'Billy the Puppet | BasmaTeach Me',
    description: 'Meet Billy! The sassy, funny, kid-friendly puppet from BasmaTeach Me. Learn with Billy and Basma!',
    url: 'https://basmaworld.com/mwl/basmateachme',
    siteName: 'BasmaWorld',
    type: 'website',
  },
}

const billyFacts = [
  {
    emoji: '🪆',
    title: 'Sassy But Sweet',
    desc: 'Billy has opinions — and he is NOT afraid to share them. But deep down, he just wants everyone to learn and have fun.',
  },
  {
    emoji: '🎵',
    title: 'Music Is Life',
    desc: 'Songs, beats, rhymes, rhythm — Billy believes every kid has a musician hiding inside them. Yes, even you.',
  },
  {
    emoji: '😂',
    title: 'Certified Funny',
    desc: 'Billy makes learning hilarious. If you are not laughing AND learning at the same time, something went wrong.',
  },
  {
    emoji: '🌟',
    title: 'Kids\' Champion',
    desc: 'Billy shows up for every kid, every time. No kid left behind. No question too silly. Billy is HERE for it.',
  },
]

export default function BasmaTeachMe() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-gray-300 transition">BasmaWorld</Link>
            <span>/</span>
            <Link href="/mwl" className="hover:text-yellow-400 transition">MWL</Link>
            <span>/</span>
            <span style={{ color: '#39FF14' }}>BasmaTeach Me</span>
          </div>

          {/* Hero */}
          <div className="text-center mb-16">
            <div className="text-7xl mb-4 animate-bounce">🪆</div>
            <p
              className="font-bold uppercase tracking-widest text-sm mb-3"
              style={{ color: '#39FF14' }}
            >
              Sassy · Funny · Kid-Friendly
            </p>
            <h1
              className="text-5xl md:text-6xl font-bold mb-4"
              style={{ color: '#39FF14' }}
            >
              Meet Billy!
            </h1>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto">
              The world&apos;s sassiest, funniest, most loveable puppet is here to teach you stuff.
              With Basma. On TikTok. Right now. Let&apos;s GOOO! 🎉
            </p>
          </div>

          {/* Billy Quote */}
          <div
            className="rounded-2xl p-8 mb-14 text-center border"
            style={{
              background: 'rgba(57,255,20,0.08)',
              borderColor: 'rgba(57,255,20,0.4)',
            }}
          >
            <blockquote
              className="text-2xl font-semibold italic leading-relaxed"
              style={{ color: '#39FF14' }}
            >
              &quot;Learning is cool. NOT learning? Kinda embarrassing, honestly. I&apos;m just saying.&quot;
            </blockquote>
            <p className="text-gray-500 mt-3 text-sm">— Billy the Puppet, BasmaTeach Me 🪆</p>
          </div>

          {/* Billy Facts Grid */}
          <h2 className="text-3xl font-bold text-white mb-6">Why Billy?</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {billyFacts.map((fact, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 border transition hover:scale-[1.02]"
                style={{
                  background: 'rgba(57,255,20,0.05)',
                  borderColor: 'rgba(57,255,20,0.25)',
                }}
              >
                <div className="text-4xl mb-3">{fact.emoji}</div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: '#39FF14' }}
                >
                  {fact.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{fact.desc}</p>
              </div>
            ))}
          </div>

          {/* Featured TikToks Section */}
          <div
            className="rounded-2xl p-8 mb-14 border"
            style={{
              background: 'rgba(57,255,20,0.06)',
              borderColor: 'rgba(57,255,20,0.3)',
            }}
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🎬</div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured TikToks</h2>
              <p className="text-gray-400">
                Billy &amp; Basma drop videos that make learning actually fun. Follow along for new episodes every week!
              </p>
            </div>

            {/* TikTok embed-style cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                { emoji: '🎵', label: 'Music Lesson #1', desc: 'Billy teaches rhythm with attitude' },
                { emoji: '🔤', label: 'Word of the Day', desc: 'Billy drops vocabulary knowledge' },
                { emoji: '🤣', label: 'Billy\'s Best Moment', desc: 'The sassiest 60 seconds on TikTok' },
              ].map((v, i) => (
                <a
                  key={i}
                  href="https://www.tiktok.com/@basmateachme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl p-5 text-center transition hover:scale-105 block border"
                  style={{
                    background: 'rgba(0,0,0,0.6)',
                    borderColor: 'rgba(57,255,20,0.2)',
                  }}
                >
                  <div className="text-4xl mb-2">{v.emoji}</div>
                  <p
                    className="font-bold text-sm mb-1"
                    style={{ color: '#39FF14' }}
                  >
                    {v.label}
                  </p>
                  <p className="text-gray-500 text-xs">{v.desc}</p>
                  <span
                    className="inline-block mt-3 text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: 'rgba(57,255,20,0.15)', color: '#39FF14' }}
                  >
                    Watch on TikTok ↗
                  </span>
                </a>
              ))}
            </div>

            <div className="text-center">
              <a
                href="https://www.tiktok.com/@basmateachme"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-full text-black transition hover:brightness-110 hover:scale-105"
                style={{ background: '#39FF14' }}
              >
                <span className="text-xl">🎵</span>
                Follow @basmateachme on TikTok
              </a>
            </div>
          </div>

          {/* Chat with Billy CTA */}
          <div
            className="text-center rounded-2xl p-10 border mb-8"
            style={{
              background: 'linear-gradient(135deg, rgba(57,255,20,0.12) 0%, rgba(0,0,0,0.9) 100%)',
              borderColor: 'rgba(57,255,20,0.5)',
            }}
          >
            <div className="text-6xl mb-4">🪆💬</div>
            <h2
              className="text-3xl font-bold mb-3"
              style={{ color: '#39FF14' }}
            >
              Chat with Billy!
            </h2>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto text-lg">
              Got questions? Want to learn something? Just want to chat with the sassiest puppet on the internet?
              Billy is literally RIGHT HERE. Hit that button. Go on. He won&apos;t bite. Probably.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => {
                  // The BillyChat floating button is already on the page
                  const btn = document.querySelector<HTMLButtonElement>('[aria-label="Open Billy Chat"]')
                  btn?.click()
                }}
                className="font-bold px-8 py-4 rounded-full text-black transition hover:brightness-110 hover:scale-105 text-lg"
                style={{ background: '#39FF14' }}
              >
                🪆 Chat with Billy Now!
              </button>
              <Link
                href="/mwl"
                className="border font-semibold px-6 py-3 rounded-full transition hover:border-green-400"
                style={{ borderColor: 'rgba(57,255,20,0.5)', color: '#39FF14' }}
              >
                ← Back to MWL
              </Link>
            </div>
          </div>

          {/* About BasmaTeach Me */}
          <div className="bg-gray-900/40 border border-white/10 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-3">About BasmaTeach Me</h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto">
              BasmaTeach Me is Basma&apos;s educational TikTok channel where Billy the Puppet and Basma team up to
              make learning fun, accessible, and genuinely hilarious for kids of all ages. Part of the Major Winners League
              family, BasmaTeach Me brings creativity and education together in the most entertaining way possible.
            </p>
          </div>

        </div>
      </main>
      <Footer />
      <BillyChat page="basmateachme" />
    </>
  )
}
