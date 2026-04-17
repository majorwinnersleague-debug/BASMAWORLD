import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BillyChat from '@/components/BillyChat'
import Link from 'next/link'

export const metadata = {
  title: 'Major Winners League — Community Events & Social Impact | Las Vegas',
  description: 'Major Winners League covers Las Vegas community events, interviews with businesses and nonprofits, motivational talks, and social impact through Historic Westside and Nevada Partners.',
}

export default function MWL() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-16">

        {/* Hero with photo */}
        <section className="relative h-[70vh] flex items-end pb-16 px-4">
          <div className="absolute inset-0">
            <img src="/images/basma-mwl.jpg" alt="Major Winners League community events Las Vegas"
              className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center w-full">
            <p className="text-yellow-400 font-bold uppercase tracking-widest text-sm mb-3">Community • Impact • Motivation</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Major Winners League</h1>
            <p className="text-gray-300 text-lg">Covering Las Vegas from Historic Westside to Nevada Partners — one community at a time.</p>
          </div>
        </section>

        {/* 4 sub-section cards */}
        <section className="max-w-5xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-6">
          {[
            { href: '/mwl/i-am-positive', icon: '💛', title: 'I Am Positive', desc: 'Motivational talks, spoken word poetry, and inspiration for the community.', color: 'yellow' },
            { href: '/mwl/podcast', icon: '🎙️', title: 'Mildly Interesting', desc: 'The podcast with Wesley. Real conversations, real topics. Posted on BasmaWorld YouTube.', color: 'yellow' },
            { href: '/hopes', icon: '🤝', title: 'Hopes Chance', desc: 'Free resource navigator connecting youth 16-30 to housing, jobs, and mental health services.', color: 'green' },
            { href: '/vegan-survivors', icon: '🥦', title: 'Vegan Survivors', desc: 'Plant-based recipes, health tips, and wellness content for the whole community.', color: 'orange' },
          ].map(s => (
            <Link key={s.href} href={s.href}
              className="bg-gray-900/50 border border-white/10 hover:border-yellow-500/50 rounded-2xl p-6 flex gap-4 items-start transition group hover:bg-yellow-900/10">
              <div className="text-4xl">{s.icon}</div>
              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-yellow-400 transition mb-2">{s.title}</h2>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </Link>
          ))}
        </section>

        {/* Community photo strip */}
        <section className="max-w-5xl mx-auto px-4 pb-20 grid grid-cols-2 md:grid-cols-3 gap-4">
          <img src="/images/basma-community.jpg" alt="Basma in the community" className="rounded-xl w-full h-48 object-cover" />
          <img src="/images/basma-mwl.jpg" alt="MWL community event" className="rounded-xl w-full h-48 object-cover" />
          <img src="/images/basma-about.jpg" alt="Basma Awada community leader" className="rounded-xl w-full h-48 object-cover md:block hidden" />
        </section>

      </main>
      <Footer />
      <BillyChat page="basmateachme" />
    </>
  )
}
