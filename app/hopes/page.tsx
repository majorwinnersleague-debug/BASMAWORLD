import Image from 'next/image'

export const dynamic = 'force-static'
export const revalidate = 86400

const needs = [
  { label: 'Housing', emoji: '🏠' },
  { label: 'Food', emoji: '🍎' },
  { label: 'Mental Health', emoji: '💙' },
  { label: 'Jobs', emoji: '💼' },
  { label: 'Healthcare', emoji: '❤️‍🩹' },
  { label: 'Legal', emoji: '⚖️' },
  { label: 'Education', emoji: '📚' },
  { label: 'Transportation', emoji: '🚌' },
]

export default function HopesChance() {
  return (
    <main className="min-h-screen text-white">

      {/* ── Hero with community photo ──────────────────────────────────────── */}
      <section className="relative h-[60vh] min-h-[420px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/basma/basma-community-event.jpg"
          alt="BasmaWorld community event"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0a0a0a]" />

        {/* Back nav (floating) */}
        <div className="absolute top-0 left-0 px-8 pt-8 z-20">
          <a href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-emerald-300 transition text-sm backdrop-blur-sm bg-black/30 px-3 py-1.5 rounded-full">
            ← Back to BasmaWorld
          </a>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-900/60 border border-emerald-500/40 rounded-full px-5 py-2 mb-6 text-sm text-emerald-300 backdrop-blur-sm">
            💚 Free · Confidential · No judgment
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <span style={{ background: 'linear-gradient(135deg, #34d399, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Hopes Chance
            </span>
          </h1>
          <p className="text-xl text-emerald-200 mb-4 max-w-2xl mx-auto leading-relaxed">
            You deserve support. We&apos;re here to help you find it — fast, free, and without judgment.
          </p>
          <p className="text-white/60 max-w-xl mx-auto">
            Real resources for real people. Whether you&apos;re in crisis or just need a little extra help right now — you&apos;ve come to the right place. 💚
          </p>
        </div>
      </section>

      {/* ── Needs grid ─────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <div
          className="rounded-3xl p-10"
          style={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.1), rgba(168,85,247,0.1))', border: '1px solid rgba(52,211,153,0.3)' }}
        >
          <h2 className="text-2xl font-bold text-white mb-2 text-center">What do you need help with?</h2>
          <p className="text-gray-400 text-center mb-8 text-sm">Tap any category to find resources near you</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {needs.map(({ label, emoji }) => (
              <button
                key={label}
                className="card-hover flex flex-col items-center gap-2 bg-emerald-900/30 hover:bg-emerald-800/50 border border-emerald-600/30 hover:border-emerald-400/60 px-4 py-5 rounded-2xl text-sm font-medium text-emerald-200 transition-all duration-300"
              >
                <span className="text-3xl">{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Community photos ────────────────────────────────────────────────── */}
      <section className="px-6 pb-16 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative h-64 rounded-2xl overflow-hidden group">
            <Image
              src="/images/basma/basma-community-daytime.jpg"
              alt="BasmaWorld community outreach during the day"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white font-semibold text-sm">Community First</p>
              <p className="text-white/60 text-xs mt-1">Real people helping real people — that&apos;s what BasmaWorld is about.</p>
            </div>
          </div>
          <div className="relative h-64 rounded-2xl overflow-hidden group">
            <Image
              src="/images/basma-community.jpg"
              alt="Basma community support"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white font-semibold text-sm">No Judgment, Ever</p>
              <p className="text-white/60 text-xs mt-1">Everyone deserves a second chance. We&apos;re here to help you find yours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reassurance block ──────────────────────────────────────────────── */}
      <section className="px-6 pb-20 max-w-2xl mx-auto text-center">
        <div className="bg-purple-900/20 border border-purple-500/20 rounded-3xl p-8">
          <p className="text-2xl mb-4">💜</p>
          <h3 className="text-xl font-bold text-white mb-3">You are not alone</h3>
          <p className="text-gray-400 leading-relaxed">
            Hopes Chance is a safe space created by BasmaWorld to connect people with real, local resources. Everything here is free, and your privacy is always protected.
          </p>
        </div>
      </section>

    </main>
  )
}
