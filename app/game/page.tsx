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
    icon: '👑',
    description: 'Born leaders who turn ideas into empires.',
    skills: ['Leadership', 'Marketing', 'Strategy'],
    accent: '#c9a84c',
  },
  {
    name: 'The Survivor',
    icon: '🛡️',
    description: 'Resilient warriors who turn adversity into strength.',
    skills: ['Resilience', 'Adaptability', 'Community'],
    accent: '#34d399',
  },
  {
    name: 'The Siren',
    icon: '🎤',
    description: 'Natural performers whose voice moves mountains.',
    skills: ['Vocals', 'Performance', 'Stage Presence'],
    accent: '#9b7dff',
  },
  {
    name: 'The Producer',
    icon: '🎧',
    description: 'Creative architects who build worlds through sound.',
    skills: ['Production', 'Mixing', 'Composition'],
    accent: '#60a5fa',
  },
  {
    name: 'The Healer',
    icon: '💚',
    description: 'Compassionate souls who uplift everyone around them.',
    skills: ['Empathy', 'Support', 'Wellness'],
    accent: '#f472b6',
  },
]

const MINI_GAMES = [
  {
    title: 'Rhythm Drop',
    description: 'Tap notes to the beat. Chain combos.',
    href: '/game/rhythm',
    xp: '+50 XP',
    available: true,
  },
  {
    title: 'Music Trivia',
    description: 'Test your music theory and history.',
    href: '/game/trivia',
    xp: '+30 XP',
    available: true,
  },
  {
    title: 'Ear Training',
    description: 'Identify intervals, chords, and scales.',
    href: '/game/ear-training',
    xp: '+40 XP',
    available: false,
  },
]

const GALLERY_ITEMS = [
  {
    title: 'Phoenix Rising',
    artist: 'Dave Dave',
    story: 'Transformation and resilience in the face of adversity.',
  },
  {
    title: 'Identity Reclaimed',
    artist: 'Dave Dave',
    story: 'The journey of rebuilding self after trauma.',
  },
  {
    title: 'Community of Light',
    artist: 'Dave Dave',
    story: 'Finding connection and healing through shared experience.',
  },
]

