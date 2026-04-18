export const dynamic = 'force-static'
export const revalidate = 86400

import type { Metadata } from 'next'
import MWLContactForm from '@/components/MWLContactForm'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact BasmaWorld | Book Music Lessons Las Vegas | Get In Touch',
  description: 'Contact Basma Awada and BasmaWorld. Book music lessons, inquire about the Gateway Festival, partnerships, and more. Las Vegas, NV.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-16">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20
                          text-[#8B5CF6] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            ✦ Get In Touch
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact{' '}
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#F59E0B] bg-clip-text text-transparent">
              BasmaWorld
            </span>
          </h1>
          <p className="text-white/40 max-w-md mx-auto">
            Book a lesson, ask about the Gateway Festival, or just say hi.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">

          {/* Left — quick options */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white mb-6">Quick Options</h2>

            {[
              { emoji: '🎵', title: 'Book a Trial Lesson', desc: '$29 — voice, piano, guitar & more', href: '/academy', color: 'border-[#8B5CF6]/30 hover:border-[#8B5CF6]' },
              { emoji: '🎭', title: 'Gateway Festival', desc: 'Oct 24 · Historic Westside School', href: '/gateway', color: 'border-[#F59E0B]/30 hover:border-[#F59E0B]' },
              { emoji: '🤝', title: 'Hopes Chance', desc: 'Free youth resources Las Vegas', href: '/hopes', color: 'border-[#22C55E]/30 hover:border-[#22C55E]' },
              { emoji: '💬', title: 'Chat with Billy', desc: 'Ask our AI assistant anything', href: '/#billy', color: 'border-white/10 hover:border-white/30' },
            ].map((item) => (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-4 bg-white/[0.02] border ${item.color} rounded-xl p-4 transition group`}>
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <p className="font-semibold text-white text-sm group-hover:text-[#8B5CF6] transition">{item.title}</p>
                  <p className="text-white/30 text-xs">{item.desc}</p>
                </div>
                <span className="ml-auto text-white/20 group-hover:text-white/60 transition">→</span>
              </Link>
            ))}

            {/* Direct contact */}
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 mt-4">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Direct Contact</p>
              <div className="space-y-2 text-sm text-white/60">
                <p>📞 (702) 788-7369</p>
                <p>📍 9205 W Russell Rd Bldg 3, Las Vegas NV</p>
                <div className="flex gap-3 pt-2">
                  <a href="https://www.tiktok.com/@basma_singer" target="_blank" rel="noopener noreferrer"
                    className="text-[#8B5CF6] hover:text-[#A78BFA] transition text-xs">@basma_singer</a>
                  <a href="https://www.instagram.com/basma.tea" target="_blank" rel="noopener noreferrer"
                    className="text-[#EC4899] hover:text-pink-400 transition text-xs">@basma.tea</a>
                </div>
              </div>
            </div>
          </div>

          {/* Right — contact form */}
          <div>
            <h2 className="text-lg font-bold text-white mb-6">Send a Message</h2>
            <MWLContactForm />
          </div>

        </div>
      </section>
    </div>
  )
}
