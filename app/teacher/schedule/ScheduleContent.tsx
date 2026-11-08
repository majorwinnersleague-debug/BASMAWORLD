'use client'

import { useCallback, useEffect, useState } from 'react'
import { formatDayLabel, formatTimeLabel, zonedDate, zonedTime } from '@/lib/tz'
import { BOOKING_POLICY_LINES } from '@/lib/schedule-policy'

/* Staff schedule (Phase 3): teaching hours, days off, bookings. */

interface Rule { id: number; weekday: number; startTime: string; endTime: string }
interface Block { id: number; date: string; reason: string | null }
interface Booking {
  id: number; studentName: string; guardianEmail: string; guardianName: string | null; guardianPhone: string | null
  kind: 'lesson' | 'trial'; minutes: number; startsAt: string; endsAt: string; status: string
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const gold = '#c9a84c'
const card: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16 }
const input = 'rounded-lg px-3 py-2 bg-white/[0.05] border border-white/10 text-white text-sm'
const btn = 'px-3 py-2 rounded-lg text-xs font-semibold transition disabled:opacity-40'
const TIMES = Array.from({ length: (22 - 7) * 4 + 1 }, (_, i) => {
  const m = 7 * 60 + i * 15
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
})
const statusText: Record<string, string> = {
  booked: 'Booked', completed: '✅ Attended', no_show: '❌ No-show', no_show_forgiven: '🙏 No-show (forgiven)',
}

