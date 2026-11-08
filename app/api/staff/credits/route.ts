import { NextRequest, NextResponse } from 'next/server'
import { getStaffSession, staffUnauthorized } from '@/lib/auth'
import {
  CreditError,
  extendExpiry,
  getFamily,
  grantCredits,
  recordLesson,
  restoreLessonCredit,
  searchFamilies,
  upsertGuardianAndStudent,
} from '@/lib/credits'
import { isValidEmail } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/**
 * Staff lesson-credit tools (Phase 2). Staff sign-in required.
 * - Any staff member: search families, view a family, record a lesson.
 * - Admins only (exceptions): give a credit back, change an expiry date,
 *   add credits, add a family/student. Each needs a note and is logged.
 */

function fail(error: unknown) {
  if (error instanceof CreditError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }
  console.error('[staff/credits] error:', error)
  return NextResponse.json({ error: 'Something went wrong. Nothing was changed.' }, { status: 500 })
}

const posInt = (v: unknown) => (typeof v === 'number' || typeof v === 'string') && /^\d+$/.test(String(v)) ? Number(v) : NaN
const minutesOf = (v: unknown): 30 | 60 | null => (Number(v) === 30 ? 30 : Number(v) === 60 ? 60 : null)

export async function GET(req: NextRequest) {
  const staff = await getStaffSession()
  if (!staff) return staffUnauthorized()
  try {
    const guardianId = posInt(req.nextUrl.searchParams.get('guardianId'))
    if (Number.isFinite(guardianId)) {
      const family = await getFamily({ guardianId }, true)
      if (!family) return NextResponse.json({ error: 'Family not found' }, { status: 404 })
      return NextResponse.json({ family, role: staff.role })
    }
    const q = (req.nextUrl.searchParams.get('q') || '').slice(0, 100)
    return NextResponse.json({ results: await searchFamilies(q), role: staff.role })
  } catch (error) {
    return fail(error)
  }
}

export async function POST(req: NextRequest) {
  const staff = await getStaffSession()
  if (!staff) return staffUnauthorized()

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const by = staff.email
  const isAdmin = staff.role === 'admin'
  const adminOnly = () =>
    NextResponse.json({ error: 'Only an admin can make exceptions. Nothing was changed.' }, { status: 403 })
  const note = typeof body.note === 'string' ? body.note.trim().slice(0, 500) : ''

  try {
    switch (body.action) {
      case 'record_lesson': {
        const studentId = posInt(body.studentId)
        const minutes = minutesOf(body.minutes)
        const lessonDate = typeof body.lessonDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.lessonDate) ? body.lessonDate : ''
        const outcome = body.outcome === 'attended' || body.outcome === 'no_show' ? body.outcome : null
        if (!Number.isFinite(studentId) || !minutes || !lessonDate || !outcome) {
          return NextResponse.json({ error: 'Choose the student, lesson length, date and outcome.' }, { status: 400 })
        }
        const result = await recordLesson({ studentId, minutes, lessonDate, outcome, note, by })
        return NextResponse.json({ success: true, ...result })
      }

      case 'restore_credit': {
        if (!isAdmin) return adminOnly()
        const lessonId = posInt(body.lessonId)
        if (!Number.isFinite(lessonId)) return NextResponse.json({ error: 'Invalid lesson' }, { status: 400 })
        await restoreLessonCredit({ lessonId, note, by })
        return NextResponse.json({ success: true })
      }

      case 'extend_expiry': {
        if (!isAdmin) return adminOnly()
        const purchaseId = posInt(body.purchaseId)
        const newExpiry = typeof body.newExpiry === 'string' ? body.newExpiry : ''
        if (!Number.isFinite(purchaseId)) return NextResponse.json({ error: 'Invalid purchase' }, { status: 400 })
        await extendExpiry({ purchaseId, newExpiry, note, by })
        return NextResponse.json({ success: true })
      }

      case 'grant_credits': {
        if (!isAdmin) return adminOnly()
        const studentId = posInt(body.studentId)
        const minutes = minutesOf(body.minutes)
        const lessons = posInt(body.lessons)
        if (!Number.isFinite(studentId) || !minutes || !Number.isFinite(lessons)) {
          return NextResponse.json({ error: 'Choose the student, lesson length and number of credits.' }, { status: 400 })
        }
        await grantCredits({ studentId, minutes, lessons, note, by })
        return NextResponse.json({ success: true })
      }

      case 'add_student': {
        if (!isAdmin) return adminOnly()
        const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
        const studentName = typeof body.studentName === 'string' ? body.studentName.trim().slice(0, 100) : ''
        if (!email || !isValidEmail(email) || !studentName) {
          return NextResponse.json({ error: 'A valid parent email and the student name are required.' }, { status: 400 })
        }
        const ids = await upsertGuardianAndStudent({
          email,
          guardianName: typeof body.guardianName === 'string' ? body.guardianName.slice(0, 100) : '',
          phone: typeof body.phone === 'string' ? body.phone.slice(0, 40) : '',
          studentName,
          studentAge: typeof body.studentAge === 'string' ? body.studentAge.slice(0, 10) : '',
        })
        return NextResponse.json({ success: true, ...ids })
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    return fail(error)
  }
}
