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
    description: 'Born leaders who turn ideas into empires. Bonus XP from Branding quests.',
    color: 'from-[#c9a84c] to-[#a08539]',
    border: 'border-[#c9a84c]/30',
    glow: 'rgba(201,168,76,0.15)',
    skills: ['Leadership', 'Marketing', 'Strategy'],
  },
  {
    name: 'The Survivor',
    emoji: '🛡️',
    description: 'Resilient warriors who turn adversity into strength. Bonus XP from Wellness quests.',
    color: 'from-emerald-500 to-emerald-700',
    border: 'border-emerald-500/30',
    glow: 'rgba(52,211,153,0.15)',
    skills: ['Resilience', 'Adaptability', 'Community'],
  },
  {
    name: 'The Siren',
    emoji: '🎤',
    description: 'Natural performers whose voice moves mountains. Bonus XP from Music quests.',
    color: 'from-[#9b7dff] to-purple-700',
    border: 'border-[#9b7dff]/30',
    glow: 'rgba(155,125,255,0.15)',
    skills: ['Vocals', 'Performance', 'Stage Presence'],
  },
  {
    name: 'The Producer',
    emoji: '🎧',
    description: 'Creative architects who build worlds through sound. Bonus XP from production quests.',
    color: 'from-blue-500 to-blue-700',
    border: 'border-blue-500/30',
    glow: 'rgba(59,130,246,0.15)',
    skills: ['Production', 'Mixing', 'Composition'],
  },
  {
    name: 'The Healer',
    emoji: '💚',
    description: 'Compassionate souls who uplift everyone around them. Bonus XP from community service.',
    color: 'from-rose-500 to-rose-700',
    border: 'border-rose-500/30',
    glow: 'rgba(244,63,94,0.15)',
    skills: ['Empathy', 'Support', 'Wellness'],
  },
]

const MINI_GAMES = [
  {
    title: 'Rhythm Drop',
    description: 'Tap notes to the beat. Chain combos. Climb the leaderboard.',
    href: '/game/rhythm',
    emoji: '🎵',
    gradient: 'from-[#9b7dff]/20 to-[#c9a84c]/10',
    border: 'border-[#9b7dff]/20',
    tag: 'PLAY NOW',
    xp: '+50 XP per song',
  },
  {
    title: 'Music Trivia',
    description: 'Test your knowledge of music theory, history, and artists.',
    href: '/game/trivia',
    emoji: '🧠',
    gradient: 'from-[#c9a84c]/20 to-emerald-500/10',
    border: 'border-[#c9a84c]/20',
    tag: 'PLAY NOW',
    xp: '+30 XP per round',
  },
  {
    title: 'Ear Training',
    description: 'Identify intervals, chords, and scales by ear. Sharpen your musical hearing.',
    href: '/game/ear-training',
    emoji: '👂',
    gradient: 'from-emerald-500/20 to-blue-500/10',
    border: 'border-emerald-500/20',
    tag: 'COMING SOON',
    xp: '+40 XP per session',
  },
]

