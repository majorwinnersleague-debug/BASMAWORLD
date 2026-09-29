'use client'

import { FormEvent, useState } from 'react'

export default function OnlineLessonsComingSoon() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('Submitting...')

    try {
      const res = await fetch('/api/online-lessons-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Unable to submit.')
      setStatus('You’re on the list. We’ll let you know when online lessons are available.')
      setName('')
      setEmail('')
      setPhone('')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to submit. Please try again.')
    }
  }

  return (
    <section className="my-12 rounded-3xl border border-[#c9a84c]/30 bg-black/20 p-6 sm:p-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a84c]">
          Coming Soon
        </p>
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">
          Online Lessons
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/60 sm:text-base">
          Online private lessons are coming soon. Join the interest list and we’ll
          contact you when online lessons are ready.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto mt-6 grid max-w-xl gap-3 text-left">
          <input
            aria-label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#c9a84c]/50"
          />
          <input
            aria-label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#c9a84c]/50"
          />
          <input
            aria-label="Phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone (optional)"
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#c9a84c]/50"
          />
          <button
            type="submit"
            className="rounded-xl px-5 py-3 font-semibold text-black transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)' }}
          >
            Notify Me
          </button>
          {status && <p className="text-center text-sm text-white/60">{status}</p>}
        </form>
      </div>
    </section>
  )
}
