import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'I Am Positive | Major Winners League | BasmaWorld',
  description: 'Motivational talks, spoken word poetry, and stories of resilience from Major Winners League. Shift your mindset in Las Vegas and beyond.',
  keywords: 'motivational speaker Las Vegas, spoken word poetry Nevada, I am positive, mindset shift, Las Vegas community events, motivational talks',
  openGraph: {
    title: 'I Am Positive | Major Winners League',
    description: 'Motivational talks, spoken poetry & stories of resilience from the MWL community.',
    url: 'https://basmaworld.com/mwl/i-am-positive',
    siteName: 'BasmaWorld',
    type: 'website',
  },
}

const poems = [
  {
    title: 'I Choose to Rise',
    excerpt: 'Every morning is a declaration. Every breath is a choice. I am not defined by my past — I am powered by my purpose.',
    author: 'BasmaWorld'
  },
  {
    title: "The Winner's Mindset",
    excerpt: "Winners aren't born in gyms. They're forged in silence. In the quiet moments when no one's watching — and you still choose to show up.",
    author: 'MWL Community'
  },
  {
    title: 'Positive Is A Practice',
    excerpt: "Positivity isn't ignoring the hard. It's facing it anyway. With your chin up, your heart open, and your vision locked on what's possible.",
    author: 'BasmaWorld'
  }
]

export default function IAmPositive() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-gray-300 transition">BasmaWorld</Link>
            <span>/</span>
            <Link href="/mwl" className="hover:text-yellow-400 transition">MWL</Link>
            <span>/</span>
            <span className="text-yellow-400">I Am Positive</span>
          </div>

          <div className="text-center mb-16">
            <div className="text-6xl mb-4">&#10027;</div>
            <h1 className="text-5xl font-bold text-yellow-400 mb-4">I Am Positive</h1>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto">Motivational talks, spoken word poetry, and stories of resilience. Shift your mindset. Claim your power.</p>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-2xl p-8 mb-12 text-center">
            <blockquote className="text-2xl font-semibold text-yellow-300 italic leading-relaxed">
              &quot;You are not your circumstances. You are your choices. And today, you choose to rise.&quot;
            </blockquote>
            <p className="text-gray-500 mt-3 text-sm">— I Am Positive, Major Winners League</p>
          </div>

          <h2 className="text-3xl font-bold text-white mb-6">Spoken Poetry</h2>
          <div className="grid gap-6 mb-16">
            {poems.map((poem, i) => (
              <div key={i} className="bg-yellow-900/10 border border-yellow-800/50 hover:border-yellow-600 rounded-2xl p-7 transition">
                <h3 className="text-xl font-bold text-yellow-400 mb-3">&quot;{poem.title}&quot;</h3>
                <p className="text-gray-300 leading-relaxed italic mb-4">&quot;{poem.excerpt}&quot;</p>
                <p className="text-gray-500 text-sm">— {poem.author}</p>
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold text-white mb-6">Motivational Talks</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {[
              { icon: '&#129504;', title: 'Mindset Resets', desc: 'Short powerful sessions to rewire how you think about success, failure, and your own potential.' },
              { icon: '&#128170;', title: 'Resilience Stories', desc: 'Real people from the Las Vegas community sharing how they survived and thrived.' },
              { icon: '&#127919;', title: 'Goal Architecture', desc: 'How to build goals that actually stick — and the mindset to see them through.' },
              { icon: '&#11088;', title: 'Community Spotlights', desc: 'Honoring local heroes making a quiet difference every day.' },
            ].map((item, i) => (
              <div key={i} className="bg-black border border-yellow-800/30 hover:border-yellow-600/60 rounded-xl p-5 transition">
                <div className="text-3xl mb-3" dangerouslySetInnerHTML={{__html: item.icon}} />
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center bg-gradient-to-r from-yellow-900/30 to-black border border-yellow-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">Share Your Story</h2>
            <p className="text-gray-400 mb-6">Have a story of resilience, a poem, or a message to share with the MWL community? We want to hear it.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="https://www.instagram.com/basma.tea" target="_blank" rel="noopener noreferrer"
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded-full transition">
                DM on Instagram
              </a>
              <Link href="/mwl" className="bg-transparent border border-yellow-600 hover:border-yellow-400 text-yellow-400 font-semibold px-6 py-3 rounded-full transition">
                Back to MWL
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
