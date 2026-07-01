'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
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
  discoveryWeek: string
  timeSlot: string
  paymentStatus: string
  enrolledClass: string
  hasWaiver: boolean
  createdAt: string
  // Enriched fields
  allergies: string
  medicalConditions: string
  emergencyContactName: string
  emergencyContactPhone: string
  liabilityAgreed: boolean
  waiverFormStatus: string
  lastCheckIn: string | null
  isRegistrationComplete: boolean
  missingFields?: string[]
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCHEDULE DATA
   ═══════════════════════════════════════════════════════════════════════════ */

const SCHEDULE_BLOCKS = [
  { time: '9:00 – 9:45 AM',        label: 'Tiny Tots Music & Fun',   ageRange: '2–5',   emoji: '👶', color: '#f472b6' },
  { time: '10:00 – 11:30 AM',      label: 'Kids Music & Fun (5–10)', ageRange: '5–10',  emoji: '🎵', color: '#60a5fa' },
  { time: '10:00 – 11:30 AM',      label: 'Kids Music & Fun (10–17)',ageRange: '10–17', emoji: '🎤', color: '#a78bfa' },
  { time: '12:00 – 1:30 PM',       label: 'Piano Class Lecture',     ageRange: 'All',   emoji: '🎹', color: '#34d399' },
  { time: '12:00 – 1:30 PM',       label: 'Recording Class',         ageRange: 'All',   emoji: '🎧', color: '#f59e0b', julyAugOnly: true },
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday']

const DEFAULT_CLOSURES: { date: string; note: string }[] = [
  { date: '2026-06-25', note: 'School Closed' },
  { date: '2026-07-02', note: 'School Closed (Jul 2–6)' },
  { date: '2026-07-03', note: 'School Closed (Jul 2–6)' },
  { date: '2026-07-06', note: 'School Closed (Jul 2–6)' },
]

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

function classifyRegistration(r: Registration): string {
  const interests = safe(r.interests).toLowerCase()
  const age = parseInt(safe(r.studentAge)) || 0
  const msg = safe(r.message).toLowerCase()
  if (interests.includes('piano')) return 'Piano Class Lecture'
  if (interests.includes('recording') || interests.includes('studio')) return 'Teens Recording Lecture'
  if (interests.includes('tiny tots') || interests.includes('toddler')) return 'Tiny Tots Music & Fun'
  if (age >= 2 && age <= 4) return 'Tiny Tots Music & Fun'
  if (age >= 5 && age <= 10) return 'Kids Music & Fun (5–10)'
  if (age >= 10 && age <= 17) return 'Kids Music & Fun (10–17)'
  const ageMatch = msg.match(/age:\s*(\d+)/)
  if (ageMatch) {
    const a = parseInt(ageMatch[1])
    if (a >= 2 && a <= 4) return 'Tiny Tots Music & Fun'
    if (a >= 5 && a <= 10) return 'Kids Music & Fun (5–10)'
    if (a >= 10 && a <= 17) return 'Kids Music & Fun (10–17)'
  }
  return 'Unassigned'
}

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPad = firstDay.getDay()
  const days: { date: Date; inMonth: boolean }[] = []
  for (let i = startPad - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    days.push({ date: d, inMonth: false })
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push({ date: new Date(year, month, d), inMonth: true })
  }
  while (days.length < 42) {
    const d = new Date(year, month + 1, days.length - startPad - lastDay.getDate() + 1)
    days.push({ date: d, inMonth: false })
  }
  return days
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function isClassDay(d: Date): boolean {
  const dow = d.getDay()
  return dow >= 1 && dow <= 4
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

const ACCESS_CODE = '1515'
type TabView = 'checkin' | 'roster' | 'discovery' | 'thisweek' | 'calendar' | 'closures' | 'chat' | 'announce'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface EditFields {
  studentName: string
  studentAge: string
  parentName: string
  email: string
  phone: string
  allergies: string
  medicalConditions: string
  emergencyContactName: string
  emergencyContactPhone: string
  interests: string
}

export default function TeacherContent() {
  const [authenticated, setAuthenticated] = useState(false)
  const [codeInput, setCodeInput] = useState('')
  const [codeError, setCodeError] = useState(false)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [allContacts, setAllContacts] = useState<{ name: string; phone: string; studentName: string; email: string; source: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<TabView>('checkin')
  const [expandedClass, setExpandedClass] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Check-in state
  const [checkedInToday, setCheckedInToday] = useState<Record<string, string>>({})
  const [checkingIn, setCheckingIn] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Registration | null>(null)
  const [checkInSearch, setCheckInSearch] = useState('')
  const [statsFilter, setStatsFilter] = useState<'all' | 'paid' | 'complete' | 'incomplete' | 'checkedin'>('all')

  // Calendar
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [calYear, setCalYear] = useState(2026)

  // Closures
  const [closures, setClosures] = useState<{ date: string; note: string }[]>(DEFAULT_CLOSURES)
  const [newClosureDate, setNewClosureDate] = useState('')
  const [newClosureNote, setNewClosureNote] = useState('')

  // Birthdays
  const [birthdays, setBirthdays] = useState<Record<string, string>>({})
  const [editingBirthday, setEditingBirthday] = useState<string | null>(null)
  const [birthdayInput, setBirthdayInput] = useState('')

  // Edit student mode
  const [editMode, setEditMode] = useState(false)
  const [editCodeInput, setEditCodeInput] = useState('')
  const [editCodeVerified, setEditCodeVerified] = useState(false)
  const [editFields, setEditFields] = useState<EditFields | null>(null)
  const [editSaving, setEditSaving] = useState(false)
  const [editSuccess, setEditSuccess] = useState(false)

  // Admin chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useCallback((node: HTMLDivElement | null) => {
    if (node) node.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Announcement state
  const [announceMsg, setAnnounceMsg] = useState('')
  const [announceSentContacts, setAnnounceSentContacts] = useState<Set<string>>(new Set())
  const [announceActive, setAnnounceActive] = useState(false)

  // Block contacts state
  const [blockPhone, setBlockPhone] = useState('')
  const [blockName, setBlockName] = useState('')
  const [blockedList, setBlockedList] = useState<{id: string; phone: string; name: string; blockedAt: string}[]>([])
  const [blockLoading, setBlockLoading] = useState(false)
  const [blockMsg, setBlockMsg] = useState('')
  const [showBlockSection, setShowBlockSection] = useState(false)

  // Auth check — code required every time (no saved sessions)
  useEffect(() => {
    // Clear any old saved auth so code is always required
    try { localStorage.removeItem('basma-teacher-auth') } catch {}
  }, [])

  // Load saved data from localStorage
  useEffect(() => {
    try {
      const savedClosures = localStorage.getItem('basma-closures')
      if (savedClosures) setClosures(JSON.parse(savedClosures))
      const savedBdays = localStorage.getItem('basma-birthdays')
      if (savedBdays) setBirthdays(JSON.parse(savedBdays))
      // Load today's check-ins
      const today = new Date().toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' })
      const savedCheckins = localStorage.getItem(`basma-checkins-${today}`)
      if (savedCheckins) setCheckedInToday(JSON.parse(savedCheckins))
    } catch {}
  }, [])

  function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (codeInput.trim() === ACCESS_CODE) {
      setAuthenticated(true)
      setCodeError(false)
      // No localStorage persistence — code required every visit
    } else {
      setCodeError(true)
    }
  }

  function addClosure() {
    if (!newClosureDate) return
    const updated = [...closures, { date: newClosureDate, note: newClosureNote || 'School Closed' }]
    setClosures(updated)
    try { localStorage.setItem('basma-closures', JSON.stringify(updated)) } catch {}
    setNewClosureDate('')
    setNewClosureNote('')
  }

  function removeClosure(date: string) {
    const updated = closures.filter(c => c.date !== date)
    setClosures(updated)
    try { localStorage.setItem('basma-closures', JSON.stringify(updated)) } catch {}
  }

  function toggleClosureOnDate(dateStr: string) {
    const existing = closures.find(c => c.date === dateStr)
    if (existing) {
      removeClosure(dateStr)
    } else {
      const updated = [...closures, { date: dateStr, note: 'School Closed' }]
      setClosures(updated)
      try { localStorage.setItem('basma-closures', JSON.stringify(updated)) } catch {}
    }
  }

  function saveBirthday(studentId: string) {
    const updated = { ...birthdays, [studentId]: birthdayInput }
    setBirthdays(updated)
    try { localStorage.setItem('basma-birthdays', JSON.stringify(updated)) } catch {}
    setEditingBirthday(null)
    setBirthdayInput('')
  }

  // Fetch registrations
  useEffect(() => {
    if (!authenticated) return
    fetch('/api/registrations?source=all&teacherCode=1515')
      .then(r => r.json())
      .then(data => {
        setRegistrations(data.registrations || [])
        setAllContacts(data.allContacts || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [authenticated])

  // Fetch blocked contacts list
  const fetchBlockedList = useCallback(async () => {
    try {
      const res = await fetch('/api/contacts/block')
      const data = await res.json()
      setBlockedList(data.blocked || [])
    } catch (_) {}
  }, [])

  useEffect(() => {
    if (authenticated) fetchBlockedList()
  }, [authenticated, fetchBlockedList])

  // Block a phone number
  const handleBlockPhone = async () => {
    const digits = blockPhone.replace(/\D/g, '')
    if (digits.length < 7) {
      setBlockMsg('⚠️ Please enter a valid phone number')
      return
    }
    setBlockLoading(true)
    setBlockMsg('')
    try {
      const res = await fetch('/api/contacts/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: blockPhone, name: blockName }),
      })
      const data = await res.json()
      if (!res.ok) {
        setBlockMsg(`⚠️ ${data.error}`)
      } else {
        setBlockMsg('✅ Number blocked — they won\'t appear in Text All anymore')
        setBlockPhone('')
        setBlockName('')
        fetchBlockedList()
        // Re-fetch contacts to update the Text All list
        fetch('/api/registrations?source=all&teacherCode=1515')
          .then(r => r.json())
          .then(d => { setRegistrations(d.registrations || []); setAllContacts(d.allContacts || []) })
      }
    } catch (e: any) {
      setBlockMsg(`⚠️ Error: ${e.message}`)
    }
    setBlockLoading(false)
  }

  // Unblock a phone number
  const handleUnblock = async (recordId: string) => {
    setBlockLoading(true)
    try {
      await fetch('/api/contacts/block', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId }),
      })
      fetchBlockedList()
      // Re-fetch contacts
      fetch('/api/registrations?source=all&teacherCode=1515')
        .then(r => r.json())
        .then(d => { setRegistrations(d.registrations || []); setAllContacts(d.allContacts || []) })
    } catch (_) {}
    setBlockLoading(false)
  }

  // Check-in handler
  const handleCheckIn = useCallback(async (student: Registration) => {
    setCheckingIn(student.id)
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordId: student.id,
          teacherCode: ACCESS_CODE,
          studentName: student.studentName || student.parentName,
          parentEmail: student.email,
          parentName: student.parentName,
          parentPhone: student.phone || '',
          isIncomplete: !student.isRegistrationComplete,
          studentAge: student.studentAge || '',
          allergies: student.allergies || '',
          medicalConditions: student.medicalConditions || '',
          emergencyContactName: student.emergencyContactName || '',
          emergencyContactPhone: student.emergencyContactPhone || '',
          hasWaiver: student.hasWaiver || false,
          interests: student.interests || '',
        }),
      })
      const data = await res.json()
      if (data.success) {
        const today = new Date().toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' })
        const updated = { ...checkedInToday, [student.id]: data.checkedInAt }
        setCheckedInToday(updated)
        try { localStorage.setItem(`basma-checkins-${today}`, JSON.stringify(updated)) } catch {}
      }
    } catch (err) {
      console.error('Check-in error:', err)
    }
    setCheckingIn(null)
  }, [checkedInToday])

  const handleUncheck = useCallback(async (student: Registration) => {
    if (!confirm(`Undo check-in for ${safe(student.studentName) || safe(student.parentName)}?`)) return
    setCheckingIn(student.id)
    try {
      const res = await fetch('/api/checkin', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherCode: ACCESS_CODE,
          studentName: student.studentName || student.parentName,
          recordId: student.id,
        }),
      })
      const data = await res.json()
      if (data.success) {
        const today = new Date().toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' })
        const updated = { ...checkedInToday }
        delete updated[student.id]
        setCheckedInToday(updated)
        try { localStorage.setItem(`basma-checkins-${today}`, JSON.stringify(updated)) } catch {}
      }
    } catch (err) {
      console.error('Uncheck error:', err)
    }
    setCheckingIn(null)
  }, [checkedInToday])

  const closureSet = useMemo(() => new Set(closures.map(c => c.date)), [closures])

  // Edit student handlers
  const startEdit = useCallback((student: Registration) => {
    setEditMode(true)
    setEditCodeVerified(false)
    setEditCodeInput('')
    setEditSuccess(false)
    setEditFields({
      studentName: safe(student.studentName),
      studentAge: safe(student.studentAge),
      parentName: safe(student.parentName),
      email: safe(student.email),
      phone: safe(student.phone),
      allergies: safe(student.allergies),
      medicalConditions: safe(student.medicalConditions),
      emergencyContactName: safe(student.emergencyContactName),
      emergencyContactPhone: safe(student.emergencyContactPhone),
      interests: safe(student.interests),
    })
  }, [])

  const verifyEditCode = useCallback((code: string) => {
    if (code.trim() === ACCESS_CODE) {
      setEditCodeVerified(true)
      return true
    }
    return false
  }, [])

  const saveEdit = useCallback(async (student: Registration) => {
    if (!editFields) return
    setEditSaving(true)
    try {
      const res = await fetch('/api/family', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordId: student.id,
          teacherCode: ACCESS_CODE,
          studentName: editFields.studentName,
          studentAge: editFields.studentAge,
          parentName: editFields.parentName,
          email: editFields.email,
          phone: editFields.phone,
          interests: editFields.interests,
          allergies: editFields.allergies,
          medicalConditions: editFields.medicalConditions,
          emergencyContactName: editFields.emergencyContactName,
          emergencyContactPhone: editFields.emergencyContactPhone,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setEditSuccess(true)
        // Update local state
        setRegistrations(prev => prev.map(r => r.id === student.id ? {
          ...r,
          studentName: editFields.studentName,
          studentAge: editFields.studentAge,
          parentName: editFields.parentName,
          email: editFields.email,
          phone: editFields.phone,
          interests: editFields.interests,
          allergies: editFields.allergies,
          medicalConditions: editFields.medicalConditions,
          emergencyContactName: editFields.emergencyContactName,
          emergencyContactPhone: editFields.emergencyContactPhone,
        } : r))
        // Update the selected student too
        setSelectedStudent(prev => prev && prev.id === student.id ? {
          ...prev,
          studentName: editFields.studentName,
          studentAge: editFields.studentAge,
          parentName: editFields.parentName,
          email: editFields.email,
          phone: editFields.phone,
          interests: editFields.interests,
          allergies: editFields.allergies,
          medicalConditions: editFields.medicalConditions,
          emergencyContactName: editFields.emergencyContactName,
          emergencyContactPhone: editFields.emergencyContactPhone,
        } : prev)
        setTimeout(() => {
          setEditMode(false)
          setEditSuccess(false)
        }, 1500)
      }
    } catch (err) {
      console.error('Save edit error:', err)
      alert('Failed to save. Please try again.')
    }
    setEditSaving(false)
  }, [editFields])

  // Admin chat handler
  const sendChatMessage = useCallback(async () => {
    if (!chatInput.trim()) return
    const userMsg: ChatMessage = { role: 'user', content: chatInput.trim() }
    const newMessages = [...chatMessages, userMsg]
    setChatMessages(newMessages)
    setChatInput('')
    setChatLoading(true)

    try {
      const res = await fetch('/api/teacher-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          teacherCode: ACCESS_CODE,
        }),
      })
      const data = await res.json()
      if (data.reply) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
        // If updates were made, refresh registrations
        if (data.updates && data.updates.length > 0 && data.updates.some((u: any) => u.success)) {
          fetch('/api/registrations?source=all&teacherCode=1515')
            .then(r => r.json())
            .then(d => { setRegistrations(d.registrations || []); setAllContacts(d.allContacts || []) })
            .catch(() => {})
        }
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    }
    setChatLoading(false)
  }, [chatInput, chatMessages])

  // This Week data
  const thisWeekData = useMemo(() => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0=Sun ... 6=Sat
    // Find Monday of current week
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const monday = new Date(today)
    monday.setDate(today.getDate() + mondayOffset)

    const weekDays: { date: Date; dateStr: string; dayName: string; isClosed: boolean; isToday: boolean; isPast: boolean }[] = []
    for (let i = 0; i < 4; i++) { // Mon-Thu
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      const ds = dateKey(d)
      weekDays.push({
        date: d,
        dateStr: ds,
        dayName: DAYS[i],
        isClosed: closureSet.has(ds),
        isToday: d.toDateString() === today.toDateString(),
        isPast: d < new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      })
    }

    // Group students by class
    const classBucketsList = SCHEDULE_BLOCKS.map(block => {
      const students = registrations.filter(r => classifyRegistration(r) === block.label)
      return { block, students }
    })

    const confirmedStudents = registrations.filter(r => safe(r.paymentStatus) === 'Paid' || safe(r.paymentStatus) === 'Free' || safe(r.status) === 'Free Trial')
    return { weekDays, classBuckets: classBucketsList, totalStudents: confirmedStudents.length }
  }, [registrations, closureSet])

  // Class buckets for roster
  const classBuckets = useMemo(() => {
    const buckets: Record<string, { block: typeof SCHEDULE_BLOCKS[0]; students: Registration[] }> = {}
    for (const block of SCHEDULE_BLOCKS) {
      buckets[block.label] = { block, students: [] }
    }
    buckets['Unassigned'] = {
      block: { time: 'TBD', label: 'Unassigned', ageRange: 'All', emoji: '📋', color: '#6b7280' },
      students: [],
    }
    for (const reg of registrations) {
      const cls = classifyRegistration(reg)
      if (buckets[cls]) buckets[cls].students.push(reg)
      else buckets['Unassigned'].students.push(reg)
    }
    return buckets
  }, [registrations])

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

  // Discovery camp groups
  const discoveryGroups = useMemo(() => {
    const campStudents = registrations.filter(r =>
      safe(r.source).includes('discovery') || safe(r.interests).toLowerCase().includes('discovery')
      || safe(r.discoveryWeek)
    )
    const groups: Record<string, { morning: Registration[]; midday: Registration[] }> = {}
    for (const s of campStudents) {
      const week = safe(s.discoveryWeek) || 'No week selected'
      if (!groups[week]) groups[week] = { morning: [], midday: [] }
      const slot = safe(s.timeSlot).toLowerCase()
      if (slot.includes('12') || slot.includes('midday') || slot.includes('pm') && !slot.includes('10')) {
        groups[week].midday.push(s)
      } else {
        groups[week].morning.push(s)
      }
    }
    return groups
  }, [registrations])

  // Check-in filtered list (with stats filter + search)
  const checkInStudents = useMemo(() => {
    let filtered = registrations

    // Apply stats filter first
    if (statsFilter === 'paid') {
      filtered = filtered.filter(s => safe(s.paymentStatus) === 'Paid' || safe(s.paymentStatus) === 'Free' || safe(s.status) === 'Free Trial')
    } else if (statsFilter === 'complete') {
      filtered = filtered.filter(s => s.isRegistrationComplete)
    } else if (statsFilter === 'incomplete') {
      filtered = filtered.filter(s => !s.isRegistrationComplete)
    } else if (statsFilter === 'checkedin') {
      filtered = filtered.filter(s => !!checkedInToday[s.id])
    }

    // Then apply search
    if (checkInSearch.trim()) {
      const q = checkInSearch.toLowerCase()
      filtered = filtered.filter(s =>
        safe(s.studentName).toLowerCase().includes(q) ||
        safe(s.parentName).toLowerCase().includes(q) ||
        safe(s.email).toLowerCase().includes(q) ||
        safe(s.phone).includes(q)
      )
    }

    return filtered
  }, [registrations, checkInSearch, statsFilter, checkedInToday])

  const stats = useMemo(() => {
    const uniqueStudents = new Set(registrations.map(r => safe(r.studentName).trim().toLowerCase()).filter(Boolean))
    const uniqueParents = new Set(registrations.map(r => safe(r.email).trim().toLowerCase()).filter(Boolean))
    const checkedInCount = Object.keys(checkedInToday).length
    const paidCount = registrations.filter(r => safe(r.paymentStatus) === 'Paid' || safe(r.paymentStatus) === 'Free' || safe(r.status) === 'Free Trial').length
    return {
      total: registrations.length,
      uniqueStudents: uniqueStudents.size,
      uniqueParents: uniqueParents.size,
      paid: paidCount,
      complete: registrations.filter(r => r.isRegistrationComplete).length,
      incomplete: registrations.filter(r => !r.isRegistrationComplete).length,
      checkedIn: checkedInCount,
    }
  }, [registrations, checkedInToday])

  // Upcoming birthdays
  const upcomingBirthdays = useMemo(() => {
    const today = new Date()
    return Object.entries(birthdays)
      .map(([id, bday]) => {
        const student = registrations.find(r => r.id === id)
        if (!student || !bday) return null
        const [m, d] = bday.split('/').map(Number)
        if (!m || !d) return null
        let next = new Date(today.getFullYear(), m - 1, d)
        if (next < today) next = new Date(today.getFullYear() + 1, m - 1, d)
        const daysUntil = Math.ceil((next.getTime() - today.getTime()) / 86400000)
        return { name: safe(student.studentName) || safe(student.parentName), birthday: bday, daysUntil }
      })
      .filter(Boolean)
      .sort((a, b) => a!.daysUntil - b!.daysUntil)
      .slice(0, 5) as { name: string; birthday: string; daysUntil: number }[]
  }, [birthdays, registrations])

  // ─── Login screen ───
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
            <input type="password" placeholder="Access code" value={codeInput}
              onChange={(e) => { setCodeInput(e.target.value); setCodeError(false) }}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center text-2xl tracking-[0.5em] placeholder-white/25 focus:border-[#c9a84c]/50 focus:outline-none transition"
              autoFocus />
            {codeError && <p className="text-red-400 text-sm">Incorrect code. Please try again.</p>}
            <button type="submit" disabled={!codeInput.trim()}
              className="w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', color: '#050505' }}>
              Enter Portal
            </button>
          </form>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#050505' }}>
        <div className="text-center">
          <div className="text-4xl animate-pulse mb-4">🎵</div>
          <p className="text-white/40 text-sm">Loading...</p>
        </div>
      </main>
    )
  }

  const calDays = getMonthDays(calYear, calMonth)

  return (
    <main className="min-h-screen text-white" style={{ background: '#050505' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <Link href="/" className="text-lg font-bold tracking-wider" style={{ color: '#c9a84c', fontFamily: "'Playfair Display', serif" }}>BASMA</Link>
        <span className="text-sm text-white/40">Teacher Portal</span>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Teacher <span style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dashboard</span>
          </h1>
          <p className="text-white/30 text-sm">Summer 2026 · 6787 W Tropicana Ave Suite 260 · Mon–Thu</p>
        </div>

        {/* Stats — clickable to filter */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
          {[
            { label: 'Total Sign-ups', value: stats.total, emoji: '📋', filter: 'all' as const },
            { label: 'Paid / Free', value: stats.paid, emoji: '💰', filter: 'paid' as const },
            { label: 'All Students', value: stats.uniqueStudents, emoji: '👧', filter: 'all' as const },
            { label: 'Families', value: stats.uniqueParents, emoji: '👨‍👩‍👧', filter: 'all' as const },
            { label: 'Checked In', value: stats.checkedIn, emoji: '🟢', filter: 'checkedin' as const },
          ].map(s => {
            const isActive = statsFilter === s.filter
            return (
              <button key={s.label}
                onClick={() => { setStatsFilter(prev => prev === s.filter ? 'all' : s.filter); setTab('checkin') }}
                className="p-4 rounded-xl text-center transition cursor-pointer hover:scale-[1.03] hover:ring-1 hover:ring-[#c9a84c]/30"
                style={{
                  background: isActive ? 'rgba(240,200,80,0.08)' : 'rgba(255,255,255,0.02)',
                  border: isActive ? '2px solid rgba(240,200,80,0.4)' : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="text-2xl mb-1">{s.emoji}</div>
                <div className="text-2xl font-bold" style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                <div className="text-xs text-white/30 mt-1">{s.label}</div>
                <div className="text-[10px] mt-1" style={{ color: isActive ? '#F0C850' : 'rgba(255,255,255,0.15)' }}>{isActive ? '✕ Clear filter' : 'Tap to filter'}</div>
              </button>
            )
          })}
        </div>
        {/* Active filter indicator */}
        {statsFilter !== 'all' && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg" style={{ background: 'rgba(240,200,80,0.06)', border: '1px solid rgba(240,200,80,0.15)' }}>
            <span className="text-sm" style={{ color: '#F0C850' }}>
              Showing: {statsFilter === 'paid' ? '💰 Paid / Free students' : statsFilter === 'complete' ? '✅ Complete registrations' : statsFilter === 'incomplete' ? '⏳ Incomplete registrations' : statsFilter === 'checkedin' ? '🟢 Checked in today' : '📋 All sign-ups'}
            </span>
            <button onClick={() => setStatsFilter('all')} className="ml-auto text-xs px-2 py-1 rounded-lg hover:bg-white/5 transition" style={{ color: '#F0C850' }}>
              Clear ✕
            </button>
          </div>
        )}

        {/* Upcoming Birthdays */}
        {upcomingBirthdays.length > 0 && (
          <div className="mb-6 p-4 rounded-xl" style={{ background: 'rgba(244,114,182,0.05)', border: '1px solid rgba(244,114,182,0.15)' }}>
            <h3 className="text-sm font-semibold text-pink-400 mb-2">🎂 Upcoming Birthdays</h3>
            <div className="flex flex-wrap gap-3">
              {upcomingBirthdays.map(b => (
                <span key={b.name} className="text-xs px-3 py-1.5 rounded-full" style={{ background: 'rgba(244,114,182,0.1)', color: '#f472b6' }}>
                  {b.name} — {b.birthday} {b.daysUntil === 0 ? '🎉 TODAY!' : b.daysUntil <= 7 ? `(in ${b.daysUntil}d!)` : `(in ${b.daysUntil}d)`}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl bg-white/[0.03] w-fit overflow-x-auto">
          {([
            { id: 'checkin' as const, label: '✅ Check-In' },
            { id: 'thisweek' as const, label: '📅 This Week' },
            { id: 'roster' as const, label: '📋 Class Roster' },
            { id: 'discovery' as const, label: '🏕️ Discovery Camp' },
            { id: 'calendar' as const, label: '🗓️ Calendar' },
            { id: 'closures' as const, label: '🚫 Closures' },
            { id: 'chat' as const, label: '🤖 Assistant' },
            { id: 'announce' as const, label: '📢 Text All' },
          ]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${tab === t.id ? 'bg-[#c9a84c]/20 text-[#c9a84c]' : 'text-white/40 hover:text-white/60'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ═══ CHECK-IN TAB ═══ */}
        {tab === 'checkin' && (
          <>
            {/* Search bar */}
            <div className="mb-6">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
                <input type="text" placeholder="Search student by name, parent name, email, or phone..."
                  value={checkInSearch} onChange={(e) => setCheckInSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/25 focus:border-[#c9a84c]/50 focus:outline-none transition text-lg"
                  autoFocus />
              </div>
              {checkInSearch && (
                <p className="text-sm text-white/30 mt-2">{checkInStudents.length} result{checkInStudents.length !== 1 ? 's' : ''} found</p>
              )}
            </div>

            {/* Student detail modal */}
            {selectedStudent && (
              <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => { setSelectedStudent(null); setEditMode(false) }}>
                <div className="bg-[#0a0a0f] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}
                  style={{ border: '1px solid rgba(201,168,76,0.2)' }}>
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-white">{safe(selectedStudent.studentName) || safe(selectedStudent.parentName)}</h2>
                        <p className="text-sm text-white/40">Age {safe(selectedStudent.studentAge) || '?'} · {classifyRegistration(selectedStudent)}</p>
                      </div>
                      <button onClick={() => { setSelectedStudent(null); setEditMode(false) }} className="text-white/30 hover:text-white text-2xl">&times;</button>
                    </div>

                    {/* ═══ QUICK ACTIONS ═══ */}
                    <div className="grid grid-cols-2 gap-2 mb-5">
                      {safe(selectedStudent.email) && (
                        <a href={`mailto:${safe(selectedStudent.email)}?subject=${encodeURIComponent('BASMA Academy — ' + safe(selectedStudent.studentName))}`}
                          className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition hover:opacity-90"
                          style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' }}>
                          📧 Email Parent
                        </a>
                      )}
                      {safe(selectedStudent.phone) && (
                        <a href={`sms:${safe(selectedStudent.phone).replace(/\D/g, '')}?body=${encodeURIComponent('Hi ' + (safe(selectedStudent.parentName).split(' ')[0] || '') + '! This is BASMA Academy regarding ' + safe(selectedStudent.studentName) + '. ')}`}
                          className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition hover:opacity-90"
                          style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}>
                          💬 Text Parent
                        </a>
                      )}
                      {safe(selectedStudent.phone) && (
                        <a href={`tel:${safe(selectedStudent.phone).replace(/\D/g, '')}`}
                          className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition hover:opacity-90"
                          style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)' }}>
                          📞 Call Parent
                        </a>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const parentFirst = safe(selectedStudent.parentName).split(' ')[0] || 'Parent'
                          const student = safe(selectedStudent.studentName)
                          const body = `Hi ${parentFirst}! We'd love to schedule ${student}'s next session at BASMA Academy. What days/times work best for your family this week? We have openings Mon–Thu.\n\nReply to this message or call us at (702) 788-7369.\n\n— Miss Basma 🎵`
                          if (safe(selectedStudent.email)) {
                            window.open(`mailto:${safe(selectedStudent.email)}?subject=${encodeURIComponent('Schedule ' + student + "'s Session — BASMA Academy")}&body=${encodeURIComponent(body)}`, '_blank')
                          } else if (safe(selectedStudent.phone)) {
                            window.open(`sms:${safe(selectedStudent.phone).replace(/\D/g, '')}?body=${encodeURIComponent(body)}`, '_blank')
                          }
                        }}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition hover:opacity-90"
                        style={{ background: 'rgba(244,114,182,0.1)', color: '#f472b6', border: '1px solid rgba(244,114,182,0.25)' }}>
                        📅 Schedule Session
                      </button>
                    </div>

                    {/* Enrolled class — prominent display */}
                    <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)' }}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">🎵</span>
                        <span className="text-xs text-[#c9a84c]/60 uppercase tracking-wider font-semibold">Registered For</span>
                      </div>
                      <p className="text-white/90 font-semibold">{classifyRegistration(selectedStudent)}</p>
                      {safe(selectedStudent.enrolledClass) && safe(selectedStudent.enrolledClass) !== classifyRegistration(selectedStudent) && (
                        <p className="text-xs text-white/40 mt-1">Enrolled: {safe(selectedStudent.enrolledClass)}</p>
                      )}
                      {safe(selectedStudent.discoveryWeek) && (
                        <p className="text-xs text-white/40 mt-1">📅 {safe(selectedStudent.discoveryWeek)} · {safe(selectedStudent.timeSlot) || 'No time selected'}</p>
                      )}
                    </div>

                    {/* ═══ REGISTRATION CHECKLIST ═══ */}
                    {(() => {
                      const s = selectedStudent
                      const checks = [
                        { label: 'Registration Form', icon: '📝', done: !!(safe(s.parentName) && safe(s.email) && safe(s.phone) && safe(s.studentName)), detail: safe(s.parentName) && safe(s.email) ? `${safe(s.parentName)} · ${safe(s.email)}` : 'Parent name, email, phone needed' },
                        { label: 'Liability Waiver', icon: '📜', done: s.hasWaiver, detail: s.hasWaiver ? 'Signed' : 'Not signed — required for participation' },
                        { label: 'Allergy / Dietary Info', icon: '🍕', done: !!(safe(s.allergies)), detail: safe(s.allergies) ? (safe(s.allergies).toLowerCase() === 'none' ? 'None reported' : `⚠️ ${safe(s.allergies)}`) : 'Not provided — needed for safety' },
                        { label: 'Medical Conditions', icon: '🏥', done: !!(safe(s.medicalConditions)), detail: safe(s.medicalConditions) ? safe(s.medicalConditions) : 'Not provided' },
                        { label: 'Emergency Contact', icon: '🆘', done: !!(safe(s.emergencyContactName) && safe(s.emergencyContactPhone)), detail: safe(s.emergencyContactName) ? `${safe(s.emergencyContactName)} · ${safe(s.emergencyContactPhone) ? formatPhone(safe(s.emergencyContactPhone)) : 'No phone'}` : 'Not provided — required' },
                        { label: 'Payment', icon: '💳', done: safe(s.paymentStatus) === 'Paid' || safe(s.paymentStatus) === 'Free', detail: safe(s.paymentStatus) === 'Paid' ? 'Paid ✓' : safe(s.paymentStatus) === 'Free' ? 'Free program' : 'Pending' },
                      ]
                      const doneCount = checks.filter(c => c.done).length
                      const allDone = doneCount === checks.length
                      const pct = Math.round((doneCount / checks.length) * 100)

                      // Build the complete-registration link for this student
                      const regLink = `https://basmaworld.com/enroll?studentName=${encodeURIComponent(safe(s.studentName))}&studentAge=${encodeURIComponent(safe(s.studentAge))}&parentName=${encodeURIComponent(safe(s.parentName))}&email=${encodeURIComponent(safe(s.email))}&phone=${encodeURIComponent(safe(s.phone))}`

                      return (
                        <>
                          {/* Progress bar */}
                          <div className={`p-4 rounded-xl mb-4 ${allDone ? 'bg-green-500/10 border border-green-500/20' : 'bg-yellow-500/10 border border-yellow-500/20'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{allDone ? '✅' : '⚠️'}</span>
                                <span className={`font-semibold ${allDone ? 'text-green-400' : 'text-yellow-400'}`}>
                                  {allDone ? 'All Forms Complete' : `${doneCount}/${checks.length} Complete`}
                                </span>
                              </div>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${allDone ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{pct}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: allDone ? '#22c55e' : 'linear-gradient(90deg, #F0C850, #c9a84c)' }} />
                            </div>
                          </div>

                          {/* Checklist items */}
                          <div className="space-y-2 mb-4">
                            {checks.map(c => (
                              <div key={c.label} className={`flex items-start gap-3 p-3 rounded-xl ${c.done ? 'bg-white/[0.02]' : 'bg-yellow-500/[0.04]'}`} style={{ border: c.done ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(234,179,8,0.15)' }}>
                                <span className="text-lg flex-shrink-0 mt-0.5">{c.done ? '✅' : '❌'}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm">{c.icon}</span>
                                    <span className={`text-sm font-semibold ${c.done ? 'text-white/70' : 'text-yellow-400'}`}>{c.label}</span>
                                  </div>
                                  <p className={`text-xs mt-0.5 ${c.done ? 'text-white/40' : 'text-yellow-400/60'}`}>{c.detail}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Send registration link button */}
                          {!allDone && (
                            <div className="mb-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const text = `Hi! Please complete ${safe(s.studentName)}'s registration for BASMA Academy. It only takes 2 minutes:\n\n${regLink}\n\nThank you! 🎵`
                                  navigator.clipboard.writeText(text).then(() => {
                                    alert('Registration link copied to clipboard! Paste it in a text message or email to the parent.')
                                  }).catch(() => {
                                    // Fallback: select the link text
                                    prompt('Copy this registration link to send to the parent:', regLink)
                                  })
                                }}
                                className="w-full py-3 rounded-xl font-semibold text-sm transition hover:opacity-90 flex items-center justify-center gap-2"
                                style={{ background: 'rgba(240,200,80,0.1)', color: '#F0C850', border: '1px solid rgba(240,200,80,0.3)' }}
                              >
                                📋 Copy Registration Link for Parent
                              </button>
                              <p className="text-[11px] text-white/25 text-center mt-1">Copies a ready-to-send message with the enrollment link</p>
                            </div>
                          )}

                          {/* Parent & Student Info */}
                          <div className="space-y-4">
                            {/* Parent info */}
                            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                              <h3 className="text-sm font-semibold text-white/50 mb-3 uppercase tracking-wider">👤 Parent Info</h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-white/40">Name</span><span className="text-white/80">{safe(s.parentName) || '—'}</span></div>
                                <div className="flex justify-between"><span className="text-white/40">Email</span><span className="text-white/80">{safe(s.email) || '—'}</span></div>
                                <div className="flex justify-between"><span className="text-white/40">Phone</span><span className="text-white/80">{formatPhone(safe(s.phone))}</span></div>
                              </div>
                            </div>

                            {/* Allergies & Medical — PROMINENT */}
                            <div className={`p-4 rounded-xl ${safe(s.allergies) && safe(s.allergies).toLowerCase() !== 'none' && safe(s.allergies).toLowerCase() !== '' ? 'bg-red-500/10 border border-red-500/20' : 'bg-white/[0.02] border border-white/[0.06]'}`}>
                              <h3 className="text-sm font-semibold text-white/50 mb-3 uppercase tracking-wider">🏥 Health & Safety</h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-start">
                                  <span className="text-white/40">Allergies</span>
                                  <span className={`text-right ${
                                    !safe(s.allergies) ? 'text-yellow-400 font-semibold' :
                                    safe(s.allergies).toLowerCase() === 'none' ? 'text-green-400' :
                                    'text-red-400 font-bold'
                                  }`}>
                                    {safe(s.allergies) || '⚠️ NOT PROVIDED'}
                                  </span>
                                </div>
                                <div className="flex justify-between items-start">
                                  <span className="text-white/40">Medical</span>
                                  <span className="text-white/80 text-right">{safe(s.medicalConditions) || 'None listed'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Emergency Contact */}
                            <div className={`p-4 rounded-xl ${!safe(s.emergencyContactName) ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-white/[0.02] border border-white/[0.06]'}`}>
                              <h3 className="text-sm font-semibold text-white/50 mb-3 uppercase tracking-wider">🆘 Emergency Contact</h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-white/40">Name</span>
                                  <span className={!safe(s.emergencyContactName) ? 'text-yellow-400 font-semibold' : 'text-white/80'}>
                                    {safe(s.emergencyContactName) || '⚠️ NOT PROVIDED'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-white/40">Phone</span>
                                  <span className={!safe(s.emergencyContactPhone) ? 'text-yellow-400 font-semibold' : 'text-white/80'}>
                                    {safe(s.emergencyContactPhone) ? formatPhone(safe(s.emergencyContactPhone)) : '⚠️ NOT PROVIDED'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Enrollment details */}
                            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                              <h3 className="text-sm font-semibold text-white/50 mb-3 uppercase tracking-wider">📋 Enrollment Details</h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-white/40">Interests</span><span className="text-white/80">{safe(s.interests) || '—'}</span></div>
                                <div className="flex justify-between"><span className="text-white/40">Source</span><span className="text-white/80">{safe(s.source) || '—'}</span></div>
                                <div className="flex justify-between"><span className="text-white/40">Time Slot</span><span className="text-white/80">{safe(s.timeSlot) || '—'}</span></div>
                                {safe(s.discoveryWeek) && (
                                  <div className="flex justify-between"><span className="text-white/40">Discovery Week</span><span className="text-white/80">{s.discoveryWeek}</span></div>
                                )}
                                {s.lastCheckIn && (
                                  <div className="flex justify-between"><span className="text-white/40">Last Check-In</span><span className="text-green-400">{s.lastCheckIn}</span></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    })()}

                    {/* ═══ EDIT INFO SECTION ═══ */}
                    <div className="mt-4">
                      {!editMode ? (
                        <button
                          onClick={() => startEdit(selectedStudent)}
                          className="w-full py-3 rounded-xl font-semibold text-sm transition hover:opacity-90 flex items-center justify-center gap-2"
                          style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)' }}>
                          ✏️ Edit Student Info
                        </button>
                      ) : !editCodeVerified ? (
                        <div className="p-4 rounded-xl" style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.2)' }}>
                          <p className="text-sm text-purple-400 mb-3 font-semibold">🔒 Enter teacher code to edit:</p>
                          <form onSubmit={(e) => { e.preventDefault(); if (!verifyEditCode(editCodeInput)) { setEditCodeInput(''); alert('Incorrect code') } }} className="flex gap-2">
                            <input type="password" value={editCodeInput} onChange={e => setEditCodeInput(e.target.value)}
                              className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-center text-xl tracking-[0.3em] placeholder-white/25 focus:border-purple-400/50 focus:outline-none"
                              placeholder="••••" autoFocus />
                            <button type="submit" className="px-4 py-2 rounded-lg font-semibold text-sm" style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', color: '#fff' }}>
                              Verify
                            </button>
                            <button type="button" onClick={() => setEditMode(false)} className="px-3 py-2 rounded-lg text-white/40 hover:text-white/60 text-sm">
                              Cancel
                            </button>
                          </form>
                        </div>
                      ) : editSuccess ? (
                        <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
                          <span className="text-green-400 text-lg font-bold">✅ Saved successfully!</span>
                        </div>
                      ) : editFields ? (
                        <div className="p-4 rounded-xl space-y-3" style={{ background: 'rgba(167,139,250,0.04)', border: '1px solid rgba(167,139,250,0.15)' }}>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-purple-400">✏️ Edit Info</h3>
                            <button onClick={() => setEditMode(false)} className="text-xs text-white/30 hover:text-white/60">Cancel</button>
                          </div>
                          {([
                            { key: 'studentName' as const, label: 'Student Name', icon: '👧' },
                            { key: 'studentAge' as const, label: 'Age', icon: '🎂' },
                            { key: 'parentName' as const, label: 'Parent Name', icon: '👤' },
                            { key: 'email' as const, label: 'Email', icon: '📧' },
                            { key: 'phone' as const, label: 'Phone', icon: '📱' },
                            { key: 'interests' as const, label: 'Interests', icon: '🎵' },
                            { key: 'allergies' as const, label: 'Allergies', icon: '🍕' },
                            { key: 'medicalConditions' as const, label: 'Medical Conditions', icon: '🏥' },
                            { key: 'emergencyContactName' as const, label: 'Emergency Contact', icon: '🆘' },
                            { key: 'emergencyContactPhone' as const, label: 'Emergency Phone', icon: '📞' },
                          ]).map(({ key, label, icon }) => (
                            <div key={key} className="flex items-center gap-2">
                              <span className="text-sm w-5">{icon}</span>
                              <label className="text-xs text-white/40 w-28 flex-shrink-0">{label}</label>
                              <input
                                type="text"
                                value={editFields[key]}
                                onChange={(e) => setEditFields(prev => prev ? { ...prev, [key]: e.target.value } : prev)}
                                className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-purple-400/50 focus:outline-none transition"
                              />
                            </div>
                          ))}
                          <button
                            onClick={() => saveEdit(selectedStudent)}
                            disabled={editSaving}
                            className="w-full py-3 rounded-xl font-semibold text-sm transition hover:opacity-90 disabled:opacity-50 mt-2"
                            style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', color: '#fff' }}>
                            {editSaving ? '⏳ Saving...' : '💾 Save Changes'}
                          </button>
                        </div>
                      ) : null}
                    </div>

                    {/* Check-in / Uncheck buttons */}
                    <div className="mt-6 space-y-2">
                      {checkedInToday[selectedStudent.id] ? (
                        <>
                          <div className="w-full py-4 rounded-xl text-center bg-green-500/10 border border-green-500/20">
                            <span className="text-green-400 font-bold text-lg">✅ Checked In — {checkedInToday[selectedStudent.id]}</span>
                          </div>
                          <button onClick={() => handleUncheck(selectedStudent)}
                            disabled={checkingIn === selectedStudent.id}
                            className="w-full py-2.5 rounded-xl text-sm font-medium transition hover:bg-red-500/10 disabled:opacity-50"
                            style={{ color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}>
                            {checkingIn === selectedStudent.id ? 'Undoing...' : '↩️ Undo Check-In'}
                          </button>
                        </>
                      ) : (
                        <button onClick={() => handleCheckIn(selectedStudent)}
                          disabled={checkingIn === selectedStudent.id}
                          className="w-full py-4 rounded-xl font-bold text-lg transition hover:opacity-90 disabled:opacity-50"
                          style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff' }}>
                          {checkingIn === selectedStudent.id ? 'Checking in...' : `✅ Check In ${safe(selectedStudent.studentName) || 'Student'}`}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Student list for check-in */}
            <div className="space-y-2">
              {checkInStudents.length === 0 ? (
                <div className="text-center py-12 text-white/30">
                  <p className="text-4xl mb-4">🔍</p>
                  <p>{checkInSearch ? 'No students found matching your search' : 'No registrations yet'}</p>
                </div>
              ) : (
                checkInStudents.map((s) => {
                  const isCheckedIn = !!checkedInToday[s.id]
                  const studentDisplay = safe(s.studentName) || safe(s.parentName)
                  const hasAllergies = safe(s.allergies) && safe(s.allergies).toLowerCase() !== 'none' && safe(s.allergies).toLowerCase() !== ''
                  const missingInfo = !safe(s.allergies) || !safe(s.emergencyContactName)

                  return (
                    <div key={s.id}
                      className={`flex items-center gap-4 p-4 rounded-xl transition cursor-pointer hover:bg-white/[0.04] ${isCheckedIn ? 'bg-green-500/[0.04]' : ''}`}
                      style={{ border: isCheckedIn ? '1px solid rgba(34,197,94,0.15)' : '1px solid rgba(255,255,255,0.06)' }}
                      onClick={() => setSelectedStudent(s)}>

                      {/* Check-in / uncheck button */}
                      <div className="flex-shrink-0" onClick={(e) => { e.stopPropagation(); isCheckedIn ? handleUncheck(s) : handleCheckIn(s) }}>
                        {isCheckedIn ? (
                          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-red-500/20 transition group" title="Click to undo check-in">
                            <span className="text-green-400 text-2xl group-hover:hidden">✓</span>
                            <span className="text-red-400 text-xl hidden group-hover:inline">↩</span>
                          </div>
                        ) : checkingIn === s.id ? (
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                            <span className="text-white/30">⏳</span>
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-green-500/10 transition group">
                            <span className="text-white/20 group-hover:text-green-400 text-xl transition">○</span>
                          </div>
                        )}
                      </div>

                      {/* Student info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-white/90">{studentDisplay}</span>
                          {safe(s.studentAge) && <span className="text-xs text-white/30">Age {s.studentAge}</span>}
                          {/* Mini checklist icons */}
                          {(() => {
                            const hasReg = !!(safe(s.parentName) && safe(s.email) && safe(s.phone))
                            const hasWvr = s.hasWaiver
                            const hasAlg = !!(safe(s.allergies))
                            const hasEmg = !!(safe(s.emergencyContactName))
                            const allOk = hasReg && hasWvr && hasAlg && hasEmg
                            if (allOk) return <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-semibold">✅ Complete</span>
                            return (
                              <span className="text-xs px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 flex items-center gap-1" title={`Reg:${hasReg?'✓':'✗'} Waiver:${hasWvr?'✓':'✗'} Allergy:${hasAlg?'✓':'✗'} Emergency:${hasEmg?'✓':'✗'}`}>
                                <span>{hasReg ? '📝' : '❌'}</span>
                                <span>{hasWvr ? '📜' : '❌'}</span>
                                <span>{hasAlg ? '🍕' : '❌'}</span>
                                <span>{hasEmg ? '🆘' : '❌'}</span>
                              </span>
                            )
                          })()}
                          {hasAllergies && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-semibold">⚠️ {safe(s.allergies)}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-white/30">
                          <span>{safe(s.parentName)}</span>
                          <span>{formatPhone(safe(s.phone))}</span>
                        </div>
                        <div className="mt-0.5">
                          <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.08)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.15)' }}>
                            🎵 {classifyRegistration(s)}
                          </span>
                        </div>
                      </div>

                      {/* Quick action buttons + badges */}
                      <div className="flex-shrink-0 flex items-center gap-1.5">
                        {safe(s.email) && (
                          <a href={`mailto:${safe(s.email)}?subject=${encodeURIComponent('BASMA Academy — ' + safe(s.studentName))}`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-500/10 transition" title="Email parent">
                            <span className="text-sm">📧</span>
                          </a>
                        )}
                        {safe(s.phone) && (
                          <a href={`sms:${safe(s.phone).replace(/\D/g, '')}?body=${encodeURIComponent('Hi! This is BASMA Academy regarding ' + safe(s.studentName) + '. ')}`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-green-500/10 transition" title="Text parent">
                            <span className="text-sm">💬</span>
                          </a>
                        )}
                        {safe(s.phone) && (
                          <a href={`tel:${safe(s.phone).replace(/\D/g, '')}`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-purple-500/10 transition" title="Call parent">
                            <span className="text-sm">📞</span>
                          </a>
                        )}
                        <span className="w-px h-5 bg-white/10 mx-1" />
                        <span className={`text-xs px-2 py-1 rounded-full ${s.hasWaiver ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                          {s.hasWaiver ? '📋✓' : '📋✗'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          safe(s.paymentStatus) === 'Paid' ? 'bg-green-500/10 text-green-400' :
                          safe(s.paymentStatus) === 'Free' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {safe(s.paymentStatus) === 'Paid' ? '💰' : safe(s.paymentStatus) === 'Free' ? '🆓' : '⏳'}
                        </span>
                        <svg className="w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </>
        )}

        {/* ═══ ROSTER TAB ═══ */}
        {tab === 'roster' && (
          <>
            <div className="flex flex-wrap gap-3 mb-6">
              <input type="text" placeholder="Search student or parent..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-sm text-white placeholder-white/20 focus:border-[#c9a84c]/30 focus:outline-none transition flex-1 min-w-[200px]" />
            </div>

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
                      return safe(s.studentName).toLowerCase().includes(q) || safe(s.parentName).toLowerCase().includes(q) || safe(s.email).toLowerCase().includes(q)
                    })
                  : students

                return (
                  <div key={label} className="mb-4 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <button onClick={() => setExpandedClass(isExpanded ? null : label)}
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ background: `${block.color}15` }}>
                          {block.emoji}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white/90">{block.label}</h3>
                          <p className="text-xs text-white/30">{block.time} · Ages {block.ageRange}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold" style={{ color: '#c9a84c' }}>{filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}</span>
                        <svg className={`w-5 h-5 text-white/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-white/5">
                        <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-2 text-xs text-white/25 uppercase tracking-wider border-b border-white/5">
                          <div className="col-span-2">Student</div>
                          <div className="col-span-1">Age</div>
                          <div className="col-span-2">Parent</div>
                          <div className="col-span-2">Phone</div>
                          <div className="col-span-2">Allergies</div>
                          <div className="col-span-1">Waiver</div>
                          <div className="col-span-1">Payment</div>
                          <div className="col-span-1">Status</div>
                        </div>

                        {filteredStudents.map((s, idx) => (
                          <div key={s.id}
                            className={`px-5 py-3 cursor-pointer hover:bg-white/[0.03] transition ${idx % 2 === 0 ? 'bg-white/[0.01]' : ''} border-b border-white/[0.03] last:border-0`}
                            onClick={() => setSelectedStudent(s)}>
                            <div className="hidden md:grid grid-cols-12 gap-2 items-center text-sm">
                              <div className="col-span-2 font-medium text-white/80">{safe(s.studentName) || safe(s.parentName)}</div>
                              <div className="col-span-1 text-white/40">{safe(s.studentAge) || '—'}</div>
                              <div className="col-span-2">
                                <p className="text-white/60 text-xs">{safe(s.parentName)}</p>
                              </div>
                              <div className="col-span-2 text-white/40 text-xs">{formatPhone(safe(s.phone))}</div>
                              <div className="col-span-2">
                                <span className={`text-xs ${
                                  !safe(s.allergies) ? 'text-yellow-400' :
                                  safe(s.allergies).toLowerCase() === 'none' ? 'text-green-400' :
                                  'text-red-400 font-semibold'
                                }`}>
                                  {safe(s.allergies) || '⚠️ Missing'}
                                </span>
                              </div>
                              <div className="col-span-1">
                                <span className={`text-xs ${s.hasWaiver ? 'text-green-400' : 'text-yellow-400'}`}>
                                  {s.hasWaiver ? '✅' : '❌'}
                                </span>
                              </div>
                              <div className="col-span-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                  safe(s.paymentStatus) === 'Paid' ? 'bg-green-500/15 text-green-400' :
                                  safe(s.paymentStatus) === 'Free' ? 'bg-blue-500/15 text-blue-400' :
                                  'bg-yellow-500/10 text-yellow-400'
                                }`}>
                                  {safe(s.paymentStatus) === 'Paid' ? '💰' : safe(s.paymentStatus) === 'Free' ? '🆓' : '⏳'}
                                </span>
                              </div>
                              <div className="col-span-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${s.isRegistrationComplete ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                  {s.isRegistrationComplete ? '✅' : '⚠️'}
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
                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                  safe(s.paymentStatus) === 'Paid' ? 'bg-green-500/15 text-green-400' :
                                  safe(s.paymentStatus) === 'Free' ? 'bg-blue-500/15 text-blue-400' :
                                  'bg-yellow-500/10 text-yellow-400'
                                }`}>
                                  {safe(s.paymentStatus) === 'Paid' ? '💰 Paid' : safe(s.paymentStatus) === 'Free' ? '🆓 Free' : '⏳ Pending'}
                                </span>
                              </div>
                              <p className="text-xs text-white/40">{safe(s.parentName)} · {formatPhone(safe(s.phone))}</p>
                              <div className="flex gap-2">
                                {safe(s.allergies) && safe(s.allergies).toLowerCase() !== 'none' && (
                                  <span className="text-xs text-red-400">⚠️ {safe(s.allergies)}</span>
                                )}
                                <span className={`text-xs ${s.hasWaiver ? 'text-green-400' : 'text-yellow-400'}`}>
                                  Waiver: {s.hasWaiver ? '✅' : '❌'}
                                </span>
                              </div>
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

        {/* ═══ DISCOVERY CAMP TAB ═══ */}
        {tab === 'discovery' && (
          <>
            <div className="mb-4 p-4 rounded-xl" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)' }}>
              <h3 className="text-lg font-bold text-green-400 mb-1">🏕️ June Discovery Camp Attendance</h3>
              <p className="text-xs text-white/40">Who&apos;s coming at 10 AM vs 12 PM — grouped by week</p>
            </div>

            {Object.keys(discoveryGroups).length === 0 ? (
              <div className="text-center py-12 text-white/30">
                <p className="text-4xl mb-4">📭</p>
                <p>No Discovery Camp registrations with week/time data yet</p>
                <p className="text-xs mt-2 text-white/20">Students need to select a week & time slot when enrolling</p>
              </div>
            ) : (
              Object.entries(discoveryGroups)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([week, { morning, midday }]) => (
                <div key={week} className="mb-6 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(34,197,94,0.12)' }}>
                  <div className="px-5 py-4" style={{ background: 'rgba(34,197,94,0.06)', borderBottom: '1px solid rgba(34,197,94,0.1)' }}>
                    <h4 className="font-bold text-green-400 text-base">📅 {week}</h4>
                    <p className="text-xs text-white/30 mt-1">{morning.length + midday.length} total students</p>
                  </div>

                  {/* 10 AM Session */}
                  <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm">🌅</span>
                      <span className="font-semibold text-sm text-white/80">10:00 AM – 12:00 PM</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-bold ml-2">{morning.length} student{morning.length !== 1 ? 's' : ''}</span>
                    </div>
                    {morning.length === 0 ? (
                      <p className="text-xs text-white/20 ml-6">No students registered for this slot</p>
                    ) : (
                      <div className="space-y-1 ml-6">
                        {morning.map((s, i) => (
                          <div key={s.id} className={`flex items-center gap-4 py-2 px-3 rounded-lg text-sm cursor-pointer hover:bg-white/[0.03] ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
                            onClick={() => setSelectedStudent(s)}>
                            <span className="text-white/70 w-5 text-right text-xs">{i + 1}.</span>
                            <span className="font-medium text-white/80 min-w-[120px]">{safe(s.studentName) || safe(s.parentName)}</span>
                            <span className="text-white/30 text-xs">Age {safe(s.studentAge) || '?'}</span>
                            {safe(s.allergies) && safe(s.allergies).toLowerCase() !== 'none' && (
                              <span className="text-xs text-red-400">⚠️ {safe(s.allergies)}</span>
                            )}
                            <span className="text-white/25 text-xs ml-auto">{safe(s.parentName)} · {formatPhone(safe(s.phone))}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 12 PM Session */}
                  <div className="px-5 py-3">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm">☀️</span>
                      <span className="font-semibold text-sm text-white/80">12:00 – 2:00 PM</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold ml-2">{midday.length} student{midday.length !== 1 ? 's' : ''}</span>
                    </div>
                    {midday.length === 0 ? (
                      <p className="text-xs text-white/20 ml-6">No students registered for this slot</p>
                    ) : (
                      <div className="space-y-1 ml-6">
                        {midday.map((s, i) => (
                          <div key={s.id} className={`flex items-center gap-4 py-2 px-3 rounded-lg text-sm cursor-pointer hover:bg-white/[0.03] ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
                            onClick={() => setSelectedStudent(s)}>
                            <span className="text-white/70 w-5 text-right text-xs">{i + 1}.</span>
                            <span className="font-medium text-white/80 min-w-[120px]">{safe(s.studentName) || safe(s.parentName)}</span>
                            <span className="text-white/30 text-xs">Age {safe(s.studentAge) || '?'}</span>
                            {safe(s.allergies) && safe(s.allergies).toLowerCase() !== 'none' && (
                              <span className="text-xs text-red-400">⚠️ {safe(s.allergies)}</span>
                            )}
                            <span className="text-white/25 text-xs ml-auto">{safe(s.parentName)} · {formatPhone(safe(s.phone))}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* ═══ THIS WEEK TAB ═══ */}
        {tab === 'thisweek' && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                <span style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  This Week&apos;s Schedule
                </span>
              </h2>
              <p className="text-sm text-white/30">Who to expect each day — {MONTH_NAMES[thisWeekData.weekDays[0]?.date.getMonth() || 0]} {thisWeekData.weekDays[0]?.date.getFullYear() || 2026}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {thisWeekData.weekDays.map((day) => (
                <div key={day.dateStr}
                  className={`rounded-xl overflow-hidden ${day.isClosed ? 'opacity-60' : ''}`}
                  style={{
                    background: day.isToday ? 'rgba(201,168,76,0.06)' : 'rgba(255,255,255,0.02)',
                    border: day.isToday ? '2px solid rgba(201,168,76,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  }}>
                  {/* Day header */}
                  <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${day.isToday ? 'bg-[#c9a84c]/20 text-[#c9a84c]' : day.isPast ? 'bg-white/5 text-white/20' : 'bg-white/5 text-white/60'}`}>
                        {day.date.getDate()}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${day.isToday ? 'text-[#c9a84c]' : 'text-white/80'}`}>{day.dayName}</h3>
                        <p className="text-xs text-white/30">{MONTH_NAMES[day.date.getMonth()]} {day.date.getDate()}</p>
                      </div>
                    </div>
                    {day.isToday && <span className="text-xs px-2 py-1 rounded-full bg-[#c9a84c]/20 text-[#c9a84c] font-bold">TODAY</span>}
                    {day.isClosed && <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 font-bold">🚫 CLOSED</span>}
                    {day.isPast && !day.isToday && <span className="text-xs text-white/20">Past</span>}
                  </div>

                  {day.isClosed ? (
                    <div className="px-5 py-6 text-center">
                      <p className="text-red-400/60 text-sm">No classes — school closed</p>
                      <p className="text-xs text-white/20 mt-1">{closures.find(c => c.date === day.dateStr)?.note || ''}</p>
                    </div>
                  ) : (
                    <div className="px-4 py-3 space-y-2">
                      {thisWeekData.classBuckets
                        .filter(({ block }) => {
                          if (block.julyAugOnly && day.date.getMonth() < 6) return false
                          return true
                        })
                        .map(({ block, students }) => (
                        <div key={block.label} className="flex items-center gap-3 py-2 px-3 rounded-lg" style={{ background: `${block.color}08` }}>
                          <span className="text-lg">{block.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white/70 truncate">{block.label}</p>
                            <p className="text-[11px] text-white/30">{block.time}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold" style={{ color: block.color }}>{students.length}</span>
                            <span className="text-xs text-white/25">students</span>
                          </div>
                        </div>
                      ))}

                      {/* Total for the day */}
                      <div className="flex items-center justify-between pt-2 mt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <span className="text-xs text-white/30">Total expected</span>
                        <span className="text-sm font-bold" style={{ color: '#c9a84c' }}>
                          {thisWeekData.classBuckets
                            .filter(({ block }) => !(block.julyAugOnly && day.date.getMonth() < 6))
                            .reduce((sum, { students }) => sum + students.length, 0)} students
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Detailed student list per class */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white/80 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Students by Class
              </h3>
              <div className="space-y-3">
                {thisWeekData.classBuckets
                  .filter(({ students }) => students.length > 0)
                  .map(({ block, students }) => (
                  <div key={block.label} className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="px-5 py-3 flex items-center justify-between" style={{ background: `${block.color}08`, borderBottom: `1px solid ${block.color}15` }}>
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{block.emoji}</span>
                        <div>
                          <h4 className="font-semibold text-white/80 text-sm">{block.label}</h4>
                          <p className="text-xs text-white/30">{block.time} · Ages {block.ageRange}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold" style={{ color: block.color }}>{students.length}</span>
                    </div>
                    <div className="divide-y divide-white/[0.04]">
                      {students.map((s, i) => (
                        <div key={s.id} className="flex items-center gap-3 px-5 py-2.5 hover:bg-white/[0.03] cursor-pointer transition"
                          onClick={() => setSelectedStudent(s)}>
                          <span className="text-xs text-white/20 w-5 text-right">{i + 1}.</span>
                          <span className="font-medium text-white/80 text-sm flex-1">{safe(s.studentName) || safe(s.parentName)}</span>
                          <span className="text-xs text-white/30">Age {safe(s.studentAge) || '?'}</span>
                          {safe(s.allergies) && safe(s.allergies).toLowerCase() !== 'none' && (
                            <span className="text-xs text-red-400">⚠️ {safe(s.allergies)}</span>
                          )}
                          <div className="flex gap-1">
                            {safe(s.phone) && (
                              <a href={`sms:${safe(s.phone).replace(/\D/g, '')}?body=${encodeURIComponent('Hi! This is BASMA Academy regarding ' + safe(s.studentName) + '. ')}`}
                                onClick={e => e.stopPropagation()}
                                className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-green-500/10 transition" title="Text parent">
                                <span className="text-xs">💬</span>
                              </a>
                            )}
                            {safe(s.phone) && (
                              <a href={`tel:${safe(s.phone).replace(/\D/g, '')}`}
                                onClick={e => e.stopPropagation()}
                                className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-purple-500/10 transition" title="Call parent">
                                <span className="text-xs">📞</span>
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ═══ CALENDAR TAB ═══ */}
        {tab === 'calendar' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1) } else setCalMonth(calMonth - 1) }}
                className="px-3 py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 transition">←</button>
              <h2 className="text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                <span style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {MONTH_NAMES[calMonth]} {calYear}
                </span>
              </h2>
              <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1) } else setCalMonth(calMonth + 1) }}
                className="px-3 py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 transition">→</button>
            </div>

            <p className="text-xs text-white/30 mb-4">Click any class day (Mon–Thu) to toggle it as closed. Red = closed.</p>

            <div className="overflow-x-auto">
              <div className="grid grid-cols-7 gap-1 min-w-[700px]">
                {DAY_HEADERS.map(d => (
                  <div key={d} className="text-center text-xs text-white/30 uppercase tracking-wider py-2 font-medium">{d}</div>
                ))}
                {calDays.map(({ date, inMonth }, i) => {
                  const dk = dateKey(date)
                  const isClosed = closureSet.has(dk)
                  const isClass = isClassDay(date)
                  const today = new Date()
                  const isToday = date.toDateString() === today.toDateString()
                  const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
                  const closureNote = closures.find(c => c.date === dk)?.note

                  return (
                    <button key={i}
                      onClick={() => inMonth && isClass && toggleClosureOnDate(dk)}
                      disabled={!inMonth || !isClass}
                      className={`rounded-lg p-2 text-left transition min-h-[100px] ${
                        !inMonth ? 'opacity-20 cursor-default' :
                        isClosed ? 'cursor-pointer' :
                        isClass ? 'cursor-pointer hover:bg-white/[0.04]' :
                        'cursor-default'
                      }`}
                      style={{
                        background: isClosed && inMonth ? 'rgba(239,68,68,0.1)' :
                                    isToday ? 'rgba(201,168,76,0.08)' :
                                    isClass && inMonth ? 'rgba(255,255,255,0.02)' : 'transparent',
                        border: isToday ? '2px solid rgba(201,168,76,0.3)' :
                                isClosed && inMonth ? '1px solid rgba(239,68,68,0.2)' :
                                isClass && inMonth ? '1px solid rgba(255,255,255,0.05)' :
                                '1px solid transparent',
                      }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium ${isToday ? 'text-[#c9a84c]' : isPast ? 'text-white/20' : 'text-white/60'}`}>
                          {date.getDate()}
                        </span>
                        {isClosed && inMonth && <span className="text-xs">🚫</span>}
                      </div>
                      {isClosed && inMonth ? (
                        <p className="text-[10px] text-red-400 font-medium leading-tight">{closureNote || 'CLOSED'}</p>
                      ) : isClass && inMonth && !isPast ? (
                        <div className="space-y-0.5">
                          {SCHEDULE_BLOCKS.filter(b => {
                            if (b.julyAugOnly && calMonth < 6) return false
                            return true
                          }).map(b => (
                            <div key={b.label} className="text-[9px] text-white/25 truncate leading-tight">
                              <span style={{ color: b.color, opacity: 0.6 }}>●</span> {b.time.split('–')[0].trim()}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-xs text-white/40">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }} /> Class Day (Mon–Thu)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }} /> Closed</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: 'rgba(201,168,76,0.08)', border: '2px solid rgba(201,168,76,0.3)' }} /> Today</span>
            </div>
          </>
        )}

        {/* ═══ CLOSURES TAB ═══ */}
        {tab === 'closures' && (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Manage <span style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>School Closures</span>
              </h2>
              <p className="text-sm text-white/40">Add dates when the school is closed. These will appear on the calendar and parent portal.</p>
            </div>

            <div className="p-5 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 className="text-sm font-semibold text-white/70 mb-3">Add Closure Date</h3>
              <div className="flex flex-wrap gap-3">
                <input type="date" value={newClosureDate} onChange={e => setNewClosureDate(e.target.value)}
                  className="px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                  style={{ background: '#ffffff', color: '#1a1a2e', border: '1px solid rgba(201,168,76,0.3)' }} />
                <input type="text" placeholder="Reason (optional)" value={newClosureNote}
                  onChange={e => setNewClosureNote(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addClosure()}
                  className="flex-1 min-w-[200px] px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                  style={{ background: '#ffffff', color: '#1a1a2e', border: '1px solid rgba(201,168,76,0.3)' }} />
                <button onClick={addClosure} disabled={!newClosureDate}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-30"
                  style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', color: '#050505' }}>
                  + Add Closure
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {closures.sort((a, b) => a.date.localeCompare(b.date)).map(c => {
                const d = new Date(c.date + 'T12:00:00')
                const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()]
                const formatted = `${dayName}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
                const isPast = d < new Date()
                return (
                  <div key={c.date} className={`flex items-center justify-between px-5 py-3 rounded-xl ${isPast ? 'opacity-40' : ''}`}
                    style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)' }}>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🚫</span>
                      <div>
                        <p className="text-sm font-medium text-white/80">{formatted}</p>
                        <p className="text-xs text-white/40">{c.note}</p>
                      </div>
                    </div>
                    <button onClick={() => removeClosure(c.date)}
                      className="text-xs text-red-400/60 hover:text-red-400 transition px-3 py-1 rounded-lg hover:bg-red-500/10">
                      Remove
                    </button>
                  </div>
                )
              })}
              {closures.length === 0 && (
                <div className="text-center py-8 text-white/30">
                  <p className="text-3xl mb-2">📅</p>
                  <p className="text-sm">No closures scheduled. Add one above.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ═══ ADMIN CHAT TAB ═══ */}
        {tab === 'chat' && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                <span style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Admin Assistant
                </span>
              </h2>
              <p className="text-sm text-white/30">Chat to look up or update student info. Changes require the teacher code.</p>
            </div>

            {/* Quick help */}
            <div className="mb-4 p-4 rounded-xl" style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)' }}>
              <p className="text-xs text-[#c9a84c]/60 font-semibold uppercase tracking-wider mb-2">Try saying:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "What's Sarah's phone number?",
                  "Change Amir's allergies to none",
                  "Update the phone for the Smith family to 702-555-1234",
                  "Show me all students age 5",
                  "Who has allergies?",
                ].map((example, i) => (
                  <button key={i}
                    onClick={() => { setChatInput(example) }}
                    className="text-xs px-3 py-1.5 rounded-full hover:bg-white/[0.05] transition"
                    style={{ color: '#c9a84c', border: '1px solid rgba(201,168,76,0.2)' }}>
                    &quot;{example}&quot;
                  </button>
                ))}
              </div>
            </div>

            {/* Chat messages */}
            <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="h-[400px] overflow-y-auto p-4 space-y-3">
                {chatMessages.length === 0 && (
                  <div className="text-center py-12">
                    <span className="text-4xl mb-3 block">🤖</span>
                    <p className="text-white/30 text-sm">Hi Miss Basma! Ask me anything about your students.</p>
                    <p className="text-white/20 text-xs mt-1">I can look up info, update records, and help manage your roster.</p>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-[#c9a84c]/20 text-white/90 rounded-br-none'
                        : 'bg-white/[0.05] text-white/80 rounded-bl-none'
                    }`} style={{
                      border: msg.role === 'user' ? '1px solid rgba(201,168,76,0.2)' : '1px solid rgba(255,255,255,0.06)',
                    }}>
                      {msg.role === 'assistant' && <span className="text-xs text-[#c9a84c]/50 block mb-1">🤖 Assistant</span>}
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-white/[0.05]" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="text-xs text-[#c9a84c]/50 block mb-1">🤖 Assistant</span>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <form onSubmit={(e) => { e.preventDefault(); sendChatMessage() }} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about a student or request a change..."
                    disabled={chatLoading}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/25 focus:border-[#c9a84c]/50 focus:outline-none transition disabled:opacity-50"
                  />
                  <button type="submit" disabled={chatLoading || !chatInput.trim()}
                    className="px-5 py-3 rounded-xl font-semibold text-sm transition disabled:opacity-30"
                    style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', color: '#050505' }}>
                    Send
                  </button>
                </form>
              </div>
            </div>
          </>
        )}

        {/* ═══ TEXT ALL / ANNOUNCEMENTS TAB ═══ */}
        {tab === 'announce' && (() => {
          // Use allContacts (all leads + summer records with phones, de-duped by phone, excludes blocked names)
          const contactsList = allContacts.length > 0 ? allContacts : []
          const sentCount = contactsList.filter(c => announceSentContacts.has(c.phone.replace(/\D/g, ''))).length
          const allDone = contactsList.length > 0 && sentCount >= contactsList.length
          // Next unsent contact
          const nextContact = contactsList.find(c => !announceSentContacts.has(c.phone.replace(/\D/g, '')))
          const nextPhone = nextContact ? nextContact.phone.replace(/\D/g, '') : ''
          const nextPhoneFormatted = nextPhone.length === 10 ? '1' + nextPhone : nextPhone
          const nextName = nextContact ? (nextContact.name.split(' ')[0] || nextContact.studentName.split(' ')[0] || '') : ''
          const personalizedMsg = nextName ? announceMsg.replace(/\{name\}/gi, nextName) : announceMsg.replace(/\{name\}/gi, '')
          const smsUri = nextContact ? `sms:${nextPhoneFormatted}?body=${encodeURIComponent(personalizedMsg)}` : '#'

          return (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <span style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    📢 Text Announcement
                  </span>
                </h2>
                <p className="text-sm text-white/30">Compose a message and text every contact individually from your phone — one tap at a time.</p>
              </div>

              {/* Compose */}
              <div className="rounded-xl p-5 mb-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <label className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-2 block">Your Message</label>
                <textarea
                  value={announceMsg}
                  onChange={(e) => { setAnnounceMsg(e.target.value); if (!announceActive) setAnnounceSentContacts(new Set()) }}
                  placeholder="Type your announcement here... e.g. Hi BASMA family! We have complimentary EVO tickets for you..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/25 focus:border-[#c9a84c]/50 focus:outline-none transition resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-white/20">{announceMsg.length} chars · Use <code className="text-[#c9a84c]/60 bg-white/5 px-1 rounded">{'{name}'}</code> to personalize</span>
                  <span className="text-xs text-white/30">{contactsList.length} contacts</span>
                </div>
              </div>

              {/* Quick Templates */}
              {!announceActive && (
                <div className="rounded-xl p-4 mb-5" style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)' }}>
                  <p className="text-xs text-[#c9a84c]/60 font-semibold uppercase tracking-wider mb-3">Quick Templates</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: '🎟️ EVO Tickets', text: 'Hi {name}! This is BASMA Academy 🎵 We have complimentary FREE EVO Convention tickets for you for being part of the BASMA family! Reply to this text if you\'d like tickets. Also don\'t forget to register for our NEW Summer Camp at basmaworld.com — spots are very limited! 🎶' },
                      { label: '🏕️ Camp Reminder', text: 'Hi {name}! This is BASMA Academy 🎵 Just a reminder — our FREE Summer Dance & Music Camp starts June 29 at Synergy Dance Studio! Spots are LIMITED. Register now at basmaworld.com 🎶' },
                      { label: '🎹 Free Trial', text: 'Hi {name}! This is BASMA Academy 🎵 Did you know every new student gets a FREE 20-minute private lesson? Piano, guitar, voice & more! Book yours at basmaworld.com/private-lessons 🎶' },
                    ].map((tmpl, i) => (
                      <button key={i}
                        onClick={() => setAnnounceMsg(tmpl.text)}
                        className="text-xs px-3 py-2 rounded-lg hover:bg-white/[0.05] transition text-left"
                        style={{ color: '#c9a84c', border: '1px solid rgba(201,168,76,0.2)' }}>
                        {tmpl.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Send Flow */}
              {announceMsg.trim() && (
                <div className="rounded-xl p-5 mb-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>

                  {/* Progress header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-white/80">
                        {allDone ? '🎉 All done!' : announceActive ? `Texting — ${sentCount} of ${contactsList.length} sent` : `Ready to text ${contactsList.length} contacts`}
                      </p>
                      <p className="text-xs text-white/30 mt-1">
                        {allDone ? 'Every contact has been texted!' : announceActive ? 'Tap the button below → send in Messages → come back & tap "Sent, Next →"' : 'Each contact gets their own individual text from your number.'}
                      </p>
                    </div>
                    {sentCount > 0 && (
                      <button onClick={() => { setAnnounceSentContacts(new Set()); setAnnounceActive(false) }}
                        className="text-xs text-white/30 hover:text-white/60 transition">
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2.5 rounded-full bg-white/5 mb-5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${contactsList.length > 0 ? (sentCount / contactsList.length) * 100 : 0}%`,
                        background: allDone ? '#22c55e' : 'linear-gradient(135deg, #c9a84c, #e4cc7a)',
                      }}
                    />
                  </div>

                  {!announceActive && !allDone && (
                    <button
                      onClick={() => setAnnounceActive(true)}
                      className="w-full py-4 rounded-xl font-bold text-base transition hover:scale-[1.01]"
                      style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', color: '#050505' }}>
                      📱 Start Texting All ({contactsList.length} contacts)
                    </button>
                  )}

                  {/* Active sending flow */}
                  {announceActive && !allDone && nextContact && (
                    <div className="space-y-3">
                      {/* Current contact card */}
                      <div className="rounded-xl p-4" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)' }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-[#c9a84c]/60 font-semibold uppercase tracking-wider">Next Contact ({sentCount + 1}/{contactsList.length})</span>
                        </div>
                        <p className="text-lg font-semibold text-white/90 mb-1">{nextContact.name || nextContact.studentName || 'Contact'}</p>
                        <p className="text-sm text-white/40 font-mono mb-1">{formatPhone(nextPhone)}</p>
                        {nextContact.studentName && nextContact.name && nextContact.studentName !== nextContact.name && (
                          <p className="text-xs text-white/30">Student: {nextContact.studentName}</p>
                        )}
                      </div>

                      {/* Message preview */}
                      {announceMsg.includes('{name}') && (
                        <div className="rounded-lg p-3 mt-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <p className="text-xs text-white/30 mb-1">Preview:</p>
                          <p className="text-sm text-white/60 italic">{personalizedMsg.slice(0, 120)}{personalizedMsg.length > 120 ? '…' : ''}</p>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <a
                          href={smsUri}
                          className="flex-1 py-4 rounded-xl font-bold text-center text-base transition hover:scale-[1.01] block"
                          style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', color: '#050505' }}>
                          📱 Open in Messages
                        </a>
                      </div>
                      <button
                        onClick={() => {
                          setAnnounceSentContacts(prev => {
                            const next = new Set(prev)
                            next.add(nextPhone)
                            return next
                          })
                        }}
                        className="w-full py-3 rounded-xl font-semibold text-sm transition hover:bg-green-500/20"
                        style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80' }}>
                        ✅ Sent, Next →
                      </button>
                      <button
                        onClick={() => {
                          // Skip this contact
                          setAnnounceSentContacts(prev => {
                            const next = new Set(prev)
                            next.add(nextPhone)
                            return next
                          })
                        }}
                        className="w-full py-2 rounded-lg text-xs text-white/25 hover:text-white/50 transition">
                        Skip this contact
                      </button>
                    </div>
                  )}

                  {/* Completion */}
                  {allDone && (
                    <div className="p-5 rounded-xl text-center" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                      <span className="text-3xl block mb-2">🎉</span>
                      <p className="text-green-400 font-bold text-lg">All texts sent!</p>
                      <p className="text-green-400/50 text-sm mt-1">{contactsList.length} individual texts from your number</p>
                      <button
                        onClick={() => { setAnnounceSentContacts(new Set()); setAnnounceActive(false); setAnnounceMsg('') }}
                        className="mt-4 px-6 py-2 rounded-lg text-sm font-medium transition"
                        style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        New Announcement
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Recipient list */}
              <details className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <summary className="px-5 py-3 cursor-pointer text-sm text-white/40 hover:text-white/60 transition select-none">
                  👥 All {contactsList.length} recipients {sentCount > 0 && `(${sentCount} sent)`}
                </summary>
                <div className="px-5 pb-4 max-h-[300px] overflow-y-auto">
                  <div className="space-y-1 mt-2">
                    {contactsList.map((c, i) => {
                      const ph = c.phone.replace(/\D/g, '')
                      const isSent = announceSentContacts.has(ph)
                      return (
                        <div key={i} className="flex items-center justify-between py-1.5 text-xs border-b border-white/5">
                          <span className={isSent ? 'text-green-400/60' : 'text-white/60'}>
                            {isSent && '✅ '}{c.name || c.studentName || 'Unknown'}
                          </span>
                          <span className="text-white/30 font-mono">{formatPhone(ph)}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </details>

              {/* ── REMOVE FROM LEADS (BLOCK) SECTION ── */}
              <div className="mt-8 rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <button
                  onClick={() => setShowBlockSection(!showBlockSection)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition"
                >
                  <span className="text-sm font-semibold text-white/70">🚫 Remove from Leads</span>
                  <span className="text-xs text-white/30">{showBlockSection ? '▲' : '▼'} {blockedList.length > 0 && `(${blockedList.length} blocked)`}</span>
                </button>

                {showBlockSection && (
                  <div className="px-5 pb-5 border-t border-white/5">
                    <p className="text-xs text-white/30 mt-3 mb-4">
                      Type a phone number to remove someone from the Text All list. They won&apos;t appear in future texts.
                    </p>

                    {/* Input form */}
                    <div className="flex flex-col gap-3 mb-4">
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          placeholder="Phone number (e.g. 702-555-1234)"
                          value={blockPhone}
                          onChange={(e) => setBlockPhone(e.target.value)}
                          className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#c9a84c]/50"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Name (optional, for your reference)"
                          value={blockName}
                          onChange={(e) => setBlockName(e.target.value)}
                          className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#c9a84c]/50"
                        />
                        <button
                          onClick={handleBlockPhone}
                          disabled={blockLoading || !blockPhone.trim()}
                          className="px-5 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/30 transition disabled:opacity-30"
                        >
                          {blockLoading ? '...' : '🚫 Block'}
                        </button>
                      </div>
                    </div>

                    {blockMsg && (
                      <p className={`text-sm mb-4 ${blockMsg.startsWith('✅') ? 'text-green-400/80' : 'text-red-400/80'}`}>
                        {blockMsg}
                      </p>
                    )}

                    {/* Blocked list */}
                    {blockedList.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-2">Blocked Numbers</p>
                        <div className="space-y-1 max-h-[200px] overflow-y-auto">
                          {blockedList.map((b) => (
                            <div key={b.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-black/20 border border-white/5">
                              <div>
                                <span className="text-sm text-white/60 font-mono">{b.phone}</span>
                                {b.name && <span className="text-xs text-white/30 ml-2">({b.name})</span>}
                              </div>
                              <button
                                onClick={() => handleUnblock(b.id)}
                                disabled={blockLoading}
                                className="text-xs px-3 py-1 rounded-lg bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10 transition disabled:opacity-30"
                              >
                                Unblock
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )
        })()}

      </div>

      <footer className="mt-20 py-6 border-t border-white/5 text-center">
        <p className="text-xs text-white/20">© 2026 BASMA Music Academy · <a href="/" className="text-[#c9a84c]/40 hover:text-[#c9a84c]">basmaworld.com</a></p>
      </footer>
    </main>
  )
}