export default function GamePage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [characterName, setCharacterName] = useState('')
  const [showCreateSuccess, setShowCreateSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(data => setPlayers((data.players || []).slice(0, 5)))
      .catch(() => {})
  }, [])

  const handleCreateCharacter = () => {
    if (!selectedClass || !characterName.trim()) return
    setShowCreateSuccess(true)
    setTimeout(() => setShowCreateSuccess(false), 4000)
  }

  return (
    <main className="min-h-screen text-white">

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-[#c9a84c]/50 tracking-[0.3em] uppercase mb-6">Play · Earn XP · Level Up</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="gradient-gold">MajorWinners</span>
          </h1>
          <p className="text-lg text-white/40 max-w-xl mx-auto leading-relaxed">
            Choose your character. Play music games. Earn XP in the real world and the Viverse.
          </p>
        </div>
      </section>

      {/* ── Mini-Games ─────────────────────────────────── */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-white text-center mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>
          Play <span className="gradient-gold">Games</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {MINI_GAMES.map(game => (
            <Link
              key={game.title}
              href={game.available ? game.href : '#'}
              className={`card-minimal rounded-xl p-6 ${!game.available ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-white">{game.title}</h3>
                <span className={`text-[10px] tracking-wider px-2 py-0.5 rounded-full ${
                  game.available
                    ? 'text-[#c9a84c] border border-[#c9a84c]/20'
                    : 'text-white/30 border border-white/10'
                }`}>
                  {game.available ? 'PLAY' : 'SOON'}
                </span>
              </div>
              <p className="text-sm text-white/30 leading-relaxed mb-3">{game.description}</p>
              <span className="text-xs text-[#c9a84c]/40">{game.xp}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="divider max-w-3xl mx-auto" />

      {/* ── Character Creation ─────────────────────────── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-white text-center mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Create Your <span className="gradient-gold">Character</span>
        </h2>
        <p className="text-white/30 text-center mb-10 text-sm">
          Your class determines your bonus XP paths.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {CHARACTER_CLASSES.map(cls => {
            const isSelected = selectedClass === cls.name
            return (
              <button
                key={cls.name}
                onClick={() => setSelectedClass(isSelected ? null : cls.name)}
                className={`rounded-xl p-5 text-center transition-all duration-300 ${
                  isSelected
                    ? 'bg-white/[0.06] border border-white/20'
                    : 'card-minimal'
                }`}
              >
                <span className="text-3xl block mb-3">{cls.icon}</span>
                <h3 className="font-semibold text-sm mb-1 text-white/80">{cls.name}</h3>
                <div className="flex flex-wrap gap-1 justify-center">
                  {cls.skills.map(s => (
                    <span key={s} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.04] text-white/25">
                      {s}
                    </span>
                  ))}
                </div>
                {isSelected && (
                  <p className="text-xs text-white/40 mt-3 leading-relaxed animate-fadeIn">{cls.description}</p>
                )}
              </button>
            )
          })}
        </div>

        {selectedClass && (
          <div className="max-w-md mx-auto animate-fadeIn">
            <div className="card-minimal rounded-xl p-5">
              <label className="text-xs text-white/30 block mb-2">Name your MajorWinner</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={characterName}
                  onChange={e => setCharacterName(e.target.value)}
                  placeholder="Enter a name..."
                  maxLength={20}
                  className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#c9a84c]/30 transition"
                />
                <button
                  onClick={handleCreateCharacter}
                  disabled={!characterName.trim()}
                  className="btn-gold px-5 py-2.5 rounded-lg text-sm disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
              {showCreateSuccess && (
                <p className="mt-3 text-center text-[#c9a84c] text-sm animate-fadeIn">
                  {characterName} the {selectedClass?.replace('The ', '')} is born!
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      <div className="divider max-w-3xl mx-auto" />

      {/* ── Leaderboard ───────────────────────────────── */}
      {players.length > 0 && (
        <section className="px-6 py-20 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-white text-center mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            Top <span className="gradient-gold">MajorWinners</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {players.map((p, i) => (
              <div key={p.rank} className="card-minimal rounded-xl p-4 text-center">
                {p.characterArt ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.characterArt} alt={p.name} className="w-12 h-12 rounded-full object-cover mx-auto mb-2" />
                ) : (
                  <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-xl ${
                    i === 0 ? 'bg-[#c9a84c]/20' : 'bg-white/[0.04]'
                  }`}>
                    {p.characterClass === 'The Mogul' ? '👑' : p.characterClass === 'The Survivor' ? '🛡️' : p.characterClass === 'The Siren' ? '🎤' : p.characterClass === 'The Producer' ? '🎧' : '⭐'}
                  </div>
                )}
                <p className="font-semibold text-white text-xs truncate">{p.name}</p>
                <p className="text-[10px] text-white/20 mb-1">{p.characterClass}</p>
                <p className="text-xs gradient-gold">{p.xp.toLocaleString()} XP</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="divider max-w-3xl mx-auto" />

      {/* ── Dave Dave Gallery ──────────────────────────── */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-white text-center mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Dave Dave <span className="gradient-gold">Gallery</span>
        </h2>
        <p className="text-white/30 text-center mb-10 text-sm">
          Art for emotional grounding, identity rebuilding, and healing.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {GALLERY_ITEMS.map(item => (
            <div key={item.title} className="card-minimal rounded-xl p-6">
              <h3 className="font-semibold text-white text-base mb-1">{item.title}</h3>
              <p className="text-[11px] text-[#c9a84c]/40 mb-3">by {item.artist}</p>
              <p className="text-sm text-white/30 leading-relaxed">{item.story}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider max-w-3xl mx-auto" />

      {/* ── Viverse World CTA ─────────────────────────── */}
      <section className="px-6 py-24 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Enter the <span className="gradient-gold">Viverse World</span>
        </h2>
        <p className="text-white/35 mb-10 max-w-md mx-auto text-sm leading-relaxed">
          Explore the MajorWinners League virtual world. Play, earn XP, and connect with other MajorWinners in 3D.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="https://www.viverse.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold px-8 py-3.5 rounded-full text-sm tracking-wide"
          >
            Launch Viverse →
          </a>
          <Link href="/academy" className="btn-outline px-8 py-3.5 rounded-full text-sm tracking-wide">
            Music Quests
          </Link>
        </div>
      </section>

      {/* ── Ecosystem Links ───────────────────────────── */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/navigator" className="card-minimal rounded-xl p-6 text-center group">
            <h3 className="font-semibold text-white text-sm mb-2">MWL Navigator</h3>
            <p className="text-white/25 text-xs leading-relaxed">Find verified resources — food, shelter, jobs, mental health.</p>
          </Link>
          <Link href="/academy" className="card-minimal rounded-xl p-6 text-center group">
            <h3 className="font-semibold text-white text-sm mb-2">BASMA Academy</h3>
            <p className="text-white/25 text-xs leading-relaxed">Gamified music lessons. Earn XP from quests.</p>
          </Link>
          <Link href="/hopes" className="card-minimal rounded-xl p-6 text-center group">
            <h3 className="font-semibold text-white text-sm mb-2">Hopes Chance</h3>
            <p className="text-white/25 text-xs leading-relaxed">Youth resources for ages 16–30. Free and confidential.</p>
          </Link>
        </div>
      </section>
    </main>
  )
}
