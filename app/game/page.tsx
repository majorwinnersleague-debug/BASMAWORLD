'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Player {
  rank: number
  name: string
  xp: number
  level: number
  characterClass: string
  currentLevel: string
  completedQuests: number
  characterArt: string | null
}

const CHARACTER_CLASSES = [
  {
    name: 'The Mogul',
    description: 'Born leaders who turn ideas into empires. Moguls earn bonus XP from Branding quests and unlock exclusive business mentorship pathways.',
    skills: ['Leadership', 'Marketing', 'Strategy'],
  },
  {
    name: 'The Survivor',
    description: 'Resilient warriors who turn adversity into strength. Survivors earn bonus XP from Wellness quests and gain access to peer mentorship circles.',
    skills: ['Resilience', 'Adaptability', 'Community'],
  },
  {
    name: 'The Siren',
    description: 'Natural performers whose voice can move mountains. Sirens earn bonus XP from Music quests and unlock exclusive vocal masterclass content.',
    skills: ['Vocals', 'Performance', 'Stage Presence'],
  },
  {
    name: 'The Producer',
    description: 'Creative architects who build worlds through sound. Producers earn bonus XP from music production quests and get studio session access.',
    skills: ['Production', 'Mixing', 'Composition'],
  },
  {
    name: 'The Healer',
    description: 'Compassionate souls who uplift everyone around them. Healers earn bonus XP from community service and unlock mentoring roles.',
    skills: ['Empathy', 'Support', 'Wellness'],
  },
]

const GALLERY_ITEMS = [
  {
    title: 'Phoenix Rising',
    artist: 'Dave Dave',
    story: 'This piece represents transformation and resilience in the face of adversity.',
    themes: ['Survival', 'Resilience', 'Transformation'],
  },
  {
    title: 'Identity Reclaimed',
    artist: 'Dave Dave',
    story: 'Exploring the journey of rebuilding self after trauma.',
    themes: ['Identity', 'Healing', 'Hope'],
  },
  {
    title: 'Community of Light',
    artist: 'Dave Dave',
    story: 'Finding connection and healing through shared experience.',
    themes: ['Community', 'Hope', 'Expression'],
  },
]

