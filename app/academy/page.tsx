export const dynamic = 'force-static'
export const revalidate = 86400

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BillyChat from '@/components/BillyChat'
import StripeCheckoutButton from '@/components/StripeCheckoutButton'
import HowItWorks from '@/components/HowItWorks'
import TikTokBanner from '@/components/TikTokBanner'
import PricingSection from '@/components/PricingSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import FAQSection from '@/components/FAQSection'
import Link from 'next/link'

export const metadata = {
  title: 'BASMA Music Academy — Singing & Instrument Lessons | Las Vegas, NV',
  description: 'Join Become A Singer Music Academy in Las Vegas. Trial lesson for just $29. Professional singing, piano, guitar & vocal coaching with Basma. Kids & adults welcome.',
  keywords: ['music lessons las vegas', 'singing lessons las vegas', 'kids music academy', 'basma music school', 'vocal coach las vegas', 'piano lessons las vegas', 'guitar lessons las vegas', 'become a singer academy'],
  openGraph: {
    title: 'BASMA Music Academy — Singing & Instrument Lessons | Las Vegas, NV',
    description: 'Trial music lesson for $29. Singing, piano, guitar & vocal coaching with Basma — Become A Singer Music Academy, Las Vegas.',
    url: 'https://basmaworld.com/academy',
    siteName: 'BasmaWorld',
    type: 'website',
    images: [{ url: '/images/basma-academy.jpg', width: 1200, height: 630, alt: 'BASMA Music Academy Las Vegas' }],
  },
}

const musicSchoolSchema = {
  '@context': 'https://schema.org',
  '@type': 'MusicSchool',
  name: 'BASMA — Become A Singer Music Academy',
  url: 'https://basmaworld.com/academy',
  description: 'Professional singing, piano, guitar, and instrument lessons in Las Vegas. Trial lesson $29. Kids and adults welcome.',
  telephone: '+1-702-788-7369',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '9205 W Russell Rd Building 3',
    addressLocality: 'Las Vegas',
    addressRegion: 'NV',
    postalCode: '89148',
    addressCountry: 'US',
  },
  areaServed: ['Las Vegas', 'Online'],
  teaches: ['Singing', 'Vocal Technique', 'Piano', 'Guitar', 'Music Theory', 'Performance Skills'],
  image: 'https://basmaworld.com/images/basma-academy.jpg',
  priceRange: '$29+',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much do music lessons cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your first trial lesson is just $29. After your trial you can choose from our flexible monthly lesson packages.',
      },
    },
    {
      '@type': 'Question',
      name: 'What ages do you teach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All ages welcome! Kids as young as 5 up to adults of any age.',
      },
    },
    {
      '@type': 'Question',
      name: 'What instruments and skills do you offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Voice/singing, piano, guitar, violin, drums, and music theory.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are lessons in-person or online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Both! In-person in Las Vegas and online worldwide.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long is each lesson?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '30 or 60 minute sessions are available.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need experience to start?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No experience needed at all! We start from the very beginning.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes BasmaWorld different?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Gamified learning with XP points, skill trees, and an AI music mentor — learning feels like a game.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where are you located?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '9205 W Russell Rd Building 3, Las Vegas, NV 89148.',
      },
    },
  ],
}

