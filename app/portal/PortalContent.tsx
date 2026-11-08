'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { POLICY_LINES } from '@/lib/lesson-policy'
import SlotPicker from '@/components/SlotPicker'
import { formatInstant } from '@/lib/tz'
import { BOOKING_POLICY_LINES } from '@/lib/schedule-policy'

/* Online bookings from /api/portal/bookings (Phase 3) */
interface PortalBooking { id: number; studentId: number; kind: 'lesson' | 'trial'; minutes: number; startsAt: string; status: string; canCancelOnline: boolean }

/* Lesson credits from /api/portal/credits (Phase 2) */
interface LessonFamily {
  students: { id: number; name: string; firstNoShowForgiven: boolean; credits: { minutes: number; remaining: number; nextExpiry: string | null; expiredUnused: number }[] }[]
  purchases: { id: number; studentId: number; packageName: string | null; minutes: number; lessonsTotal: number; lessonsUsed: number; amountCents: number | null; status: string; paidAt: string; expiresAt: string; active: boolean }[]
  lessons: { id: number; studentId: number; minutes: number; lessonDate: string; status: string; creditRestored: boolean }[]
}

/* ═══ TYPES ═══ */
interface Student {
  id: string
  studentName: string
  studentAge: string
  interests: string
  status: string
  enrolledClass: string
  timeSlot: string
  discoveryWeek: string
  allergies: string
  medicalConditions: string
  emergencyContactName: string
  emergencyContactPhone: string
  paymentStatus: string
  createdAt: string
  source: string
  photoUrl: string
  liabilityAgreed: boolean
}

interface Payment {
  id: string
  amount: number
  status: string
  description: string
  studentName: string
  className: string
  days: string
  createdAt: string
}

interface PortalData {
  parentName: string
  email: string
  phone: string
  students: Student[]
}

/* ═══ CONSTANTS ═══ */
const gold = '#c9a84c'

