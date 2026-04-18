export const dynamic = 'force-static'
export const revalidate = 86400

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Vegan Survivors | MWL Gaming & Community | BasmaWorld',
  description: 'Vegan Survivors — a Major Winners League gaming community initiative. Fun, food, and community under the MWL banner.',
}

export default function VeganSurvivorsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-6">🥦</div>
      <div className="inline-flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
        ✦ MWL · Gaming & Community
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Vegan <span className="text-[#22C55E]">Survivors</span>
      </h1>
      <p className="text-white/40 max-w-md mb-8 leading-relaxed">
        A Major Winners League community gaming initiative. More details coming soon — follow @basma_singer on TikTok for updates!
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <a
          href="https://www.tiktok.com/@basma_singer"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          Follow @basma_singer
        </a>
        <Link
          href="/mwl"
          className="border border-white/20 hover:border-white/40 text-white/60 hover:text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          ← Back to MWL
        </Link>
      </div>
    </div>
  )
}
