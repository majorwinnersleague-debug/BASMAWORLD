'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ConnectedAccount {
  platform: string
  accountName: string
}

interface VideoRecord {
  id: string
  videoUrl: string
  status: string
  clipsPosted: number
  platforms: string[]
  processedAt: string
}

interface ClientData {
  id: string
  name: string
  email: string
  package: string
  platforms: string[]
  videosProcessed: number
  postsPublished: number
  videosAllowed: number
  status: string
  subscribedAt: string
  lastProcessedAt: string
  connectedAccounts: ConnectedAccount[]
  videos: VideoRecord[]
}

// ─── Platform icons ────────────────────────────────────────────────────────────

const PLATFORM_ICONS: Record<string, string> = {
  tiktok: '🎵',
  instagram: '📸',
  youtube: '▶️',
  facebook: '📘',
  linkedin: '💼',
  twitter: '🐦',
}

function platformIcon(platform: string): string {
  const key = platform.toLowerCase().replace(/\s*(reels|shorts)\s*/gi, '')
  return PLATFORM_ICONS[key] ?? '🌐'
}

// ─── Package limits ────────────────────────────────────────────────────────────

const PACKAGE_LIMITS: Record<string, number> = {
  Starter: 4,
  Growth: 8,
  Elite: 999,
}

