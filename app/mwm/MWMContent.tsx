'use client'

import Image from 'next/image'
import Link from 'next/link'
import ExpandableSection from '@/components/ExpandableSection'
import BotPackageCard from '@/components/BotPackageCard'

export default function MWMContent() {
  return (
    <>
      
      <main className="min-h-screen bg-[#0a0a0a] text-white pt-16">

        {/* ── Hero with background ─────────────────────────────── */}
        <section className="relative max-w-4xl mx-auto px-4 pt-12 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 uppercase tracking-widest">
            📱 Social Media · Content · Growth · AI
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Major Winners{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Marketing
            </span>
          </h1>
          <p className="text-white/50 text-xl max-w-2xl mx-auto leading-relaxed mb-4">
            We grow your brand on social media. Content creation, strategy, and management — powered by real expertise and AI.
          </p>
          <p className="text-white/30 text-sm mb-10">
            By BasmaWorld · Built on 300K+ followers of organic growth experience
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition hover:opacity-90 shadow-lg shadow-blue-900/30">
            📱 Get a Free Consultation
          </Link>
        </section>

        {/* ── Social proof photo strip ─────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { src: '/images/marketing/basma-tiktok-story.jpg', alt: 'TikTok content creation' },
              { src: '/images/marketing/basma-banner.jpg', alt: 'Basma brand banner' },
              { src: '/images/marketing/basma-business.jpg', alt: 'Professional business content' },
              { src: '/images/marketing/basma-ig-academy.jpg', alt: 'Instagram academy growth' },
            ].map((img, i) => (
              <div key={i} className="relative h-48 rounded-2xl overflow-hidden group border border-blue-500/10">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            ))}
          </div>
        </section>

        {/* ── What We Offer ───────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 pb-8">
          <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-3 text-center">How Can We Help Your Brand?</h2>
            <p className="text-white/50 max-w-2xl mx-auto leading-relaxed text-center mb-6">
              We&apos;ve grown a 300K+ following from scratch. Now we use that experience — plus AI tools — to do the same for your business. No fluff, just results.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: '📱', title: 'Social Media Management', desc: 'We run your accounts so you can run your business. Posts, stories, reels — done.' },
                { icon: '🎬', title: 'Content Creation', desc: 'Scroll-stopping videos, graphics, and copy that actually converts.' },
                { icon: '📊', title: 'Growth Strategy', desc: 'Data-driven plans to grow followers, engagement, and revenue.' },
                { icon: '🤖', title: 'AI-Powered Tools', desc: 'Our custom AI assists with content ideas, scheduling, and analytics.' },
                { icon: '🎯', title: 'Brand Identity', desc: 'Logos, color palettes, brand voice — we help you stand out.' },
                { icon: '📈', title: 'Paid Ads', desc: 'Facebook, Instagram, TikTok ads that actually deliver ROI.' },
              ].map((s) => (
                <div key={s.title} className="bg-white/[0.03] border border-blue-500/10 rounded-xl p-4 hover:border-blue-400/30 transition">
                  <span className="text-2xl">{s.icon}</span>
                  <h3 className="text-sm font-bold text-white mt-2">{s.title}</h3>
                  <p className="text-white/40 text-xs mt-1 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Expandable Details ──────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 pb-16 space-y-4">

          <ExpandableSection
            title="Our Process"
            preview="Discovery → Strategy → Content → Growth → Results. Simple and transparent."
            icon="🔄"
            accentColor="#3B82F6"
            defaultOpen
          >
            <div className="space-y-3">
              {[
                { step: '01', title: 'Discovery Call', desc: 'We learn about your brand, goals, and audience. 100% free.', color: '#60A5FA' },
                { step: '02', title: 'Custom Strategy', desc: 'We build a tailored plan — platforms, content types, posting schedule, growth targets.', color: '#34D399' },
                { step: '03', title: 'Content Creation', desc: 'Our team (+ AI tools) creates scroll-stopping content. You approve before anything goes live.', color: '#FBBF24' },
                { step: '04', title: 'Launch & Manage', desc: 'We post, engage, and manage your presence. You focus on your business.', color: '#F472B6' },
                { step: '05', title: 'Report & Optimize', desc: 'Monthly analytics reports. We adjust strategy based on real data.', color: '#A78BFA' },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-4 bg-white/[0.03] rounded-xl p-4">
                  <span className="text-2xl font-bold shrink-0" style={{ color: s.color }}>{s.step}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{s.title}</h4>
                    <p className="text-white/40 text-xs mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ExpandableSection>

          <ExpandableSection
            title="Platforms We Cover"
            preview="TikTok, Instagram, YouTube, Facebook, Twitter/X, LinkedIn, and more."
            icon="🌐"
            accentColor="#06B6D4"
          >
            <div className="flex flex-wrap gap-3">
              {[
                { name: 'TikTok', emoji: '🎵', color: '#00f2ea' },
                { name: 'Instagram', emoji: '📸', color: '#E1306C' },
                { name: 'YouTube', emoji: '📺', color: '#FF0000' },
                { name: 'Facebook', emoji: '📘', color: '#1877F2' },
                { name: 'Twitter/X', emoji: '🐦', color: '#1DA1F2' },
                { name: 'LinkedIn', emoji: '💼', color: '#0A66C2' },
                { name: 'Spotify', emoji: '🎧', color: '#1DB954' },
                { name: 'Pinterest', emoji: '📌', color: '#E60023' },
              ].map((p) => (
                <span key={p.name} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border"
                  style={{ borderColor: `${p.color}30`, color: p.color, background: `${p.color}10` }}>
                  {p.emoji} {p.name}
                </span>
              ))}
            </div>
          </ExpandableSection>

          <ExpandableSection
            title="Why Choose MWM?"
            preview="We built 300K+ followers ourselves. Now we do it for you."
            icon="⭐"
            accentColor="#F59E0B"
          >
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { title: 'Proven Track Record', desc: '300K+ followers built organically. We know what works because we\'ve done it.' },
                { title: 'AI-Enhanced', desc: 'We use custom AI tools for content ideas, optimal posting times, and performance analysis.' },
                { title: 'Las Vegas Local', desc: 'We understand the Las Vegas market. Local businesses are our specialty.' },
                { title: 'Transparent Pricing', desc: 'No hidden fees. No long-term contracts. Results-focused packages.' },
              ].map((item) => (
                <div key={item.title} className="bg-yellow-900/10 border border-yellow-800/30 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-white/40 text-xs mt-1 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </ExpandableSection>
        </section>

        {/* ── MWM Bot Package ────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <BotPackageCard
            botName="MWM Bot"
            botEmoji="📱"
            description="Your AI marketing assistant. Generate content, schedule posts, analyze performance — all from one place."
            accentColor="#3B82F6"
            tiers={[
              {
                name: 'Starter',
                price: '$79',
                period: '/mo',
                features: [
                  'AI content idea generator',
                  'Post scheduling (3 platforms)',
                  'Basic analytics dashboard',
                  'Caption & hashtag suggestions',
                  '50 AI-generated posts/mo',
                ],
              },
              {
                name: 'Growth',
                price: '$199',
                period: '/mo',
                highlight: true,
                badge: 'Best Value',
                features: [
                  'Everything in Starter',
                  'Unlimited platforms',
                  'AI video script generator',
                  'Competitor analysis',
                  'Engagement auto-responses',
                  '200 AI-generated posts/mo',
                ],
              },
              {
                name: 'Agency',
                price: '$499',
                period: '/mo',
                features: [
                  'Everything in Growth',
                  'White-label for your brand',
                  'Multi-client dashboard',
                  'Custom AI personality',
                  'Unlimited posts',
                  'Priority support + strategy calls',
                ],
              },
            ]}
          />
        </section>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-4 pb-20 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to grow your brand?</h2>
          <p className="text-white/40 mb-6">Free consultation. No commitment. Let&apos;s talk about your goals.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition hover:opacity-90">
            📱 Book Free Consultation
          </Link>
        </section>

      </main>
      
    </>
  )
}
