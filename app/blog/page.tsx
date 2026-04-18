export const dynamic = 'force-static'
export const revalidate = 86400

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Music Tips & Blog | BasmaWorld | Las Vegas Vocal Coach Basma Awada',
  description: 'Free music tips, singing advice, and vocal coaching insights from Basma Awada. Learn how to sing, improve your voice, and grow as an artist.',
}

const posts = [
  {
    slug: 'how-to-sing-better',
    title: '5 Things Every Beginner Singer Needs to Know',
    excerpt: 'Before you can sound good, you need to understand these five fundamentals. Most teachers skip them. We don't.',
    category: 'Vocal Tips',
    color: 'text-[#8B5CF6]',
    emoji: '🎤',
    readTime: '4 min read',
  },
  {
    slug: 'breath-control',
    title: 'Why Breath Control Is the Foundation of Everything',
    excerpt: 'Your voice is only as strong as your breath support. Here's the simple exercise that changes everything in week one.',
    category: 'Technique',
    color: 'text-[#F59E0B]',
    emoji: '🌬️',
    readTime: '3 min read',
  },
  {
    slug: 'stage-fright',
    title: 'Stage Fright Is a Liar — Here's the Proof',
    excerpt: 'Every performer feels it. The ones who succeed have learned one reframe that turns terror into energy.',
    category: 'Mindset',
    color: 'text-[#EC4899]',
    emoji: '🎭',
    readTime: '5 min read',
  },
  {
    slug: 'kids-music-lessons',
    title: 'When Should Your Child Start Music Lessons?',
    excerpt: 'The answer isn't "as early as possible." Here's what the research actually says — and what to look for.',
    category: 'For Parents',
    color: 'text-[#22C55E]',
    emoji: '👨‍👧',
    readTime: '4 min read',
  },
  {
    slug: 'vocal-warmup',
    title: 'The 10-Minute Warmup Basma Does Before Every Performance',
    excerpt: 'This exact routine has been tested on hundreds of students. It works whether you're 8 or 58.',
    category: 'Vocal Tips',
    color: 'text-[#8B5CF6]',
    emoji: '🔥',
    readTime: '3 min read',
  },
  {
    slug: 'las-vegas-music-scene',
    title: 'Breaking Into the Las Vegas Music Scene in 2026',
    excerpt: 'Las Vegas is one of the most competitive — and most opportunity-rich — music markets in the world. Here's how to navigate it.',
    category: 'Music Business',
    color: 'text-[#F59E0B]',
    emoji: '🎰',
    readTime: '6 min read',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-16">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20
                          text-[#8B5CF6] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            ✦ Music Tips & Insights
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The BasmaWorld{' '}
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#F59E0B] bg-clip-text text-transparent">
              Blog
            </span>
          </h1>
          <p className="text-white/40 max-w-md mx-auto">
            Free tips from 8 years of teaching. No fluff — just what actually works.
          </p>
        </div>

        {/* Posts grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white/[0.02] border border-white/10 hover:border-white/20 rounded-2xl p-6 flex flex-col gap-3 transition hover:bg-white/[0.04]"
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${post.color} uppercase tracking-widest`}>
                  {post.category}
                </span>
                <span className="text-white/20 text-xs">{post.readTime}</span>
              </div>
              <div className="text-3xl">{post.emoji}</div>
              <h2 className="font-bold text-white text-lg leading-tight group-hover:text-[#8B5CF6] transition">
                {post.title}
              </h2>
              <p className="text-white/40 text-sm leading-relaxed flex-1">{post.excerpt}</p>
              <span className="text-[#8B5CF6] text-sm font-medium mt-auto">Read more →</span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-white/[0.02] border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-3">Ready to go beyond reading?</h2>
          <p className="text-white/40 text-sm mb-6">Book a trial lesson and put these tips into practice with Basma directly.</p>
          <Link href="/academy"
            className="inline-flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-3 rounded-xl font-semibold transition">
            🎵 Book $29 Trial Lesson
          </Link>
        </div>

      </section>
    </div>
  )
}
