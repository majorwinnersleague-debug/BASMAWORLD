'use client'

import Link from 'next/link'
import ExpandableSection from '@/components/ExpandableSection'
import BotPackageCard from '@/components/BotPackageCard'

export default function MWLContent() {
  return (
    <>
      
      <main className="min-h-screen text-white pt-16">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 pt-12 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 uppercase tracking-widest">
            🏆 Community · Impact · Gaming · Motivation
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Major Winners{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              League
            </span>
          </h1>
          <p className="text-white/50 text-xl max-w-2xl mx-auto leading-relaxed mb-4">
            We build community, serve youth, and create content that inspires. Las Vegas proud.
          </p>

          {/* Value Props */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mt-8">
            {[
              { icon: '🤝', label: 'Youth Resources' },
              { icon: '🎮', label: 'Gaming' },
              { icon: '🎙️', label: 'Podcasts' },
              { icon: '💛', label: 'Motivation' },
            ].map((item) => (
              <div key={item.label} className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-3 text-center">
                <span className="text-2xl">{item.icon}</span>
                <p className="text-white/50 text-xs mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── What We Offer ───────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 pb-8">
          <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-2xl p-6 md:p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">What is MWL?</h2>
            <p className="text-white/50 max-w-2xl mx-auto leading-relaxed">
              Major Winners League is the community arm of BasmaWorld. We cover Las Vegas from the Historic Westside to Nevada Partners — connecting youth to resources, hosting gaming events, creating motivational content, and producing real conversations through our podcasts. <strong className="text-yellow-400">Everyone deserves a chance to win.</strong>
            </p>
          </div>
        </section>

        {/* ── Community Photos ────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Rooftop music video crew */}
            <div className="relative rounded-3xl overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/basma/music-video-crew.jpg"
                alt="Music video crew rooftop shoot — Las Vegas community"
                className="w-full object-cover h-72 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-1">🎬 Music Video Shoot</p>
                <p className="text-white text-lg font-black">&ldquo;Much love to all of you fr&rdquo;</p>
                <p className="text-white/60 text-xs mt-1">Rooftop · Las Vegas 💛</p>
              </div>
            </div>

            {/* Dance crew at gym */}
            <div className="relative rounded-3xl overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/basma/basma-dance-crew-gym.jpg"
                alt="Basma with dance crew in school gymnasium"
                className="w-full object-cover h-72 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-1">🕺 Community Performance</p>
                <p className="text-white text-lg font-black">We Started Z Spirit in &apos;93</p>
                <p className="text-white/60 text-xs mt-1">School Gym · Las Vegas 💛</p>
              </div>
            </div>

          </div>
        </section>

        {/* ── Expandable Sections ─────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 pb-16 space-y-4">

          <ExpandableSection
            title="Hopes Chance — Free Youth Resources"
            preview="Free resource navigator for youth ages 16–30. Housing, jobs, mental health, food & more."
            icon="🤝"
            accentColor="#22C55E"
            defaultOpen
          >
            <div className="space-y-4">
              <p className="text-white/60 text-sm leading-relaxed">
                <strong className="text-white">Hopes Chance</strong> connects young people in Las Vegas (ages 16–30) to real, free resources — no judgment, 100% confidential. If you or someone you know needs help, start here.
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { icon: '🏠', title: 'Housing', desc: 'Emergency shelters, transitional housing, rental assistance' },
                  { icon: '💼', title: 'Jobs & Training', desc: 'Job placement, resume help, vocational training' },
                  { icon: '🧠', title: 'Mental Health', desc: 'Free counseling, crisis support, therapy referrals' },
                  { icon: '🍎', title: 'Food', desc: 'Food banks, SNAP assistance, community meals' },
                  { icon: '🏥', title: 'Healthcare', desc: 'Free clinics, insurance enrollment, dental care' },
                  { icon: '📚', title: 'Education', desc: 'GED programs, scholarships, tutoring' },
                ].map((r) => (
                  <div key={r.title} className="bg-green-900/10 border border-green-800/30 rounded-xl p-4">
                    <span className="text-2xl">{r.icon}</span>
                    <h4 className="text-sm font-bold text-white mt-2">{r.title}</h4>
                    <p className="text-white/40 text-xs mt-1">{r.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-green-400 text-sm font-semibold pt-2">
                📞 Call (702) 788-7369 or reach out via our Contact page for help.
              </p>
            </div>
          </ExpandableSection>

          <ExpandableSection
            title="BasmaTeach Me — Learning Made Fun"
            preview="Billy the Puppet and Basma make learning sassy, funny, and genuinely fun for kids on TikTok."
            icon="🪆"
            accentColor="#8B5CF6"
          >
            <div className="space-y-3 text-white/60 text-sm leading-relaxed">
              <p>
                <strong className="text-white">BasmaTeach Me</strong> features Billy the Puppet and Basma creating short-form educational content that kids actually want to watch. Sassy, funny, and packed with real knowledge.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a href="https://www.tiktok.com/@basmateachme" target="_blank" rel="noopener noreferrer"
                  className="bg-purple-500/10 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-full text-sm font-semibold hover:bg-purple-500/20 transition">
                  🪆 Follow @basmateachme
                </a>
              </div>
            </div>
          </ExpandableSection>

          <ExpandableSection
            title="Mildly Interesting Podcast"
            preview="Real conversations with Wesley. Real topics. Posted on BasmaWorld YouTube."
            icon="🎙️"
            accentColor="#F59E0B"
          >
            <div className="space-y-3 text-white/60 text-sm leading-relaxed">
              <p>
                The <strong className="text-white">Mildly Interesting</strong> podcast with Wesley explores real conversations about life, Las Vegas, community, and everything in between. No scripts, no filter.
              </p>
              <p>
                Plus check out <strong className="text-white">R.O.F.L. Podcast</strong> on Spotify for more casual laughs and real talk.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a href="https://www.youtube.com/channel/UChszcJ6HQ4u1NoTs4-06H3w" target="_blank" rel="noopener noreferrer"
                  className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-500/20 transition">
                  📺 Watch on YouTube
                </a>
                <a href="https://open.spotify.com/show/0i0tC040EavARkiFoDIR5j" target="_blank" rel="noopener noreferrer"
                  className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-500/20 transition">
                  🎙️ R.O.F.L. on Spotify
                </a>
              </div>
            </div>
          </ExpandableSection>

          <ExpandableSection
            title="Gaming"
            preview="Real gaming. Real community. Streams, challenges, and youth gaming events."
            icon="🎮"
            accentColor="#BF5FFF"
          >
            <div className="space-y-3">
              <p className="text-white/60 text-sm leading-relaxed">
                MWL brings gaming together with purpose, connection, and next-level energy for youth. Live streams, community challenges, and pro tips.
              </p>
              <div className="grid sm:grid-cols-3 gap-3 pt-2">
                {[
                  { emoji: '🎮', title: 'Live Streams', desc: 'Gaming sessions, commentary & reactions' },
                  { emoji: '🏆', title: 'Challenges', desc: 'Weekly competitions & bragging rights' },
                  { emoji: '🧠', title: 'Life Skills', desc: 'Strategy, teamwork, resilience' },
                ].map((item) => (
                  <div key={item.title} className="bg-purple-900/10 border border-purple-800/30 rounded-xl p-4">
                    <span className="text-2xl">{item.emoji}</span>
                    <h4 className="text-sm font-bold text-white mt-2">{item.title}</h4>
                    <p className="text-white/40 text-xs mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </ExpandableSection>

          <ExpandableSection
            title="I Am Positive — Motivational Content"
            preview="Mindset resets, spoken word, and stories of resilience. Shift your thinking."
            icon="💛"
            accentColor="#F59E0B"
          >
            <div className="space-y-3">
              <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-6 text-center">
                <blockquote className="text-lg font-semibold text-yellow-300 italic">
                  &quot;You are not your circumstances. You are your choices. And today, you choose to rise.&quot;
                </blockquote>
                <p className="text-white/30 mt-2 text-xs">— I Am Positive, Major Winners League</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                {[
                  { icon: '🧠', title: 'Mindset Resets', desc: 'Rewire how you think about success and failure' },
                  { icon: '💪', title: 'Resilience Stories', desc: 'Real people sharing how they thrived' },
                  { icon: '🎯', title: 'Goal Architecture', desc: 'Build goals that actually stick' },
                  { icon: '⭐', title: 'Community Spotlights', desc: 'Local heroes making a quiet difference' },
                ].map((item) => (
                  <div key={item.title} className="bg-yellow-900/10 border border-yellow-800/30 rounded-xl p-4">
                    <span className="text-xl">{item.icon}</span>
                    <h4 className="text-sm font-bold text-white mt-1">{item.title}</h4>
                    <p className="text-white/40 text-xs mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </ExpandableSection>

          <ExpandableSection
            title="Vegan Survivors"
            preview="Plant-based recipes, health tips, and wellness content. Coming soon!"
            icon="🥦"
            accentColor="#22C55E"
          >
            <p className="text-white/60 text-sm leading-relaxed">
              A Major Winners League community initiative — plant-based recipes, health tips, and wellness content. <strong className="text-white">More coming soon!</strong> Follow @basma_singer for updates.
            </p>
          </ExpandableSection>
        </section>

        {/* ── MWL Bot Package ────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <BotPackageCard
            botName="MWL Bot"
            botEmoji="🏆"
            description="Your AI-powered community assistant. Manage events, connect youth to resources, and keep your community engaged — 24/7."
            accentColor="#F59E0B"
            tiers={[
              {
                name: 'Community',
                price: '$49',
                period: '/mo',
                features: [
                  'Community Q&A chatbot',
                  'Event announcements',
                  'Basic resource navigation',
                  'Social media auto-replies',
                ],
              },
              {
                name: 'League',
                price: '$149',
                period: '/mo',
                highlight: true,
                badge: 'Most Popular',
                features: [
                  'Everything in Community',
                  'Youth resource matching AI',
                  'Gaming event coordination',
                  'Podcast scheduling assistant',
                  'Multi-platform posting',
                ],
              },
              {
                name: 'Champion',
                price: '$349',
                period: '/mo',
                features: [
                  'Everything in League',
                  'Custom AI personality',
                  'Analytics dashboard',
                  'Unlimited conversations',
                  'Priority support',
                  'White-label option',
                ],
              },
            ]}
          />
        </section>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-4 pb-20 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Want to work with MWL?</h2>
          <p className="text-white/40 mb-6">Community events, sponsorships, or just want to connect — reach out.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold text-lg transition">
            🏆 Get In Touch
          </Link>
        </section>

      </main>
      
    </>
  )
}
