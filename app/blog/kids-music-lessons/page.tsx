export const dynamic = 'force-static'
export const revalidate = 86400

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'When Should Your Child Start Music Lessons? | BasmaWorld Las Vegas',
  description: 'The right age to start music lessons for kids — what the research says, what to look for in a teacher, and how to know your child is ready. From Basma Awada.',
  keywords: 'kids music lessons las vegas, when to start music lessons, children singing lessons, music lessons for kids las vegas, best age to start piano',
}

export default function KidsMusicLessonsPost() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <article className="max-w-2xl mx-auto px-4 pt-20 pb-16">
        <Link href="/blog" className="text-white/30 hover:text-white/60 text-sm transition mb-8 inline-block">← Back to Blog</Link>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[#22C55E] text-xs font-semibold uppercase tracking-widest">For Parents</span>
          <span className="text-white/20 text-xs">4 min read</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
          When Should Your Child Start Music Lessons?
        </h1>
        <p className="text-white/40 text-lg mb-10 leading-relaxed">
          The answer isn&apos;t &quot;as early as possible.&quot; Here&apos;s what the research actually says — and what to look for.
        </p>
        <div className="prose prose-invert max-w-none space-y-8 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-xl mb-3">The short answer 🎯</h2>
            <p>Most children are ready for structured music lessons between ages <strong className="text-white">5 and 7</strong>. But readiness depends less on age and more on attention span, fine motor development, and genuine interest — not parental pressure.</p>
          </section>
          <section>
            <h2 className="text-white font-bold text-xl mb-3">Signs your child is ready 🌱</h2>
            <ul className="space-y-2">
              {['Can sit focused on a single activity for 15-20 minutes', 'Shows genuine interest in music (sings along, asks about instruments)', 'Can follow 2-3 step instructions', 'Fine motor skills are developing (can hold a pencil, stack blocks)', 'Wants to learn — not just because you want them to'].map((sign) => (
                <li key={sign} className="flex items-start gap-2"><span className="text-[#22C55E] mt-0.5">✓</span><span>{sign}</span></li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-white font-bold text-xl mb-3">By instrument 🎹</h2>
            <div className="space-y-3">
              {[
                { instrument: '🎹 Piano', age: 'Age 5-6+', note: 'Great first instrument. Develops both hands, music reading, theory.' },
                { instrument: '🎤 Voice/Singing', age: 'Age 6-7+', note: 'Earlier is fine for exploration, but structured technique at 6-7 prevents strain.' },
                { instrument: '🎸 Guitar', age: 'Age 7-8+', note: 'Finger strength needed. Ukulele is a great starter at age 5-6.' },
                { instrument: '🥁 Drums', age: 'Age 5+', note: 'Excellent for coordination and rhythm. Kids often take to it naturally.' },
                { instrument: '🎻 Violin', age: 'Age 4-5+', note: 'Suzuki method allows very early start. Requires patient teacher.' },
              ].map((item) => (
                <div key={item.instrument} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-white text-sm">{item.instrument}</span>
                    <span className="text-[#F59E0B] text-xs font-bold">{item.age}</span>
                  </div>
                  <p className="text-xs text-white/50">{item.note}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-white font-bold text-xl mb-3">What matters most 💜</h2>
            <p>The best music teacher is one your child connects with. A technically brilliant teacher who makes your child dread lessons is worse than a warm, encouraging teacher who makes them excited to practice. At BasmaWorld, we match students with teachers based on personality first, technique second.</p>
          </section>
        </div>
        <div className="mt-12 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-2xl p-6 text-center">
          <p className="text-white font-bold mb-2">Not sure if your child is ready? Let&apos;s find out together.</p>
          <p className="text-white/40 text-sm mb-4">The $29 trial lesson includes a readiness assessment and instrument recommendation.</p>
          <Link href="/academy" className="inline-flex items-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-white px-6 py-3 rounded-xl font-semibold transition">Book Trial — $29</Link>
        </div>
      </article>
    </div>
  )
}
