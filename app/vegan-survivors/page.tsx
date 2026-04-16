import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Vegan Survivors | BasmaWorld',
  description: 'Vegan Survivors — vegan recipes, plant-based health tips, and a community for thriving on a plant-based lifestyle in Las Vegas and beyond.',
  keywords: 'vegan recipes Las Vegas, plant-based health, vegan lifestyle, vegan survivors, healthy eating Las Vegas, plant-based diet Nevada',
  openGraph: {
    title: 'Vegan Survivors | BasmaWorld',
    description: 'Vegan recipes, plant-based health tips, and a thriving community for plant-based living.',
    url: 'https://basmaworld.com/vegan-survivors',
    siteName: 'BasmaWorld',
    type: 'website',
  },
}

const recipes = [
  {
    name: 'Power Green Smoothie Bowl',
    time: '10 min',
    tags: ['Breakfast', 'Quick', 'High Protein'],
    desc: 'Spinach, frozen banana, pea protein, and almond milk — topped with granola, berries, and hemp seeds.',
    emoji: '&#129367;'
  },
  {
    name: 'Spicy Chickpea Tacos',
    time: '20 min',
    tags: ['Dinner', 'High Protein', 'Las Vegas Local'],
    desc: 'Smoky, spiced chickpeas in corn tortillas with mango salsa, avocado, and a chipotle lime drizzle.',
    emoji: '&#127790;'
  },
  {
    name: 'Golden Lentil Soup',
    time: '35 min',
    tags: ['Comfort Food', 'Anti-inflammatory', 'Budget Friendly'],
    desc: 'Turmeric, red lentils, coconut milk, and garlic. A warm hug in a bowl that fights inflammation.',
    emoji: '&#127858;'
  },
  {
    name: 'Crispy Tofu Stir Fry',
    time: '25 min',
    tags: ['Dinner', 'High Protein', 'Quick'],
    desc: 'Extra firm tofu, air-fried crispy, tossed in ginger-soy sauce with broccoli and sesame seeds over jasmine rice.',
    emoji: '&#129346;'
  },
]

const healthTips = [
  { icon: '&#128138;', title: 'B12 & D3', desc: 'Essential supplements on a plant-based diet. Take daily for energy and bone health.' },
  { icon: '&#129752;', title: 'Complete Proteins', desc: 'Combine rice + beans, or eat quinoa, tempeh, or edamame for complete amino acid profiles.' },
  { icon: '&#127807;', title: 'Iron Absorption', desc: 'Pair iron-rich foods (legumes, spinach) with vitamin C (citrus, bell peppers) to boost absorption.' },
  { icon: '&#128167;', title: 'Omega-3s', desc: 'Flaxseeds, chia seeds, and walnuts are your plant-based omega-3 powerhouses.' },
]

export default function VeganSurvivors() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-6xl mb-4">&#127807;</div>
            <h1 className="text-5xl font-bold text-orange-400 mb-4">Vegan Survivors</h1>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto">Thriving on plants. Delicious recipes, real health tips, and a community that proves you do not have to sacrifice flavor for health.</p>
            <p className="text-orange-400 font-medium mt-3">Las Vegas &amp; Beyond</p>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Plant-Based Health Essentials</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {healthTips.map((tip, i) => (
                <div key={i} className="bg-orange-900/20 border border-orange-800/50 hover:border-orange-500 rounded-xl p-5 transition">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl" dangerouslySetInnerHTML={{__html: tip.icon}} />
                    <div>
                      <h3 className="font-bold text-orange-300 mb-1">{tip.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{tip.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Survivor Recipes</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {recipes.map((recipe, i) => (
                <div key={i} className="bg-orange-900/10 border border-orange-800/40 hover:border-orange-500 rounded-2xl p-6 transition">
                  <div className="text-4xl mb-3" dangerouslySetInnerHTML={{__html: recipe.emoji}} />
                  <h3 className="text-xl font-bold text-white mb-1">{recipe.name}</h3>
                  <p className="text-orange-400 text-sm mb-3">{recipe.time}</p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{recipe.desc}</p>
                  <div className="flex gap-2 flex-wrap">
                    {recipe.tags.map(tag => (
                      <span key={tag} className="bg-orange-900/40 border border-orange-700 text-orange-300 text-xs px-3 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center bg-gradient-to-r from-orange-900/30 to-black border border-orange-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-orange-400 mb-3">Join the Vegan Survivor Community</h2>
            <p className="text-gray-400 mb-6">Share your recipes, ask questions, and thrive together.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="https://www.instagram.com/basma.tea" target="_blank" rel="noopener noreferrer"
                className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 py-3 rounded-full transition">
                Follow on Instagram
              </a>
              <a href="https://linktr.ee/BASMATea" target="_blank" rel="noopener noreferrer"
                className="bg-transparent border border-orange-600 hover:border-orange-400 text-orange-400 font-semibold px-6 py-3 rounded-full transition">
                All Links
              </a>
              <Link href="/mwl" className="bg-transparent border border-gray-600 hover:border-gray-400 text-gray-400 font-semibold px-6 py-3 rounded-full transition">
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
