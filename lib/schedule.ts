import { sql } from './db'
import { ensurePhase3Tables } from './phase3-schema'
import { CreditError } from './credits'
import {
  BOOKING_WINDOW_DAYS,
  CANCEL_CUTOFF_HOURS,
  LESSON_SLOT_STEP_MINUTES,
  MIN_NOTICE_HOURS,
  TRIAL_MINUTES,
  TRIAL_SLOT_STEP_MINUTES,
} from './schedule-policy'
import { addDays, minutesOfDay, timeOfMinutes, weekdayOf, zonedDate, zonedTime, zonedToUtc } from './tz'

/**
 * Online booking (Phase 3).
 * - Teaching hours: weekly rules + blocked days, managed by staff.
 * - Open slots = hours − blocked days − existing bookings − too-soon times.
 * - Booking a lesson reserves one credit (same rules as lib/credits.ts) in the
 *   same SQL statement that inserts the booking. If the slot was just taken,
 *   the database's no-overlap rule rejects it and no credit is used.
 * - Nothing is deleted: cancelling sets status; hours/blocks are switched off.
 */

type Db = NonNullable<typeof sql>
function db(): Db {
  if (!sql) throw new Error('DATABASE_URL is not configured')
  return sql
}

const ACTIVE = ['booked', 'completed', 'no_show', 'no_show_forgiven']

export interface Rule { id: number; weekday: number; startTime: string; endTime: string }
export interface Block { id: number; date: string; reason: string | null }
export interface Slot { startsAt: string; date: string; time: string }

const dateOnly = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10))
const iso = (v: unknown) => (v instanceof Date ? v.toISOString() : new Date(String(v)).toISOString())

function isOverlapError(error: unknown): boolean {
  const code = (error as { code?: string })?.code
  const msg = String((error as { message?: string })?.message || '')
  return code === '23P01' || msg.includes('bookings_no_overlap')
}
function isUniqueTrialError(error: unknown): boolean {
  const code = (error as { code?: string })?.code
  const msg = String((error as { message?: string })?.message || '')
  return code === '23505' || msg.includes('idx_bookings_one_trial')
}

/* ───────────────────────────── teaching hours ───────────────────────────── */

export async function getAvailability(): Promise<{ rules: Rule[]; blocks: Block[] }> {
  await ensurePhase3Tables()
  const d = db()
  const [rules, blocks] = await Promise.all([
    d`SELECT id, weekday, start_time, end_time FROM availability_rules WHERE active ORDER BY weekday, start_time`,
    d`SELECT id, block_date, reason FROM availability_blocks WHERE active AND block_date >= (NOW() AT TIME ZONE 'America/Los_Angeles')::date ORDER BY block_date`,
  ])
  return {
    rules: rules.map((r: Record<string, unknown>) => ({ id: Number(r.id), weekday: Number(r.weekday), startTime: String(r.start_time), endTime: String(r.end_time) })),
    blocks: blocks.map((b: Record<string, unknown>) => ({ id: Number(b.id), date: dateOnly(b.block_date), reason: (b.reason as string) ?? null })),
  }
}

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/

export async function addRule(args: { weekday: number; startTime: string; endTime: string; by: string }): Promise<void> {
  await ensurePhase3Tables()
  if (!Number.isInteger(args.weekday) || args.weekday < 0 || args.weekday > 6) throw new CreditError('Choose a day')
  if (!HHMM.test(args.startTime) || !HHMM.test(args.endTime) || args.startTime >= args.endTime) {
    throw new CreditError('Choose a start time before the end time')
  }
  if (minutesOfDay(args.startTime) % 15 || minutesOfDay(args.endTime) % 15) throw new CreditError('Use times on the quarter hour')
  await db()`INSERT INTO availability_rules (weekday, start_time, end_time, created_by) VALUES (${args.weekday}, ${args.startTime}, ${args.endTime}, ${args.by})`
}

