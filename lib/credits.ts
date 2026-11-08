import { sql } from './db'
import { ensurePhase2Tables } from './phase2-schema'
import { creditExpiry } from './lesson-policy'

/**
 * Lesson credits (Phase 2). Rules: see lib/lesson-policy.ts.
 *
 * A purchase is a "credit lot": lessons_total credits of one length
 * (30 or 60 min), usable until expires_at. Using a credit increments
 * lessons_used on the active lot that expires first. Every change is written
 * to credit_ledger with who did it and why. Multi-step changes run as a
 * single SQL statement (data-modifying CTEs), so they are all-or-nothing.
 * Nothing in this module deletes rows.
 */

type Db = NonNullable<typeof sql>

function db(): Db {
  if (!sql) throw new Error('DATABASE_URL is not configured')
  return sql
}

const text = (v: unknown) => (v === undefined || v === null ? '' : String(v).trim())
export const normEmail = (v: unknown) => text(v).toLowerCase()

export class CreditError extends Error {
  constructor(message: string, public readonly status = 400) {
    super(message)
    this.name = 'CreditError'
  }
}

/* ─────────────────────────── guardians & students ─────────────────────────── */

/**
 * Finds or creates the guardian (by email) and student (by name within that
 * guardian). Existing names, phones, ages and instruments are never
 * replaced; only empty values are filled in.
 */
export async function upsertGuardianAndStudent(args: {
  email: string
  guardianName?: string
  phone?: string
  studentName: string
  studentAge?: string
  instrument?: string
}): Promise<{ guardianId: number; studentId: number }> {
  await ensurePhase2Tables()
  const d = db()
  const email = normEmail(args.email)
  const studentName = text(args.studentName)
  if (!email || !studentName) throw new CreditError('Email and student name are required')

  const [g] = await d`
    INSERT INTO guardians (email, name, phone)
    VALUES (${email}, ${text(args.guardianName) || null}, ${text(args.phone) || null})
    ON CONFLICT ((LOWER(email))) DO UPDATE SET
      name = COALESCE(NULLIF(guardians.name, ''), EXCLUDED.name),
      phone = COALESCE(NULLIF(guardians.phone, ''), EXCLUDED.phone),
      updated_at = NOW()
    RETURNING id
  `
  const [s] = await d`
    INSERT INTO students (guardian_id, name, age, instrument)
    VALUES (${g.id}, ${studentName}, ${text(args.studentAge) || null}, ${text(args.instrument) || null})
    ON CONFLICT (guardian_id, (LOWER(name))) DO UPDATE SET
      age = COALESCE(NULLIF(students.age, ''), EXCLUDED.age),
      instrument = COALESCE(NULLIF(students.instrument, ''), EXCLUDED.instrument)
    RETURNING id
  `
  return { guardianId: Number(g.id), studentId: Number(s.id) }
}

/* ─────────────────────────────── purchases ─────────────────────────────── */

/**
 * Records a paid Stripe checkout as a credit lot. Idempotent: the same
 * Stripe session never creates a second lot or grant.
 */
export async function recordStripePurchase(args: {
  email: string
  guardianName?: string
  phone?: string
  studentName: string
  studentAge?: string
  instrument?: string
  sessionId: string
  paymentIntentId?: string
  lessonRequestId?: number | null
  packageId: string
  packageName: string
  minutes: number
  lessons: number
  amountCents: number
  paidAt: Date
}): Promise<{ created: boolean; studentId: number }> {
  const { guardianId, studentId } = await upsertGuardianAndStudent(args)
  const d = db()
  const expiresAt = creditExpiry(args.paidAt)
  const rows = await d`
    WITH p AS (
      INSERT INTO purchases (
        guardian_id, student_id, source, lesson_request_id, stripe_session_id, stripe_payment_id,
        package_id, package_name, minutes, lessons_total, amount_cents, paid_at, expires_at, created_by
      ) VALUES (
        ${guardianId}, ${studentId}, 'stripe', ${args.lessonRequestId ?? null}, ${args.sessionId},
        ${args.paymentIntentId || null}, ${args.packageId}, ${args.packageName}, ${args.minutes},
        ${args.lessons}, ${args.amountCents}, ${args.paidAt.toISOString()}, ${expiresAt.toISOString()}, 'stripe'
      )
      ON CONFLICT (stripe_session_id) WHERE stripe_session_id IS NOT NULL DO NOTHING
      RETURNING id, student_id, lessons_total
    )
    INSERT INTO credit_ledger (student_id, purchase_id, delta, reason, note, created_by)
    SELECT student_id, id, lessons_total, 'purchase', ${args.packageName}, 'stripe' FROM p
    RETURNING purchase_id
  `
  return { created: rows.length > 0, studentId }
}