export default function AcademyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(musicSchoolSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-16">

        {/* Hero */}
        <section className="relative h-[70vh] flex items-center px-4">
          <div className="absolute inset-0">
            <img src="/images/basma-academy.jpg" alt="BASMA music academy professional singing lessons Las Vegas"
              className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <p className="text-purple-400 font-bold uppercase tracking-widest text-sm mb-3">Become A Singer Music Academy · Las Vegas, NV</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">Learn Music.<br/>Earn XP.<br/>Unlock Your Potential.</h1>
            <p className="text-gray-300 text-lg mb-8">Professional vocal coaching, piano, guitar & more — in Las Vegas or online. Trial lesson just $29.</p>
            <StripeCheckoutButton />
          </div>
        </section>

        <TikTokBanner />
        {/* Trial CTA Banner */}
        <section className="bg-gradient-to-r from-purple-900/40 to-black border-y border-purple-700/40 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-purple-300 font-semibold uppercase tracking-widest text-sm mb-3">Limited Time Offer</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start Your Music Journey Today</h2>
            <p className="text-gray-300 text-lg mb-6 max-w-xl mx-auto">
              Book a trial lesson with BASMA Music Academy for just <span className="text-purple-400 font-bold">$29</span>. No experience needed. All ages welcome.
            </p>
            <StripeCheckoutButton />
            <p className="text-gray-500 text-sm mt-4">✓ One-on-one lesson · ✓ Professional coach · ✓ Las Vegas or online</p>
          </div>
        </section>

        <HowItWorks />
        {/* Learning paths */}
        <section className="max-w-5xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-4">What We Teach</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Singing lessons, piano, guitar, violin, and more — in Las Vegas, Nevada and online. Taught by Basma and her team.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🎤', title: 'Singing & Vocals', desc: 'Technique, breath control, performance — from beginner to advanced. Great for kids and adults.' },
              { icon: '🎹', title: 'Piano & Keys', desc: 'Classical to contemporary. Learn to read music, play songs, and compose your own.' },
              { icon: '🎸', title: 'Guitar', desc: 'Acoustic and electric guitar. Chords, fingerpicking, strumming patterns, and your favorite songs.' },
              { icon: '🎻', title: 'Violin & Viola', desc: 'String technique for beginners and intermediate players. Focus on tone, intonation, and musicality.' },
              { icon: '🥁', title: 'Drums & Rhythm', desc: 'Rock, pop, jazz, and more. Beat keeping, fills, and full kit coordination.' },
              { icon: '🤖', title: 'Echo AI Mentor', desc: 'Built-in AI practice guidance, XP tracking, and personalized lesson recommendations.' },
            ].map(p => (
              <div key={p.title} className="bg-purple-900/20 border border-purple-800 rounded-2xl p-6 hover:border-purple-600 transition hover:bg-purple-900/30">
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Echo AI mentor */}
        <section className="bg-gradient-to-r from-purple-900/20 to-black border-y border-purple-800/30 py-16">
          <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-purple-400 font-bold uppercase tracking-widest text-sm mb-3">Your AI Mentor</p>
              <h2 className="text-4xl font-bold mb-4">Meet Echo 🤖</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Echo is your personal AI music guide. She tracks your XP, recommends your next quest,
                celebrates every win, and helps you unlock new levels on your Skill Tree.
              </p>
              <p className="text-gray-400 text-sm mb-8">Available 24/7. No judgment. Pure encouragement.</p>
              <StripeCheckoutButton />
            </div>
            <div className="bg-purple-900/30 border border-purple-700 rounded-2xl p-6 font-mono text-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse"></div>
                <span className="text-purple-400 font-sans font-semibold">Echo</span>
              </div>
              <p className="text-gray-300 mb-3">{"\"Hey! You just earned "}<span className="text-yellow-400 font-bold">+50 XP</span>{" for completing Lesson 3! 🎉\""}</p>
              <p className="text-gray-300 mb-3">{"\"Your next quest: "}<span className="text-purple-400">Chest Voice Resonance</span>{". Ready?\""}</p>
              <p className="text-gray-400">{"\"You're 120 XP away from unlocking the "}<span className="text-yellow-400">Performance Stage</span>{" node 🌟\""}</p>
            </div>
          </div>
        </section>

        {/* Location info */}
        <section className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">📍 Las Vegas Music Academy</h2>
          <p className="text-gray-400 mb-2">9205 W Russell Rd Building 3, Las Vegas, NV 89148</p>
          <p className="text-gray-400 mb-6">(702) 788-7369 · In-person & online lessons available</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/basma/academy" className="bg-purple-700 hover:bg-purple-600 px-6 py-3 rounded-full font-semibold transition">
              Learn More About the Academy
            </Link>
            <Link href="/basma/lessons" className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-full font-semibold transition">
              View All Lesson Options
            </Link>
          </div>
        </section>

      </main>
      {/* Blog teaser */}
      <section className="max-w-4xl mx-auto px-4 pb-8">
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-4">Free Resources</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { href: '/blog/how-to-sing-better', label: '5 Things Every Beginner Needs to Know' },
              { href: '/blog/vocal-warmup', label: 'The 10-Minute Warmup Routine' },
              { href: '/blog/kids-music-lessons', label: 'When Should Kids Start Lessons?' },
            ].map((item) => (
              <a key={item.href} href={item.href} className="text-[#8B5CF6] hover:text-[#A78BFA] text-sm font-medium transition">
                📖 {item.label} →
              </a>
            ))}
          </div>
        </div>
      </section>
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
      <BillyChat page="academy" />
    </>
  )
}
