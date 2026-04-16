'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const CATEGORIES = [
  'Housing', 'Food Support', 'Mental Health', 'Job Training',
  'Healthcare', 'Legal', 'Education', 'Transportation',
  'Financial', 'Childcare', 'Employment', 'Crisis Intervention'
]

type Resource = {
  name: string
  address?: string
  phone?: string
  website?: string
  howToAccess?: string
  mapsLink?: string
}

export default function HopesChance() {
  const [selected, setSelected] = useState<string | null>(null)
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSelect(category: string) {
    setSelected(category)
    setLoading(true)
    setError(null)
    setResources([])
    try {
      const res = await fetch(`/api/resources?category=${encodeURIComponent(category)}`)
      const data = await res.json()
      if (data.resources?.length) {
        setResources(data.resources)
      } else {
        setError('No resources found for this category right now. Call 211 for immediate help.')
      }
    } catch {
      setError('Unable to load resources. Please call 211 for immediate assistance.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-20 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-green-400 mb-2 mt-8">🤝 Hopes Chance</h1>
          <p className="text-gray-300 text-lg mb-8">Find free resources for housing, jobs, mental health & more.<br/>
            <span className="text-green-400 font-medium">Confidential. No judgment. For ages 16–30.</span>
          </p>
          <h2 className="text-lg font-semibold mb-4 text-gray-200">What do you need help with?</h2>
          <div className="flex flex-wrap gap-3 mb-8">
            {CATEGORIES.map(cat => (
              <button key={cat}
                onClick={() => handleSelect(cat)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition
                  ${selected === cat
                    ? 'bg-green-600 border-green-500 text-white'
                    : 'bg-green-900/30 border-green-700 text-green-300 hover:bg-green-800/50'}`}>
                {cat}
              </button>
            ))}
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-400">Finding resources...</p>
            </div>
          )}

          {error && (
            <div className="bg-yellow-900/30 border border-yellow-700 rounded-xl p-4 text-yellow-300">
              ⚠️ {error}
            </div>
          )}

          {resources.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-200">{resources.length} resource{resources.length !== 1 ? 's' : ''} found for <span className="text-green-400">{selected}</span></h3>
              {resources.map((r, i) => (
                <div key={i} className="bg-green-900/20 border border-green-800 rounded-xl p-5">
                  <h4 className="font-bold text-white text-lg mb-1">{r.name}</h4>
                  {r.address && <p className="text-gray-400 text-sm mb-1">📍 {r.address}</p>}
                  {r.phone && <p className="text-gray-400 text-sm mb-1">📞 {r.phone}</p>}
                  {r.howToAccess && <p className="text-gray-300 text-sm mb-3">ℹ️ {r.howToAccess}</p>}
                  <div className="flex gap-3 flex-wrap">
                    {r.mapsLink && <a href={r.mapsLink} target="_blank" rel="noopener noreferrer" className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-full transition">📍 Get Directions</a>}
                    {r.website && <a href={r.website} target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-full transition">🌐 Website</a>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
