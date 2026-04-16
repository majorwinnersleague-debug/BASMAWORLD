import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Vegan Survivors — Plant-Based Recipes & Health Tips | BasmaWorld',
  description: 'Vegan Survivors — plant-based recipes, health tips, exercises and wellness content. Vegan lifestyle by Basma in Las Vegas.',
}

export default function VeganSurvivors() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-16">

        {/* Hero */}
        <section className="relative h-[60vh] flex items-end pb-16 px-4">
          <div className="absolute inset-0">
            <img src="/images/basma-vegan.jpg" alt="Vegan Survivors plant-based lifestyle Las Vegas"
              className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center w-full">
            <p className="text-orange-400 font-bold uppercase tracking-widest text-sm mb-3">Plant-Based Living</p>
            <h1 className="text-5xl font-bold text-white mb-3">🥦 Vegan Survivors</h1>
            <p className="text-gray-300 text-lg">Real recipes. Real health. No compromise.</p>
          </div>
        </section>

        {/* Content grid */}
        <section className="max-w-5xl mx-auto px-4 py-20">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: '🥗', title: 'Recipes', desc: 'Delicious plant-based meals that actually taste amazing. Quick, easy, and nutritious.' },
              { icon: '💪', title: 'Health Tips', desc: 'Evidence-based wellness advice for living your best plant-powered life.' },
              { icon: '🏃', title: 'Exercise', desc: 'Fitness routines and movement practices to complement your healthy lifestyle.' },
            ].map(c => (
              <div key={c.title} className="bg-orange-900/20 border border-orange-800 rounded-2xl p-6 hover:bg-orange-900/30 transition">
                <div className="text-4xl mb-4">{c.icon}</div>
                <h2 className="text-xl font-bold text-white mb-2">{c.title}</h2>
                <p className="text-gray-400 text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* YouTube CTA */}
          <div className="bg-orange-900/20 border border-orange-700 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">▶️</div>
            <h2 className="text-2xl font-bold mb-3">Watch on YouTube</h2>
            <p className="text-gray-400 mb-6">Full recipe videos, health deep-dives, and more on the Vegan Survivors YouTube channel.</p>
            <a href="https://www.youtube.com/@VeganSurvivors" target="_blank" rel="noopener noreferrer"
              className="bg-orange-600 hover:bg-orange-500 px-8 py-3 rounded-full font-bold transition inline-block">
              🥦 Visit Vegan Survivors on YouTube
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
