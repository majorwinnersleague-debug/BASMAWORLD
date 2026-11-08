'use client'

import { useCallback, useEffect, useState } from 'react'
import { POLICY_LINES } from '@/lib/lesson-policy'

/* Staff screen for lesson credits (Phase 2).
   Any staff: find a family, record a lesson (attended / no-show).
   Admins: exceptions — give a credit back, change expiry, add credits,
   add a family/student. Every exception needs a note. */

interface Credit { minutes: 30 | 60; remaining: number; nextExpiry: string | null; expiredUnused: number }
interface Student { id: number; name: string; age: string | null; instrument: string | null; firstNoShowForgiven: boolean; credits: Credit[] }
interface Purchase { id: number; studentId: number; source: string; packageName: string | null; minutes: number; lessonsTotal: number; lessonsUsed: number; amountCents: number | null; status: string; paidAt: string; expiresAt: string; active: boolean; note: string | null }
interface Lesson { id: number; studentId: number; minutes: number; lessonDate: string; status: string; usedCredit: boolean; creditRestored: boolean; note: string | null; recordedBy: string | null }
interface LedgerEntry { id: number; studentId: number; delta: number; reason: string; note: string | null; createdBy: string | null; createdAt: string }
interface Family { guardian: { id: number; email: string; name: string | null; phone: string | null }; students: Student[]; purchases: Purchase[]; lessons: Lesson[]; ledger?: LedgerEntry[] }
interface SearchResult { id: number; email: string; name: string | null; students: string[] }

const gold = '#c9a84c'
const card: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16 }
const input = 'w-full rounded-lg px-3 py-2 bg-white/[0.05] border border-white/10 text-white text-sm placeholder-white/30'
const btn = 'px-3 py-2 rounded-lg text-xs font-semibold transition disabled:opacity-40'

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles', month: 'short', day: 'numeric', year: 'numeric' }) : '—'
const todayPT = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' })
const statusLabel: Record<string, string> = {
  attended: '✅ Attended',
  no_show: '❌ No-show (credit used)',
  no_show_forgiven: '🙏 No-show — first one forgiven',
}
const reasonLabel: Record<string, string> = {
  purchase: 'Purchase',
  lesson_attended: 'Lesson attended',
  no_show: 'No-show',
  no_show_forgiven: 'First no-show forgiven',
  credit_restored: 'Credit given back',
  expiry_changed: 'Expiry changed',
  manual_grant: 'Credits added by staff',
  refund: 'Refund',
}