export async function removeRule(id: number): Promise<void> {
  await ensurePhase3Tables()
  await db()`UPDATE availability_rules SET active = FALSE WHERE id = ${id}`
}

export async function addBlock(args: { date: string; reason?: string; by: string }): Promise<void> {
  await ensurePhase3Tables()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.date)) throw new CreditError('Choose a date')
  await db()`INSERT INTO availability_blocks (block_date, reason, created_by) VALUES (${args.date}, ${(args.reason || '').slice(0, 200) || null}, ${args.by})`
}

export async function removeBlock(id: number): Promise<void> {
  await ensurePhase3Tables()
  await db()`UPDATE availability_blocks SET active = FALSE WHERE id = ${id}`
}

/* ─────────────────────────────── open slots ─────────────────────────────── */

/** Open start times for a lesson of `minutes` (15 = free trial). */
export async function getOpenSlots(minutes: number, now: Date = new Date()): Promise<Slot[]> {
  await ensurePhase3Tables()
  const d = db()
  const { rules, blocks } = await getAvailability()
  if (!rules.length) return []

  const step = minutes === TRIAL_MINUTES ? TRIAL_SLOT_STEP_MINUTES : LESSON_SLOT_STEP_MINUTES
  const earliest = now.getTime() + MIN_NOTICE_HOURS * 3600_000
  const today = zonedDate(now)
  const last = addDays(today, BOOKING_WINDOW_DAYS)
  const blocked = new Set(blocks.map(b => b.date))

  const taken = await d`
    SELECT starts_at, ends_at FROM bookings
    WHERE status <> 'cancelled' AND ends_at > ${now.toISOString()} AND starts_at < ${zonedToUtc(addDays(last, 1), '00:00').toISOString()}
  `
  const busy = taken.map((b: Record<string, unknown>) => [new Date(iso(b.starts_at)).getTime(), new Date(iso(b.ends_at)).getTime()])

  const slots: Slot[] = []
  for (let date = today; date <= last; date = addDays(date, 1)) {
    if (blocked.has(date)) continue
    const wd = weekdayOf(date)
    for (const r of rules.filter(x => x.weekday === wd)) {
      const from = minutesOfDay(r.startTime)
      const to = minutesOfDay(r.endTime)
      // first start on the grid, at or after the rule's start
      for (let m = Math.ceil(from / step) * step; m + minutes <= to; m += step) {
        const time = timeOfMinutes(m)
        const start = zonedToUtc(date, time).getTime()
        const end = start + minutes * 60_000
        if (start < earliest) continue
        if (busy.some(([s, e]) => start < e && end > s)) continue
        slots.push({ startsAt: new Date(start).toISOString(), date, time })
      }
    }
  }
  // de-duplicate (overlapping rules) and sort
  const seen = new Set<string>()
  return slots
    .filter(s => (seen.has(s.startsAt) ? false : (seen.add(s.startsAt), true)))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
}

async function assertOpen(minutes: number, startsAt: Date): Promise<void> {
  const open = await getOpenSlots(minutes)
  if (!open.some(s => s.startsAt === startsAt.toISOString())) {
    throw new CreditError('That time is no longer available. Please pick another.', 409)
  }
}

/* ──────────────────────────────── booking ──────────────────────────────── */

/**
 * Books a lesson and reserves one credit of that length, atomically.
 * The caller must already have verified the student belongs to the parent.
 */
