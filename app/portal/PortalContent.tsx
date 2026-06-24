'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'

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
  const [activeTab, setActiveTab] = useState<'students' | 'payments' | 'info'>('students')
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
    fetch('/api/auth/logout', { method: 'POST' })
      .then(() => setAuthState('login'))
      .catch(() => setAuthState('login'))
  }, [])

  const loadDashboard = useCallback(async () => {
    try {
      const [studentsRes, paymentsRes] = await Promise.all([
        fetch('/api/portal/students'),
        fetch('/api/portal/payments'),
      ])
      const studentsData = await studentsRes.json()
      const paymentsData = await paymentsRes.json()
      if (studentsData.students) setPortalData(studentsData)
      if (paymentsData.payments) setPayments(paymentsData.payments)
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

            {/* ── Payments Tab ── */}
            {activeTab === 'payments' && (
              <div className="space-y-3">
                {payments.length === 0 ? (
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