export default function CreditsContent() {
  const [auth, setAuth] = useState<'checking' | 'ok' | 'no'>('checking')
  const [role, setRole] = useState<'admin' | 'teacher' | ''>('')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [family, setFamily] = useState<Family | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  // Record-lesson form (per student)
  const [lessonForm, setLessonForm] = useState<Record<number, { minutes: 30 | 60; date: string; outcome: 'attended' | 'no_show'; note: string }>>({})
  // Admin forms
  const [grantForm, setGrantForm] = useState<{ studentId: number; minutes: 30 | 60; lessons: string; note: string } | null>(null)
  const [extendForm, setExtendForm] = useState<{ purchaseId: number; date: string; note: string } | null>(null)
  const [restoreForm, setRestoreForm] = useState<{ lessonId: number; note: string } | null>(null)
  const [addForm, setAddForm] = useState<{ email: string; guardianName: string; phone: string; studentName: string; studentAge: string } | null>(null)

  const isAdmin = role === 'admin'

  const search = useCallback(async (q: string) => {
    const res = await fetch(`/api/staff/credits?q=${encodeURIComponent(q)}`, { cache: 'no-store' })
    if (res.status === 401) { setAuth('no'); return }
    const data = await res.json()
    if (data.role) setRole(data.role)
    setResults(data.results || [])
  }, [])

  const openFamily = useCallback(async (guardianId: number) => {
    const res = await fetch(`/api/staff/credits?guardianId=${guardianId}`, { cache: 'no-store' })
    if (res.status === 401) { setAuth('no'); return }
    const data = await res.json()
    if (data.family) setFamily(data.family)
    else setMessage({ kind: 'error', text: data.error || 'Could not load that family.' })
  }, [])

  useEffect(() => {
    fetch('/api/staff/me', { cache: 'no-store' })
      .then(async r => {
        if (!r.ok) { setAuth('no'); return }
        const data = await r.json()
        setRole(data.user?.role || '')
        setAuth('ok')
        search('')
      })
      .catch(() => setAuth('no'))
  }, [search])

  async function act(payload: Record<string, unknown>, okText: string) {
    setBusy(true)
    setMessage(null)
    try {
      const res = await fetch('/api/staff/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setMessage({ kind: 'ok', text: data.status === 'no_show_forgiven' ? 'Recorded. This was the student’s first no-show, so it was forgiven — no credit used.' : okText })
        if (family) await openFamily(family.guardian.id)
        return data
      }
      setMessage({ kind: 'error', text: data.error || 'Something went wrong. Nothing was changed.' })
    } catch {
      setMessage({ kind: 'error', text: 'Network problem. Nothing was changed.' })
    } finally {
      setBusy(false)
    }
    return null
  }

  if (auth === 'checking') {
    return <main className="min-h-screen flex items-center justify-center text-white/40 text-sm">Loading…</main>
  }
  if (auth === 'no') {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div style={card} className="max-w-sm text-center">
          <p className="text-white font-semibold mb-2">Staff sign-in required</p>
          <p className="text-white/40 text-sm mb-4">Sign in on the Teacher Portal first, then come back to this page.</p>
          <a href="/teacher" className="inline-block px-5 py-2 rounded-full text-sm font-semibold" style={{ background: gold, color: '#0D0118' }}>Go to Teacher Portal</a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: gold }}>🎵 Lesson Credits</h1>
            <p className="text-white/40 text-xs mt-1">Signed in as {role === 'admin' ? 'admin' : 'teacher'}{isAdmin ? ' — you can make exceptions' : ''}</p>
          </div>
          <a href="/teacher" className="text-xs text-white/40 hover:text-white">← Teacher Portal</a>
        </div>

        <div style={card} className="mb-6">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Credit rules</p>
          <ul className="text-white/60 text-sm space-y-1 list-disc ml-5">
            {POLICY_LINES.map(l => <li key={l}>{l}</li>)}
          </ul>
        </div>

        {message && (
          <div className={`mb-4 rounded-lg px-4 py-3 text-sm ${message.kind === 'ok' ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>{message.text}</div>
        )}

        {!family && (
          <>
            <form onSubmit={e => { e.preventDefault(); search(query) }} className="flex gap-2 mb-4">
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by parent email, parent name or student name" className={input} />
              <button className={btn} style={{ background: gold, color: '#0D0118' }}>Search</button>
            </form>

            <div className="space-y-2 mb-6">
              {results.length === 0 && <p className="text-white/30 text-sm">No families yet. Families appear here after they pay online{isAdmin ? ', or add one below' : ''}.</p>}
              {results.map(r => (
                <button key={r.id} onClick={() => openFamily(r.id)} style={card} className="w-full text-left hover:border-white/20">
                  <p className="text-white text-sm font-semibold">{r.name || r.email}</p>
                  <p className="text-white/40 text-xs">{r.email} · {r.students.join(', ') || 'no students'}</p>
                </button>
              ))}
            </div>

            {isAdmin && (
              <div style={card}>
                {!addForm ? (
                  <button className={btn} style={{ border: `1px solid ${gold}`, color: gold }} onClick={() => setAddForm({ email: '', guardianName: '', phone: '', studentName: '', studentAge: '' })}>
                    + Add a family / student (e.g. paid before online credits)
                  </button>
                ) : (
                  <form onSubmit={async e => {
                    e.preventDefault()
                    const data = await act({ action: 'add_student', ...addForm }, 'Family/student saved. You can now add credits.')
                    if (data?.guardianId) { setAddForm(null); openFamily(data.guardianId) }
                  }} className="grid md:grid-cols-2 gap-2">
                    <input required type="email" placeholder="Parent email *" value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })} className={input} />
                    <input placeholder="Parent name" value={addForm.guardianName} onChange={e => setAddForm({ ...addForm, guardianName: e.target.value })} className={input} />
                    <input placeholder="Phone" value={addForm.phone} onChange={e => setAddForm({ ...addForm, phone: e.target.value })} className={input} />
                    <input required placeholder="Student name *" value={addForm.studentName} onChange={e => setAddForm({ ...addForm, studentName: e.target.value })} className={input} />
                    <input placeholder="Student age" value={addForm.studentAge} onChange={e => setAddForm({ ...addForm, studentAge: e.target.value })} className={input} />
                    <div className="flex gap-2">
                      <button disabled={busy} className={btn} style={{ background: gold, color: '#0D0118' }}>Save</button>
                      <button type="button" className={btn} onClick={() => setAddForm(null)}>Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </>
        )}

        {family && (
          <div className="space-y-5">
            <button className="text-xs text-white/40 hover:text-white" onClick={() => { setFamily(null); setMessage(null); search(query) }}>← Back to search</button>

            <div style={card}>
              <p className="text-white font-semibold">{family.guardian.name || family.guardian.email}</p>
              <p className="text-white/40 text-xs">{family.guardian.email}{family.guardian.phone ? ` · ${family.guardian.phone}` : ''}</p>
            </div>

            {family.students.map(s => {
              const f = lessonForm[s.id] || { minutes: 30, date: todayPT(), outcome: 'attended', note: '' }
              const setF = (patch: Partial<typeof f>) => setLessonForm({ ...lessonForm, [s.id]: { ...f, ...patch } })
              return (
                <div key={s.id} style={card}>
                  <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
                    <div>
                      <p className="text-white font-semibold">{s.name}{s.age ? <span className="text-white/40 font-normal"> · age {s.age}</span> : null}</p>
                      <p className="text-white/40 text-xs">{s.firstNoShowForgiven ? 'First no-show already forgiven — further no-shows use a credit.' : 'First no-show not used yet (will be forgiven once).'}</p>
                    </div>
                    <div className="flex gap-3">
                      {s.credits.map(c => (
                        <div key={c.minutes} className="text-center px-3 py-2 rounded-lg" style={{ background: 'rgba(201,168,76,0.08)' }}>
                          <p className="text-xl font-bold" style={{ color: gold }}>{c.remaining}</p>
                          <p className="text-[10px] text-white/50 uppercase">{c.minutes}-min left</p>
                          {c.nextExpiry && <p className="text-[10px] text-white/40">expires {fmtDate(c.nextExpiry)}</p>}
                          {c.expiredUnused > 0 && <p className="text-[10px] text-red-300/70">{c.expiredUnused} expired</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Record a lesson */}
                  <form onSubmit={e => { e.preventDefault(); act({ action: 'record_lesson', studentId: s.id, minutes: f.minutes, lessonDate: f.date, outcome: f.outcome, note: f.note }, 'Lesson recorded — 1 credit used.') }} className="grid grid-cols-2 md:grid-cols-5 gap-2 items-end">
                    <label className="text-[10px] text-white/40">Length
                      <select value={f.minutes} onChange={e => setF({ minutes: Number(e.target.value) === 60 ? 60 : 30 })} className={input}>
                        <option value={30} className="bg-[#111]">30 min</option>
                        <option value={60} className="bg-[#111]">60 min</option>
                      </select>
                    </label>
                    <label className="text-[10px] text-white/40">Date
                      <input type="date" value={f.date} onChange={e => setF({ date: e.target.value })} className={input} />
                    </label>
                    <label className="text-[10px] text-white/40">Outcome
                      <select value={f.outcome} onChange={e => setF({ outcome: e.target.value === 'no_show' ? 'no_show' : 'attended' })} className={input}>
                        <option value="attended" className="bg-[#111]">Attended</option>
                        <option value="no_show" className="bg-[#111]">No-show</option>
                      </select>
                    </label>
                    <label className="text-[10px] text-white/40">Note (optional)
                      <input value={f.note} onChange={e => setF({ note: e.target.value })} className={input} />
                    </label>
                    <button disabled={busy} className={btn} style={{ background: gold, color: '#0D0118' }}>Record lesson</button>
                  </form>

                  {isAdmin && (
                    <div className="mt-3">
                      {grantForm?.studentId === s.id ? (
                        <form onSubmit={async e => { e.preventDefault(); const ok = await act({ action: 'grant_credits', studentId: s.id, minutes: grantForm.minutes, lessons: Number(grantForm.lessons), note: grantForm.note }, 'Credits added.'); if (ok) setGrantForm(null) }} className="grid grid-cols-2 md:grid-cols-5 gap-2 items-end">
                          <label className="text-[10px] text-white/40">Length
                            <select value={grantForm.minutes} onChange={e => setGrantForm({ ...grantForm, minutes: Number(e.target.value) === 60 ? 60 : 30 })} className={input}>
                              <option value={30} className="bg-[#111]">30 min</option>
                              <option value={60} className="bg-[#111]">60 min</option>
                            </select>
                          </label>
                          <label className="text-[10px] text-white/40">Credits
                            <input type="number" min={1} max={12} value={grantForm.lessons} onChange={e => setGrantForm({ ...grantForm, lessons: e.target.value })} className={input} />
                          </label>
                          <label className="text-[10px] text-white/40 md:col-span-2">Why? (required)
                            <input required value={grantForm.note} onChange={e => setGrantForm({ ...grantForm, note: e.target.value })} className={input} placeholder="e.g. Paid in cash on Nov 3" />
                          </label>
                          <div className="flex gap-2">
                            <button disabled={busy} className={btn} style={{ background: gold, color: '#0D0118' }}>Add</button>
                            <button type="button" className={btn} onClick={() => setGrantForm(null)}>Cancel</button>
                          </div>
                        </form>
                      ) : (
                        <button className="text-xs underline" style={{ color: gold }} onClick={() => setGrantForm({ studentId: s.id, minutes: 30, lessons: '4', note: '' })}>+ Add credits (exception)</button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Purchases / credit lots */}
            <div style={card}>
              <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Purchases & credits</p>
              {family.purchases.length === 0 && <p className="text-white/30 text-sm">None yet.</p>}
              <div className="space-y-2">
                {family.purchases.map(p => {
                  const student = family.students.find(s => s.id === p.studentId)
                  return (
                    <div key={p.id} className="text-sm border-b border-white/5 pb-2">
                      <div className="flex justify-between gap-2 flex-wrap">
                        <span className="text-white/80">{student?.name} · {p.packageName || `${p.minutes}-min credits`}{p.amountCents !== null ? ` · $${(p.amountCents / 100).toFixed(2)}` : ''}</span>
                        <span className={p.status === 'refunded' ? 'text-red-300' : p.active ? 'text-green-300' : 'text-white/40'}>
                          {p.status === 'refunded' ? 'Refunded' : p.active ? `${p.lessonsTotal - p.lessonsUsed} of ${p.lessonsTotal} left` : `Expired (${p.lessonsTotal - p.lessonsUsed} unused)`}
                        </span>
                      </div>
                      <p className="text-white/40 text-xs">Bought {fmtDate(p.paidAt)} · expires {fmtDate(p.expiresAt)}{p.note ? ` · ${p.note}` : ''}</p>
                      {isAdmin && p.status === 'paid' && (
                        extendForm?.purchaseId === p.id ? (
                          <form onSubmit={async e => { e.preventDefault(); const ok = await act({ action: 'extend_expiry', purchaseId: p.id, newExpiry: extendForm.date, note: extendForm.note }, 'Expiry date changed.'); if (ok) setExtendForm(null) }} className="flex gap-2 mt-2 flex-wrap">
                            <input type="date" required value={extendForm.date} onChange={e => setExtendForm({ ...extendForm, date: e.target.value })} className={input + ' max-w-[11rem]'} />
                            <input required placeholder="Why? (required)" value={extendForm.note} onChange={e => setExtendForm({ ...extendForm, note: e.target.value })} className={input + ' flex-1'} />
                            <button disabled={busy} className={btn} style={{ background: gold, color: '#0D0118' }}>Save</button>
                            <button type="button" className={btn} onClick={() => setExtendForm(null)}>Cancel</button>
                          </form>
                        ) : (
                          <button className="text-xs underline mt-1" style={{ color: gold }} onClick={() => setExtendForm({ purchaseId: p.id, date: p.expiresAt.slice(0, 10), note: '' })}>Change expiry (exception)</button>
                        )
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Lessons */}
            <div style={card}>
              <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Lessons</p>
              {family.lessons.length === 0 && <p className="text-white/30 text-sm">None recorded yet.</p>}
              <div className="space-y-2">
                {family.lessons.map(l => {
                  const student = family.students.find(s => s.id === l.studentId)
                  return (
                    <div key={l.id} className="text-sm border-b border-white/5 pb-2">
                      <div className="flex justify-between gap-2 flex-wrap">
                        <span className="text-white/80">{fmtDate(l.lessonDate + 'T12:00:00Z')} · {student?.name} · {l.minutes} min</span>
                        <span className="text-white/60">{statusLabel[l.status] || l.status}{l.creditRestored ? ' · credit given back' : ''}</span>
                      </div>
                      {(l.note || l.recordedBy) && <p className="text-white/30 text-xs">{l.note}{l.note && l.recordedBy ? ' · ' : ''}{l.recordedBy ? `by ${l.recordedBy}` : ''}</p>}
                      {isAdmin && l.usedCredit && !l.creditRestored && (
                        restoreForm?.lessonId === l.id ? (
                          <form onSubmit={async e => { e.preventDefault(); const ok = await act({ action: 'restore_credit', lessonId: l.id, note: restoreForm.note }, 'Credit given back.'); if (ok) setRestoreForm(null) }} className="flex gap-2 mt-2">
                            <input required placeholder="Why? (required)" value={restoreForm.note} onChange={e => setRestoreForm({ ...restoreForm, note: e.target.value })} className={input + ' flex-1'} />
                            <button disabled={busy} className={btn} style={{ background: gold, color: '#0D0118' }}>Give back</button>
                            <button type="button" className={btn} onClick={() => setRestoreForm(null)}>Cancel</button>
                          </form>
                        ) : (
                          <button className="text-xs underline mt-1" style={{ color: gold }} onClick={() => setRestoreForm({ lessonId: l.id, note: '' })}>Give this credit back (exception)</button>
                        )
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {family.ledger && family.ledger.length > 0 && (
              <details style={card}>
                <summary className="text-xs uppercase tracking-widest text-white/40 cursor-pointer">History (every credit change)</summary>
                <div className="mt-3 space-y-1">
                  {family.ledger.map(c => (
                    <p key={c.id} className="text-xs text-white/50">
                      {fmtDate(c.createdAt)} · {family.students.find(s => s.id === c.studentId)?.name} · {reasonLabel[c.reason] || c.reason}
                      {c.delta !== 0 ? ` (${c.delta > 0 ? '+' : ''}${c.delta})` : ''}{c.note ? ` · ${c.note}` : ''}{c.createdBy ? ` · ${c.createdBy}` : ''}
                    </p>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