export async function bookLesson(args: { studentId: number; minutes: 30 | 60; startsAt: string; by: string }): Promise<{ bookingId: number }> {
  await ensurePhase3Tables()
  const start = new Date(args.startsAt)
  if (Number.isNaN(start.getTime())) throw new CreditError('Pick a time')
  await assertOpen(args.minutes, start)
  const end = new Date(start.getTime() + args.minutes * 60_000)
  const label = `${zonedDate(start)} ${zonedTime(start)}`
  try {
    const rows = await db()`
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
      b AS (
        INSERT INTO bookings (student_id, purchase_id, kind, minutes, starts_at, ends_at, status, created_by)
        SELECT lot.student_id, lot.id, 'lesson', ${args.minutes}, ${start.toISOString()}, ${end.toISOString()}, 'booked', ${args.by} FROM lot
        RETURNING id, student_id, purchase_id
      )
      INSERT INTO credit_ledger (student_id, purchase_id, delta, reason, note, created_by)
      SELECT student_id, purchase_id, -1, 'lesson_booked', ${'Booked ' + label}, ${args.by} FROM b
      RETURNING (SELECT id FROM b) AS booking_id
    `
    if (!rows.length) {
      throw new CreditError(`No ${args.minutes}-minute lesson credits left (or they expired). Buy a package to book more.`, 409)
    }
    return { bookingId: Number(rows[0].booking_id) }
  } catch (error) {
    if (isOverlapError(error)) throw new CreditError('That time was just booked by someone else. Please pick another.', 409)
    throw error
  }
}

/** Books the free 15-minute trial (no credit). One trial per student. */
export async function bookTrial(args: { studentId: number; startsAt: string; by: string }): Promise<{ bookingId: number }> {
  await ensurePhase3Tables()
  const start = new Date(args.startsAt)
  if (Number.isNaN(start.getTime())) throw new CreditError('Pick a time')
  await assertOpen(TRIAL_MINUTES, start)
  const end = new Date(start.getTime() + TRIAL_MINUTES * 60_000)
  try {
    const [row] = await db()`
      INSERT INTO bookings (student_id, kind, minutes, starts_at, ends_at, status, created_by)
      VALUES (${args.studentId}, 'trial', ${TRIAL_MINUTES}, ${start.toISOString()}, ${end.toISOString()}, 'booked', ${args.by})
      RETURNING id
    `
    return { bookingId: Number(row.id) }
  } catch (error) {
    if (isOverlapError(error)) throw new CreditError('That time was just booked by someone else. Please pick another.', 409)
    if (isUniqueTrialError(error)) throw new CreditError('This student already has a free trial booked.', 409)
    throw error
  }
}

/**
 * Cancels a booked (not yet held) booking.
 * - Parent: only up to CANCEL_CUTOFF_HOURS before; credit returned.
 * - Staff: any time; returnCredit decides whether the credit comes back.
 */
export async function cancelBooking(args: {
  bookingId: number
  by: string
  asParent: boolean
  returnCredit: boolean
  reason?: string
}): Promise<{ creditReturned: boolean }> {
  await ensurePhase3Tables()
  const cutoff = new Date(Date.now() + (args.asParent ? CANCEL_CUTOFF_HOURS : -1e6) * 3600_000).toISOString()
  const giveBack = args.asParent ? true : args.returnCredit
  const rows = await db()`
    WITH b AS (
      UPDATE bookings SET status = 'cancelled', cancelled_at = NOW(), cancel_reason = ${(args.reason || '').slice(0, 300) || null}
      WHERE id = ${args.bookingId} AND status = 'booked' AND starts_at > ${cutoff}
      RETURNING id, student_id, purchase_id
    ),
    p AS (
      UPDATE purchases SET lessons_used = purchases.lessons_used - 1
      FROM b WHERE ${giveBack}::boolean AND purchases.id = b.purchase_id AND purchases.lessons_used > 0
      RETURNING purchases.id
    )
    INSERT INTO credit_ledger (student_id, purchase_id, delta, reason, note, created_by)
    SELECT b.student_id, b.purchase_id, CASE WHEN p.id IS NULL THEN 0 ELSE 1 END, 'booking_cancelled',
           ${args.reason || (args.asParent ? 'Cancelled online by parent' : 'Cancelled by staff')}, ${args.by}
    FROM b LEFT JOIN p ON p.id = b.purchase_id
    RETURNING delta
  `
  if (!rows.length) {
    throw new CreditError(
      args.asParent
        ? `This lesson can no longer be cancelled online (less than ${CANCEL_CUTOFF_HOURS} hours away). Please call (702) 788-7369.`
        : 'That booking is not active.',
      409
    )
  }
  return { creditReturned: Number(rows[0].delta) > 0 }
}

