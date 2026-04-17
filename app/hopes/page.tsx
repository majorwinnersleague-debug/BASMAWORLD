'use client'
import { useState } from 'react'
import posthog from 'posthog-js'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const CATEGORIES = [
  { label: '🏠 Housing', value: 'Housing' },
  { label: '🏡 Shelter', value: 'Shelter/Housing' },
  { label: '🍎 Food', value: 'Food Support' },
  { label: '🧠 Mental Health', value: 'Mental Health' },
  { label: '💼 Job Training', value: 'Job Training' },
  { label: '💊 Healthcare', value: 'Healthcare' },
  { label: '⚖️ Legal Help', value: 'Legal Assistance' },
  { label: '💰 Financial', value: 'Financial' },
  { label: '🚨 Crisis', value: 'Crisis Intervention' },
  { label: '👶 Childcare', value: 'Childcare' },
  { label: '🌍 Immigration', value: 'Immigration Services' },
  { label: '🎖️ Veterans', value: 'Veteran Services' },
  { label: '🌱 Youth Programs', value: 'Youth Programs' },
  { label: '👨‍👩‍👧 Family Support', value: 'Family Support' },
  { label: '♿ Disability', value: 'Disability Services' },
  { label: '💪 Employment', value: 'Employment' },
]

type Resource = {
  name: string
  description?: string
  address?: string
  phone?: string
  website?: string
  howToAccess?: string
  mapsLink?: string
}

export default function HopesChance() {
  const [selected, setSelected] = useState<string | null>(null)
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSelect(value: string, label: string) {
    setSelected(value)
    setSelectedLabel(label)
    setLoading(true)
    setError(null)
    setResources([])

    // Track category search
    posthog.capture('hopes_chance_search', { category: value, category_label: label })

    try {
      const res = await fetch(`/api/resources?category=${encodeURIComponent(value)}`)
      const data = await res.json()
      if (data.resources?.length) {
        setResources(data.resources)
        posthog.capture('hopes_chance_search_results', {
          category: value,
          category_label: label,
          result_count: data.resources.length,
        })
      } else {
        setError('No resources found for this category right now. Call 211 for immediate help.')
        // Track no-results event for Viktor alerting
        posthog.capture('hopes_chance_search_no_results', {
          category: value,
          category_label: label,
        })
      }
    } catch {
      setError('Unable to load resources. Please call 211 for immediate assistance.')
      posthog.capture('hopes_chance_search_error', {
        category: value,
        category_label: label,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">🤝</div>
            <h1 className="text-4xl font-bold text-green-400 mb-3">Hopes Chance</h1>
            <p className="text-gray-300 text-lg mb-2">
              Free resources for housing, jobs, mental health &amp; more.
            </p>
            <p className="text-green-400 font-semibold">Confidential. No judgment. For ages 16–30.</p>
            <p className="text-gray-500 text-sm mt-2">Las Vegas, Nevada · Youth Resource Navigator</p>
          </div>

          <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-8 text-center">
            <p className="text-red-300 font-semibold">
              In crisis? Call <a href="tel:211" className="underline text-white">211</a> or text HOME to 741741 — free, 24/7
            </p>
          </div>

          <h2 className="text-lg font-semibold mb-4 text-gray-200">What do you need help with?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {CATEGORIES.map(cat => (
              <button key={cat.value}
                onClick={() => handleSelect(cat.value, cat.label)}
                className={`px-4 py-3 rounded-xl border text-sm font-medium transition text-left
                  ${selected === cat.value
                    ? 'bg-green-600 border-green-500 text-white'
                    : 'bg-green-900/30 border-green-700 text-green-300 hover:bg-green-800/50'}`}>
                {cat.label}
              </button>
            ))}
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-400">Finding resources near you...</p>
            </div>
          )}

          {error && !loading && (
            <div className="bg-yellow-900/30 border border-yellow-700 rounded-xl p-4 text-yellow-300">
              {error}
            </div>
          )}

          {resources.length > 0 && !loading && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-200">
                {resources.length} resource{resources.length !== 1 ? 's' : ''} found for{' '}
                <span className="text-green-400">{selectedLabel}</span>
              </h3>
              {resources.map((r, i) => (
                <div key={i} className="bg-green-900/20 border border-green-800 rounded-xl p-5">
                  <h4 className="font-bold text-white text-lg mb-1">{r.name}</h4>
                  {r.description && <p className="text-gray-400 text-sm mb-2">{r.description}</p>}
                  {r.address && <p className="text-gray-400 text-sm mb-1">📍 {r.address}</p>}
                  {r.phone && (
                    <p className="text-gray-400 text-sm mb-1">
                      📞 <a href={`tel:${r.phone}`} className="hover:text-white underline">{r.phone}</a>
                    </p>
                  )}
                  {r.howToAccess && <p className="text-gray-300 text-sm mb-3">ℹ️ {r.howToAccess}</p>}
                  <div className="flex gap-3 flex-wrap mt-2">
                    {r.mapsLink && (
                      <a href={r.mapsLink} target="_blank" rel="noopener noreferrer"
                        className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-full transition">
                        📍 Get Directions
                      </a>
                    )}
                    {r.website && (
                      <a href={r.website} target="_blank" rel="noopener noreferrer"
                        className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-full transition">
                        🔗 Website
                      </a>
                    )}
                    {r.phone && (
                      <a href={`tel:${r.phone}`}
                        className="bg-blue-800 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-full transition">
                        📞 Call Now
                      </a>
                    )}
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
