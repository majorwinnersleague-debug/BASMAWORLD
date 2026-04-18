'use client'
import { useState } from 'react'

export default function StripeCheckoutButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Could not start checkout. Please try again.')
        setLoading(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className="bg-[#7B2FBE] hover:bg-[#9333ea] disabled:opacity-60 disabled:cursor-not-allowed
                   text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-200
                   shadow-lg shadow-purple-900/50 hover:shadow-purple-600/40 hover:scale-105
                   active:scale-95 border border-purple-500/40"
        style={{
          background: loading ? '#4a1a7a' : 'linear-gradient(135deg, #7B2FBE 0%, #5b21a0 100%)',
          boxShadow: '0 0 24px rgba(123,47,190,0.4), 0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Preparing checkout…
          </span>
        ) : (
          '🎵 Book Trial Lesson — $29'
        )}
      </button>
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  )
}
