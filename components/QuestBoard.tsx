'use client'

import { useEffect, useState } from 'react'

interface Quest {
  id: string
  name: string
  path: string
  xp: number
  summary: string | null
  nextSteps: string | null
  prerequisite: string | null
  unlockStatus: string
  totalAssigned: number
}

const PATH_STYLES: Record<string, { color: string; border: string; bg: string; badge: string; emoji: string }> = {
  Music: {
    color: 'purple',
    border: 'border-purple-500/30',
    bg: 'from-purple-900/40 to-purple-950/20',
    badge: 'bg-purple-500/20 text-purple-300',
    emoji: '🎵',
  },
  Branding: {
    color: 'yellow',
    border: 'border-yellow-500/30',
    bg: 'from-yellow-900/30 to-amber-950/10',
    badge: 'bg-yellow-500/20 text-yellow-300',
    emoji: '🎨',
  },
  Health: {
    color: 'emerald',
    border: 'border-emerald-500/30',
    bg: 'from-emerald-900/30 to-green-950/10',
    badge: 'bg-emerald-500/20 text-emerald-300',
    emoji: '💚',
  },
  General: {
    color: 'gray',
    border: 'border-gray-500/30',
    bg: 'from-gray-900/30 to-gray-950/10',
    badge: 'bg-gray-500/20 text-gray-300',
    emoji: '📖',
  },
}

export default function QuestBoard() {
  const [quests, setQuests] = useState<Quest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [expandedQuest, setExpandedQuest] = useState<string | null>(null)

  useEffect(() => {
    const url = activeFilter === 'All' ? '/api/quests' : `/api/quests?path=${activeFilter}`
    setLoading(true)
    fetch(url)
      .then(r => r.json())
      .then(data => {
        setQuests(data.quests || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [activeFilter])

  const filters = ['All', 'Music', 'Branding', 'Health']

  return (
    <section className="px-6 py-16 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-white text-center mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        Quest Board 🗺️
      </h2>
      <p className="text-white/40 text-center mb-8 max-w-md mx-auto">
        Complete quests to earn XP, unlock achievements, and level up your skills.
      </p>

      {/* Path Filters */}
      <div className="flex justify-center gap-2 mb-10">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeFilter === f
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
            }`}
          >
            {f === 'All' ? '✨ All Paths' : `${PATH_STYLES[f]?.emoji || '📖'} ${f}`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
        </div>
      ) : quests.length === 0 ? (
        <p className="text-center text-white/40 py-8">No quests found for this path yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {quests.map(quest => {
            const style = PATH_STYLES[quest.path] || PATH_STYLES.General
            const isExpanded = expandedQuest === quest.id
            const isUnlocked = quest.unlockStatus === 'Unlocked'

            return (
              <div
                key={quest.id}
                onClick={() => setExpandedQuest(isExpanded ? null : quest.id)}
                className={`cursor-pointer bg-gradient-to-br ${style.bg} border ${style.border} rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] ${
                  !isUnlocked ? 'opacity-60' : ''
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {!isUnlocked && <span className="text-sm">🔒</span>}
                      <h3 className="font-bold text-white text-lg">{quest.name}</h3>
                    </div>
                    {quest.prerequisite && (
                      <p className="text-xs text-white/30">Requires: {quest.prerequisite}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`${style.badge} rounded-full px-3 py-1 text-xs font-bold`}>
                      {style.emoji} {quest.path}
                    </span>
                    <span className="text-sm font-black text-white/80">+{quest.xp} XP</span>
                  </div>
                </div>

                {/* Summary */}
                {quest.summary && (
                  <p className="text-sm text-white/50 leading-relaxed mb-3">{quest.summary}</p>
                )}

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-3 animate-fadeIn">
                    {quest.nextSteps && (
                      <div>
                        <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1">Next Steps</p>
                        <p className="text-sm text-white/40">{quest.nextSteps}</p>
                      </div>
                    )}

                    {/* Placeholder video player area */}
                    <div className="relative rounded-xl bg-black/40 border border-white/10 overflow-hidden aspect-video flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-4xl">▶️</span>
                        <p className="text-white/40 text-sm mt-2">Quest Video Module</p>
                        <p className="text-white/20 text-xs">Coming soon — video lessons unlock here</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-white/30">
                      <span>{quest.totalAssigned} student{quest.totalAssigned !== 1 ? 's' : ''} enrolled</span>
                      <span>{isUnlocked ? '✅ Unlocked' : '🔒 Complete prerequisite first'}</span>
                    </div>
                  </div>
                )}

                {/* Expand indicator */}
                {!isExpanded && (
                  <p className="text-xs text-white/20 mt-2">Tap to expand →</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
