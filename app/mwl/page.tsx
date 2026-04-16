'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function MWL() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', company: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-20 pb-12 px-4">
        <div className="max-w-3xl mx-auto mt-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">🏆 Major Winners League</h1>
          <p className="text-gray-300 text-lg mb-12">Content agency & marketing that gets results. Let's grow your brand.</p>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: '📣', title: 'Content Strategy', desc: 'Full content plans built around your audience and goals' },
              { icon: '📈', title: 'Lead Generation', desc: 'Apollo-powered outreach that fills your pipeline' },
              { icon: '🎬', title: 'Video Production', desc: 'Short-form content optimized for every platform' },
            ].map(s => (
              <div key={s.title} className="bg-yellow-900/20 border border-yellow-800 rounded-xl p-5">
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-bold text-white mb-1">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-yellow-900/20 border border-yellow-800 rounded-2xl p-8 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Work with us</h2>
            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎉</div>
                <p className="text-green-400 font-semibold text-lg">We got your message!</p>
                <p className="text-gray-400 mt-2">We'll be in touch within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  type="text" placeholder="Your Name"
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500" />
                <input required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  type="email" placeholder="Email Address"
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500" />
                <input value={form.company} onChange={e => setForm({...form, company: e.target.value})}
                  type="text" placeholder="Company / Brand"
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500" />
                <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                  placeholder="Tell us about your project..."
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white h-28 focus:outline-none focus:border-yellow-500" />
                {status === 'error' && <p className="text-red-400 text-sm">Something went wrong. Please try again or email us directly.</p>}
                <button type="submit" disabled={status === 'loading'}
                  className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-bold py-3 rounded-lg transition">
                  {status === 'loading' ? 'Sending...' : 'Submit Inquiry →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
