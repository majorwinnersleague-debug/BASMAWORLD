'use client'

import { useEffect, useState } from 'react'

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

const CLASS_COLORS: Record<string, string> = {
  'The Mogul': 'from-yellow-500 to-amber-600',
  'The Survivor': 'from-emerald-500 to-green-600',
  'The Siren': 'from-purple-500 to-pink-600',
  'The Producer': 'from-blue-500 to-cyan-600',
  'The Healer': 'from-rose-500 to-red-600',
  'Newcomer': 'from-gray-500 to-gray-600',
}

const CLASS_BADGES: Record<string, string> = {
  'The Mogul': '👑',
  'The Survivor': '🛡️',
  'The Siren': '🎤',
  'The Producer': '🎧',
  'The Healer': '💚',
  'Newcomer': '⭐',
}

const RANK_DISPLAY = ['🥇', '🥈', '🥉']

export default function XPLeaderboard() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(data => {
        setPlayers(data.players || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
      </div>
    )
  }

  if (players.length === 0) return null

  return (
    <section className="px-6 py-16 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white text-center mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        XP Leaderboard 🏆
      </h2>
      <p className="text-white/40 text-center mb-10 max-w-md mx-auto">
        Top players ranked by XP. Complete quests to climb the board!
      </p>

      <div className="space-y-3">
        {players.map((player, i) => {
          const gradient = CLASS_COLORS[player.characterClass] || CLASS_COLORS['Newcomer']
          const badge = CLASS_BADGES[player.characterClass] || '⭐'
          const isTop3 = i < 3

          return (
            <div
              key={player.rank}
              className={`relative flex items-center gap-4 rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] ${
                isTop3
                  ? 'bg-gradient-to-r from-purple-900/40 to-purple-950/20 border border-purple-500/30'
                  : 'bg-white/5 border border-white/10 hover:border-white/20'
              }`}
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-12 text-center">
                {isTop3 ? (
                  <span className="text-3xl">{RANK_DISPLAY[i]}</span>
                ) : (
                  <span className="text-lg font-bold text-white/50">#{player.rank}</span>
                )}
              </div>

              {/* Avatar */}
              <div className="flex-shrink-0">
                {player.characterArt ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={player.characterArt}
                    alt={`${player.name}'s character`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/50"
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-xl`}>
                    {badge}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white truncate">{player.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60 whitespace-nowrap">
                    {player.characterClass}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                  <span>{player.currentLevel}</span>
                  <span>•</span>
                  <span>{player.completedQuests} quests</span>
                </div>
              </div>

              {/* XP */}
              <div className="flex-shrink-0 text-right">
                <div className="text-xl font-black" style={{
                  background: 'linear-gradient(135deg, #c084fc, #fbbf24)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {player.xp.toLocaleString()}
                </div>
                <div className="text-xs text-white/40">XP</div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
