import Link from 'next/link'

export default function TikTokBanner() {
  return (
    <section className="border-y border-white/10 bg-white/[0.02] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-white/30 text-xs uppercase tracking-widest mb-1">As seen on TikTok</p>
            <h3 className="text-2xl font-bold text-white">
              270K+ Followers on{' '}
              <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
                @basma_singer
              </span>
            </h3>
            <p className="text-white/40 text-sm mt-1">
              Music education content that actually works — millions of views, thousands of students
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a
              href="https://www.tiktok.com/@basma_singer"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black border border-white/20 hover:border-white/40 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2"
            >
              🎵 @basma_singer
            </a>
            <a
              href="https://www.tiktok.com/@basmateachme"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#22C55E]/10 border border-[#22C55E]/30 hover:border-[#22C55E]/60 text-[#22C55E] px-5 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2"
            >
              🪆 @basmateachme
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
