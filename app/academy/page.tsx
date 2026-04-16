import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function Academy() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-20 pb-12 px-4">
        <div className="max-w-5xl mx-auto mt-8">
          <h1 className="text-4xl font-bold text-purple-400 mb-2">🎵 BASMA Music Academy</h1>
          <p className="text-gray-300 text-lg mb-12">Level up your music. Earn XP. Unlock your Skill Tree. Guided by <span className="text-purple-400 font-semibold">Echo</span>, your AI music mentor.</p>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: '🎸', title: 'Music Path', desc: 'Core instrument & theory lessons. Master your craft from fundamentals to performance.', color: 'purple' },
              { icon: '🎨', title: 'Branding Path', desc: 'Music marketing, social media strategy & personal brand building for artists.', color: 'pink' },
              { icon: '💚', title: 'Health Path', desc: 'Artist wellness, performance mindset & the mental game of a music career.', color: 'green' },
            ].map(path => (
              <div key={path.title} className="bg-purple-900/20 border border-purple-800 rounded-2xl p-6 hover:border-purple-600 transition">
                <div className="text-4xl mb-4">{path.icon}</div>
                <h2 className="text-xl font-bold text-white mb-2">{path.title}</h2>
                <p className="text-gray-400 text-sm leading-relaxed">{path.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-purple-900/20 border border-purple-700 rounded-2xl p-8 text-center max-w-xl mx-auto">
            <div className="text-5xl mb-4">🤖</div>
            <h2 className="text-2xl font-bold mb-2">Meet Echo</h2>
            <p className="text-gray-400 mb-6">Your personal AI music mentor. Echo tracks your progress, recommends your next quest, and celebrates every win with you.</p>
            <div className="inline-block bg-purple-700/40 border border-purple-600 rounded-xl px-6 py-3 text-purple-300 text-sm">
              🚀 Full Academy launching soon — join the waitlist below
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
