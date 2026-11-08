import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getFamily } from '@/lib/credits'
import { sql } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * Parent portal: the signed-in parent's own lesson credits, purchases and
 * lessons (Phase 2). Looked up only by the email in the parent's session.
 * Staff notes and the internal ledger are not included.
 */
export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if (!sql) return NextResponse.json({ family: null })

  try {
    const family = await getFamily({ email: user.email }, false)
    if (!family) return NextResponse.json({ family: null })
    return NextResponse.json({
      family: {
        students: family.students.map(s => ({
          id: s.id,
          name: s.name,
          firstNoShowForgiven: s.firstNoShowForgiven,
          credits: s.credits,
        })),
        purchases: family.purchases.map(p => ({
          id: p.id,
          studentId: p.studentId,
          packageName: p.source === 'manual' ? 'Lesson credits' : p.packageName,
          minutes: p.minutes,
          lessonsTotal: p.lessonsTotal,
          lessonsUsed: p.lessonsUsed,
          amountCents: p.amountCents,
          status: p.status,
          paidAt: p.paidAt,
          expiresAt: p.expiresAt,
          active: p.active,
        })),
        lessons: family.lessons.map(l => ({
          id: l.id,
          studentId: l.studentId,
          minutes: l.minutes,
          lessonDate: l.lessonDate,
          status: l.status,
          creditRestored: l.creditRestored,
        })),
      },
    })
  } catch (error) {
    console.error('[portal/credits] error:', error)
    return NextResponse.json({ error: 'Could not load lesson credits' }, { status: 500 })
  }
}
