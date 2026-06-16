'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'

interface Student {
  id: string
  table: string
  studentName: string
  studentAge: string
  parentName: string
  email: string
  phone: string
  interests: string
  allergies: string
  medicalConditions: string
  emergencyContactName: string
  emergencyContactPhone: string
  hasWaiver: boolean
  isDuplicate: boolean
}

interface FamilyData {
  found: boolean
  parentName: string
  email: string
  phone: string
  students: Student[]
  totalLeadsRecords: number
  totalSummerRecords: number
}

export default function FamilyContent() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [familyData, setFamilyData] = useState<FamilyData | null>(null)
  const [error, setError] = useState('')
  const [editingStudent, setEditingStudent] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Student>>({})
  const [addingChild, setAddingChild] = useState(false)
  const [newChild, setNewChild] = useState({ studentName: '', studentAge: '', interests: '' })
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const lookupFamily = useCallback(async () => {
    if (!email.trim()) return
    setLoading(true)
    setError('')
    setFamilyData(null)
    setSuccessMsg('')

    try {
      const res = await fetch(`/api/family?email=${encodeURIComponent(email.trim())}`)
      const data = await res.json()
      if (data.found) {
        setFamilyData(data)
      } else {
        setError('No registration found for this email. If you haven\'t registered yet, please visit basmaworld.com/start')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }, [email])

  const startEdit = (student: Student) => {
    setEditingStudent(student.id)
    setEditForm({
      studentName: student.studentName,
      studentAge: student.studentAge,
      interests: student.interests,
      allergies: student.allergies,
      medicalConditions: student.medicalConditions,
      emergencyContactName: student.emergencyContactName,
      emergencyContactPhone: student.emergencyContactPhone,
    })
  }

  const saveEdit = async () => {
    if (!editingStudent) return
    setSaving(true)
    try {
      const res = await fetch('/api/family', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordId: editingStudent,
          ...editForm,
          parentName: familyData?.parentName,
          phone: familyData?.phone,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccessMsg('Saved! ✅')
        setEditingStudent(null)
        // Refresh
        await lookupFamily()
      }
    } catch {
      setError('Failed to save. Please try again.')
    }
    setSaving(false)
  }

  const addChild = async () => {
    if (!newChild.studentName.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: familyData?.email || email,
          parentName: familyData?.parentName,
          phone: familyData?.phone,
          ...newChild,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccessMsg(`${newChild.studentName} added! ✅`)
        setAddingChild(false)
        setNewChild({ studentName: '', studentAge: '', interests: '' })
        await lookupFamily()
      }
    } catch {
      setError('Failed to add. Please try again.')
    }
    setSaving(false)
  }

  const removeDuplicate = async (student: Student) => {
    if (!confirm(`Remove duplicate record for "${student.studentName}"? This cannot be undone.`)) return
    setSaving(true)
    try {
      const res = await fetch('/api/family', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId: student.id }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccessMsg(`Duplicate removed for ${student.studentName} ✅`)
        await lookupFamily()
      }
    } catch {
      setError('Failed to remove. Please try again.')
    }
    setSaving(false)
  }

  const interestOptions = ['Piano', 'Voice/Singing', 'Guitar', 'Drums', 'Performance/Dance', 'Music Production']

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0D0118 0%, #1a0d30 50%, #2D1B4E 100%)', borderBottom: '1px solid rgba(240,200,80,0.15)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ color: '#F0C850', textDecoration: 'none', fontWeight: 'bold', fontSize: 20 }}>B.A.S.M.A.</Link>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Update My Family</span>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 20px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>👨‍👩‍👧‍👦</div>
          <h1 style={{ fontSize: 26, fontWeight: 'bold', margin: '0 0 8px', color: '#F0C850' }}>Update My Family</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, margin: 0, lineHeight: 1.5 }}>
            View your registered children, add siblings, and update information.
          </p>
        </div>

        {/* Email Lookup */}
        {!familyData && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
              Enter the email you used to register
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && lookupFamily()}
              placeholder="your@email.com"
              style={{
                width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid rgba(240,200,80,0.2)',
                background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 16, outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={lookupFamily}
              disabled={loading || !email.trim()}
              style={{
                width: '100%', marginTop: 12, padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #F0C850, #c9a84c)', color: '#0D0118', fontWeight: 'bold',
                fontSize: 16, opacity: loading || !email.trim() ? 0.5 : 1,
              }}
            >
              {loading ? 'Looking up...' : '🔍 Find My Family'}
            </button>

            {error && (
              <div style={{ marginTop: 16, padding: 14, borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: 14 }}>
                {error}
              </div>
            )}
          </div>
        )}

        {/* Success message */}
        {successMsg && (
          <div style={{ marginBottom: 16, padding: 14, borderRadius: 10, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e', fontSize: 14, textAlign: 'center' }}>
            {successMsg}
          </div>
        )}

        {/* Family Dashboard */}
        {familyData && (
          <>
            {/* Parent info bar */}
            <div style={{ background: 'linear-gradient(135deg, rgba(240,200,80,0.08), rgba(240,200,80,0.03))', border: '1px solid rgba(240,200,80,0.15)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 20, color: '#F0C850' }}>👋 {familyData.parentName || 'Welcome!'}</h2>
                  <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                    {familyData.email} · {familyData.phone || 'No phone'}
                  </p>
                </div>
                <button
                  onClick={() => { setFamilyData(null); setEmail(''); setSuccessMsg('') }}
                  style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}
                >
                  ← Different email
                </button>
              </div>
            </div>

            {/* Duplicate warning */}
            {familyData.students.some(s => s.isDuplicate) && (
              <div style={{ marginBottom: 16, padding: 16, borderRadius: 12, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <div style={{ fontWeight: 'bold', color: '#f59e0b', fontSize: 15, marginBottom: 4 }}>⚠️ Duplicate registrations detected</div>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.4 }}>
                  It looks like the same child was registered multiple times. You can remove duplicates below — keep the one with the most info, and tap &quot;Remove Duplicate&quot; on the extras.
                </p>
              </div>
            )}

            {/* Student cards */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                🎵 Registered Students ({familyData.students.length})
              </h3>

              {familyData.students.map((student) => (
                <div key={student.id} style={{
                  background: 'rgba(255,255,255,0.03)', border: student.isDuplicate ? '1px solid rgba(245,158,11,0.25)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14, padding: 20, marginBottom: 12,
                }}>
                  {editingStudent === student.id ? (
                    /* Edit mode */
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h4 style={{ margin: 0, color: '#F0C850', fontSize: 16 }}>✏️ Editing {student.studentName}</h4>
                        <button onClick={() => setEditingStudent(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
                      </div>

                      <div style={{ display: 'grid', gap: 12 }}>
                        <div>
                          <label style={labelStyle}>Child&apos;s Name *</label>
                          <input style={inputStyle} value={editForm.studentName || ''} onChange={e => setEditForm(p => ({ ...p, studentName: e.target.value }))} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div>
                            <label style={labelStyle}>Age</label>
                            <input style={inputStyle} type="number" value={editForm.studentAge || ''} onChange={e => setEditForm(p => ({ ...p, studentAge: e.target.value }))} />
                          </div>
                          <div>
                            <label style={labelStyle}>Interests</label>
                            <input style={inputStyle} value={editForm.interests || ''} onChange={e => setEditForm(p => ({ ...p, interests: e.target.value }))} placeholder="Piano, Voice..." />
                          </div>
                        </div>
                        <div>
                          <label style={labelStyle}>🍕 Allergies / Dietary</label>
                          <input style={inputStyle} value={editForm.allergies || ''} onChange={e => setEditForm(p => ({ ...p, allergies: e.target.value }))} placeholder="None, or list allergies" />
                        </div>
                        <div>
                          <label style={labelStyle}>🏥 Medical Conditions</label>
                          <input style={inputStyle} value={editForm.medicalConditions || ''} onChange={e => setEditForm(p => ({ ...p, medicalConditions: e.target.value }))} placeholder="None, or list conditions" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div>
                            <label style={labelStyle}>🆘 Emergency Contact</label>
                            <input style={inputStyle} value={editForm.emergencyContactName || ''} onChange={e => setEditForm(p => ({ ...p, emergencyContactName: e.target.value }))} placeholder="Name" />
                          </div>
                          <div>
                            <label style={labelStyle}>🆘 Emergency Phone</label>
                            <input style={inputStyle} value={editForm.emergencyContactPhone || ''} onChange={e => setEditForm(p => ({ ...p, emergencyContactPhone: e.target.value }))} placeholder="(555) 555-5555" />
                          </div>
                        </div>
                      </div>

                      <button onClick={saveEdit} disabled={saving} style={{
                        width: '100%', marginTop: 16, padding: '12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                        background: '#22c55e', color: '#fff', fontWeight: 'bold', fontSize: 14, opacity: saving ? 0.5 : 1,
                      }}>
                        {saving ? 'Saving...' : '💾 Save Changes'}
                      </button>
                    </div>
                  ) : (
                    /* View mode */
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: 18, color: '#fff' }}>
                            {student.studentName}
                            {student.isDuplicate && <span style={{ marginLeft: 8, fontSize: 12, color: '#f59e0b', background: 'rgba(245,158,11,0.15)', padding: '2px 8px', borderRadius: 6 }}>DUPLICATE</span>}
                          </h4>
                          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                            {student.studentAge ? `Age ${student.studentAge}` : 'Age not set'} · {student.interests || 'No interests set'}
                          </p>
                        </div>
                      </div>

                      {/* Quick status icons */}
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                        <StatusPill ok={student.hasWaiver} label="Waiver" icon="📜" />
                        <StatusPill ok={!!student.allergies} label="Allergies" icon="🍕" />
                        <StatusPill ok={!!student.emergencyContactName} label="Emergency" icon="🆘" />
                        <StatusPill ok={!!student.medicalConditions} label="Medical" icon="🏥" />
                      </div>

                      {/* Detail rows */}
                      {student.allergies && (
                        <p style={{ margin: '0 0 4px', fontSize: 13, color: student.allergies.toLowerCase() === 'none' ? 'rgba(255,255,255,0.4)' : '#f87171' }}>
                          🍕 Allergies: {student.allergies}
                        </p>
                      )}
                      {student.emergencyContactName && (
                        <p style={{ margin: '0 0 4px', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                          🆘 Emergency: {student.emergencyContactName} {student.emergencyContactPhone}
                        </p>
                      )}

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                        <button onClick={() => startEdit(student)} style={btnStyle}>
                          ✏️ Edit Info
                        </button>
                        {!student.hasWaiver && (
                          <Link href={`/enroll?studentName=${encodeURIComponent(student.studentName)}&studentAge=${encodeURIComponent(student.studentAge)}&parentName=${encodeURIComponent(familyData.parentName)}&email=${encodeURIComponent(familyData.email)}&phone=${encodeURIComponent(familyData.phone)}`}
                            style={{ ...btnStyle, background: 'rgba(240,200,80,0.1)', color: '#F0C850', borderColor: 'rgba(240,200,80,0.3)', textDecoration: 'none' }}>
                            📝 Complete Registration
                          </Link>
                        )}
                        {student.isDuplicate && (
                          <button onClick={() => removeDuplicate(student)} style={{ ...btnStyle, background: 'rgba(239,68,68,0.1)', color: '#f87171', borderColor: 'rgba(239,68,68,0.2)' }}>
                            🗑️ Remove Duplicate
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add sibling */}
            {addingChild ? (
              <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
                <h4 style={{ margin: '0 0 16px', color: '#22c55e', fontSize: 16 }}>➕ Add Another Child</h4>
                <div style={{ display: 'grid', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Child&apos;s Full Name *</label>
                    <input style={inputStyle} value={newChild.studentName} onChange={e => setNewChild(p => ({ ...p, studentName: e.target.value }))} placeholder="First Last" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Age</label>
                      <input style={inputStyle} type="number" value={newChild.studentAge} onChange={e => setNewChild(p => ({ ...p, studentAge: e.target.value }))} />
                    </div>
                    <div>
                      <label style={labelStyle}>Interests</label>
                      <select style={{ ...inputStyle, appearance: 'auto' as never }} value={newChild.interests} onChange={e => setNewChild(p => ({ ...p, interests: e.target.value }))}>
                        <option value="">Select...</option>
                        {interestOptions.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  <button onClick={addChild} disabled={saving || !newChild.studentName.trim()} style={{
                    flex: 1, padding: '12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: '#22c55e', color: '#fff', fontWeight: 'bold', fontSize: 14, opacity: saving || !newChild.studentName.trim() ? 0.5 : 1,
                  }}>
                    {saving ? 'Adding...' : '✅ Add Child'}
                  </button>
                  <button onClick={() => setAddingChild(false)} style={{ padding: '12px 20px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 14 }}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAddingChild(true)} style={{
                width: '100%', padding: '14px', borderRadius: 12, cursor: 'pointer',
                background: 'rgba(34,197,94,0.08)', border: '1px dashed rgba(34,197,94,0.3)', color: '#22c55e',
                fontWeight: 'bold', fontSize: 15, marginBottom: 20,
              }}>
                ➕ Add a Sibling
              </button>
            )}

            {/* Complete registration CTA */}
            <div style={{ textAlign: 'center', padding: 20 }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, margin: '0 0 8px' }}>
                Need to complete full registration with waiver, allergies, and emergency info?
              </p>
              <Link href={`/enroll?parentName=${encodeURIComponent(familyData.parentName)}&email=${encodeURIComponent(familyData.email)}&phone=${encodeURIComponent(familyData.phone)}`}
                style={{ color: '#F0C850', fontSize: 14, textDecoration: 'underline' }}>
                Go to Full Enrollment Form →
              </Link>
            </div>
          </>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '32px 0', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 20 }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textDecoration: 'none' }}>
            ← Back to basmaworld.com
          </Link>
        </div>
      </div>
    </div>
  )
}

// Shared styles
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
}
const btnStyle: React.CSSProperties = {
  padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)',
}

function StatusPill({ ok, label, icon }: { ok: boolean; label: string; icon: string }) {
  return (
    <span style={{
      fontSize: 12, padding: '3px 8px', borderRadius: 6,
      background: ok ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
      color: ok ? '#22c55e' : '#f59e0b',
      border: `1px solid ${ok ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'}`,
    }}>
      {ok ? '✅' : '❌'} {icon} {label}
    </span>
  )
}
