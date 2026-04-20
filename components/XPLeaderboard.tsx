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
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#c9a84c] border-t-transparent" />
      </div>
    )
  }

  if (players.length === 0) return null

  return (
    <section className="px-6 py-16 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white text-center mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
        XP Leaderboard
      </h2>
      <div className="divider mx-auto mb-4" />
      <p className="text-white/40 text-center mb-10 max-w-md mx-auto">
        Top players ranked by XP. Complete quests to climb the board.
      </p>

      <div className="glass rounded-2xl p-6 space-y-2">
        {players.map((player, i) => {
          const isTop3 = i < 3

          return (
            <div
              key={player.rank}
              className={`relative flex items-center gap-4 rounded-xl p-4 transition-all duration-300 ${
                isTop3
                  ? 'bg-[#c9a84c]/[0.06] border border-[#c9a84c]/[0.12]'
                  : 'bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08]'
              }`}
              style={{ transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-10 text-center">
                {isTop3 ? (
                  <span className={`text-sm font-bold ${i === 0 ? 'text-[#e4cc7a]' : i === 1 ? 'text-white/60' : 'text-[#b87333]'}`}>
                    {i === 0 ? '1st' : i === 1 ? '2nd' : '3rd'}
                  </span>
                ) : (
                  <span className="text-sm font-bold text-white/30">#{player.rank}</span>
                )}
              </div>

              {/* Avatar */}
              <div className="flex-shrink-0">
                {player.characterArt ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={player.characterArt}
                    alt={`${player.name}'s character`}
                    className={`w-10 h-10 rounded-full object-cover ${isTop3 ? 'border border-[#c9a84c]/30' : 'border border-white/[0.08]'}`}
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    isTop3
                      ? 'bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/20'
                      : 'bg-white/[0.04] text-white/40 border border-white/[0.06]'
                  }`}>
                    {player.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white truncate">{player.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40 whitespace-nowrap">
                    {player.characterClass}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-white/30">
                  <span>{player.currentLevel}</span>
                  <span>·</span>
                  <span>{player.completedQuests} quests</span>
                </div>
              </div>

              {/* XP */}
              <div className="flex-shrink-0 text-right">
                <div className={`text-lg font-bold ${isTop3 ? 'text-[#e4cc7a]' : 'text-white/60'}`}>
                  {player.xp.toLocaleString()}
                </div>
                <div className="text-xs text-white/30">XP</div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
