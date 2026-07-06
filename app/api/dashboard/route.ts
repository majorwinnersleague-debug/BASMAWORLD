import { NextRequest, NextResponse } from 'next/server'

/**
 * Dashboard Stats API — Live metrics for admin dashboard
 * 
 * GET /api/dashboard?teacherCode=1515
 * 
 * Returns real numbers based on Stripe payments and Airtable enrollment data.
 * Only counts students with verified Stripe payments as "active."
 */

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || ''
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
const SUMMER_TABLE = 'tblfOnRDkfgZoCF9X'
const LEADS_TABLE = 'tbl1diIEhM9MtKViE'
const TEACHER_CODE = process.env.TEACHER_ACCESS_CODE || '1515'

interface AirtableRecord {
  id: string
  fields: Record<string, string | number | boolean>
  createdTime: string
}

async function fetchAllRecords(tableId: string): Promise<AirtableRecord[]> {
  const allRecords: AirtableRecord[] = []
  let offset: string | undefined

  do {
    const params = new URLSearchParams({ pageSize: '100' })
    if (offset) params.set('offset', offset)
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${tableId}?${params}`

    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` },
      next: { revalidate: 0 },
    })

    if (!res.ok) break
    const data = await res.json()
    allRecords.push(...(data.records || []))
    offset = data.offset
  } while (offset)

  return allRecords
}

/* ─── Schedule data for class names ─── */
const SCHEDULE_BLOCKS = [
  { label: 'Tiny Tots Music & Movement', ageRange: '5 & Under', time: '9:00 – 9:45 AM', emoji: '👶', teacher: 'Miss Basma' },
  { label: 'Kids Music Academy (AM)', ageRange: 'By Skill', time: '10:00 – 11:15 AM', emoji: '🎵', teacher: 'Miss Basma' },
  { label: 'Kids Music Academy (PM)', ageRange: 'By Skill', time: '11:30 AM – 12:45 PM', emoji: '🎵', teacher: 'Miss Basma' },
  { label: 'Band Academy', ageRange: 'By Skill', time: '1:00 – 2:15 PM', emoji: '🎸', teacher: 'Miss Basma' },
  { label: 'Piano Fundamentals', ageRange: 'By Skill', time: '45 min', emoji: '🎹', teacher: 'Miss Sarah' },
]

