'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface VideoRecord {
  id: string
  videoUrl: string
  status: string
  clipsPosted: number
  platforms: string[]
  processedAt: string
}

interface ClientData {
  name: string
  email: string
  package: string
  platforms: string[]
  videosProcessed: number
  postsPublished: number
  status: string
  videosAllowed: number
}

const PACKAGE_LIMITS: Record<string, number> = {
  Starter: 4,
  Growth: 8,
  Elite: 999,
}

export default function DashboardPage() {
  const params = useSearchParams()
  const sessionId = params.get('session_id') ?? ''

  const [client, setClient] = useState<ClientData | null>(null)
  const [videos, setVideos] = useState<VideoRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!sessionId) { setLoading(false); return }
    fetch(`/api/social-media/dashboard-data?session_id=${sessionId}`)
      .then(r => r.json())
      .then(d => {
        setClient(d.client ?? null)
        setVideos(d.videos ?? [])
      })
      .finally(() => setLoading(false))
  }, [sessionId])

  const handleNewVideo = () => {
    window.location.href = `/social-media/onboarding?session_id=${sessionId}&step=upload`
  }

  const handleReconnect = async () => {
    const res = await fetch('/api/social-media/connect-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
    const data = await res.json()
    if (data.url) window.open(data.url, '_blank')
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="shimmer text-white/40 text-lg">Loading your dashboard…</div>
      </main>
    )
  }

  if (!client) {
    return (
      <main className="min-h-screen px-4 py-16 max-w-2xl mx-auto text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-white mb-3">Dashboard not found</h1>
        <p className="text-white/50 mb-6">We couldn&apos;t find your account. Make sure you&apos;re using the link from your welcome email.</p>
        <Link href="/social-media" className="text-[#8B5CF6] hover:underline">← Back to Social Media</Link>
      </main>
    )
  }

  const limit = PACKAGE_LIMITS[client.package] ?? 4
  const usagePercent = Math.min((client.videosProcessed / limit) * 100, 100)
  const hasQuota = client.videosProcessed < limit

  return (
    <main className="min-h-screen px-4 py-12 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">{client.email}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
          client.status === 'Active' ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]' : 'bg-white/5 border-white/10 text-white/40'
        }`}>
          {client.status}
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Package', value: client.package, color: 'text-[#8B5CF6]' },
          { label: 'Posts Published', value: String(client.postsPublished), color: 'text-[#22C55E]' },
          { label: 'Platforms', value: String(client.platforms.length), color: 'text-[#F59E0B]' },
        ].map(s => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-white/40 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Usage bar */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-white font-semibold text-sm">Monthly Usage</span>
          <span className="text-white/40 text-sm">
            {client.videosProcessed} / {limit === 999 ? '∞' : limit} videos
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${usagePercent >= 90 ? 'bg-red-500' : 'bg-[#8B5CF6]'}`}
            style={{ width: `${usagePercent}%` }}
          />
        </div>
        {!hasQuota && (
          <p className="text-amber-400 text-xs mt-2">Monthly limit reached. Videos reset on your billing date.</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={handleNewVideo}
          disabled={!hasQuota || uploading}
          className="flex-1 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-3 px-4 rounded-xl transition-all glow-purple disabled:opacity-30 disabled:cursor-not-allowed text-sm"
        >
          {uploading ? 'Processing…' : '+ Upload New Video'}
        </button>
        <button
          onClick={handleReconnect}
          className="bg-white/5 border border-white/10 hover:border-white/30 text-white/70 font-medium py-3 px-4 rounded-xl transition-all text-sm"
        >
          Reconnect Accounts
        </button>
      </div>

      {/* Connected platforms */}
      <div className="mb-8">
        <h2 className="text-white font-semibold text-sm mb-3">Connected Platforms</h2>
        <div className="flex flex-wrap gap-2">
          {client.platforms.length > 0 ? (
            client.platforms.map(p => (
              <span key={p} className="bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#c084fc] text-sm px-3 py-1 rounded-full">
                {p}
              </span>
            ))
          ) : (
            <span className="text-white/30 text-sm">No platforms connected yet</span>
          )}
        </div>
      </div>

      {/* Video history */}
      <div>
        <h2 className="text-white font-semibold text-sm mb-4">Your Videos</h2>
        {videos.length === 0 ? (
          <div className="bg-white/3 border border-white/10 rounded-xl p-8 text-center">
            <div className="text-4xl mb-3">🎬</div>
            <p className="text-white/50 text-sm">No videos yet. Upload your first video to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {videos.map(v => (
              <div key={v.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium truncate max-w-[200px]">
                    {v.videoUrl.split('/').pop() ?? 'Video'}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    v.status === 'Posted' ? 'bg-[#22C55E]/10 text-[#22C55E]' :
                    v.status === 'Processing' || v.status === 'Clipping' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                    'bg-white/5 text-white/40'
                  }`}>
                    {v.status === 'Posted' ? `✓ ${v.clipsPosted} clips posted` : v.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/30">
                  <span>{v.platforms.join(', ')}</span>
                  {v.processedAt && <span>· {new Date(v.processedAt).toLocaleDateString()}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </main>
  )
}
