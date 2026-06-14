'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES — matches /api/registrations response
   ═══════════════════════════════════════════════════════════════════════════ */

interface Registration {
  id: string
  parentName: string
  email: string
  phone: string
  status: string
  source: string
  message: string
  interests: string
  studentName: string
  studentAge: string
  ageGroup: string
  experienceLevel: string
  referralSource: string
  createdAt: string
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCHEDULE DATA — Mon-Thu, 6787 W Tropicana Ave
   ═══════════════════════════════════════════════════════════════════════════ */

const SCHEDULE_BLOCKS = [
  { time: '9:00–9:45 AM',       label: 'Tiny Tots Music',         month: 'july-aug', ageRange: '2–5',   duration: '45 min',  maxSlots: 10 },
  { time: '10:00–11:00 AM',     label: 'Kids Music (5–10)',       month: 'july-aug', ageRange: '5–10',  duration: '60 min',  maxSlots: 15 },
  { time: '11:00 AM–12:00 PM',  label: 'Kids Music (11–17)',      month: 'july-aug', ageRange: '11–17', duration: '60 min',  maxSlots: 15 },
  { time: '12:00–1:00 PM',      label: 'Piano Class',             month: 'july-aug', ageRange: 'All',   duration: '60 min',  maxSlots: 10 },
  { time: '1:00–2:00 PM',       label: 'Teens Recording Studio',  month: 'july-aug', ageRange: '13–17', duration: '60 min',  maxSlots: 10 },
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday']

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

function formatPhone(phone: string): string {
  if (!phone) return '—'
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`
  return phone
}

function safe(val: unknown): string {
  if (typeof val === 'string') return val
  if (typeof val === 'number') return String(val)
  return ''
}

/** Try to classify a registration into a schedule block based on interests/age */
function classifyRegistration(r: Registration): string {
  const interests = safe(r.interests).toLowerCase()
  const age = parseInt(safe(r.studentAge)) || 0
  const msg = safe(r.message).toLowerCase()

  // Check interests for keywords
  if (interests.includes('piano')) return 'Piano Class'
  if (interests.includes('recording') || interests.includes('studio')) return 'Teens Recording Studio'
  if (interests.includes('tiny tots') || interests.includes('toddler')) return 'Tiny Tots Music'

  // Classify by age
  if (age >= 2 && age <= 4) return 'Tiny Tots Music'
  if (age >= 5 && age <= 10) return 'Kids Music (5–10)'
  if (age >= 11 && age <= 17) return 'Kids Music (11–17)'
  if (age >= 13) return 'Teens Recording Studio'

  // Check message field for age
  const ageMatch = msg.match(/age:\s*(\d+)/)
  if (ageMatch) {
    const parsedAge = parseInt(ageMatch[1])
    if (parsedAge >= 2 && parsedAge <= 4) return 'Tiny Tots Music'
    if (parsedAge >= 5 && parsedAge <= 10) return 'Kids Music (5–10)'
    if (parsedAge >= 11 && parsedAge <= 17) return 'Kids Music (11–17)'
  }

  return 'Unassigned'
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

const ACCESS_CODE = '1515'

type TabView = 'roster' | 'calendar'

export default function TeacherContent() {
  const [authenticated, setAuthenticated] = useState(false)
  const [codeInput, setCodeInput] = useState('')
  const [codeError, setCodeError] = useState(false)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<TabView>('roster')
  const [expandedClass, setExpandedClass] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Check localStorage for saved auth
  useEffect(() => {
    try {
      const saved = localStorage.getItem('basma-teacher-auth')
      if (saved === 'true') setAuthenticated(true)
    } catch {}
  }, [])

  function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (codeInput.trim() === ACCESS_CODE) {
      setAuthenticated(true)
      setCodeError(false)
      try { localStorage.setItem('basma-teacher-auth', 'true') } catch {}
    } else {
      setCodeError(true)
    }
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white" style={{ background: '#050505' }}>
        <div className="text-center max-w-sm mx-auto px-6">
          <div className="mb-8">
            <p className="text-xs text-[#c9a84c]/50 tracking-[0.3em] uppercase mb-4">Teacher Portal</p>
            <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BASMA</span> Teachers
            </h1>
            <p className="text-white/40 text-sm">Enter your access code to continue.</p>
          </div>
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Access code"
              value={codeInput}
              onChange={(e) => { setCodeInput(e.target.value); setCodeError(false) }}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center text-2xl tracking-[0.5em] placeholder-white/25 focus:border-[#c9a84c]/50 focus:outline-none transition"
              autoFocus
            />
            {codeError && <p className="text-red-400 text-sm">Incorrect code. Please try again.</p>}
            <button
              type="submit"
              disabled={!codeInput.trim()}
              className="w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', color: '#050505' }}
            >
              Enter Portal
            </button>
          </form>
          <p className="mt-6 text-xs text-white/20">
            Contact admin for your access code
          </p>
        </div>
      </main>
    )
  }

  // Calendar state — teacher availability
  const [availability, setAvailability] = useState<Record<string, Record<string, 'available' | 'busy' | 'off'>>>(() => {
    const init: Record<string, Record<string, 'available' | 'busy' | 'off'>> = {}
    for (const day of DAYS) {
      init[day] = {}
      for (const block of SCHEDULE_BLOCKS) {
        init[day][block.label] = 'available'
      }
    }
    return init
  })

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('basma-teacher-availability')
      if (saved) setAvailability(JSON.parse(saved))
    } catch {}
  }, [])

  // Save to localStorage
  function toggleAvailability(day: string, block: string) {
    setAvailability(prev => {
      const next = { ...prev }
      next[day] = { ...prev[day] }
      const current = next[day][block] || 'available'
      const cycle: Record<string, 'available' | 'busy' | 'off'> = {
        'available': 'busy',
        'busy': 'off',
        'off': 'available',
      }
      next[day][block] = cycle[current]
      try { localStorage.setItem('basma-teacher-availability', JSON.stringify(next)) } catch {}
      return next
    })
  }

  useEffect(() => {
    fetch('/api/registrations')
      .then(r => r.json())
      .then(data => {
        setRegistrations(data.registrations || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  /* Group registrations by class block */
  const classBuckets = useMemo(() => {
    const buckets: Record<string, { block: typeof SCHEDULE_BLOCKS[0]; students: Registration[] }> = {}
    for (const block of SCHEDULE_BLOCKS) {
      buckets[block.label] = { block, students: [] }
    }
    buckets['Unassigned'] = {
      block: { time: 'TBD', label: 'Unassigned', month: 'july-aug', ageRange: 'All', duration: '', maxSlots: 0 },
      students: [],
    }

    for (const reg of registrations) {
      const cls = classifyRegistration(reg)
      if (buckets[cls]) {
        buckets[cls].students.push(reg)
      } else {
        buckets['Unassigned'].students.push(reg)
      }
    }
    return buckets
  }, [registrations])

  /* Filtered buckets */
  const filteredBuckets = useMemo(() => {
    return Object.entries(classBuckets)
      .filter(([, { students }]) => students.length > 0)
      .filter(([, { students }]) => {
        if (!searchQuery.trim()) return true
        const q = searchQuery.toLowerCase()
        return students.some(s =>
          safe(s.studentName).toLowerCase().includes(q) ||
          safe(s.parentName).toLowerCase().includes(q) ||
          safe(s.email).toLowerCase().includes(q)
        )
      })
  }, [classBuckets, searchQuery])

  /* Summary stats */
  const stats = useMemo(() => {
    const uniqueStudents = new Set(registrations.map(r => safe(r.studentName).trim().toLowerCase()).filter(Boolean))
    const uniqueParents = new Set(registrations.map(r => safe(r.email).trim().toLowerCase()).filter(Boolean))
    const complete = registrations.filter(r => safe(r.status).toLowerCase() !== 'incomplete').length
    const incomplete = registrations.filter(r => safe(r.status).toLowerCase() === 'incomplete').length

    return {
      total: registrations.length,
      uniqueStudents: uniqueStudents.size,
      uniqueParents: uniqueParents.size,
      complete,
      incomplete,
    }
  }, [registrations])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#050505' }}>
        <div className="text-center">
          <div className="text-4xl animate-pulse mb-4">🎵</div>
          <p className="text-white/40 text-sm">Loading registrations...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen text-white" style={{ background: '#050505' }}>
      {/* ─── Header ────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <Link href="/" className="text-lg font-bold tracking-wider" style={{ color: '#c9a84c', fontFamily: "'Playfair Display', serif" }}>
          BASMA
        </Link>
        <span className="text-sm text-white/40">Teacher Portal</span>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* ─── Title & Stats ──────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Teacher{' '}
            <span style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Dashboard
            </span>
          </h1>
          <p className="text-white/30 text-sm">Summer 2026 · 6787 W Tropicana Ave · Mon–Thu</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {[
            { label: 'Total Sign-ups', value: stats.total, emoji: '📋' },
            { label: 'Students', value: stats.uniqueStudents, emoji: '👧' },
            { label: 'Families', value: stats.uniqueParents, emoji: '👨‍👩‍👧' },
            { label: 'Complete', value: stats.complete, emoji: '✅' },
            { label: 'Incomplete', value: stats.incomplete, emoji: '⏳' },
          ].map(s => (
            <div key={s.label} className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="text-2xl font-bold" style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
              <div className="text-xs text-white/30 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ─── Tab navigation ─────────────────────────────── */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl bg-white/[0.03] w-fit">
          {([
            { id: 'roster' as const, label: '📋 Class Roster' },
            { id: 'calendar' as const, label: '📅 Calendar' },
          ]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                tab === t.id
                  ? 'bg-[#c9a84c]/20 text-[#c9a84c]'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'roster' && (
          <>
            {/* ─── Search ─────────────────────────────────── */}
            <div className="flex flex-wrap gap-3 mb-6">
              <input
                type="text"
                placeholder="Search student or parent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-sm text-white placeholder-white/20 focus:border-[#c9a84c]/30 focus:outline-none transition flex-1 min-w-[200px]"
              />
            </div>

            {/* ─── Class blocks ───────────────────────────── */}
            {filteredBuckets.length === 0 ? (
              <div className="text-center py-12 text-white/30">
                <p className="text-4xl mb-4">📭</p>
                <p>No registrations match your search</p>
              </div>
            ) : (
              filteredBuckets.map(([label, { block, students }]) => {
                const isExpanded = expandedClass === label
                const filteredStudents = searchQuery.trim()
                  ? students.filter(s => {
                      const q = searchQuery.toLowerCase()
                      return safe(s.studentName).toLowerCase().includes(q) ||
                             safe(s.parentName).toLowerCase().includes(q) ||
                             safe(s.email).toLowerCase().includes(q)
                    })
                  : students

                return (
                  <div key={label} className="mb-4 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {/* Class header — clickable */}
                    <button
                      onClick={() => setExpandedClass(isExpanded ? null : label)}
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ background: 'rgba(201,168,76,0.1)' }}>
                          {label === 'Tiny Tots Music' ? '👶' :
                           label.includes('5–10') ? '🎵' :
                           label.includes('11–17') ? '🎤' :
                           label === 'Piano Class' ? '🎹' :
                           label === 'Teens Recording Studio' ? '🎧' : '📋'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white/90">{block.label}</h3>
                          <p className="text-xs text-white/30">
                            {block.time} · Ages {block.ageRange}{block.duration ? ` · ${block.duration}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold" style={{ color: '#c9a84c' }}>
                          {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
                        </span>
                        <svg className={`w-5 h-5 text-white/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {/* Expanded student list */}
                    {isExpanded && (
                      <div className="border-t border-white/5">
                        {/* Table header */}
                        <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-2 text-xs text-white/25 uppercase tracking-wider border-b border-white/5">
                          <div className="col-span-3">Student</div>
                          <div className="col-span-1">Age</div>
                          <div className="col-span-3">Parent</div>
                          <div className="col-span-2">Phone</div>
                          <div className="col-span-2">Interests</div>
                          <div className="col-span-1">Status</div>
                        </div>

                        {filteredStudents.map((s, idx) => (
                          <div key={s.id} className={`px-5 py-3 ${idx % 2 === 0 ? 'bg-white/[0.01]' : ''} border-b border-white/[0.03] last:border-0`}>
                            {/* Desktop row */}
                            <div className="hidden md:grid grid-cols-12 gap-2 items-center text-sm">
                              <div className="col-span-3 font-medium text-white/80">{safe(s.studentName) || safe(s.parentName)}</div>
                              <div className="col-span-1 text-white/40">{safe(s.studentAge) || '—'}</div>
                              <div className="col-span-3">
                                <p className="text-white/60">{safe(s.parentName)}</p>
                                <p className="text-xs text-white/25">{safe(s.email)}</p>
                              </div>
                              <div className="col-span-2 text-white/40 text-xs">{formatPhone(safe(s.phone))}</div>
                              <div className="col-span-2 text-xs text-white/40">{safe(s.interests) || '—'}</div>
                              <div className="col-span-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  safe(s.status).toLowerCase() === 'incomplete'
                                    ? 'bg-yellow-500/10 text-yellow-400'
                                    : 'bg-green-500/10 text-green-400'
                                }`}>
                                  {safe(s.status) || 'New'}
                                </span>
                              </div>
                            </div>

                            {/* Mobile card */}
                            <div className="md:hidden space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-white/80">
                                  {safe(s.studentName) || safe(s.parentName)}
                                  {safe(s.studentAge) && <span className="text-white/30"> (age {s.studentAge})</span>}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  safe(s.status).toLowerCase() === 'incomplete'
                                    ? 'bg-yellow-500/10 text-yellow-400'
                                    : 'bg-green-500/10 text-green-400'
                                }`}>
                                  {safe(s.status) || 'New'}
                                </span>
                              </div>
                              <p className="text-xs text-white/40">{safe(s.parentName)} · {formatPhone(safe(s.phone))}</p>
                              {safe(s.interests) && <p className="text-xs text-white/30">🎵 {s.interests}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </>
        )}

        {tab === 'calendar' && (
          <>
            {/* ─── Calendar View ──────────────────────────── */}
            <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Weekly{' '}
                  <span style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Schedule
                  </span>
                </h2>
                <p className="text-xs text-white/30 mt-1">
                  Click a cell to toggle: <span className="text-green-400">Available</span> → <span className="text-yellow-400">Busy</span> → <span className="text-red-400/60">Off</span>
                </p>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.3)' }} /> Available</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: 'rgba(234,179,8,0.2)', border: '1px solid rgba(234,179,8,0.3)' }} /> Busy</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }} /> Off</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[700px]">
                <thead>
                  <tr>
                    <th className="p-3 text-left text-xs text-white/30 uppercase tracking-wider border-b border-white/5 w-48">Time Slot</th>
                    {DAYS.map(day => (
                      <th key={day} className="p-3 text-center text-xs text-white/30 uppercase tracking-wider border-b border-white/5">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SCHEDULE_BLOCKS.map(block => {
                    const studentCount = classBuckets[block.label]?.students.length || 0
                    return (
                      <tr key={block.label} className="border-b border-white/[0.03]">
                        <td className="p-3">
                          <div className="text-sm font-medium text-white/70">{block.label}</div>
                          <div className="text-xs text-white/25">{block.time}</div>
                          {studentCount > 0 && (
                            <div className="text-xs mt-1" style={{ color: '#c9a84c' }}>
                              {studentCount} enrolled
                            </div>
                          )}
                        </td>
                        {DAYS.map(day => {
                          const status = availability[day]?.[block.label] || 'available'
                          const colors = {
                            available: { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.15)', text: 'text-green-400/60', icon: '✓' },
                            busy: { bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.15)', text: 'text-yellow-400/60', icon: '⏳' },
                            off: { bg: 'rgba(239,68,68,0.05)', border: 'rgba(239,68,68,0.1)', text: 'text-red-400/40', icon: '✕' },
                          }
                          const c = colors[status]
                          return (
                            <td key={day} className="p-2">
                              <button
                                onClick={() => toggleAvailability(day, block.label)}
                                className="w-full p-3 rounded-lg transition hover:scale-[1.02] active:scale-95"
                                style={{ background: c.bg, border: `1px solid ${c.border}` }}
                              >
                                <div className={`text-lg ${c.text}`}>{c.icon}</div>
                                <div className={`text-[10px] mt-1 capitalize ${c.text}`}>{status}</div>
                              </button>
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-20 py-6 border-t border-white/5 text-center">
        <p className="text-xs text-white/20">
          © 2026 BASMA Music Academy · <a href="/" className="text-[#c9a84c]/40 hover:text-[#c9a84c]">basmaworld.com</a>
        </p>
      </footer>
    </main>
  )
}
