'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface ConnectedAccount {
  platform: string
  accountName: string
}

// Platform icon mapping
const PLATFORM_META: Record<string, { icon: string; color: string; label: string }> = {
  tiktok: { icon: '🎵', color: 'border-pink-500/30 bg-pink-500/10 text-pink-300', label: 'TikTok' },
  instagram: { icon: '📸', color: 'border-purple-500/30 bg-purple-500/10 text-purple-300', label: 'Instagram' },
  youtube: { icon: '▶️', color: 'border-red-500/30 bg-red-500/10 text-red-300', label: 'YouTube' },
  facebook: { icon: '📘', color: 'border-blue-500/30 bg-blue-500/10 text-blue-300', label: 'Facebook' },
  linkedin: { icon: '💼', color: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300', label: 'LinkedIn' },
  twitter: { icon: '🐦', color: 'border-sky-500/30 bg-sky-500/10 text-sky-300', label: 'X (Twitter)' },
}

export default function ConnectPage() {
  const params = useSearchParams()
  const sessionId = params.get('session_id') ?? ''
  const clientId = params.get('client_id') ?? ''
  const justConnected = params.get('connected') === 'true'

  const [connectUrl, setConnectUrl] = useState<string | null>(null)
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const identifier = clientId || sessionId

  useEffect(() => {
    if (!identifier) {
      setLoading(false)
      return
    }

    const fetchConnectData = async () => {
      try {
        const res = await fetch('/api/social-media/connect-accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: sessionId || undefined,
            clientId: clientId || undefined,
          }),
        })
        const data = await res.json()

        if (res.ok) {
          setConnectUrl(data.connectUrl ?? null)
          setAccounts(data.connectedAccounts ?? [])
        } else {
          setError(data.error ?? 'Could not load connection data')
        }
      } catch {
        setError('Failed to connect to server')
      } finally {
        setLoading(false)
      }
    }

    fetchConnectData()
  }, [identifier, sessionId, clientId])

  // Auth gate
  if (!identifier) {
    return (
      <main className="min-h-screen px-4 py-16 max-w-2xl mx-auto text-center">
        <div className="text-5xl mb-4">🔗</div>
        <h1 className="text-2xl font-bold text-white mb-3">Connect Your Accounts</h1>
        <p className="text-white/50 mb-6">
          You need a valid session to connect accounts. If you&apos;re a subscriber,
          use the link from your welcome email.
        </p>
        <Link
          href="/social-media"
          className="inline-block bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold px-6 py-3 rounded-xl transition-all"
        >
          Get Started →
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-16 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Connect Accounts</h1>
          <p className="text-white/50 mt-1">
            Link your social media accounts for automatic posting.
          </p>
        </div>
        <Link
          href={`/social-media/dashboard?session_id=${identifier}`}
          className="text-[#8B5CF6] hover:text-[#c084fc] text-sm font-medium transition-colors"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Success banner */}
      {justConnected && (
        <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-xl p-4 mb-8 flex items-center gap-3">
          <span className="text-[#22C55E] text-xl">✓</span>
          <div>
            <p className="text-[#22C55E] font-semibold text-sm">Account connected!</p>
            <p className="text-[#22C55E]/70 text-xs">
              Your social account has been linked. You can connect more accounts below.
            </p>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-white/40 text-lg shimmer">Loading your accounts…</div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8">
          <p className="text-red-400 text-sm">⚠️ {error}</p>
        </div>
      )}

      {!loading && (
        <div className="space-y-8">
          {/* Connected accounts */}
          <div>
            <h2 className="text-white font-semibold text-sm mb-4">
              Connected Accounts
              {accounts.length > 0 && (
                <span className="text-[#22C55E] ml-2">({accounts.length})</span>
              )}
            </h2>

            {accounts.length > 0 ? (
              <div className="grid gap-3">
                {accounts.map((account, i) => {
                  const meta = PLATFORM_META[account.platform.toLowerCase()] ?? {
                    icon: '🌐',
                    color: 'border-white/20 bg-white/5 text-white/70',
                    label: account.platform,
                  }
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-4 p-4 rounded-xl border ${meta.color}`}
                    >
                      <span className="text-2xl">{meta.icon}</span>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{meta.label}</p>
                        {account.accountName && (
                          <p className="text-white/40 text-xs">@{account.accountName}</p>
                        )}
                      </div>
                      <span className="text-[#22C55E] text-xs font-bold bg-[#22C55E]/10 px-2 py-1 rounded-full">
                        Connected
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 text-center">
                <div className="text-4xl mb-3">🔗</div>
                <p className="text-white/50 text-sm">
                  No accounts connected yet. Click below to link your social media platforms.
                </p>
              </div>
            )}
          </div>

          {/* Connect button */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <h2 className="text-xl font-bold text-white mb-2">
              {accounts.length > 0 ? 'Connect More Accounts' : 'Connect Your Social Accounts'}
            </h2>
            <p className="text-white/50 text-sm mb-6">
              Click the button below to securely connect your social media platforms.
              You&apos;ll log into each account — we never see your passwords.
            </p>

            {connectUrl ? (
              <a
                href={connectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold px-8 py-4 rounded-xl transition-all glow-purple"
              >
                {accounts.length > 0 ? 'Connect Another Account →' : 'Connect My Accounts →'}
              </a>
            ) : !error ? (
              <p className="text-white/30 text-sm">
                Connection URL not available. Please try refreshing the page.
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {Object.entries(PLATFORM_META).map(([key, meta]) => (
                <span
                  key={key}
                  className="text-white/30 text-xs flex items-center gap-1.5"
                >
                  <span>{meta.icon}</span> {meta.label}
                </span>
              ))}
            </div>
          </div>

          {/* Security note */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <span>🔒</span> How account connection works
            </h3>
            <div className="space-y-2.5 text-white/50 text-sm">
              <p>
                • We use OAuth (the same login flow used by major apps) — your passwords are never shared with us
              </p>
              <p>
                • Each platform asks you to approve specific permissions (posting only — we don&apos;t read your DMs or private data)
              </p>
              <p>
                • You can disconnect any account at any time from this page or from the platform&apos;s settings
              </p>
              <p>
                • All connections are encrypted and stored securely via Upload-Post&apos;s infrastructure
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