function normalizeClassName(raw: string): string {
  if (!raw) return 'Unassigned'
  const lower = raw.toLowerCase()
  if (lower.includes('tiny tots')) return 'Tiny Tots Music & Movement'
  if (lower.includes('kids music') && lower.includes('pm')) return 'Kids Music Academy (PM)'
  if (lower.includes('kids music') && lower.includes('am')) return 'Kids Music Academy (AM)'
  if (lower.includes('kids')) return 'Kids Music Academy (AM)' // default
  if (lower.includes('band')) return 'Band Academy'
  if (lower.includes('piano')) return 'Piano Fundamentals'
  if (lower.includes('all access') || lower.includes('all classes') || lower.includes('scholarship')) return 'All Access'
  if (lower.includes('private')) return 'Private Lessons'
  return raw
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const teacherCode = url.searchParams.get('teacherCode')

  if (teacherCode !== TEACHER_CODE) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!AIRTABLE_PAT) {
    return NextResponse.json({ error: 'Airtable not configured' }, { status: 503 })
  }

  try {
    const [summerRecords, leadRecords] = await Promise.all([
      fetchAllRecords(SUMMER_TABLE),
      fetchAllRecords(LEADS_TABLE),
    ])

    // Also fetch calendar events for upcoming closures
    let calendarEvents: { date: string; note: string; type: string }[] = []
    try {
      const calRes = await fetch(`${url.origin}/api/calendar`)
      if (calRes.ok) {
        const calData = await calRes.json()
        calendarEvents = calData.events || []
      }
    } catch { /* non-critical */ }

    // ── Active paid students from Summer 2026 table ──
    const paidStudents = summerRecords.filter(r =>
      r.fields['Payment Status'] === 'Paid' && r.fields['Student Name']
    )
    const pendingStudents = summerRecords.filter(r =>
      (!r.fields['Payment Status'] || r.fields['Payment Status'] === 'Pending' || r.fields['Payment Status'] === 'Free') &&
      r.fields['Student Name']
    )
    const refundedStudents = summerRecords.filter(r =>
      r.fields['Payment Status'] === 'Refunded' && r.fields['Student Name']
    )

    // ── Students by class ──
    const byClass: Record<string, { count: number; students: { name: string; parent: string; paymentStatus: string }[] }> = {}
    for (const block of SCHEDULE_BLOCKS) {
      byClass[block.label] = { count: 0, students: [] }
    }
    byClass['All Access'] = { count: 0, students: [] }
    byClass['Private Lessons'] = { count: 0, students: [] }
    byClass['Unassigned'] = { count: 0, students: [] }

    for (const r of paidStudents) {
      const className = normalizeClassName(String(r.fields['Class'] || ''))
      if (!byClass[className]) byClass[className] = { count: 0, students: [] }
      byClass[className].count++
      byClass[className].students.push({
        name: String(r.fields['Student Name'] || ''),
        parent: String(r.fields['Parent Name'] || ''),
        paymentStatus: 'Paid',
      })
    }

    // ── Revenue ──
    let totalRevenue = 0
    const revenueByMonth: Record<string, number> = {}
    for (const r of summerRecords) {
      if (r.fields['Payment Status'] === 'Paid') {
        const amt = parseFloat(String(r.fields['Amount Paid'] || '0'))
        totalRevenue += amt
        const payDate = String(r.fields['Payment Date'] || '')
        const month = payDate.slice(0, 7) || 'Unknown'
        revenueByMonth[month] = (revenueByMonth[month] || 0) + amt
      }
    }

    // ── Students by teacher ──
    const byTeacher: Record<string, number> = {}
    for (const block of SCHEDULE_BLOCKS) {
      byTeacher[block.teacher] = byTeacher[block.teacher] || 0
    }
    for (const r of paidStudents) {
      const className = normalizeClassName(String(r.fields['Class'] || ''))
      const block = SCHEDULE_BLOCKS.find(b => b.label === className)
      const teacher = block?.teacher || 'Unassigned'
      byTeacher[teacher] = (byTeacher[teacher] || 0) + 1
    }

    // ── Payment status breakdown ──
    const paymentBreakdown = {
      paid: paidStudents.length,
      pending: pendingStudents.length,
      refunded: refundedStudents.length,
      unpaid: summerRecords.filter(r =>
        !r.fields['Payment Status'] && r.fields['Student Name']
      ).length,
    }

    // ── Upcoming classes (next 7 days) ──
    const now = new Date()
    const upcomingClosures = calendarEvents
      .filter(e => {
        const eventDate = new Date(e.date + 'T00:00:00')
        return eventDate >= now && eventDate <= new Date(now.getTime() + 14 * 86400000)
      })
      .sort((a, b) => a.date.localeCompare(b.date))

    // ── Recent enrollments (last 7 days) ──
    const recentEnrollments = paidStudents
      .filter(r => {
        const enrollDate = String(r.fields['Enrollment Date'] || r.fields['Payment Date'] || '')
        if (!enrollDate) return false
        const d = new Date(enrollDate)
        return d >= new Date(now.getTime() - 7 * 86400000)
      })
      .map(r => ({
        studentName: String(r.fields['Student Name'] || ''),
        className: normalizeClassName(String(r.fields['Class'] || '')),
        parentName: String(r.fields['Parent Name'] || ''),
        enrollmentDate: String(r.fields['Enrollment Date'] || r.fields['Payment Date'] || ''),
        amount: parseFloat(String(r.fields['Amount Paid'] || '0')),
      }))
      .sort((a, b) => b.enrollmentDate.localeCompare(a.enrollmentDate))

    return NextResponse.json({
      summary: {
        totalActivePaid: paidStudents.length,
        totalPending: pendingStudents.length,
        totalRefunded: refundedStudents.length,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalLeads: leadRecords.length,
      },
      paymentBreakdown,
      byClass: Object.entries(byClass)
        .filter(([, v]) => v.count > 0)
        .map(([name, data]) => ({
          className: name,
          ...SCHEDULE_BLOCKS.find(b => b.label === name) || {},
          count: data.count,
          students: data.students,
        })),
      byTeacher: Object.entries(byTeacher)
        .filter(([, count]) => count > 0)
        .map(([teacher, count]) => ({ teacher, count })),
      revenueByMonth: Object.entries(revenueByMonth)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, amount]) => ({ month, amount: Math.round(amount * 100) / 100 })),
      upcomingClosures,
      recentEnrollments: recentEnrollments.slice(0, 10),
    })
  } catch (err) {
    console.error('[dashboard] Error:', err)
    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 })
  }
}