/**
 * Staff marks a booking after it happens.
 * - attended: lesson recorded; the credit reserved at booking stays used.
 * - no_show: the student's first no-show is forgiven (credit returned);
 *   after that the reserved credit stays used.
 */
export async function markBooking(args: {
  bookingId: number
  outcome: 'attended' | 'no_show'
  by: string
}): Promise<{ status: 'completed' | 'no_show' | 'no_show_forgiven' }> {
  await ensurePhase3Tables()
  const d = db()

  if (args.outcome === 'no_show') {
    const forgiven = await d`
      WITH bk AS (SELECT id, student_id, purchase_id, minutes, starts_at FROM bookings WHERE id = ${args.bookingId} AND status = 'booked' AND kind = 'lesson'),
      f AS (
        UPDATE students SET first_no_show_forgiven_at = NOW()
        FROM bk WHERE students.id = bk.student_id AND students.first_no_show_forgiven_at IS NULL
        RETURNING students.id
      ),
      l AS (
        INSERT INTO lessons (student_id, purchase_id, minutes, lesson_date, status, note, recorded_by)
        SELECT bk.student_id, NULL, bk.minutes, (bk.starts_at AT TIME ZONE 'America/Los_Angeles')::date, 'no_show_forgiven', 'From online booking', ${args.by}
        FROM bk JOIN f ON f.id = bk.student_id
        RETURNING id
      ),
      upd AS (
        UPDATE bookings SET status = 'no_show_forgiven', lesson_id = (SELECT id FROM l)
        FROM bk WHERE bookings.id = bk.id AND EXISTS (SELECT 1 FROM l)
        RETURNING bookings.id
      ),
      p AS (
        UPDATE purchases SET lessons_used = purchases.lessons_used - 1
        FROM bk WHERE purchases.id = bk.purchase_id AND EXISTS (SELECT 1 FROM l) AND purchases.lessons_used > 0
        RETURNING purchases.id
      )
      INSERT INTO credit_ledger (student_id, purchase_id, lesson_id, delta, reason, note, created_by)
      SELECT bk.student_id, bk.purchase_id, (SELECT id FROM l), CASE WHEN EXISTS (SELECT 1 FROM p) THEN 1 ELSE 0 END,
             'no_show_forgiven', 'First no-show forgiven (online booking)', ${args.by}
      FROM bk WHERE EXISTS (SELECT 1 FROM l)
      RETURNING id
    `
    if (forgiven.length) return { status: 'no_show_forgiven' }
  }

  const status = args.outcome === 'attended' ? 'completed' : 'no_show'
  const lessonStatus = args.outcome === 'attended' ? 'attended' : 'no_show'
  const reason = args.outcome === 'attended' ? 'lesson_attended' : 'no_show'
  const rows = await d`
    WITH bk AS (SELECT id, student_id, purchase_id, minutes, starts_at, kind FROM bookings WHERE id = ${args.bookingId} AND status = 'booked'),
    l AS (
      INSERT INTO lessons (student_id, purchase_id, minutes, lesson_date, status, note, recorded_by)
      SELECT bk.student_id, bk.purchase_id, bk.minutes, (bk.starts_at AT TIME ZONE 'America/Los_Angeles')::date, ${lessonStatus},
             CASE WHEN bk.kind = 'trial' THEN 'Free trial (online booking)' ELSE 'From online booking' END, ${args.by}
      FROM bk
      RETURNING id
    ),
    upd AS (
      UPDATE bookings SET status = ${status}, lesson_id = (SELECT id FROM l)
      FROM bk WHERE bookings.id = bk.id
      RETURNING bookings.id
    )
    INSERT INTO credit_ledger (student_id, purchase_id, lesson_id, delta, reason, note, created_by)
    SELECT bk.student_id, bk.purchase_id, (SELECT id FROM l), 0, ${reason},
           CASE WHEN bk.kind = 'trial' THEN 'Free trial' ELSE 'Credit was used when booked' END, ${args.by}
    FROM bk
    RETURNING id
  `
  if (!rows.length) throw new CreditError('That booking was already marked or cancelled.', 409)
  return { status }
}