const GALLERY_ITEMS = [
  {
    title: 'Phoenix Rising',
    artist: 'Dave Dave',
    story: 'Transformation and resilience in the face of adversity.',
    themes: ['Survival', 'Resilience', 'Transformation'],
    emoji: '🔥',
  },
  {
    title: 'Identity Reclaimed',
    artist: 'Dave Dave',
    story: 'The journey of rebuilding self after trauma.',
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

const ACHIEVEMENTS = [
  { name: 'First Notes', desc: 'Complete your first Rhythm Drop song', emoji: '🎼', unlocked: false },
  { name: 'Combo King', desc: 'Hit a 50-note combo streak', emoji: '🔥', unlocked: false },
  { name: 'Quiz Whiz', desc: 'Score 100% on a Music Trivia round', emoji: '🏅', unlocked: false },
  { name: 'Class Act', desc: 'Create your MajorWinner character', emoji: '🧬', unlocked: false },
  { name: 'Navigator', desc: 'Use the MWL Navigator to find a resource', emoji: '🗺️', unlocked: false },
  { name: 'Quest Master', desc: 'Complete 10 quests on the Quest Board', emoji: '⚔️', unlocked: false },
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
    <main className="min-h-screen text-white grain">

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(201,168,76,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />

        <div className="relative z-10 text-center max-w-4xl mx-auto animate-fadeIn">
          <div className="inline-flex items-center gap-2 glass-gold rounded-full px-5 py-2 mb-8 text-sm text-[#c9a84c]/80">
            Play · Earn XP · Level Up
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="gradient-gold">MajorWinners</span>
          </h1>
          <p className="text-xl text-white/60 mb-3 max-w-2xl mx-auto leading-relaxed">
            Choose your character. Play music games. Earn XP in the real world and the Viverse.
          </p>
          <p className="text-white/30 max-w-lg mx-auto text-sm">
            Your MajorWinner is your avatar across the entire MWL ecosystem — from music lessons to community events to the virtual world.
          </p>
        </div>
      </section>

      {/* ── Mini-Games ─────────────────────────────────── */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Play <span className="gradient-gold">Games</span>
        </h2>
        <p className="text-white/40 text-center mb-10 max-w-md mx-auto text-sm">
          Earn XP and climb the leaderboard by playing music games.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {MINI_GAMES.map(game => (
            <Link
              key={game.title}
              href={game.tag === 'COMING SOON' ? '#' : game.href}
              className={`card-premium rounded-2xl p-6 group relative overflow-hidden ${game.tag === 'COMING SOON' ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${game.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{game.emoji}</span>
                  <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full ${
                    game.tag === 'PLAY NOW'
                      ? 'bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30'
                      : 'bg-white/10 text-white/40 border border-white/10'
                  }`}>
                    {game.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed mb-4">{game.description}</p>
                <span className="text-xs text-[#c9a84c]/60">{game.xp}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="divider max-w-4xl mx-auto" />

      {/* ── Character Creation ─────────────────────────── */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Create Your <span className="gradient-gold">Character</span>
        </h2>
        <p className="text-white/40 text-center mb-10 max-w-md mx-auto text-sm">
          Your class determines your bonus XP paths and unlocks unique abilities.
        </p>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {CHARACTER_CLASSES.map(cls => {
            const isSelected = selectedClass === cls.name
            return (
              <button
                key={cls.name}
                onClick={() => setSelectedClass(isSelected ? null : cls.name)}
                className={`relative rounded-2xl p-5 text-center transition-all duration-500 ${
                  isSelected
                    ? `bg-gradient-to-b ${cls.color} shadow-xl`
                    : 'card-premium hover:border-white/20'
                }`}
                style={isSelected ? { boxShadow: `0 12px 40px ${cls.glow}` } : {}}
              >
                <span className="text-4xl block mb-3">{cls.emoji}</span>
                <h3 className={`font-bold text-lg mb-2 ${isSelected ? 'text-white' : 'text-white/70'}`}>
                  {cls.name}
                </h3>
                <div className="flex flex-wrap gap-1 justify-center mb-3">
                  {cls.skills.map(s => (
                    <span key={s} className={`text-[10px] px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-black/20 text-white/80' : 'bg-white/[0.06] text-white/30'
                    }`}>
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

        {/* Name input + Create */}
        {selectedClass && (
          <div className="max-w-md mx-auto animate-fadeIn">
            <div className="glass-gold rounded-2xl p-6">
              <label className="text-sm text-white/50 block mb-2">Name your MajorWinner</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={characterName}
                  onChange={e => setCharacterName(e.target.value)}
                  placeholder="Enter a name..."
                  maxLength={20}
                  className="flex-1 bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a84c]/40 transition"
                />
                <button
                  onClick={handleCreateCharacter}
                  disabled={!characterName.trim()}
                  className="btn-gold px-6 py-3 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                >
                  Create
                </button>
              </div>
              {showCreateSuccess && (
                <div className="mt-4 text-center animate-fadeIn">
                  <p className="text-[#c9a84c] font-bold text-lg">
                    {CHARACTER_CLASSES.find(c => c.name === selectedClass)?.emoji} {characterName} the {selectedClass?.replace('The ', '')} is born!
                  </p>
                  <p className="text-white/40 text-sm mt-1">Start playing games to earn XP</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <div className="divider max-w-4xl mx-auto" />

      {/* ── Active MajorWinners Leaderboard ─────────────── */}
      {players.length > 0 && (
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            Top <span className="gradient-gold">MajorWinners</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {players.map((p, i) => (
              <div key={p.rank} className={`card-premium rounded-2xl p-4 text-center ${i === 0 ? 'glass-gold' : ''}`}>
                {p.characterArt ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.characterArt} alt={p.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-2 border-[#c9a84c]/40" />
                ) : (
                  <div className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl ${
                    i === 0 ? 'bg-gradient-to-br from-[#c9a84c] to-[#a08539]' : 'bg-gradient-to-br from-white/10 to-white/5'
                  }`}>
                    {p.characterClass === 'The Mogul' ? '👑' : p.characterClass === 'The Survivor' ? '🛡️' : p.characterClass === 'The Siren' ? '🎤' : p.characterClass === 'The Producer' ? '🎧' : '⭐'}
                  </div>
                )}
                <p className="font-bold text-white text-sm truncate">{p.name}</p>
                <p className="text-[10px] text-white/30 mb-1">{p.characterClass}</p>
                <p className="text-sm font-bold gradient-gold">{p.xp.toLocaleString()} XP</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="divider max-w-4xl mx-auto" />

      {/* ── Achievements ──────────────────────────────── */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-white text-center mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Achievements
        </h2>
        <p className="text-white/30 text-center mb-10 text-sm">Unlock badges by playing games and completing quests</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {ACHIEVEMENTS.map(a => (
            <div
              key={a.name}
              className={`card-premium rounded-2xl p-4 text-center ${a.unlocked ? 'glass-gold' : 'opacity-40'}`}
            >
              <span className="text-3xl block mb-2 grayscale">{a.emoji}</span>
              <p className="font-bold text-white text-xs mb-1">{a.name}</p>
              <p className="text-[10px] text-white/30 leading-tight">{a.desc}</p>
              {!a.unlocked && (
                <span className="inline-block mt-2 text-[9px] text-white/20 bg-white/[0.04] px-2 py-0.5 rounded-full">LOCKED</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="divider max-w-4xl mx-auto" />

      {/* ── Dave Dave Digital Gallery ──────────────────── */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Dave Dave <span className="gradient-gold">Digital Gallery</span>
        </h2>
        <p className="text-white/40 text-center mb-10 max-w-lg mx-auto text-sm">
          A space for emotional grounding. Art that inspires identity rebuilding and healing.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map(item => (
            <div
              key={item.title}
              className="card-premium rounded-2xl overflow-hidden group"
            >
              <div className="aspect-square bg-gradient-to-br from-[#c9a84c]/10 to-[#9b7dff]/10 flex items-center justify-center group-hover:from-[#c9a84c]/20 group-hover:to-[#9b7dff]/20 transition-all duration-700">
                <span className="text-6xl group-hover:scale-110 transition-transform duration-500">{item.emoji}</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-white text-lg mb-1">{item.title}</h3>
                <p className="text-[10px] text-[#c9a84c]/50 mb-3 tracking-wide">by {item.artist}</p>
                <p className="text-sm text-white/40 leading-relaxed mb-3">{item.story}</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.themes.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#c9a84c]/10 text-[#c9a84c]/60">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider max-w-4xl mx-auto" />

      {/* ── Viverse World CTA ─────────────────────────── */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <div className="glass-gold rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(201,168,76,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.5) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }} />
          <div className="relative z-10">
            <span className="text-5xl block mb-4">🌐</span>
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Enter the <span className="gradient-gold">Viverse World</span>
            </h2>
            <p className="text-white/50 mb-8 max-w-md mx-auto text-sm">
              Explore the MajorWinners League virtual world. Play music games, earn XP, and connect with other MajorWinners in an immersive 3D environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://www.viverse.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold px-8 py-4 rounded-2xl text-lg inline-flex items-center justify-center gap-2 pulse-cta"
              >
                🎮 Launch Viverse
              </a>
              <Link href="/academy" className="btn-outline px-8 py-4 rounded-2xl text-lg inline-flex items-center justify-center gap-2">
                🎵 Music Quests
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Connects ───────────────────────────── */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white text-center mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
          The Ecosystem
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/navigator" className="card-premium rounded-2xl p-6 text-center group">
            <span className="text-3xl block mb-3">🗺️</span>
            <h3 className="font-bold text-white mb-2">MWL Navigator</h3>
            <p className="text-white/30 text-sm">Find verified resources near you — food, shelter, jobs, mental health.</p>
            <span className="text-[#c9a84c] text-xs mt-3 block group-hover:underline">Open Navigator →</span>
          </Link>
          <Link href="/academy" className="card-premium rounded-2xl p-6 text-center group">
            <span className="text-3xl block mb-3">🎵</span>
            <h3 className="font-bold text-white mb-2">BASMA Academy</h3>
            <p className="text-white/30 text-sm">Gamified music lessons. Earn XP from quests and climb the leaderboard.</p>
            <span className="text-[#c9a84c] text-xs mt-3 block group-hover:underline">Start Learning →</span>
          </Link>
          <Link href="/hopes" className="card-premium rounded-2xl p-6 text-center group">
            <span className="text-3xl block mb-3">💚</span>
            <h3 className="font-bold text-white mb-2">Hopes Chance</h3>
            <p className="text-white/30 text-sm">Youth resources for ages 16–30. Free, confidential, no judgment.</p>
            <span className="text-[#c9a84c] text-xs mt-3 block group-hover:underline">Get Support →</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