export default function ScheduleContent() {
  const [auth, setAuth] = useState<'checking' | 'ok' | 'no'>('checking')
  const [role, setRole] = useState('')
  const [rules, setRules] = useState<Rule[]>([])
  const [blocks, setBlocks] = useState<Block[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [ruleForm, setRuleForm] = useState({ weekday: 1, startTime: '15:00', endTime: '19:00' })
  const [blockForm, setBlockForm] = useState({ date: '', reason: '' })
  const isAdmin = role === 'admin'

  const load = useCallback(async () => {
    const res = await fetch('/api/staff/schedule', { cache: 'no-store' })
    if (res.status === 401) { setAuth('no'); return }
    const data = await res.json()
    setRole(data.role || '')
    setRules(data.rules || [])
    setBlocks(data.blocks || [])
    setBookings(data.bookings || [])
    setAuth('ok')
  }, [])

  useEffect(() => { load().catch(() => setAuth('no')) }, [load])

  async function act(payload: Record<string, unknown>, okText: string) {
    setBusy(true); setMsg(null)
    try {
      const res = await fetch('/api/staff/schedule', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (res.ok && data.success) {
        setMsg({ ok: true, text: data.status === 'no_show_forgiven' ? 'Marked no-show. First no-show for this student, so it was forgiven and the credit returned.' : okText })
        await load()
      } else setMsg({ ok: false, text: data.error || 'Something went wrong. Nothing was changed.' })
    } catch { setMsg({ ok: false, text: 'Network problem. Nothing was changed.' }) }
    finally { setBusy(false) }
  }

  if (auth === 'checking') return <main className="min-h-screen flex items-center justify-center text-white/40 text-sm">Loading…</main>
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

  const now = Date.now()
  const upcoming = bookings.filter(b => new Date(b.endsAt).getTime() >= now)
  const needsMarking = bookings.filter(b => b.status === 'booked' && new Date(b.endsAt).getTime() < now)
  const byDay = (list: Booking[]) => {
    const groups: Record<string, Booking[]> = {}
    for (const b of list) (groups[zonedDate(new Date(b.startsAt))] ||= []).push(b)
    return Object.entries(groups)
  }

  const bookingRow = (b: Booking, past: boolean) => (
    <div key={b.id} className="flex flex-wrap justify-between items-center gap-2 text-sm border-b border-white/5 py-2">
      <div>
        <span className="text-white font-medium">{formatTimeLabel(zonedTime(new Date(b.startsAt)))}</span>
        <span className="text-white/70"> · {b.studentName} · {b.kind === 'trial' ? 'Free trial (15 min)' : `${b.minutes} min`}</span>
        <div className="text-white/35 text-xs">{b.guardianName || ''} {b.guardianPhone ? `· ${b.guardianPhone}` : ''} · {b.guardianEmail}</div>
      </div>
      {b.status === 'booked' ? (
        <div className="flex gap-2">
          {past && (
            <>
              <button disabled={busy} className={btn} style={{ background: 'rgba(34,197,94,0.15)', color: '#86efac' }} onClick={() => act({ action: 'mark', id: b.id, outcome: 'attended' }, 'Marked attended.')}>Attended</button>
              <button disabled={busy} className={btn} style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5' }} onClick={() => act({ action: 'mark', id: b.id, outcome: 'no_show' }, 'Marked no-show — credit used.')}>No-show</button>
            </>
          )}
          <button disabled={busy} className={btn} style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}
            onClick={() => {
              const reason = prompt('Cancel this booking? The family is emailed and their credit is returned.\nOptional reason:')
              if (reason === null) return
              act({ action: 'cancel', id: b.id, returnCredit: true, reason }, 'Cancelled — the credit was returned and the family emailed.')
            }}>Cancel</button>
        </div>
      ) : (
        <span className="text-white/50 text-xs">{statusText[b.status] || b.status}</span>
      )}
    </div>
  )

  return (
    <main className="min-h-screen text-white px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: gold }}>📅 Schedule</h1>
            <p className="text-white/40 text-xs mt-1">Families book these times online. All times Pacific.</p>
          </div>
          <div className="flex gap-3 text-xs">
            <a href="/teacher/credits" className="text-white/40 hover:text-white">🎵 Lesson Credits</a>
            <a href="/teacher" className="text-white/40 hover:text-white">← Teacher Portal</a>
          </div>
        </div>

        {msg && <div className={`rounded-lg px-4 py-3 text-sm ${msg.ok ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>{msg.text}</div>}

        {needsMarking.length > 0 && (
          <div style={{ ...card, borderColor: 'rgba(201,168,76,0.4)' }}>
            <p className="text-sm font-semibold mb-2" style={{ color: gold }}>Mark these past lessons ({needsMarking.length})</p>
            {needsMarking.map(b => (
              <div key={b.id}>
                <p className="text-white/40 text-xs mt-2">{formatDayLabel(zonedDate(new Date(b.startsAt)))}</p>
                {bookingRow(b, true)}
              </div>
            ))}
          </div>
        )}

        <div style={card}>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Upcoming bookings</p>
          {upcoming.length === 0 && <p className="text-white/30 text-sm">No bookings yet.</p>}
          {byDay(upcoming).map(([day, list]) => (
            <div key={day} className="mb-3">
              <p className="text-white/50 text-xs font-semibold mt-2">{formatDayLabel(day)}</p>
              {list.map(b => bookingRow(b, false))}
            </div>
          ))}
        </div>

        <div style={card}>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Weekly teaching hours</p>
          <p className="text-white/35 text-xs mb-3">Families can only book inside these hours. {rules.length === 0 && <strong className="text-yellow-300">No hours set yet — nobody can book until you add some.</strong>}</p>
          {DAYS.map((name, wd) => {
            const list = rules.filter(r => r.weekday === wd)
            if (!list.length) return null
            return (
              <div key={wd} className="flex flex-wrap items-center gap-2 py-1">
                <span className="text-white text-sm w-24">{name}</span>
                {list.map(r => (
                  <span key={r.id} className="text-xs px-2 py-1 rounded-lg flex items-center gap-2" style={{ background: 'rgba(201,168,76,0.1)', color: gold }}>
                    {formatTimeLabel(r.startTime)} – {formatTimeLabel(r.endTime)}
                    {isAdmin && <button disabled={busy} className="text-white/40 hover:text-red-300" title="Remove" onClick={() => act({ action: 'remove_rule', id: r.id }, 'Hours removed.')}>✕</button>}
                  </span>
                ))}
              </div>
            )
          })}
          {isAdmin && (
            <form className="flex flex-wrap gap-2 mt-3 items-center" onSubmit={e => { e.preventDefault(); act({ action: 'add_rule', ...ruleForm }, 'Hours added.') }}>
              <select className={input} value={ruleForm.weekday} onChange={e => setRuleForm({ ...ruleForm, weekday: Number(e.target.value) })}>
                {DAYS.map((d, i) => <option key={d} value={i} className="bg-[#111]">{d}</option>)}
              </select>
              <select className={input} value={ruleForm.startTime} onChange={e => setRuleForm({ ...ruleForm, startTime: e.target.value })}>
                {TIMES.map(t => <option key={t} value={t} className="bg-[#111]">{formatTimeLabel(t)}</option>)}
              </select>
              <span className="text-white/40 text-sm">to</span>
              <select className={input} value={ruleForm.endTime} onChange={e => setRuleForm({ ...ruleForm, endTime: e.target.value })}>
                {TIMES.map(t => <option key={t} value={t} className="bg-[#111]">{formatTimeLabel(t)}</option>)}
              </select>
              <button disabled={busy} className={btn} style={{ background: gold, color: '#0D0118' }}>Add hours</button>
            </form>
          )}
        </div>

        <div style={card}>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Days off</p>
          {blocks.length === 0 && <p className="text-white/30 text-sm">None.</p>}
          <div className="flex flex-wrap gap-2">
            {blocks.map(b => (
              <span key={b.id} className="text-xs px-2 py-1 rounded-lg flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                {formatDayLabel(b.date)}{b.reason ? ` · ${b.reason}` : ''}
                {isAdmin && <button disabled={busy} className="text-white/40 hover:text-red-300" title="Remove" onClick={() => act({ action: 'remove_block', id: b.id }, 'Day off removed.')}>✕</button>}
              </span>
            ))}
          </div>
          {isAdmin && (
            <form className="flex flex-wrap gap-2 mt-3" onSubmit={e => { e.preventDefault(); act({ action: 'add_block', ...blockForm }, 'Day off added. Existing bookings that day are kept — cancel them above if needed.') }}>
              <input type="date" required className={input} value={blockForm.date} onChange={e => setBlockForm({ ...blockForm, date: e.target.value })} />
              <input placeholder="Reason (optional)" className={input + ' flex-1'} value={blockForm.reason} onChange={e => setBlockForm({ ...blockForm, reason: e.target.value })} />
              <button disabled={busy} className={btn} style={{ background: gold, color: '#0D0118' }}>Add day off</button>
            </form>
          )}
        </div>

        <div style={card}>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Booking rules families see</p>
          <ul className="text-white/50 text-sm list-disc ml-5 space-y-1">{BOOKING_POLICY_LINES.map(l => <li key={l}>{l}</li>)}</ul>
        </div>
      </div>
    </main>
  )
}