/**
 * Full refund: removes the unused credits of the lot paid with this
 * PaymentIntent (used lessons stay recorded). Returns how many were removed.
 */
export async function revokeCreditsForRefund(paymentIntentId: string): Promise<number> {
  await ensurePhase2Tables()
  const d = db()
  const rows = await d`
    WITH old AS (
      SELECT id, student_id, lessons_total - lessons_used AS remaining
      FROM purchases
      WHERE stripe_payment_id = ${paymentIntentId} AND status = 'paid'
    ),
    p AS (
      UPDATE purchases SET status = 'refunded', refunded_at = NOW(), lessons_total = lessons_used
      FROM old WHERE purchases.id = old.id
      RETURNING purchases.id
    )
    INSERT INTO credit_ledger (student_id, purchase_id, delta, reason, note, created_by)
    SELECT old.student_id, old.id, -old.remaining, 'refund', 'Stripe refund', 'stripe'
    FROM old JOIN p ON p.id = old.id
    RETURNING delta
  `
  return rows.reduce((sum: number, r: Record<string, unknown>) => sum - Number(r.delta), 0)
}

/* ─────────────────────────────── lessons ─────────────────────────────── */

export type LessonOutcome = 'attended' | 'no_show'

/**
 * Records a lesson.
 * - attended: uses one credit of that length (the lot expiring first).
 * - no_show: the student's first no-show is forgiven once (no credit used);
 *   after that a no-show uses a credit like an attended lesson.
 */
export async function recordLesson(args: {
  studentId: number
  minutes: 30 | 60
  lessonDate: string // YYYY-MM-DD
  outcome: LessonOutcome
  note?: string
  by: string
}): Promise<{ status: 'attended' | 'no_show' | 'no_show_forgiven'; lessonId: number }> {
  await ensurePhase2Tables()
  const d = db()
  const note = text(args.note) || null

  if (args.outcome === 'no_show') {
    const forgiven = await d`
      WITH f AS (
        UPDATE students SET first_no_show_forgiven_at = NOW()
        WHERE id = ${args.studentId} AND first_no_show_forgiven_at IS NULL
        RETURNING id
      ),
      l AS (
        INSERT INTO lessons (student_id, purchase_id, minutes, lesson_date, status, note, recorded_by)
        SELECT f.id, NULL, ${args.minutes}, ${args.lessonDate}, 'no_show_forgiven', ${note}, ${args.by} FROM f
        RETURNING id, student_id
      )
      INSERT INTO credit_ledger (student_id, lesson_id, delta, reason, note, created_by)
      SELECT student_id, id, 0, 'no_show_forgiven', ${note || 'First no-show forgiven'}, ${args.by} FROM l
      RETURNING lesson_id
    `
    if (forgiven.length > 0) return { status: 'no_show_forgiven', lessonId: Number(forgiven[0].lesson_id) }
  }

  const status = args.outcome === 'attended' ? 'attended' : 'no_show'
  const reason = args.outcome === 'attended' ? 'lesson_attended' : 'no_show'
  const used = await d`
    WITH lot AS (
      UPDATE purchases SET lessons_used = lessons_used + 1
      WHERE id = (
        SELECT id FROM purchases
        WHERE student_id = ${args.studentId} AND minutes = ${args.minutes} AND status = 'paid'
          AND expires_at > NOW() AND lessons_used < lessons_total
        ORDER BY expires_at ASC, id ASC
        LIMIT 1
        FOR UPDATE
      )
      RETURNING id, student_id
    ),
    l AS (
      INSERT INTO lessons (student_id, purchase_id, minutes, lesson_date, status, note, recorded_by)
      SELECT lot.student_id, lot.id, ${args.minutes}, ${args.lessonDate}, ${status}, ${note}, ${args.by} FROM lot
      RETURNING id, student_id, purchase_id
    )
    INSERT INTO credit_ledger (student_id, purchase_id, lesson_id, delta, reason, note, created_by)
    SELECT student_id, purchase_id, id, -1, ${reason}, ${note}, ${args.by} FROM l
    RETURNING lesson_id
  `
  if (used.length === 0) {
    throw new CreditError(`No unused ${args.minutes}-minute credits for this student (none left, or they expired).`, 409)
  }
  return { status, lessonId: Number(used[0].lesson_id) }
}

