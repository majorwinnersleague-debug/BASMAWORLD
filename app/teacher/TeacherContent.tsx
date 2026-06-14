'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

interface Registration {
  _id: string
  _creationTime: number
  studentName: string
  age: number
  classType: string
  parentName: string
  parentEmail: string
  parentPhone: string
  paymentStatus: string
  photoConsent: boolean
  allergies: string
  medications: string
  medicalConditions: string
  emergencyContactName: string
  emergencyContactPhone: string
  liabilityAgreed: boolean
  createdAt?: number
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCHEDULE DATA — Mon-Thu, 6787 W Tropicana Ave
   ═══════════════════════════════════════════════════════════════════════════ */

const SCHEDULE_BLOCKS = [
  { time: '8:00–9:40 AM', label: 'Free 1-on-1 Lesson (AM)', month: 'june', ageRange: 'All Ages', duration: '20 min each', maxSlots: 5 },
  { time: '9:00–9:45 AM', label: 'Tiny Tots Music', month: 'july-aug', ageRange: '2–5', duration: '45 min', maxSlots: 5 },
  { time: '10:00 AM–12:00 PM', label: 'Group Discovery (AM)', month: 'june', ageRange: 'All Ages', duration: '2 hrs', maxSlots: 20 },
  { time: '10:00–11:30 AM', label: 'Kids Music (AM)', month: 'july-aug', ageRange: '5–17', duration: '90 min', maxSlots: 15 },
  { time: '11:30 AM–1:00 PM', label: 'Kids Music (PM)', month: 'july-aug', ageRange: '5–17', duration: '90 min', maxSlots: 15 },
  { time: '12:00–2:00 PM', label: 'Group Discovery (PM)', month: 'june', ageRange: 'All Ages', duration: '2 hrs', maxSlots: 20 },
  { time: '1:30–2:45 PM', label: 'Teen Recording (Early)', month: 'july-aug', ageRange: '13–17', duration: '75 min', maxSlots: 10 },
  { time: '2:20–4:00 PM', label: 'Free 1-on-1 Lesson (PM)', month: 'june', ageRange: 'All Ages', duration: '20 min each', maxSlots: 5 },
  { time: '2:45–4:00 PM', label: 'Teen Recording (Late)', month: 'july-aug', ageRange: '13–17', duration: '75 min', maxSlots: 10 },
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday']

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`
  return phone
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function matchClassToBlock(classType: string, block: typeof SCHEDULE_BLOCKS[0]): boolean {
  const ct = classType.toLowerCase()
  const bl = block.label.toLowerCase()
  // Direct match
  if (ct.includes(bl)) return true
  // Fuzzy matching for variants
  if (bl.includes('1-on-1') && bl.includes('am') && ct.includes('1-on-1') && ct.includes('am')) return true
  if (bl.includes('1-on-1') && bl.includes('pm') && ct.includes('1-on-1') && ct.includes('pm')) return true
  if (bl.includes('1-on-1') && bl.includes('pm') && ct.includes('discovery lesson')) return true
  if (bl.includes('group discovery') && bl.includes('am') && ct.includes('group discovery') && ct.includes('am')) return true
  if (bl.includes('group discovery') && bl.includes('pm') && ct.includes('group discovery') && ct.includes('pm')) return true
  if (bl.includes('group discovery') && ct.includes('group music')) return true
  if (bl.includes('group discovery') && ct.includes('group classes') && bl.includes('am') && ct.includes('10:00')) return true
  if (bl.includes('group discovery') && ct.includes('group classes') && bl.includes('pm')) return true
  if (bl.includes('tiny tots') && ct.includes('tiny tots')) return true
  if (bl.includes('kids music') && bl.includes('am') && ct.includes('kids music') && ct.includes('am')) return true
  if (bl.includes('kids music') && bl.includes('pm') && ct.includes('kids music') && ct.includes('pm')) return true
  if (bl.includes('teen recording') && ct.includes('teen') && (ct.includes('recording') || ct.includes('adult'))) return true
  return false
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

const ACCESS_CODE = '1515'

type TabView = 'roster' | 'calendar' | 'attendance'

export default function TeacherContent() {
  const [authenticated, setAuthenticated] = useState(false)
  const [codeInput, setCodeInput] = useState('')
  const [codeError, setCodeError] = useState(false)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<TabView>('roster')
  const [filterMonth, setFilterMonth] = useState<'all' | 'june' | 'july-aug'>('all')
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
              <span className="gradient-gold">BASMA</span> Teachers
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
    // Default: all available
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
    // "Other" bucket for unmatched
    buckets['Other'] = { block: { time: 'Varies', label: 'Other / By Appointment', month: 'june', ageRange: 'All', duration: '', maxSlots: 0 }, students: [] }

    for (const reg of registrations) {
      let matched = false
      for (const block of SCHEDULE_BLOCKS) {
        if (matchClassToBlock(reg.classType, block)) {
          buckets[block.label].students.push(reg)
          matched = true
          break
        }
      }
      if (!matched) {
        buckets['Other'].students.push(reg)
      }
    }
    return buckets
  }, [registrations])

  /* Filtered buckets */
  const filteredBuckets = useMemo(() => {
    return Object.entries(classBuckets)
      .filter(([_, { block, students }]) => {
        if (filterMonth === 'all') return students.length > 0
        return block.month === filterMonth && students.length > 0
      })
      .filter(([_, { students }]) => {
        if (!searchQuery.trim()) return true
        const q = searchQuery.toLowerCase()
        return students.some(s =>
          s.studentName.toLowerCase().includes(q) ||
          s.parentName.toLowerCase().includes(q) ||
          s.parentEmail.toLowerCase().includes(q)
        )
      })
  }, [classBuckets, filterMonth, searchQuery])

  /* Summary stats */
  const stats = useMemo(() => {
    const uniqueStudents = new Set(registrations.map(r => r.studentName.trim().toLowerCase()))
    const uniqueParents = new Set(registrations.map(r => r.parentEmail.trim().toLowerCase()))
    const juneCount = registrations.filter(r => {
      const ct = r.classType.toLowerCase()
      return ct.includes('june') || ct.includes('group music') || ct.includes('group classes') || ct.includes('discovery') || ct.includes('1-on-1') || ct.includes('by appointment')
    }).length
    const julAugCount = registrations.filter(r => {
      const ct = r.classType.toLowerCase()
      return ct.includes('jul') || ct.includes('aug') || ct.includes('tiny tots') || ct.includes('kids music') || ct.includes('recording')
    }).length

    return {
      total: registrations.length,
      uniqueStudents: uniqueStudents.size,
      uniqueParents: uniqueParents.size,
      june: juneCount,
      julAug: julAugCount,
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
            Teacher <span className="gradient-gold">Dashboard</span>
          </h1>
          <p className="text-white/30 text-sm">Summer 2026 · 6787 W Tropicana Ave · Mon–Thu</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {[
            { label: 'Total Sign-ups', value: stats.total, emoji: '📋' },
            { label: 'Students', value: stats.uniqueStudents, emoji: '👧' },
            { label: 'Families', value: stats.uniqueParents, emoji: '👨‍👩‍👧' },
            { label: 'June (Free)', value: stats.june, emoji: '🆓' },
            { label: 'Jul/Aug ($25)', value: stats.julAug, emoji: '☀️' },
          ].map(s => (
            <div key={s.label} className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="text-2xl font-bold gradient-gold">{s.value}</div>
              <div className="text-xs text-white/30 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ─── Tab navigation ─────────────────────────────── */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl bg-white/[0.03] w-fit">
          {([
            { id: 'roster' as const, label: '📋 Class Roster', },
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
            {/* ─── Filters ────────────────────────────────── */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex gap-1 p-1 rounded-lg bg-white/[0.03]">
                {(['all', 'june', 'july-aug'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setFilterMonth(m)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                      filterMonth === m
                        ? 'bg-[#c9a84c]/20 text-[#c9a84c]'
                        : 'text-white/30 hover:text-white/50'
                    }`}
                  >
                    {m === 'all' ? 'All' : m === 'june' ? '🆓 June' : '☀️ Jul/Aug'}
                  </button>
                ))}
              </div>
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
                <p>No classes match your filters</p>
              </div>
            ) : (
              filteredBuckets.map(([label, { block, students }]) => {
                const isExpanded = expandedClass === label
                const filteredStudents = searchQuery.trim()
                  ? students.filter(s => {
                      const q = searchQuery.toLowerCase()
                      return s.studentName.toLowerCase().includes(q) || s.parentName.toLowerCase().includes(q) || s.parentEmail.toLowerCase().includes(q)
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
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ background: block.month === 'june' ? 'rgba(34,197,94,0.1)' : 'rgba(201,168,76,0.1)' }}>
                          {block.month === 'june' ? '🆓' : '💰'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white/90">{block.label}</h3>
                          <p className="text-xs text-white/30">
                            {block.time} · {block.ageRange} · {block.duration}
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
                          <div className="col-span-2">Medical</div>
                          <div className="col-span-1">Photo</div>
                        </div>

                        {filteredStudents.map((s, idx) => {
                          const hasAllergies = s.allergies && s.allergies !== 'None' && s.allergies !== 'No' && s.allergies !== 'N/A' && s.allergies !== 'none'
                          const hasMedical = s.medicalConditions && s.medicalConditions !== 'None' && s.medicalConditions !== 'No' && s.medicalConditions !== 'N/A' && s.medicalConditions !== 'none' && s.medicalConditions !== 'Ninguno'
                          const hasMeds = s.medications && s.medications !== 'None' && s.medications !== 'No' && s.medications !== 'N/A' && s.medications !== 'none'

                          return (
                            <div key={s._id} className={`px-5 py-3 ${idx % 2 === 0 ? 'bg-white/[0.01]' : ''} border-b border-white/[0.03] last:border-0`}>
                              {/* Desktop row */}
                              <div className="hidden md:grid grid-cols-12 gap-2 items-center text-sm">
                                <div className="col-span-3 font-medium text-white/80">{s.studentName}</div>
                                <div className="col-span-1 text-white/40">{s.age ? Math.floor(s.age) : '—'}</div>
                                <div className="col-span-3">
                                  <p className="text-white/60">{s.parentName}</p>
                                  <p className="text-xs text-white/25">{s.parentEmail}</p>
                                </div>
                                <div className="col-span-2 text-white/40 text-xs">{formatPhone(s.parentPhone)}</div>
                                <div className="col-span-2">
                                  {hasAllergies && <span className="text-xs text-orange-400">⚠️ {s.allergies}</span>}
                                  {hasMedical && <span className="text-xs text-red-400 block">🏥 {s.medicalConditions}</span>}
                                  {hasMeds && <span className="text-xs text-yellow-400 block">💊 {s.medications}</span>}
                                  {!hasAllergies && !hasMedical && !hasMeds && <span className="text-xs text-green-400/50">✓ Clear</span>}
                                </div>
                                <div className="col-span-1">
                                  <span className={`text-xs ${s.photoConsent ? 'text-green-400' : 'text-red-400'}`}>
                                    {s.photoConsent ? '📸 Yes' : '🚫 No'}
                                  </span>
                                </div>
                              </div>

                              {/* Mobile card */}
                              <div className="md:hidden space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-white/80">{s.studentName} <span className="text-white/30">(age {s.age ? Math.floor(s.age) : '?'})</span></span>
                                  <span className={`text-xs ${s.photoConsent ? 'text-green-400' : 'text-red-400'}`}>
                                    {s.photoConsent ? '📸' : '🚫'}
                                  </span>
                                </div>
                                <p className="text-xs text-white/40">{s.parentName} · {formatPhone(s.parentPhone)}</p>
                                {hasAllergies && <p className="text-xs text-orange-400">⚠️ {s.allergies}</p>}
                              </div>
                            </div>
                          )
                        })}

                        {/* Emergency contacts summary */}
                        <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5">
                          <p className="text-xs text-white/20 uppercase tracking-wider mb-2">Emergency Contacts</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                            {filteredStudents.map(s => (
                              <p key={s._id} className="text-xs text-white/40">
                                {s.studentName}: <span className="text-white/50">{s.emergencyContactName}</span> · {formatPhone(s.emergencyContactPhone)}
                              </p>
                            ))}
                          </div>
                        </div>
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
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Weekly <span className="gradient-gold">Schedule</span>
                </h2>
                <p className="text-xs text-white/30 mt-1">Click a cell to toggle: <span className="text-green-400">Available</span> → <span className="text-yellow-400">Busy</span> → <span className="text-red-400/60">Off</span></p>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500/20 border border-green-500/30" /> Available</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500/30" /> Busy</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/10 border border-red-500/20" /> Off</span>
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