// ─── Dashboard page ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const params = useSearchParams()
  const sessionId = params.get('session_id') ?? ''
  const clientId = params.get('client_id') ?? ''

  const [client, setClient] = useState<ClientData | null>(null)
  const [loading, setLoading] = useState(true)

  const identifier = clientId || sessionId

  useEffect(() => {
    if (!identifier) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        // Use the comprehensive client-data endpoint
        const query = clientId
          ? `client_id=${encodeURIComponent(clientId)}`
          : `session_id=${encodeURIComponent(sessionId)}`
        const res = await fetch(`/api/social-media/client-data?${query}`)
        const data = await res.json()

        if (data.client) {
          setClient({
            ...data.client,
            videosAllowed: PACKAGE_LIMITS[data.client.package] ?? 8,
            videos: data.client.videos ?? [],
            connectedAccounts: data.client.connectedAccounts ?? [],
          })
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [identifier, sessionId, clientId])

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
        <p className="text-white/50 mb-6">
          We couldn&apos;t find your account. Make sure you&apos;re using the link
          from your welcome email.
        </p>
        <Link
          href="/social-media"
          className="text-[#8B5CF6] hover:underline"
        >
          ← Back to Social Media
        </Link>
      </main>
    )
  }

  const limit = client.videosAllowed
  const usagePercent = Math.min((client.videosProcessed / limit) * 100, 100)
  const hasQuota = client.videosProcessed < limit

  return (
    <main className="min-h-screen px-4 py-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {client.name ? `Welcome back, ${client.name.split(' ')[0]}` : 'Your Dashboard'}
          </h1>
          <p className="text-white/40 text-sm mt-1">{client.email}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ${
            client.status === 'Active'
              ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]'
              : client.status === 'Cancelling'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : 'bg-white/5 border-white/10 text-white/40'
          }`}
        >
          {client.status}
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Package', value: client.package, color: 'text-[#8B5CF6]' },
          { label: 'Posts Published', value: String(client.postsPublished), color: 'text-[#22C55E]' },
          { label: 'Videos Processed', value: String(client.videosProcessed), color: 'text-[#3B82F6]' },
          {
            label: 'Accounts Connected',
            value: String(client.connectedAccounts.length),
            color: 'text-[#F59E0B]',
          },
        ].map(s => (
          <div
            key={s.label}
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
          >
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-white/40 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Monthly usage bar */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-white font-semibold text-sm">Monthly Usage</span>
          <span className="text-white/40 text-sm">
            {client.videosProcessed} / {limit === 999 ? '∞' : limit} videos
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              usagePercent >= 90 ? 'bg-red-500' : 'bg-[#8B5CF6]'
            }`}
            style={{ width: `${usagePercent}%` }}
          />
        </div>
        {!hasQuota && (
          <p className="text-amber-400 text-xs mt-2">
            Monthly limit reached. Videos reset on your billing date.
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <Link
          href={`/social-media/upload?${clientId ? `client_id=${clientId}` : `session_id=${sessionId}`}`}
          className={`flex items-center justify-center gap-2 font-bold py-3.5 px-4 rounded-xl transition-all text-sm text-center ${
            hasQuota
              ? 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white glow-purple'
              : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
          }`}
        >
          📤 Upload Video
        </Link>
        <Link
          href={`/social-media/connect?${clientId ? `client_id=${clientId}` : `session_id=${sessionId}`}`}
          className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-white/30 text-white/70 font-medium py-3.5 px-4 rounded-xl transition-all text-sm"
        >
          🔗 Connect Accounts
        </Link>
        <Link
          href="/social-media"
          className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-white/30 text-white/70 font-medium py-3.5 px-4 rounded-xl transition-all text-sm"
        >
          💎 Manage Plan
        </Link>
      </div>

      {/* Connected accounts section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-sm">Connected Accounts</h2>
          <Link
            href={`/social-media/connect?${clientId ? `client_id=${clientId}` : `session_id=${sessionId}`}`}
            className="text-[#8B5CF6] hover:text-[#c084fc] text-xs font-medium transition-colors"
          >
            + Add Account
          </Link>
        </div>

        {client.connectedAccounts.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {client.connectedAccounts.map((acc, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#c084fc] text-sm px-3 py-1.5 rounded-full"
              >
                <span>{platformIcon(acc.platform)}</span>
                <span>{acc.accountName || acc.platform}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-dashed border-white/10 rounded-xl p-6 text-center">
            <p className="text-white/40 text-sm mb-3">
              No accounts connected yet. Connect your social accounts to enable auto-posting.
            </p>
            <Link
              href={`/social-media/connect?${clientId ? `client_id=${clientId}` : `session_id=${sessionId}`}`}
              className="text-[#8B5CF6] hover:text-[#c084fc] text-sm font-medium"
            >
              Connect accounts →
            </Link>
          </div>
        )}
      </div>

      {/* Video history */}
      <div>
        <h2 className="text-white font-semibold text-sm mb-4">Your Videos</h2>
        {client.videos.length === 0 ? (
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 text-center">
            <div className="text-4xl mb-3">🎬</div>
            <p className="text-white/50 text-sm mb-3">
              No videos yet. Upload your first video to get started.
            </p>
            <Link
              href={`/social-media/upload?${clientId ? `client_id=${clientId}` : `session_id=${sessionId}`}`}
              className="text-[#8B5CF6] hover:text-[#c084fc] text-sm font-medium"
            >
              Upload a video →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {client.videos.map(v => (
              <div
                key={v.id}
                className="bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium truncate max-w-[250px]">
                    {v.videoUrl.split('/').pop()?.split('?')[0] ?? 'Video'}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      v.status === 'Posted'
                        ? 'bg-[#22C55E]/10 text-[#22C55E]'
                        : v.status === 'Processing' || v.status === 'Clipping'
                        ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                        : v.status === 'No Clips Found'
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-white/5 text-white/40'
                    }`}
                  >
                    {v.status === 'Posted'
                      ? `✓ ${v.clipsPosted} clips posted`
                      : v.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/30">
                  <span>
                    {v.platforms.map(p => `${platformIcon(p)} ${p}`).join(', ') || 'All platforms'}
                  </span>
                  {v.processedAt && (
                    <span>
                      · {new Date(v.processedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick help */}
      <div className="mt-10 bg-white/[0.03] border border-white/10 rounded-xl p-5">
        <h3 className="text-white font-semibold text-sm mb-3">How It Works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/50">
          <div className="flex items-start gap-2">
            <span>1️⃣</span>
            <span>Upload a video — any length, any format</span>
          </div>
          <div className="flex items-start gap-2">
            <span>2️⃣</span>
            <span>AI picks the best clips & writes captions</span>
          </div>
          <div className="flex items-start gap-2">
            <span>3️⃣</span>
            <span>Clips auto-post to your connected accounts</span>
          </div>
          <div className="flex items-start gap-2">
            <span>4️⃣</span>
            <span>You get an email when everything&apos;s posted</span>
          </div>
        </div>
      </div>
    </main>
  )
}
