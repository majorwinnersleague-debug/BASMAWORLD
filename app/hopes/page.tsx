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

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative h-[55vh] min-h-[380px] flex items-center justify-center overflow-hidden">
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
          <a href="/" className="text-white/40 hover:text-[#c9a84c] transition text-sm">
            ← Back
          </a>
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <p className="text-xs text-[#c9a84c]/50 tracking-[0.3em] uppercase mb-6">Free · Confidential · No judgment</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="gradient-gold">Hopes Chance</span>
          </h1>
          <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
            You deserve support. We&apos;re here to help you find it — fast, free, and without judgment.
          </p>
        </div>
      </section>

      {/* ── Needs Grid ───────────────────────────────── */}
      <section className="px-6 py-20 max-w-2xl mx-auto">
        <div className="card-minimal rounded-xl p-8">
          <h2 className="text-xl font-semibold text-white mb-2 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            What do you need help with?
          </h2>
          <p className="text-white/30 text-center mb-8 text-xs">Tap any category to find resources near you</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {needs.map(({ label }) => (
              <button
                key={label}
                className="card-minimal flex items-center justify-center px-4 py-4 rounded-xl text-sm text-white/40 hover:text-white/60 hover:bg-white/[0.04] transition-all duration-200"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Community Photos ─────────────────────────── */}
      <section className="px-6 pb-16 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative h-56 rounded-xl overflow-hidden">
            <Image
              src="/images/basma/basma-community-daytime.jpg"
              alt="BasmaWorld community outreach during the day"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white font-semibold text-sm">Community First</p>
              <p className="text-white/40 text-xs mt-1">Real people helping real people.</p>
            </div>
          </div>
          <div className="relative h-56 rounded-xl overflow-hidden">
            <Image
              src="/images/basma-community.jpg"
              alt="Basma community support"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white font-semibold text-sm">No Judgment, Ever</p>
              <p className="text-white/40 text-xs mt-1">Everyone deserves a second chance.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider max-w-3xl mx-auto" />

      {/* ── Reassurance ──────────────────────────────── */}
      <section className="px-6 py-20 max-w-xl mx-auto text-center">
        <h3 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          You are <span className="gradient-gold">not alone</span>
        </h3>
        <p className="text-white/30 text-sm leading-relaxed">
          Hopes Chance is a safe space created by BasmaWorld to connect people with real, local resources. Everything here is free, and your privacy is always protected.
        </p>
      </section>

    </main>
  )
}
