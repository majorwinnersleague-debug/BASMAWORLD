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
    emoji: '👑',
    description: 'Born leaders who turn ideas into empires. Moguls earn bonus XP from Branding quests and unlock exclusive business mentorship pathways.',
    color: 'from-yellow-500 to-amber-600',
    border: 'border-yellow-500/30',
    skills: ['Leadership', 'Marketing', 'Strategy'],
  },
  {
    name: 'The Survivor',
    emoji: '🛡️',
    description: 'Resilient warriors who turn adversity into strength. Survivors earn bonus XP from Wellness quests and gain access to peer mentorship circles.',
    color: 'from-emerald-500 to-green-600',
    border: 'border-emerald-500/30',
    skills: ['Resilience', 'Adaptability', 'Community'],
  },
  {
    name: 'The Siren',
    emoji: '🎤',
    description: 'Natural performers whose voice can move mountains. Sirens earn bonus XP from Music quests and unlock exclusive vocal masterclass content.',
    color: 'from-purple-500 to-pink-600',
    border: 'border-purple-500/30',
    skills: ['Vocals', 'Performance', 'Stage Presence'],
  },
  {
    name: 'The Producer',
    emoji: '🎧',
    description: 'Creative architects who build worlds through sound. Producers earn bonus XP from music production quests and get studio session access.',
    color: 'from-blue-500 to-cyan-600',
    border: 'border-blue-500/30',
    skills: ['Production', 'Mixing', 'Composition'],
  },
  {
    name: 'The Healer',
    emoji: '💚',
    description: 'Compassionate souls who uplift everyone around them. Healers earn bonus XP from community service and unlock mentoring roles.',
    color: 'from-rose-500 to-red-600',
    border: 'border-rose-500/30',
    skills: ['Empathy', 'Support', 'Wellness'],
  },
]

