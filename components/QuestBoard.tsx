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

const PATH_LABELS: Record<string, string> = {
  Music: 'Music',
  Branding: 'Branding',
  Health: 'Health',
  General: 'General',
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
      <h2 className="text-3xl font-bold text-white text-center mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
        Quest Board
      </h2>
      <div className="divider mx-auto mb-4" />
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
                ? 'border border-[#c9a84c]/60 bg-[#c9a84c]/10 text-[#e4cc7a]'
                : 'bg-white/[0.03] border border-white/[0.06] text-white/40 hover:bg-white/[0.06] hover:text-white/60'
            }`}
          >
            {f === 'All' ? 'All Paths' : PATH_LABELS[f] || f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#c9a84c] border-t-transparent" />
        </div>
      ) : quests.length === 0 ? (
        <p className="text-center text-white/30 py-8">No quests found for this path yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {quests.map(quest => {
            const isExpanded = expandedQuest === quest.id
            const isUnlocked = quest.unlockStatus === 'Unlocked'

            return (
              <div
                key={quest.id}
                onClick={() => setExpandedQuest(isExpanded ? null : quest.id)}
                className={`cursor-pointer glass rounded-2xl p-5 transition-all duration-300 ${
                  !isUnlocked ? 'opacity-50' : ''
                }`}
                style={{ transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {!isUnlocked && <span className="text-xs text-white/30">Locked</span>}
                      <h3 className="font-bold text-white text-lg">{quest.name}</h3>
                    </div>
                    {quest.prerequisite && (
                      <p className="text-xs text-white/25">Requires: {quest.prerequisite}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="bg-white/[0.06] text-white/50 rounded-full px-3 py-1 text-xs font-medium">
                      {quest.path}
                    </span>
                    <span className="text-sm font-bold text-[#c9a84c]">+{quest.xp} XP</span>
                  </div>
                </div>

                {/* Summary */}
                {quest.summary && (
                  <p className="text-sm text-white/40 leading-relaxed mb-3">{quest.summary}</p>
                )}

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3 animate-fadeIn">
                    {quest.nextSteps && (
                      <div>
                        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Next Steps</p>
                        <p className="text-sm text-white/40">{quest.nextSteps}</p>
                      </div>
                    )}

                    {/* Video placeholder */}
                    <div className="relative rounded-xl bg-black/40 border border-white/[0.06] overflow-hidden aspect-video flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-white/[0.06] flex items-center justify-center mx-auto mb-2">
                          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white/40 border-b-[6px] border-b-transparent ml-1" />
                        </div>
                        <p className="text-white/30 text-sm">Quest Video Module</p>
                        <p className="text-white/15 text-xs">Coming soon</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-white/25">
                      <span>{quest.totalAssigned} student{quest.totalAssigned !== 1 ? 's' : ''} enrolled</span>
                      <span>{isUnlocked ? 'Unlocked' : 'Complete prerequisite first'}</span>
                    </div>
                  </div>
                )}

                {/* Expand indicator */}
                {!isExpanded && (
                  <p className="text-xs text-white/15 mt-2">Tap to expand →</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
