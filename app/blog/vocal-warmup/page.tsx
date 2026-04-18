export const dynamic = 'force-static'
export const revalidate = 86400

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'The 10-Minute Vocal Warmup Basma Does Before Every Performance | BasmaWorld',
  description: 'The exact vocal warmup routine from vocal coach Basma Awada. 10 minutes, tested on hundreds of students. Works for all ages and skill levels.',
  keywords: 'vocal warmup routine, singing warmup, vocal exercises, voice warmup before singing, las vegas vocal coach',
}

export default function VocalWarmupPost() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <article className="max-w-2xl mx-auto px-4 pt-20 pb-16">
        <Link href="/blog" className="text-white/30 hover:text-white/60 text-sm transition mb-8 inline-block">← Back to Blog</Link>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[#8B5CF6] text-xs font-semibold uppercase tracking-widest">Vocal Tips</span>
          <span className="text-white/20 text-xs">3 min read</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
          The 10-Minute Warmup Basma Does Before Every Performance
        </h1>
        <p className="text-white/40 text-lg mb-10 leading-relaxed">
          This exact routine has been tested on hundreds of students. It works whether you&apos;re 8 or 58.
        </p>
        <div className="prose prose-invert max-w-none space-y-8 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-xl mb-3">Why warmup matters 🔥</h2>
            <p>Your vocal cords are muscles. Just like you wouldn&apos;t sprint without stretching, you shouldn&apos;t sing full out without warming up first. A proper warmup increases blood flow, improves flexibility, and dramatically reduces your risk of vocal strain or injury.</p>
          </section>
          <section>
            <h2 className="text-white font-bold text-xl mb-3">The 10-minute routine ⏱️</h2>
            <div className="space-y-4">
              {[
                { time: 'Min 1-2', name: 'Lip Trills', desc: 'Blow air through loosely closed lips creating a "brrr" sound. Slide up and down your range slowly. Relaxes the face and connects breath to tone.' },
                { time: 'Min 3-4', name: 'Humming Scales', desc: 'Hum a 5-note scale (do-re-mi-fa-sol-fa-mi-re-do) starting low and moving up by half steps. Warms resonance without strain.' },
                { time: 'Min 5-6', name: 'Siren Slides', desc: 'Make a siren sound ("wee-oo-wee") sliding smoothly from your lowest to highest comfortable note and back. Opens the full range.' },
                { time: 'Min 7-8', name: '"Ng" Exercises', desc: 'Sing scales on the "ng" sound (like the end of "sing"). Excellent for forward resonance placement.' },
                { time: 'Min 9-10', name: 'Staccato Scales', desc: 'Sing "ha-ha-ha-ha-ha" in a bouncy pattern up a scale. Activates the support muscles and wakes up the voice for full singing.' },
              ].map((step) => (
                <div key={step.time} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[#F59E0B] text-xs font-bold">{step.time}</span>
                    <span className="font-semibold text-white">{step.name}</span>
                  </div>
                  <p className="text-sm text-white/50">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-white font-bold text-xl mb-3">Pro tip 💡</h2>
            <p>Do this warmup at the same time every day — even on days you don&apos;t perform or practice. Making it a habit means your voice is always ready. Your morning shower is a perfect time.</p>
          </section>
        </div>
        <div className="mt-12 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-2xl p-6 text-center">
          <p className="text-white font-bold mb-2">Want Basma to walk you through this live?</p>
          <p className="text-white/40 text-sm mb-4">Your $29 trial lesson includes a personalized warmup assessment.</p>
          <Link href="/academy" className="inline-flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-3 rounded-xl font-semibold transition">Book Trial — $29</Link>
        </div>
      </article>
    </div>
  )
}