const GALLERY_ITEMS = [
  {
    title: 'Phoenix Rising',
    artist: 'Dave Dave',
    story: 'This piece represents transformation and resilience in the face of adversity.',
    themes: ['Survival', 'Resilience', 'Transformation'],
    emoji: '🔥',
  },
  {
    title: 'Identity Reclaimed',
    artist: 'Dave Dave',
    story: 'Exploring the journey of rebuilding self after trauma.',
    themes: ['Identity', 'Healing', 'Hope'],
    emoji: '🪞',
  },
  {
    title: 'Community of Light',
    artist: 'Dave Dave',
    story: 'Finding connection and healing through shared experience.',
    themes: ['Community', 'Hope', 'Expression'],
    emoji: '✨',
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
      {/* Hero */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-transparent to-transparent" />
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(168,85,247,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="absolute top-0 left-0 px-8 pt-8 z-20">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-purple-300 transition text-sm backdrop-blur-sm bg-black/30 px-3 py-1.5 rounded-full">
            ← Back to BasmaWorld
          </Link>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-900/60 border border-purple-500/40 rounded-full px-5 py-2 mb-6 text-sm text-purple-300 backdrop-blur-sm">
            🎮 Play · Earn XP · Level Up
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <span style={{ background: 'linear-gradient(135deg, #c084fc, #fbbf24, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              MajorWinners
            </span>
          </h1>
          <p className="text-xl text-purple-200/80 mb-3 max-w-2xl mx-auto leading-relaxed">
            Choose your character. Complete quests. Earn XP in the real world and the Viverse.
          </p>
          <p className="text-white/40 max-w-lg mx-auto text-sm">
            Your MajorWinner character is your avatar across the entire MWL ecosystem — from music lessons to community events.
          </p>
        </div>
      </section>

      {/* Character Classes */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Choose Your Character Class 🧬
        </h2>
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
                className={`relative rounded-2xl p-5 text-center transition-all duration-300 hover:scale-105 ${
                  isSelected
                    ? `bg-gradient-to-b ${cls.color} shadow-xl shadow-purple-500/20`
                    : `bg-white/5 border ${cls.border} hover:bg-white/10`
                }`}
              >
                <span className="text-4xl block mb-3">{cls.emoji}</span>
                <h3 className={`font-bold text-lg mb-2 ${isSelected ? 'text-white' : 'text-white/80'}`}>
                  {cls.name}
                </h3>
                <div className="flex flex-wrap gap-1 justify-center mb-3">
                  {cls.skills.map(s => (
                    <span key={s} className={`text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-black/20 text-white/80' : 'bg-white/10 text-white/40'}`}>
                      {s}
                    </span>
                  ))}
                </div>
                {isSelected && (
                  <p className="text-sm text-white/90 leading-relaxed animate-fadeIn">{cls.description}</p>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* Active MajorWinners */}
      {players.length > 0 && (
        <section className="px-6 py-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Active MajorWinners 🏆
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {players.map(p => (
              <div key={p.rank} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:border-purple-500/30 transition">
                {p.characterArt ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.characterArt} alt={p.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-2 border-purple-500/40" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 mx-auto mb-2 flex items-center justify-center text-2xl">
                    {p.characterClass === 'The Mogul' ? '👑' : p.characterClass === 'The Survivor' ? '🛡️' : p.characterClass === 'The Siren' ? '🎤' : '⭐'}
                  </div>
                )}
                <p className="font-bold text-white text-sm truncate">{p.name}</p>
                <p className="text-xs text-white/40">{p.characterClass}</p>
                <p className="text-sm font-bold mt-1" style={{ background: 'linear-gradient(135deg, #c084fc, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {p.xp.toLocaleString()} XP
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Dave Dave Digital Gallery */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Dave Dave Digital Gallery 🎨
        </h2>
        <p className="text-white/40 text-center mb-10 max-w-lg mx-auto">
          A space for emotional grounding. Explore art that inspires identity rebuilding and healing.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map(item => (
            <div
              key={item.title}
              className="bg-gradient-to-b from-rose-900/20 to-purple-950/10 border border-rose-500/20 rounded-2xl overflow-hidden hover:border-rose-400/40 transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Art placeholder */}
              <div className="aspect-square bg-gradient-to-br from-purple-900/40 to-rose-900/40 flex items-center justify-center">
                <span className="text-6xl">{item.emoji}</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-white text-lg mb-1">{item.title}</h3>
                <p className="text-xs text-rose-300/60 mb-3">by {item.artist}</p>
                <p className="text-sm text-white/50 leading-relaxed mb-3">{item.story}</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.themes.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Viverse World CTA */}
      <section className="px-6 pb-20 max-w-3xl mx-auto">
        <div
          className="relative rounded-3xl p-10 text-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(249,115,22,0.15))', border: '1px solid rgba(168,85,247,0.4)' }}
        >
          {/* Animated grid background */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }} />

          <div className="relative z-10">
            <span className="text-5xl block mb-4">🌐</span>
            <h2 className="text-3xl font-black mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Enter the Viverse World
            </h2>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              Explore the MajorWinners League virtual world. Play music games, earn XP, and connect with other MajorWinners in an immersive 3D environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://www.viverse.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-500 hover:to-orange-400 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25"
              >
                🎮 Launch Viverse World
              </a>
              <Link
                href="/academy"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 px-8 py-4 rounded-2xl font-bold text-lg transition-all"
              >
                🎵 Start Music Quests
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It All Connects */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white text-center mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          How It All Connects 🔗
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/navigator" className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 text-center hover:border-yellow-400/40 transition group">
            <span className="text-3xl block mb-3">🗺️</span>
            <h3 className="font-bold text-white mb-2">MWL Navigator</h3>
            <p className="text-white/40 text-sm">Find resources near you. Food, shelter, jobs, mental health — all verified.</p>
            <span className="text-yellow-400 text-xs mt-3 block group-hover:underline">Open Navigator →</span>
          </Link>
          <Link href="/academy" className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 text-center hover:border-purple-400/40 transition group">
            <span className="text-3xl block mb-3">🎵</span>
            <h3 className="font-bold text-white mb-2">BASMA Academy</h3>
            <p className="text-white/40 text-sm">Gamified music lessons. Earn XP from quests and climb the leaderboard.</p>
            <span className="text-purple-400 text-xs mt-3 block group-hover:underline">Start Learning →</span>
          </Link>
          <Link href="/hopes" className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center hover:border-emerald-400/40 transition group">
            <span className="text-3xl block mb-3">💚</span>
            <h3 className="font-bold text-white mb-2">Hopes Chance</h3>
            <p className="text-white/40 text-sm">Youth resources for ages 16–30. Free, confidential, no judgment.</p>
            <span className="text-emerald-400 text-xs mt-3 block group-hover:underline">Get Support →</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
