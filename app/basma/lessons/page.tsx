export const dynamic = 'force-static'
export const revalidate = 86400

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Music Lessons Las Vegas | Voice, Piano, Guitar & More | BasmaWorld',
  description: 'Private music lessons in Las Vegas with Basma Awada. Voice, piano, guitar, violin, drums. In-person & online. Book your $29 trial lesson today.',
  keywords: ['music lessons las vegas', 'private music lessons', 'voice lessons las vegas', 'piano lessons las vegas', 'guitar lessons las vegas', 'violin lessons las vegas', 'drums lessons las vegas', 'in person music lessons near me'],
  openGraph: {
    title: 'Music Lessons Las Vegas | Voice, Piano, Guitar & More',
    description: 'Private music lessons with Basma Awada. Voice, piano, guitar, violin, drums. $29 trial.',
    url: 'https://basmaworld.com/basma/lessons',
    siteName: 'BasmaWorld',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/basma-academy.jpg', width: 1200, height: 630, alt: 'Music lessons in Las Vegas — voice, piano, guitar, violin and drums' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@basma_singer',
    creator: '@basma_singer',
    title: 'Music Lessons Las Vegas — Voice, Piano, Guitar',
    description: 'Private lessons with Basma Awada. In-person & online. $29 trial.',
    images: ['/images/basma-academy.jpg'],
  },
  alternates: {
    canonical: 'https://basmaworld.com/basma/lessons',
  },
}

export default function LessonsPage() {
  const lessons = [
    { emoji: '🎤', name: 'Voice & Singing', desc: 'Jazz, pop, R&B, commercial. All levels welcome. Find your unique voice.', popular: true },
    { emoji: '🎹', name: 'Piano', desc: 'From first notes to full songs. Classical foundations with modern application.' },
    { emoji: '🎸', name: 'Guitar', desc: 'Acoustic and electric. Chords, melody, fingerpicking, and songwriting.' },
    { emoji: '🎻', name: 'Violin & Viola', desc: 'Classical technique adapted for modern music. Posture, tone, and repertoire.' },
    { emoji: '🥁', name: 'Drums', desc: 'Rhythm fundamentals, coordination, and groove. Play along to your favorite songs.' },
    { emoji: '🎼', name: 'Music Theory', desc: 'Understand how music actually works. Read music, write songs, compose.' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <section className="max-w-4xl mx-auto px-4 pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
          ✦ Private Music Lessons · Las Vegas & Online
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Lessons for{' '}
          <span className="bg-gradient-to-r from-[#8B5CF6] to-[#F59E0B] bg-clip-text text-transparent">
            Every Instrument
          </span>
        </h1>
        <p className="text-white/50 text-lg max-w-xl mx-auto mb-8">
          In-person in Las Vegas or online worldwide. All ages, all skill levels. Start with a $29 trial.
        </p>
        <Link
          href="/academy"
          className="inline-flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-purple-900/30"
        >
          🎵 Book $29 Trial Lesson
        </Link>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson) => (
            <div key={lesson.name} className={`relative bg-white/[0.03] border rounded-2xl p-6 transition hover:bg-white/[0.05] ${lesson.popular ? 'border-[#8B5CF6]/40' : 'border-white/10'}`}>
              {lesson.popular && (
                <span className="absolute -top-2.5 left-4 bg-[#8B5CF6] text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <div className="text-4xl mb-3">{lesson.emoji}</div>
              <h3 className="font-bold text-white text-lg mb-2">{lesson.name}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{lesson.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <p className="text-white/30 text-sm mb-4">All lessons available in-person (Las Vegas) or online</p>
          <Link href="/academy" className="text-[#8B5CF6] hover:text-[#A78BFA] font-medium transition">
            View Academy & Pricing →
          </Link>
        </div>
      </section>
    </div>
  )
}
