'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ClientRecord {
  id: string
  name: string
  email: string
  package: string
  platforms: string[]
  status: string
  videosProcessed: number
  postsPublished: number
  subscribedAt: string
  lastProcessedAt: string
  monthlyRevenue: number
}

interface AdminStats {
  totalClients: number
  activeClients: number
  totalRevenue: number
  totalPosts: number
  totalVideos: number
  clientsByPackage: Record<string, number>
}

// ─── Package pricing ───────────────────────────────────────────────────────────

const PACKAGE_REVENUE: Record<string, number> = {
  Starter: 97,
  Growth: 197,
  Elite: 497,
}

// ─── Admin page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [clients, setClients] = useState<ClientRecord[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'cancelled'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchAllClients()
  }, [])

  const fetchAllClients = async () => {
    try {
      const baseId = process.env.NEXT_PUBLIC_AIRTABLE_SOCIAL_BASE
      if (baseId) {
        // Client-side: use admin API
      }

      // Fetch from admin API endpoint
      const res = await fetch('/api/social-media/client-data?admin=true')
      const data = await res.json()

      if (data.clients) {
        processClients(data.clients)
      } else if (data.client) {
        // Single client fallback — admin API not available, show message
        setError('Admin API not configured. Showing available data.')
        processClients(data.client ? [data.client] : [])
      } else {
        // Direct Airtable fetch for admin
        await fetchFromAirtable()
      }
    } catch {
      await fetchFromAirtable()
    } finally {
      setLoading(false)
    }
  }

  const fetchFromAirtable = async () => {
    try {
      // Fetch all clients from the dashboard-data API
      // For admin, we'll use a special endpoint that returns all records
      const res = await fetch('/api/social-media/admin-data')
      if (!res.ok) {
        // Admin data API not available — show setup instructions
        setError(
          'Admin data API not yet deployed. Once it\'s live, you\'ll see all clients, revenue, and posting stats here.'
        )
        return
      }
      const data = await res.json()
      processClients(data.clients ?? [])
    } catch {
      setError(
        'Could not load admin data. The admin API endpoint will be available after the next deployment.'
      )
    }
  }

  const processClients = (raw: ClientRecord[]) => {
    const processed = raw.map(c => ({
      ...c,
      monthlyRevenue: PACKAGE_REVENUE[c.package] ?? 0,
    }))

    setClients(processed)

    // Calculate stats
    const activeClients = processed.filter(c => c.status === 'Active' || c.status === 'Cancelling')
    const clientsByPackage: Record<string, number> = {}
    for (const c of processed) {
      clientsByPackage[c.package] = (clientsByPackage[c.package] ?? 0) + 1
    }

    setStats({
      totalClients: processed.length,
      activeClients: activeClients.length,
      totalRevenue: activeClients.reduce((sum, c) => sum + c.monthlyRevenue, 0),
      totalPosts: processed.reduce((sum, c) => sum + c.postsPublished, 0),
      totalVideos: processed.reduce((sum, c) => sum + c.videosProcessed, 0),
      clientsByPackage,
    })
  }

  // Filter and search
  const filtered = clients.filter(c => {
    if (filter === 'active' && c.status !== 'Active' && c.status !== 'Cancelling') return false
    if (filter === 'cancelled' && c.status !== 'Cancelled') return false
    if (search) {
      const q = search.toLowerCase()
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.package.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <main className="min-h-screen px-4 py-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-white/40 mt-1">Social Media Automation — All Clients</p>
        </div>
        <Link
          href="/social-media"
          className="text-[#8B5CF6] hover:text-[#c084fc] text-sm font-medium transition-colors"
        >
          ← Social Media
        </Link>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-white/40 text-lg shimmer">Loading admin data…</div>
        </div>
      )}

      {error && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-8">
          <p className="text-amber-400 text-sm">{error}</p>
        </div>
      )}

      {!loading && (
        <>
          {/* Stats cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Total Clients', value: String(stats.totalClients), color: 'text-white' },
                { label: 'Active', value: String(stats.activeClients), color: 'text-[#22C55E]' },
                { label: 'MRR', value: `$${stats.totalRevenue.toLocaleString()}`, color: 'text-[#8B5CF6]' },
                { label: 'Posts Published', value: String(stats.totalPosts), color: 'text-[#F59E0B]' },
                { label: 'Videos Processed', value: String(stats.totalVideos), color: 'text-[#3B82F6]' },
              ].map(s => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-white/40 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Package breakdown */}
          {stats && Object.keys(stats.clientsByPackage).length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8">
              <h2 className="text-white font-semibold text-sm mb-4">Revenue by Package</h2>
              <div className="grid grid-cols-3 gap-4">
                {['Starter', 'Growth', 'Elite'].map(pkg => {
                  const count = stats.clientsByPackage[pkg] ?? 0
                  const revenue = count * (PACKAGE_REVENUE[pkg] ?? 0)
                  return (
                    <div key={pkg} className="text-center">
                      <p className="text-white/40 text-xs mb-1">{pkg}</p>
                      <p className="text-white font-bold text-lg">{count} clients</p>
                      <p className="text-[#22C55E] text-sm">${revenue.toLocaleString()}/mo</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Filters + Search */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex gap-2">
              {(['all', 'active', 'cancelled'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === f
                      ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6] text-white'
                      : 'bg-white/5 border border-white/10 text-white/50 hover:text-white/70'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Search clients…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#8B5CF6] transition-colors"
            />
          </div>

          {/* Client table */}
          {filtered.length > 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              {/* Desktop table header */}
              <div className="hidden md:grid grid-cols-[1fr_1fr_100px_80px_80px_100px_90px] gap-4 px-5 py-3 border-b border-white/10 text-white/40 text-xs font-medium uppercase tracking-wider">
                <span>Client</span>
                <span>Email</span>
                <span>Package</span>
                <span>Videos</span>
                <span>Posts</span>
                <span>Revenue</span>
                <span>Status</span>
              </div>

              {/* Rows */}
              {filtered.map(client => (
                <div
                  key={client.id}
                  className="grid grid-cols-1 md:grid-cols-[1fr_1fr_100px_80px_80px_100px_90px] gap-2 md:gap-4 px-5 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  {/* Mobile: stacked layout */}
                  <div className="md:hidden flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{client.name || 'Unknown'}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      client.status === 'Active' ? 'bg-[#22C55E]/10 text-[#22C55E]' :
                      client.status === 'Cancelling' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-white/5 text-white/40'
                    }`}>
                      {client.status}
                    </span>
                  </div>

                  {/* Desktop: columns */}
                  <span className="hidden md:block text-white font-medium text-sm truncate">
                    {client.name || 'Unknown'}
                  </span>
                  <span className="text-white/50 text-sm truncate">{client.email}</span>
                  <span className="text-white/70 text-sm">{client.package}</span>
                  <span className="text-white/50 text-sm">{client.videosProcessed}</span>
                  <span className="text-white/50 text-sm">{client.postsPublished}</span>
                  <span className="text-[#22C55E] text-sm font-medium">
                    ${client.monthlyRevenue}/mo
                  </span>
                  <span className={`hidden md:inline-block text-xs font-bold px-2 py-0.5 rounded-full self-center w-fit ${
                    client.status === 'Active' ? 'bg-[#22C55E]/10 text-[#22C55E]' :
                    client.status === 'Cancelling' ? 'bg-amber-500/10 text-amber-400' :
                    client.status === 'Past Due' ? 'bg-red-500/10 text-red-400' :
                    'bg-white/5 text-white/40'
                  }`}>
                    {client.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-12 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-xl font-bold text-white mb-2">No clients yet</h2>
              <p className="text-white/50 text-sm max-w-md mx-auto">
                When clients subscribe to your social media automation packages,
                they&apos;ll appear here with their stats, revenue, and posting history.
              </p>
            </div>
          )}
        </>
      )}
    </main>
  )
}
