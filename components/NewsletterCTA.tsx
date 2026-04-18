'use client'
import { useState } from 'react'

export default function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes('@')) return
    setStatus('loading')
    try {
      const res = await fetch('/api/billy-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Newsletter Signup', email, source: 'newsletter-cta' }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="border-t border-white/10 bg-gradient-to-br from-[#8B5CF6]/5 to-transparent py-16">
      <div className="max-w-xl mx-auto px-4 text-center">
        <div className="text-3xl mb-4">📧</div>
        <h2 className="text-2xl font-bold text-white mb-3">
          Stay in the Loop
        </h2>
        <p className="text-white/40 text-sm mb-6">
          Get updates on new lessons, the Gateway Festival, and BasmaWorld news. No spam — ever.
        </p>

        {status === 'success' ? (
          <div className="bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] px-6 py-4 rounded-xl">
            🎉 You&apos;re in! Check your email for a welcome message from Billy.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 bg-white/5 border border-white/10 focus:border-[#8B5CF6] 
                         rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none transition"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 text-white 
                         font-semibold px-6 py-3 rounded-xl transition flex-shrink-0"
            >
              {status === 'loading' ? 'Joining...' : 'Join Free'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-red-400 text-xs mt-2">Something went wrong — please try again.</p>
        )}
      </div>
    </section>
  )
}
