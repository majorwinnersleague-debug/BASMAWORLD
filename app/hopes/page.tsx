import Image from 'next/image'

export const dynamic = 'force-static'
export const revalidate = 86400

const needs = [
  { label: 'Housing' },
  { label: 'Food' },
  { label: 'Mental Health' },
  { label: 'Jobs' },
  { label: 'Healthcare' },
  { label: 'Legal' },
  { label: 'Education' },
  { label: 'Transportation' },
]

export default function HopesChance() {
  return (
    <main className="min-h-screen text-white">

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative h-[60vh] min-h-[420px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/basma/basma-community-event.jpg"
          alt="BasmaWorld community event"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#050505]" />

        {/* Back nav */}
        <div className="absolute top-0 left-0 px-8 pt-8 z-20">
          <a href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#c9a84c] transition text-sm backdrop-blur-sm bg-black/30 px-3 py-1.5 rounded-full">
            ← Back to BasmaWorld
          </a>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-5 py-2 mb-6 text-sm text-white/50 backdrop-blur-sm">
            Free · Confidential · No judgment
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="gradient-gold">Hopes Chance</span>
          </h1>
          <p className="text-xl text-white/60 mb-4 max-w-2xl mx-auto leading-relaxed">
            You deserve support. We&apos;re here to help you find it — fast, free, and without judgment.
          </p>
          <p className="text-white/40 max-w-xl mx-auto">
            Real resources for real people. Whether you&apos;re in crisis or just need a little extra help right now — you&apos;ve come to the right place.
          </p>
        </div>
      </section>

      {/* ── Needs Grid ─────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-3xl mx-auto">
        <div className="glass rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-white mb-2 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            What do you need help with?
          </h2>
          <p className="text-white/40 text-center mb-8 text-sm">Tap any category to find resources near you</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {needs.map(({ label }) => (
              <button
                key={label}
                className="card-premium flex flex-col items-center gap-2 bg-white/[0.03] hover:bg-[rgba(52,211,153,0.08)] border border-white/[0.06] hover:border-[rgba(52,211,153,0.2)] px-4 py-5 rounded-2xl text-sm font-medium text-white/50 hover:text-white/70 transition-all duration-300"
              >
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Community Photos ───────────────────────────────────────────────── */}
      <section className="px-6 pb-16 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative h-64 rounded-2xl overflow-hidden group">
            <Image
              src="/images/basma/basma-community-daytime.jpg"
              alt="BasmaWorld community outreach during the day"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white font-semibold text-sm">Community First</p>
              <p className="text-white/50 text-xs mt-1">Real people helping real people — that&apos;s what BasmaWorld is about.</p>
            </div>
          </div>
          <div className="relative h-64 rounded-2xl overflow-hidden group">
            <Image
              src="/images/basma-community.jpg"
              alt="Basma community support"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white font-semibold text-sm">No Judgment, Ever</p>
              <p className="text-white/50 text-xs mt-1">Everyone deserves a second chance. We&apos;re here to help you find yours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reassurance ────────────────────────────────────────────────────── */}
      <section className="px-6 pb-24 max-w-2xl mx-auto text-center">
        <div className="glass rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            You are not alone
          </h3>
          <p className="text-white/40 leading-relaxed">
            Hopes Chance is a safe space created by BasmaWorld to connect people with real, local resources. Everything here is free, and your privacy is always protected.
          </p>
        </div>
      </section>

    </main>
  )
}