/* ─────────────────────────── admin exceptions ─────────────────────────── */

/** Gives back the credit used by one lesson (exception). Note required. */
export async function restoreLessonCredit(args: { lessonId: number; note: string; by: string }): Promise<void> {
  await ensurePhase2Tables()
  const d = db()
  if (!text(args.note)) throw new CreditError('A note explaining the exception is required')
  const rows = await d`
    WITH l AS (
      UPDATE lessons SET credit_restored_at = NOW()
      WHERE id = ${args.lessonId} AND purchase_id IS NOT NULL AND credit_restored_at IS NULL
      RETURNING id, student_id, purchase_id
    ),
    p AS (
      UPDATE purchases SET lessons_used = purchases.lessons_used - 1
      FROM l WHERE purchases.id = l.purchase_id AND purchases.lessons_used > 0
      RETURNING purchases.id
    )
    INSERT INTO credit_ledger (student_id, purchase_id, lesson_id, delta, reason, note, created_by)
    SELECT l.student_id, l.purchase_id, l.id, 1, 'credit_restored', ${text(args.note)}, ${args.by}
    FROM l JOIN p ON p.id = l.purchase_id
    RETURNING id
  `
  if (rows.length === 0) throw new CreditError('That lesson did not use a credit, or its credit was already given back.', 409)
}

/** Moves a credit lot's expiry date (exception). Note required. */
export async function extendExpiry(args: { purchaseId: number; newExpiry: string; note: string; by: string }): Promise<void> {
  await ensurePhase2Tables()
  const d = db()
  if (!text(args.note)) throw new CreditError('A note explaining the exception is required')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.newExpiry)) throw new CreditError('Choose a valid date')
  // End of that day, Pacific time (08:00 UTC next day is safely after midnight PT).
  const newExpiry = new Date(`${args.newExpiry}T00:00:00Z`)
  newExpiry.setUTCDate(newExpiry.getUTCDate() + 1)
  newExpiry.setUTCHours(8)
  const rows = await d`
    WITH old AS (SELECT id, student_id, expires_at FROM purchases WHERE id = ${args.purchaseId} AND status = 'paid'),
    p AS (
      UPDATE purchases SET expires_at = ${newExpiry.toISOString()}
      FROM old WHERE purchases.id = old.id
      RETURNING purchases.id
    )
    INSERT INTO credit_ledger (student_id, purchase_id, delta, reason, note, created_by)
    SELECT old.student_id, old.id, 0, 'expiry_changed',
           ${text(args.note)} || ' (expiry ' || to_char(old.expires_at AT TIME ZONE 'America/Los_Angeles', 'YYYY-MM-DD') || ' → ' || ${args.newExpiry} || ')',
           ${args.by}
    FROM old JOIN p ON p.id = old.id
    RETURNING id
  `
  if (rows.length === 0) throw new CreditError('Purchase not found (or it was refunded).', 404)
}

