'use client'
import { useState } from 'react'

export default function MWLContactForm() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setStatus('success')
        setForm({ name: '', email: '', company: '', message: '' })
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  return (
    <section className="max-w-2xl mx-auto px-4 pb-20" id="contact">
      <div className="bg-yellow-900/10 border border-yellow-700/40 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-2">🏆 Work With MWL</h2>
        <p className="text-gray-400 mb-6 text-sm">
          Interested in partnering, sponsoring, or connecting with Major Winners League? We&apos;d love to hear from you.
        </p>

        {status === 'success' ? (
          <div className="bg-green-900/30 border border-green-600 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-green-400 font-bold text-lg mb-1">Message received!</h3>
            <p className="text-gray-300 text-sm">Thanks for reaching out. Basma or the MWL team will be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your full name"
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Company / Organization</label>
              <input
                type="text"
                value={form.company}
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                placeholder="Optional"
                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Message *</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Tell us about your project, partnership idea, or inquiry…"
                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition text-sm resize-none"
              />
            </div>
            {errorMsg && (
              <p className="text-red-400 text-sm">{errorMsg}</p>
            )}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed
                         text-black font-bold px-6 py-3 rounded-full transition hover:scale-105 active:scale-95 text-sm"
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Sending…
                </span>
              ) : (
                '🏆 Send Inquiry'
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