/* ═══ COMPONENT ═══ */
export default function PortalContent() {
  // Auth state
  const [authState, setAuthState] = useState<'loading' | 'login' | 'otp' | 'dashboard'>('loading')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  // Dashboard state
  const [portalData, setPortalData] = useState<PortalData | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [activeTab, setActiveTab] = useState<'students' | 'lessons' | 'payments' | 'info'>('students')
  const [lessonFamily, setLessonFamily] = useState<LessonFamily | null>(null)
  // Online booking (Phase 3)
  const [bookings, setBookings] = useState<PortalBooking[]>([])
  const [bookingFor, setBookingFor] = useState<{ studentId: number; minutes: number } | null>(null)
  const [bookingSlot, setBookingSlot] = useState('')
  const [bookingBusy, setBookingBusy] = useState(false)
  const [bookingMsg, setBookingMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [openTabAfterLogin, setOpenTabAfterLogin] = useState<'lessons' | null>(null)
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null)

  // Edit state
  const [editingStudent, setEditingStudent] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    allergies: '',
    medicalConditions: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    liabilityAgreed: false,
  })
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  // Photo state
  const [uploadingPhoto, setUploadingPhoto] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Always require fresh login — clear any existing session first
  useEffect(() => {
    // "Book My Lesson Times" links here with ?tab=lessons
    if (new URLSearchParams(window.location.search).get('tab') === 'lessons') setOpenTabAfterLogin('lessons')
    fetch('/api/auth/logout', { method: 'POST' })
      .then(() => setAuthState('login'))
      .catch(() => setAuthState('login'))
  }, [])

  const loadDashboard = useCallback(async () => {
    try {
      const [studentsRes, paymentsRes, creditsRes, bookingsRes] = await Promise.all([
        fetch('/api/portal/students'),
        fetch('/api/portal/payments'),
        fetch('/api/portal/credits', { cache: 'no-store' }),
        fetch('/api/portal/bookings', { cache: 'no-store' }),
      ])
      const studentsData = await studentsRes.json()
      const paymentsData = await paymentsRes.json()
      const creditsData = creditsRes.ok ? await creditsRes.json() : { family: null }
      const bookingsData = bookingsRes.ok ? await bookingsRes.json() : { bookings: [] }
      if (studentsData.students) setPortalData(studentsData)
      if (paymentsData.payments) setPayments(paymentsData.payments)
      setLessonFamily(creditsData.family || null)
      setBookings(Array.isArray(bookingsData.bookings) ? bookingsData.bookings : [])
    } catch { /* ignore */ }
  }, [])

  /* ── Login handlers ── */
  async function handleLogin() {
    setAuthLoading(true)
    setAuthError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone }),
      })
      const data = await res.json()
      if (data.success) {
        setAuthState('otp')
      } else {
        setAuthError(data.error || 'Login failed')
      }
    } catch {
      setAuthError('Something went wrong. Please try again.')
    }
    setAuthLoading(false)
  }

  async function handleVerify() {
    setAuthLoading(true)
    setAuthError('')
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, code: otpCode }),
      })
      const data = await res.json()
      if (data.success) {
        setAuthState('dashboard')
        if (openTabAfterLogin) setActiveTab(openTabAfterLogin)
        loadDashboard()
      } else {
        setAuthError(data.error || 'Invalid code')
      }
    } catch {
      setAuthError('Something went wrong. Please try again.')
    }
    setAuthLoading(false)
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setAuthState('login')
    setPortalData(null)
    setPayments([])
    setLessonFamily(null)
    setEmail('')
    setPhone('')
    setOtpCode('')
  }

  /* ── Edit handlers ── */
  function startEditing(s: Student) {
    setEditingStudent(s.id)
    setEditForm({
      allergies: s.allergies || '',
      medicalConditions: s.medicalConditions || '',
      emergencyContactName: s.emergencyContactName || '',
      emergencyContactPhone: s.emergencyContactPhone || '',
      liabilityAgreed: s.liabilityAgreed ?? false,
    })
    setSaveMsg('')
  }

  async function handleSave(recordId: string) {
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await fetch('/api/portal/students/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId, ...editForm }),
      })
      const data = await res.json()
      if (data.success) {
        setSaveMsg('✅ Saved!')
        setEditingStudent(null)
        loadDashboard() // Refresh data
      } else {
        setSaveMsg('❌ ' + (data.error || 'Save failed'))
      }
    } catch {
      setSaveMsg('❌ Something went wrong')
    }
    setSaving(false)
  }

  /* ── Photo handler ── */
  async function handlePhotoUpload(recordId: string, file: File) {
    setUploadingPhoto(recordId)
    try {
      // Resize image to max 400px and compress
      const base64 = await resizeImage(file, 400, 0.7)
      const res = await fetch('/api/portal/students/photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId, photoBase64: base64 }),
      })
      const data = await res.json()
      if (data.success) {
        loadDashboard() // Refresh
      }
    } catch { /* ignore */ }
    setUploadingPhoto(null)
  }

  /* ── Shared styles ── */
  const inputCss: React.CSSProperties = {
    background: '#fff', color: '#1a1a2e',
    border: '1px solid rgba(200,180,100,0.3)',
    borderRadius: 10, padding: '12px 16px',
    fontSize: 15, width: '100%', outline: 'none',
  }

  const editInputCss: React.CSSProperties = {
    background: 'rgba(255,255,255,0.08)', color: '#fff',
    border: '1px solid rgba(201,168,76,0.3)',
    borderRadius: 8, padding: '10px 14px',
    fontSize: 13, width: '100%', outline: 'none',
  }

  const cardCss: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16, padding: '20px',
  }

  /* ═══ RENDER ═══ */
  return (
    <main className="min-h-screen text-white" style={{ background: '#0D0118' }}>
      {/* Hidden file input for photo upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          const targetId = fileInputRef.current?.dataset.studentId
          if (file && targetId) handlePhotoUpload(targetId, file)
          e.target.value = '' // Reset for re-use
        }}
      />

      {/* Nav */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-lg mx-auto">
        <Link href="/" className="text-lg font-bold" style={{ color: gold, fontFamily: "'Playfair Display', serif" }}>
          BASMA
        </Link>
        {authState === 'dashboard' ? (
          <button onClick={handleLogout} className="text-sm text-white/40 hover:text-white/60 transition">
            Logout
          </button>
        ) : (
          <Link href="/" className="text-sm text-white/40">← Home</Link>
        )}
      </nav>

      <div className="max-w-lg mx-auto px-6 pb-24">

        {/* ═══ LOADING ═══ */}
        {authState === 'loading' && (
          <div className="text-center py-20">
            <div className="text-3xl mb-4 animate-pulse">🎵</div>
            <p className="text-white/40">Loading…</p>
          </div>
        )}

        {/* ═══ LOGIN ═══ */}
        {authState === 'login' && (
          <div className="py-12">
            <h1 className="text-2xl font-bold text-center mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Parent Portal
            </h1>
            <p className="text-center text-white/40 text-sm mb-8">
              Log in with your email and phone number
            </p>

            <div className="space-y-4 mb-6">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                style={inputCss}
                onKeyDown={e => e.key === 'Enter' && phone && handleLogin()}
              />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Phone number"
                style={inputCss}
                onKeyDown={e => e.key === 'Enter' && email && handleLogin()}
              />
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
                {authError}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={!email || !phone || authLoading}
              className="w-full py-4 rounded-full font-bold text-base transition hover:scale-[1.02] disabled:opacity-40"
              style={{ background: `linear-gradient(90deg, ${gold}, #FFE07A)`, color: '#0D0118' }}
            >
              {authLoading ? 'Sending code…' : 'Send Login Code'}
            </button>

            <p className="text-center text-white/20 text-xs mt-4">
              We&apos;ll send a 6-digit code to your email
            </p>

            <div className="text-center mt-8">
              <p className="text-white/30 text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/enroll" className="font-semibold" style={{ color: gold }}>Register here</Link>
              </p>
            </div>
          </div>
        )}

        {/* ═══ OTP VERIFICATION ═══ */}
        {authState === 'otp' && (
          <div className="py-12">
            <h1 className="text-2xl font-bold text-center mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Enter Code
            </h1>
            <p className="text-center text-white/40 text-sm mb-8">
              We sent a 6-digit code to <strong className="text-white/60">{email}</strong>
            </p>

            <div className="mb-6">
              <input
                type="text"
                value={otpCode}
                onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                style={{ ...inputCss, textAlign: 'center', fontSize: 28, letterSpacing: '8px', fontWeight: 'bold' }}
                onKeyDown={e => e.key === 'Enter' && otpCode.length === 6 && handleVerify()}
                autoFocus
              />
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
                {authError}
              </div>
            )}

            <button
              onClick={handleVerify}
              disabled={otpCode.length !== 6 || authLoading}
              className="w-full py-4 rounded-full font-bold text-base transition hover:scale-[1.02] disabled:opacity-40"
              style={{ background: `linear-gradient(90deg, ${gold}, #FFE07A)`, color: '#0D0118' }}
            >
              {authLoading ? 'Verifying…' : 'Verify & Login'}
            </button>

            <button
              onClick={() => { setAuthState('login'); setOtpCode(''); setAuthError('') }}
              className="w-full py-3 mt-3 text-sm text-white/40 hover:text-white/60 transition"
            >
              ← Back to login
            </button>
          </div>
        )}

        {/* ═══ DASHBOARD ═══ */}
        {authState === 'dashboard' && portalData && (
          <div>
            {/* Welcome */}
            <div className="py-6 text-center">
              <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                Welcome, {portalData.parentName.split(' ')[0] || 'Parent'}!
              </h1>
              <p className="text-white/40 text-sm">
                {portalData.students.length} student{portalData.students.length !== 1 ? 's' : ''} enrolled
              </p>
            </div>

            {/* Quick Action */}
            <Link
              href="/enroll"
              className="block w-full text-center py-3 rounded-full font-semibold text-sm mb-6 transition hover:scale-[1.02]"
              style={{ background: `linear-gradient(90deg, ${gold}, #FFE07A)`, color: '#0D0118' }}
            >
              + Enroll in More Classes
            </Link>

            {/* Tab Bar */}
            <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
              {[
                { key: 'students' as const, label: '👶 Students' },
                { key: 'lessons' as const, label: '🎵 Lessons' },
                { key: 'payments' as const, label: '💳 Payments' },
                { key: 'info' as const, label: '📋 Info' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="flex-1 py-2.5 rounded-lg text-xs font-semibold transition"
                  style={{
                    background: activeTab === tab.key ? 'rgba(201,168,76,0.1)' : 'transparent',
                    color: activeTab === tab.key ? gold : 'rgba(255,255,255,0.4)',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Students Tab ── */}
            {activeTab === 'students' && (
              <div className="space-y-3">
                {portalData.students.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-white/30 text-sm">No students enrolled yet.</p>
                    <Link href="/enroll" className="text-sm font-semibold mt-2 inline-block" style={{ color: gold }}>
                      Register now →
                    </Link>
                  </div>
                ) : (
                  portalData.students.map(s => (
                    <div key={s.id} style={cardCss}>
                      <button
                        onClick={() => {
                          setExpandedStudent(expandedStudent === s.id ? null : s.id)
                          if (editingStudent === s.id) setEditingStudent(null)
                        }}
                        className="w-full text-left"
                      >
                        <div className="flex items-center gap-3">
                          {/* Avatar / Photo */}
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0 overflow-hidden cursor-pointer relative"
                            style={{ background: 'rgba(201,168,76,0.15)', color: gold }}
                            onClick={e => {
                              e.stopPropagation()
                              if (fileInputRef.current) {
                                fileInputRef.current.dataset.studentId = s.id
                                fileInputRef.current.click()
                              }
                            }}
                          >
                            {uploadingPhoto === s.id ? (
                              <span className="text-xs animate-spin">⏳</span>
                            ) : s.photoUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={s.photoUrl} alt={s.studentName} className="w-full h-full object-cover" />
                            ) : (
                              <>
                                {(s.studentName || '?')[0]?.toUpperCase()}
                                <span className="absolute bottom-0 right-0 text-[8px] bg-white/20 rounded-full w-3.5 h-3.5 flex items-center justify-center">📷</span>
                              </>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-white text-sm truncate">{s.studentName || 'Unnamed'}</div>
                            <div className="text-white/30 text-xs">
                              Age {s.studentAge || '?'} · {s.interests || s.enrolledClass || 'No class'}
                            </div>
                          </div>
                          <div className="shrink-0">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              s.status === 'Free Trial' ? 'bg-blue-500/10 text-blue-400' :
                              s.paymentStatus === 'paid' || s.paymentStatus === 'Paid' ? 'bg-green-500/10 text-green-400' :
                              'bg-yellow-500/10 text-yellow-400'
                            }`}>
                              {s.status === 'Free Trial' ? '🆓 Trial' : s.paymentStatus === 'paid' || s.paymentStatus === 'Paid' ? '✅ Paid' : '⏳ Pending'}
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* Expanded Details */}
                      {expandedStudent === s.id && editingStudent !== s.id && (
                        <div className="mt-4 pt-4 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          <DetailRow label="Class" value={s.interests || s.enrolledClass || '—'} />
                          <DetailRow label="Time" value={s.timeSlot || '—'} />
                          <DetailRow label="Days" value={s.discoveryWeek || '—'} />
                          <DetailRow label="Allergies" value={s.allergies || 'None'} />
                          <DetailRow label="Medical" value={s.medicalConditions || 'None'} />
                          <DetailRow label="Emergency Contact" value={
                            s.emergencyContactName
                              ? `${s.emergencyContactName} · ${s.emergencyContactPhone}`
                              : '—'
                          } />
                          <DetailRow label="Waiver" value={s.liabilityAgreed ? '✅ Signed' : '⚠️ Not signed'} />
                          <DetailRow label="Registered" value={
                            s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'
                          } />

                          {saveMsg && (
                            <div className="text-center text-xs py-1" style={{ color: gold }}>{saveMsg}</div>
                          )}

                          <button
                            onClick={() => startEditing(s)}
                            className="w-full mt-2 py-2.5 rounded-lg text-xs font-semibold transition"
                            style={{ border: `1px solid ${gold}`, color: gold }}
                          >
                            ✏️ Edit Info
                          </button>
                        </div>
                      )}

                      {/* Edit Mode */}
                      {expandedStudent === s.id && editingStudent === s.id && (
                        <div className="mt-4 pt-4 space-y-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          <div>
                            <label className="text-white/30 text-xs block mb-1">Allergies</label>
                            <input
                              type="text"
                              value={editForm.allergies}
                              onChange={e => setEditForm(f => ({ ...f, allergies: e.target.value }))}
                              placeholder="None"
                              style={editInputCss}
                            />
                          </div>
                          <div>
                            <label className="text-white/30 text-xs block mb-1">Medical Conditions</label>
                            <input
                              type="text"
                              value={editForm.medicalConditions}
                              onChange={e => setEditForm(f => ({ ...f, medicalConditions: e.target.value }))}
                              placeholder="None"
                              style={editInputCss}
                            />
                          </div>
                          <div>
                            <label className="text-white/30 text-xs block mb-1">Emergency Contact Name</label>
                            <input
                              type="text"
                              value={editForm.emergencyContactName}
                              onChange={e => setEditForm(f => ({ ...f, emergencyContactName: e.target.value }))}
                              placeholder="Contact name"
                              style={editInputCss}
                            />
                          </div>
                          <div>
                            <label className="text-white/30 text-xs block mb-1">Emergency Contact Phone</label>
                            <input
                              type="tel"
                              value={editForm.emergencyContactPhone}
                              onChange={e => setEditForm(f => ({ ...f, emergencyContactPhone: e.target.value }))}
                              placeholder="Phone number"
                              style={editInputCss}
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={editForm.liabilityAgreed}
                              onChange={e => setEditForm(f => ({ ...f, liabilityAgreed: e.target.checked }))}
                              id={`waiver-${s.id}`}
                              className="w-5 h-5 accent-amber-500"
                            />
                            <label htmlFor={`waiver-${s.id}`} className="text-white/60 text-xs">
                              I agree to the liability waiver for {s.studentName}
                            </label>
                          </div>

                          {saveMsg && (
                            <div className="text-center text-xs py-1" style={{ color: gold }}>{saveMsg}</div>
                          )}

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSave(s.id)}
                              disabled={saving}
                              className="flex-1 py-2.5 rounded-lg text-xs font-bold transition disabled:opacity-40"
                              style={{ background: `linear-gradient(90deg, ${gold}, #FFE07A)`, color: '#0D0118' }}
                            >
                              {saving ? 'Saving…' : '💾 Save Changes'}
                            </button>
                            <button
                              onClick={() => { setEditingStudent(null); setSaveMsg('') }}
                              className="px-4 py-2.5 rounded-lg text-xs text-white/40 hover:text-white/60 transition"
                              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── Lessons Tab (credits, booking, history) ── */}
            {activeTab === 'lessons' && (
              <div className="space-y-4">
                {bookingMsg && (
                  <div className={`rounded-lg px-4 py-3 text-sm ${bookingMsg.ok ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>{bookingMsg.text}</div>
                )}
                {(!lessonFamily || lessonFamily.students.length === 0) ? (
                  <div style={cardCss} className="text-center">
                    <p className="text-white/50 text-sm mb-3">No lesson credits yet.</p>
                    <Link href="/private-lessons" className="inline-block px-5 py-2 rounded-full text-sm font-semibold" style={{ background: gold, color: '#0D0118' }}>See lesson packages</Link>
                  </div>
                ) : (
                  lessonFamily.students.map(s => (
                    <div key={s.id} style={cardCss}>
                      <div className="font-semibold text-white mb-3">{s.name}</div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {s.credits.map(c => (
                          <div key={c.minutes} className="rounded-lg p-3 text-center" style={{ background: 'rgba(201,168,76,0.08)' }}>
                            <div className="text-2xl font-bold" style={{ color: gold }}>{c.remaining}</div>
                            <div className="text-white/50 text-xs">{c.minutes}-minute lesson{c.remaining === 1 ? '' : 's'} left</div>
                            {c.nextExpiry && c.remaining > 0 && (
                              <div className="text-white/40 text-[11px] mt-1">Use by {new Date(c.nextExpiry).toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles', month: 'short', day: 'numeric', year: 'numeric' })}</div>
                            )}
                            {c.remaining > 0 && (
                              <button
                                type="button"
                                onClick={() => { setBookingFor({ studentId: s.id, minutes: c.minutes }); setBookingSlot(''); setBookingMsg(null) }}
                                className="inline-block mt-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                                style={{ background: gold, color: '#0D0118' }}
                              >
                                📅 Book a {c.minutes === 60 ? '1-hour' : '30-min'} time
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Booking panel */}
                      {bookingFor?.studentId === s.id && (
                        <div className="rounded-lg p-3 mb-3" style={{ border: `1px solid ${gold}55` }}>
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-white text-sm font-semibold">Book a {bookingFor.minutes === 60 ? '1-hour' : '30-minute'} lesson for {s.name}</div>
                            <button type="button" className="text-white/40 text-xs" onClick={() => setBookingFor(null)}>Close</button>
                          </div>
                          <SlotPicker url={`/api/portal/bookings?slots=${bookingFor.minutes}`} value={bookingSlot} onChange={setBookingSlot} />
                          <button
                            type="button"
                            disabled={!bookingSlot || bookingBusy}
                            onClick={async () => {
                              setBookingBusy(true); setBookingMsg(null)
                              try {
                                const res = await fetch('/api/portal/bookings', {
                                  method: 'POST', headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ action: 'book', studentId: s.id, minutes: bookingFor.minutes, startsAt: bookingSlot }),
                                })
                                const data = await res.json()
                                if (res.ok && data.success) {
                                  setBookingMsg({ ok: true, text: `Booked: ${formatInstant(new Date(bookingSlot))}. A confirmation email is on its way.` })
                                  setBookingFor(null); setBookingSlot('')
                                  await loadDashboard()
                                } else {
                                  setBookingMsg({ ok: false, text: data.error || 'Could not book that time. Please pick another.' })
                                }
                              } catch {
                                setBookingMsg({ ok: false, text: 'Network problem. Please try again.' })
                              } finally { setBookingBusy(false) }
                            }}
                            className="w-full mt-3 py-2.5 rounded-full text-sm font-semibold disabled:opacity-40"
                            style={{ background: gold, color: '#0D0118' }}
                          >
                            {bookingBusy ? 'Booking…' : bookingSlot ? `Confirm ${formatInstant(new Date(bookingSlot))}` : 'Pick a time above'}
                          </button>
                        </div>
                      )}

                      {/* Upcoming bookings */}
                      {bookings.filter(b => b.studentId === s.id && b.status === 'booked').length > 0 && (
                        <div className="space-y-2 mb-3">
                          <div className="text-white/40 text-xs uppercase tracking-widest">Upcoming</div>
                          {bookings.filter(b => b.studentId === s.id && b.status === 'booked').map(b => (
                            <div key={b.id} className="flex justify-between items-center text-sm rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
                              <span className="text-white/80">{formatInstant(new Date(b.startsAt))} · {b.kind === 'trial' ? 'Free trial' : `${b.minutes} min`}</span>
                              {b.canCancelOnline ? (
                                <button
                                  type="button"
                                  className="text-xs text-red-300/80 hover:text-red-300"
                                  onClick={async () => {
                                    if (!confirm('Cancel this lesson? Your lesson credit will be returned.')) return
                                    const res = await fetch('/api/portal/bookings', {
                                      method: 'POST', headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ action: 'cancel', bookingId: b.id }),
                                    })
                                    const data = await res.json()
                                    setBookingMsg({ ok: res.ok && data.success, text: res.ok && data.success ? 'Cancelled — your lesson credit is back.' : data.error || 'Could not cancel.' })
                                    await loadDashboard()
                                  }}
                                >
                                  Cancel
                                </button>
                              ) : (
                                <span className="text-white/30 text-[11px]">Call to change</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {lessonFamily.lessons.filter(l => l.studentId === s.id).length > 0 && (
                        <div className="space-y-1">
                          <div className="text-white/40 text-xs uppercase tracking-widest mb-1">Recent lessons</div>
                          {lessonFamily.lessons.filter(l => l.studentId === s.id).slice(0, 10).map(l => (
                            <div key={l.id} className="flex justify-between text-xs text-white/50">
                              <span>{new Date(l.lessonDate + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {l.minutes} min</span>
                              <span>{l.status === 'attended' ? 'Attended' : l.status === 'no_show_forgiven' ? 'Missed (forgiven)' : 'Missed'}{l.creditRestored ? ' · credit returned' : ''}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
                <div style={cardCss}>
                  <div className="text-white/40 text-xs uppercase tracking-widest mb-2">Lesson rules</div>
                  <ul className="text-white/50 text-xs space-y-1 list-disc ml-4">
                    {[...BOOKING_POLICY_LINES, ...POLICY_LINES.slice(0, 1)].map(line => <li key={line}>{line}</li>)}
                  </ul>
                </div>
              </div>
            )}

            {/* ── Payments Tab ── */}
            {activeTab === 'payments' && (
              <div className="space-y-3">
                {lessonFamily && lessonFamily.purchases.map(p => (
                  <div key={`np-${p.id}`} style={cardCss}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <div className="font-semibold text-white text-sm">{p.packageName || 'Lesson credits'}</div>
                        <div className="text-white/30 text-xs">
                          {lessonFamily.students.find(s => s.id === p.studentId)?.name} · {p.lessonsTotal - p.lessonsUsed} of {p.lessonsTotal} lesson{p.lessonsTotal === 1 ? '' : 's'} left
                        </div>
                      </div>
                      <div className="text-right">
                        {p.amountCents !== null && <div className="font-bold" style={{ color: gold }}>${(p.amountCents / 100).toFixed(2)}</div>}
                        <div className={`text-xs ${p.status === 'refunded' ? 'text-red-400' : 'text-green-400'}`}>{p.status === 'refunded' ? 'refunded' : 'paid'}</div>
                      </div>
                    </div>
                    <div className="text-white/20 text-xs">
                      {new Date(p.paidAt).toLocaleDateString()} · {p.active ? `use by ${new Date(p.expiresAt).toLocaleDateString()}` : p.status === 'refunded' ? 'refunded' : 'expired'}
                    </div>
                  </div>
                ))}
                {payments.length === 0 && !(lessonFamily && lessonFamily.purchases.length) ? (
                  <div className="text-center py-12">
                    <p className="text-white/30 text-sm">No payments yet.</p>
                  </div>
                ) : (
                  payments.map(p => (
                    <div key={p.id} style={cardCss}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold text-white text-sm">{p.description || p.className || 'Payment'}</div>
                          <div className="text-white/30 text-xs">{p.studentName} · {p.days || 'N/A'}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold" style={{ color: gold }}>${Number(p.amount || 0).toFixed(2)}</div>
                          <div className={`text-xs ${p.status === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                            {p.status || 'pending'}
                          </div>
                        </div>
                      </div>
                      {p.createdAt && (
                        <div className="text-white/20 text-xs">{new Date(p.createdAt).toLocaleDateString()}</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── Info Tab ── */}
            {activeTab === 'info' && (
              <div style={cardCss}>
                <h2 className="text-sm font-bold mb-4" style={{ color: gold }}>Parent Information</h2>
                <div className="space-y-3">
                  <DetailRow label="Name" value={portalData.parentName || '—'} />
                  <DetailRow label="Email" value={portalData.email || '—'} />
                  <DetailRow label="Phone" value={portalData.phone || '—'} />
                </div>

                {portalData.students.length > 0 && (
                  <>
                    <h2 className="text-sm font-bold mt-6 mb-4" style={{ color: gold }}>Emergency Contact</h2>
                    <div className="space-y-3">
                      <DetailRow label="Name" value={portalData.students[0].emergencyContactName || '—'} />
                      <DetailRow label="Phone" value={portalData.students[0].emergencyContactPhone || '—'} />
                    </div>

                    <h2 className="text-sm font-bold mt-6 mb-4" style={{ color: gold }}>Health & Allergies</h2>
                    <div className="space-y-3">
                      {portalData.students.map(s => (
                        <div key={s.id}>
                          <DetailRow label={s.studentName} value={s.allergies || 'None reported'} />
                          {s.medicalConditions && s.medicalConditions !== 'None' && (
                            <DetailRow label="  Medical" value={s.medicalConditions} />
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Dashboard loading state */}
        {authState === 'dashboard' && !portalData && (
          <div className="text-center py-20">
            <div className="text-3xl mb-4 animate-pulse">📚</div>
            <p className="text-white/40">Loading your dashboard…</p>
          </div>
        )}
      </div>
    </main>
  )
}

/* ── Detail Row Helper ── */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-white/30 text-xs font-medium shrink-0">{label}</span>
      <span className="text-white/70 text-xs text-right">{value}</span>
    </div>
  )
}

/* ── Image Resize Helper ── */
function resizeImage(file: File, maxSize: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let w = img.width
        let h = img.height
        if (w > h) { if (w > maxSize) { h = Math.round(h * maxSize / w); w = maxSize } }
        else { if (h > maxSize) { w = Math.round(w * maxSize / h); h = maxSize } }
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) { reject(new Error('No canvas')); return }
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = reject
      img.src = reader.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