/** Adds credits by hand, e.g. for families who paid before Phase 2. Note required. */
export async function grantCredits(args: {
  studentId: number
  minutes: 30 | 60
  lessons: number
  note: string
  by: string
}): Promise<void> {
  await ensurePhase2Tables()
  const d = db()
  if (!text(args.note)) throw new CreditError('A note explaining the exception is required')
  if (!Number.isInteger(args.lessons) || args.lessons < 1 || args.lessons > 12) {
    throw new CreditError('Choose between 1 and 12 credits')
  }
  const now = new Date()
  const rows = await d`
    WITH s AS (SELECT id, guardian_id FROM students WHERE id = ${args.studentId}),
    p AS (
      INSERT INTO purchases (guardian_id, student_id, source, package_name, minutes, lessons_total, paid_at, expires_at, note, created_by)
      SELECT s.guardian_id, s.id, 'manual', 'Credits added by staff', ${args.minutes}, ${args.lessons},
             ${now.toISOString()}, ${creditExpiry(now).toISOString()}, ${text(args.note)}, ${args.by}
      FROM s
      RETURNING id, student_id, lessons_total
    )
    INSERT INTO credit_ledger (student_id, purchase_id, delta, reason, note, created_by)
    SELECT student_id, id, lessons_total, 'manual_grant', ${text(args.note)}, ${args.by} FROM p
    RETURNING id
  `
  if (rows.length === 0) throw new CreditError('Student not found', 404)
}

/* ─────────────────────────────── reading ─────────────────────────────── */

export interface CreditSummary {
  minutes: 30 | 60
  remaining: number
  nextExpiry: string | null
  expiredUnused: number
}

export interface FamilyView {
  guardian: { id: number; email: string; name: string | null; phone: string | null }
  students: {
    id: number
    name: string
    age: string | null
    instrument: string | null
    firstNoShowForgiven: boolean
    credits: CreditSummary[]
  }[]
  purchases: {
    id: number
    studentId: number
    source: string
    packageName: string | null
    minutes: number
    lessonsTotal: number
    lessonsUsed: number
    amountCents: number | null
    status: string
    paidAt: string
    expiresAt: string
    active: boolean
    note: string | null
  }[]
  lessons: {
    id: number
    studentId: number
    minutes: number
    lessonDate: string
    status: string
    usedCredit: boolean
    creditRestored: boolean
    note: string | null
    recordedBy: string | null
  }[]
  ledger?: { id: number; studentId: number; delta: number; reason: string; note: string | null; createdBy: string | null; createdAt: string }[]
}

function iso(v: unknown): string {
  return v instanceof Date ? v.toISOString() : String(v)
}

function dateOnly(v: unknown): string {
  return v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10)
}

