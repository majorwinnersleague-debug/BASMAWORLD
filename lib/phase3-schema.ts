import { sql } from './db'
import { ensurePhase2Tables } from './phase2-schema'

/**
 * Phase 3 tables: teaching hours, blocked days and bookings.
 * Canonical migration: db/migrations/003_phase3_booking.sql (same
 * statements). Created lazily on first use; nothing existing is altered.
 * Double-booking is prevented by an exclusion constraint on bookings.
 */
let ensured: Promise<void> | null = null

export function ensurePhase3Tables(): Promise<void> {
  if (!sql) return Promise.reject(new Error('DATABASE_URL is not configured'))
  const db = sql
  if (!ensured) {
    ensured = (async () => {
      await ensurePhase2Tables()
      await db`
        CREATE TABLE IF NOT EXISTS availability_rules (
          id BIGSERIAL PRIMARY KEY,
          weekday SMALLINT NOT NULL CHECK (weekday BETWEEN 0 AND 6),
          start_time TEXT NOT NULL,
          end_time TEXT NOT NULL,
          active BOOLEAN NOT NULL DEFAULT TRUE,
          created_by TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          CHECK (start_time ~ '^[0-2][0-9]:[0-5][0-9]$' AND end_time ~ '^[0-2][0-9]:[0-5][0-9]$' AND start_time < end_time)
        )
      `
      await db`
        CREATE TABLE IF NOT EXISTS availability_blocks (
          id BIGSERIAL PRIMARY KEY,
          block_date DATE NOT NULL,
          reason TEXT,
          active BOOLEAN NOT NULL DEFAULT TRUE,
          created_by TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `
      await db`
        CREATE TABLE IF NOT EXISTS bookings (
          id BIGSERIAL PRIMARY KEY,
          student_id BIGINT NOT NULL REFERENCES students(id),
          purchase_id BIGINT REFERENCES purchases(id),
          lesson_id BIGINT REFERENCES lessons(id),
          kind TEXT NOT NULL,
          minutes INTEGER NOT NULL,
          starts_at TIMESTAMPTZ NOT NULL,
          ends_at TIMESTAMPTZ NOT NULL,
          status TEXT NOT NULL DEFAULT 'booked',
          note TEXT,
          created_by TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          cancelled_at TIMESTAMPTZ,
          cancel_reason TEXT,
          CHECK (ends_at > starts_at),
          CONSTRAINT bookings_no_overlap EXCLUDE USING gist (tstzrange(starts_at, ends_at) WITH &&)
            WHERE (status <> 'cancelled')
        )
      `
      await db`CREATE INDEX IF NOT EXISTS idx_bookings_starts ON bookings (starts_at)`
      await db`CREATE INDEX IF NOT EXISTS idx_bookings_student ON bookings (student_id, starts_at DESC)`
      await db`CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_one_trial ON bookings (student_id) WHERE kind = 'trial' AND status <> 'cancelled'`
    })().catch((error) => {
      ensured = null
      throw error
    })
  }
  return ensured
}