export default function GamePage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [selectedClass, setSelectedClass] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(data => setPlayers((data.players || []).slice(0, 5)))
      .catch(() => {})
  }, [])

  return (
    <main className="min-h-screen text-white">

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#c9a84c]/[0.03] via-transparent to-transparent" />

        <div className="absolute top-0 left-0 px-8 pt-8 z-20">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#c9a84c] transition text-sm backdrop-blur-sm bg-black/30 px-3 py-1.5 rounded-full">
            ← Back to BasmaWorld
          </Link>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-5 py-2 mb-6 text-sm text-white/50 backdrop-blur-sm">
            Play · Earn XP · Level Up
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="gradient-gold">MajorWinners</span>
          </h1>
          <p className="text-xl text-white/60 mb-3 max-w-2xl mx-auto leading-relaxed">
            Choose your character. Complete quests. Earn XP in the real world and the Viverse.
          </p>
          <p className="text-white/30 max-w-lg mx-auto text-sm">
            Your MajorWinner character is your avatar across the entire MWL ecosystem — from music lessons to community events.
          </p>
        </div>
      </section>

      {/* ── Character Classes ──────────────────────────────────────────────── */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Choose Your Character Class
        </h2>
        <div className="divider mx-auto mb-4" />
        <p className="text-white/40 text-center mb-10 max-w-md mx-auto">
          Your class determines your bonus XP paths and unlocks unique abilities.
        </p>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CHARACTER_CLASSES.map(cls => {
            const isSelected = selectedClass === cls.name
            return (
              <button
                key={cls.name}
                onClick={() => setSelectedClass(isSelected ? null : cls.name)}
                className={`relative rounded-2xl p-5 text-center transition-all duration-300 ${
                  isSelected
                    ? 'glass-gold glow-gold'
                    : 'bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.10]'
                }`}
                style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease', ...(isSelected ? {} : {}) }}
              >
                <h3 className={`font-bold text-lg mb-2 ${isSelected ? 'text-[#e4cc7a]' : 'text-white/70'}`} style={{ fontFamily: "'Playfair Display', serif" }}>
                  {cls.name}
                </h3>
                <div className="flex flex-wrap gap-1 justify-center mb-3">
                  {cls.skills.map(s => (
                    <span key={s} className={`text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-[#c9a84c]/20 text-[#e4cc7a]/80' : 'bg-white/[0.06] text-white/40'}`}>
                      {s}
                    </span>
                  ))}
                </div>
                {isSelected && (
                  <p className="text-sm text-white/60 leading-relaxed animate-fadeIn">{cls.description}</p>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Active MajorWinners ────────────────────────────────────────────── */}
      {players.length > 0 && (
        <section className="px-6 py-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            Active MajorWinners
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {players.map(p => (
              <div key={p.rank} className="glass rounded-2xl p-4 text-center">
                {p.characterArt ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.characterArt} alt={p.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border border-[#c9a84c]/30" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c9a84c]/30 to-[#a08539]/20 mx-auto mb-2 flex items-center justify-center text-sm font-bold text-[#c9a84c]">
                    {p.name.charAt(0)}
                  </div>
                )}
                <p className="font-bold text-white text-sm truncate">{p.name}</p>
                <p className="text-xs text-white/30">{p.characterClass}</p>
                <p className="text-sm font-bold mt-1 gradient-gold">
                  {p.xp.toLocaleString()} XP
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Dave Dave Digital Gallery ──────────────────────────────────────── */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Dave Dave Digital Gallery
        </h2>
        <div className="divider mx-auto mb-4" />
        <p className="text-white/40 text-center mb-10 max-w-lg mx-auto">
          A space for emotional grounding. Explore art that inspires identity rebuilding and healing.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map(item => (
            <div
              key={item.title}
              className="card-premium glass rounded-2xl overflow-hidden"
            >
              {/* Art placeholder */}
              <div className="aspect-square bg-gradient-to-br from-white/[0.03] to-white/[0.01] flex items-center justify-center border-b border-white/[0.06]">
                <div className="text-center">
                  <p className="text-white/20 text-sm italic" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</p>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-white text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h3>
                <p className="text-xs text-[#c9a84c]/50 mb-3">by {item.artist}</p>
                <p className="text-sm text-white/40 leading-relaxed mb-3">{item.story}</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.themes.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Viverse World CTA ──────────────────────────────────────────────── */}
      <section className="px-6 pb-20 max-w-3xl mx-auto">
        <div className="glass-gold rounded-2xl p-10 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Enter the <span className="gradient-gold">Viverse World</span>
            </h2>
            <p className="text-white/50 mb-8 max-w-md mx-auto">
              Explore the MajorWinners League virtual world. Play music games, earn XP, and connect with other MajorWinners in an immersive 3D environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://www.viverse.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-bold text-lg"
              >
                Launch Viverse World
              </a>
              <Link
                href="/academy"
                className="btn-outline inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg text-white/70 hover:text-white transition"
              >
                Start Music Quests
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It All Connects ────────────────────────────────────────────── */}
      <section className="px-6 pb-24 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white text-center mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
          How It All Connects
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/navigator" className="glass rounded-2xl p-6 text-center group">
            <h3 className="font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>MWL Navigator</h3>
            <p className="text-white/40 text-sm mb-3">Find resources near you. Food, shelter, jobs, mental health — all verified.</p>
            <span className="text-[#c9a84c] text-xs group-hover:underline">Open Navigator →</span>
          </Link>
          <Link href="/academy" className="glass rounded-2xl p-6 text-center group">
            <h3 className="font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>BASMA Academy</h3>
            <p className="text-white/40 text-sm mb-3">Gamified music lessons. Earn XP from quests and climb the leaderboard.</p>
            <span className="text-[#c9a84c] text-xs group-hover:underline">Start Learning →</span>
          </Link>
          <Link href="/hopes" className="glass rounded-2xl p-6 text-center group">
            <h3 className="font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Hopes Chance</h3>
            <p className="text-white/40 text-sm mb-3">Youth resources for ages 16–30. Free, confidential, no judgment.</p>
            <span className="text-[#c9a84c] text-xs group-hover:underline">Get Support →</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