/** Everything about one family. Pass includeLedger for staff views. */
export async function getFamily(where: { email?: string; guardianId?: number }, includeLedger = false): Promise<FamilyView | null> {
  await ensurePhase2Tables()
  const d = db()
  const gRows = where.guardianId
    ? await d`SELECT id, email, name, phone FROM guardians WHERE id = ${where.guardianId}`
    : await d`SELECT id, email, name, phone FROM guardians WHERE LOWER(email) = ${normEmail(where.email)}`
  const g = gRows[0]
  if (!g) return null
  const gid = Number(g.id)

  const [students, purchases, lessons, ledger] = await Promise.all([
    d`SELECT id, name, age, instrument, first_no_show_forgiven_at FROM students WHERE guardian_id = ${gid} ORDER BY LOWER(name)`,
    d`SELECT * FROM purchases WHERE guardian_id = ${gid} ORDER BY paid_at DESC, id DESC`,
    d`SELECT l.* FROM lessons l JOIN students s ON s.id = l.student_id WHERE s.guardian_id = ${gid} ORDER BY l.lesson_date DESC, l.id DESC LIMIT 200`,
    includeLedger
      ? d`SELECT c.* FROM credit_ledger c JOIN students s ON s.id = c.student_id WHERE s.guardian_id = ${gid} ORDER BY c.created_at DESC, c.id DESC LIMIT 200`
      : Promise.resolve([] as Record<string, unknown>[]),
  ])

  const now = Date.now()
  const view: FamilyView = {
    guardian: { id: gid, email: String(g.email), name: g.name ?? null, phone: g.phone ?? null },
    students: students.map((s: Record<string, unknown>) => {
      const sid = Number(s.id)
      const credits = ([30, 60] as const).map((minutes) => {
        const lots = purchases.filter((p: Record<string, unknown>) =>
          Number(p.student_id) === sid && Number(p.minutes) === minutes && p.status === 'paid')
        const active = lots.filter((p: Record<string, unknown>) => new Date(iso(p.expires_at)).getTime() > now)
        const expired = lots.filter((p: Record<string, unknown>) => new Date(iso(p.expires_at)).getTime() <= now)
        const left = (p: Record<string, unknown>) => Number(p.lessons_total) - Number(p.lessons_used)
        const withCredits = active.filter((p: Record<string, unknown>) => left(p) > 0)
        const next = withCredits
          .map((p: Record<string, unknown>) => iso(p.expires_at))
          .sort()[0] || null
        return {
          minutes,
          remaining: withCredits.reduce((n: number, p: Record<string, unknown>) => n + left(p), 0),
          nextExpiry: next,
          expiredUnused: expired.reduce((n: number, p: Record<string, unknown>) => n + Math.max(0, left(p)), 0),
        }
      })
      return {
        id: sid,
        name: String(s.name),
        age: (s.age as string) ?? null,
        instrument: (s.instrument as string) ?? null,
        firstNoShowForgiven: Boolean(s.first_no_show_forgiven_at),
        credits,
      }
    }),
    purchases: purchases.map((p: Record<string, unknown>) => ({
      id: Number(p.id),
      studentId: Number(p.student_id),
      source: String(p.source),
      packageName: (p.package_name as string) ?? null,
      minutes: Number(p.minutes),
      lessonsTotal: Number(p.lessons_total),
      lessonsUsed: Number(p.lessons_used),
      amountCents: p.amount_cents === null || p.amount_cents === undefined ? null : Number(p.amount_cents),
      status: String(p.status),
      paidAt: iso(p.paid_at),
      expiresAt: iso(p.expires_at),
      active: p.status === 'paid' && new Date(iso(p.expires_at)).getTime() > now,
      note: (p.note as string) ?? null,
    })),
    lessons: lessons.map((l: Record<string, unknown>) => ({
      id: Number(l.id),
      studentId: Number(l.student_id),
      minutes: Number(l.minutes),
      lessonDate: dateOnly(l.lesson_date),
      status: String(l.status),
      usedCredit: l.purchase_id !== null && l.purchase_id !== undefined,
      creditRestored: Boolean(l.credit_restored_at),
      note: (l.note as string) ?? null,
      recordedBy: (l.recorded_by as string) ?? null,
    })),
  }
  if (includeLedger) {
    view.ledger = (ledger as Record<string, unknown>[]).map((c) => ({
      id: Number(c.id),
      studentId: Number(c.student_id),
      delta: Number(c.delta),
      reason: String(c.reason),
      note: (c.note as string) ?? null,
      createdBy: (c.created_by as string) ?? null,
      createdAt: iso(c.created_at),
    }))
  }
  return view
}

/** Staff search by parent email, parent name or student name. */
export async function searchFamilies(query: string): Promise<{ id: number; email: string; name: string | null; students: string[] }[]> {
  await ensurePhase2Tables()
  const d = db()
  const q = text(query).toLowerCase()
  const rows = q
    ? await d`
        SELECT g.id, g.email, g.name, COALESCE(array_agg(s.name ORDER BY LOWER(s.name)) FILTER (WHERE s.id IS NOT NULL), '{}') AS students
        FROM guardians g LEFT JOIN students s ON s.guardian_id = g.id
        WHERE LOWER(g.email) LIKE ${'%' + q + '%'} OR LOWER(COALESCE(g.name, '')) LIKE ${'%' + q + '%'}
           OR EXISTS (SELECT 1 FROM students s2 WHERE s2.guardian_id = g.id AND LOWER(s2.name) LIKE ${'%' + q + '%'})
        GROUP BY g.id ORDER BY LOWER(COALESCE(g.name, g.email)) LIMIT 25
      `
    : await d`
        SELECT g.id, g.email, g.name, COALESCE(array_agg(s.name ORDER BY LOWER(s.name)) FILTER (WHERE s.id IS NOT NULL), '{}') AS students
        FROM guardians g LEFT JOIN students s ON s.guardian_id = g.id
        GROUP BY g.id ORDER BY g.updated_at DESC LIMIT 25
      `
  return rows.map((r: Record<string, unknown>) => ({
    id: Number(r.id),
    email: String(r.email),
    name: (r.name as string) ?? null,
    students: Array.isArray(r.students) ? (r.students as string[]) : [],
  }))
}