/* ──────────────────────────────── reading ──────────────────────────────── */

export interface BookingView {
  id: number
  studentId: number
  studentName: string
  guardianEmail: string
  guardianName: string | null
  guardianPhone: string | null
  kind: 'lesson' | 'trial'
  minutes: number
  startsAt: string
  endsAt: string
  status: string
  canCancelOnline: boolean
}

function toView(r: Record<string, unknown>): BookingView {
  const startsAt = iso(r.starts_at)
  return {
    id: Number(r.id),
    studentId: Number(r.student_id),
    studentName: String(r.student_name),
    guardianEmail: String(r.guardian_email),
    guardianName: (r.guardian_name as string) ?? null,
    guardianPhone: (r.guardian_phone as string) ?? null,
    kind: r.kind === 'trial' ? 'trial' : 'lesson',
    minutes: Number(r.minutes),
    startsAt,
    endsAt: iso(r.ends_at),
    status: String(r.status),
    canCancelOnline: r.status === 'booked' && new Date(startsAt).getTime() > Date.now() + CANCEL_CUTOFF_HOURS * 3600_000,
  }
}

export async function getBookingsForGuardian(email: string): Promise<BookingView[]> {
  await ensurePhase3Tables()
  const rows = await db()`
    SELECT b.*, s.name AS student_name, g.email AS guardian_email, g.name AS guardian_name, g.phone AS guardian_phone
    FROM bookings b JOIN students s ON s.id = b.student_id JOIN guardians g ON g.id = s.guardian_id
    WHERE LOWER(g.email) = ${email.trim().toLowerCase()}
      AND b.status <> 'cancelled' AND b.starts_at > NOW() - INTERVAL '60 days'
    ORDER BY b.starts_at
  `
  return rows.map(toView)
}

/** Staff view: from `from` for `days` days (default: last 14 days → next 56). */
export async function getBookingsForStaff(fromDays = -14, days = 70): Promise<BookingView[]> {
  await ensurePhase3Tables()
  const from = new Date(Date.now() + fromDays * 86400_000).toISOString()
  const to = new Date(Date.now() + (fromDays + days) * 86400_000).toISOString()
  const rows = await db()`
    SELECT b.*, s.name AS student_name, g.email AS guardian_email, g.name AS guardian_name, g.phone AS guardian_phone
    FROM bookings b JOIN students s ON s.id = b.student_id JOIN guardians g ON g.id = s.guardian_id
    WHERE b.status <> 'cancelled' AND b.starts_at >= ${from} AND b.starts_at < ${to}
    ORDER BY b.starts_at
  `
  return rows.map(toView)
}

export async function getBooking(bookingId: number): Promise<BookingView | null> {
  await ensurePhase3Tables()
  const rows = await db()`
    SELECT b.*, s.name AS student_name, g.email AS guardian_email, g.name AS guardian_name, g.phone AS guardian_phone
    FROM bookings b JOIN students s ON s.id = b.student_id JOIN guardians g ON g.id = s.guardian_id
    WHERE b.id = ${bookingId}
  `
  return rows.length ? toView(rows[0]) : null
}

/** True if the student belongs to the guardian with this email. */
export async function studentBelongsTo(studentId: number, email: string): Promise<boolean> {
  await ensurePhase3Tables()
  const rows = await db()`
    SELECT 1 FROM students s JOIN guardians g ON g.id = s.guardian_id
    WHERE s.id = ${studentId} AND LOWER(g.email) = ${email.trim().toLowerCase()}
  `
  return rows.length > 0
}
