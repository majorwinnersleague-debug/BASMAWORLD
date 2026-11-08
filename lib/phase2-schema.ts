import { sql } from './db'

/**
 * Phase 2 tables: guardian accounts, students, purchases (credit lots),
 * lessons and a credit ledger (audit trail).
 *
 * Canonical migration: db/migrations/002_phase2_credits.sql. This helper runs
 * the same idempotent CREATE ... IF NOT EXISTS statements once per server
 * instance, so the feature works even before the migration is run by hand.
 * Nothing here alters or deletes existing tables or rows.
 */
let ensured: Promise<void> | null = null

export function ensurePhase2Tables(): Promise<void> {
  if (!sql) return Promise.reject(new Error('DATABASE_URL is not configured'))
  const db = sql
  if (!ensured) {
    ensured = (async () => {
      await db`
        CREATE TABLE IF NOT EXISTS guardians (
          id BIGSERIAL PRIMARY KEY,
          email TEXT NOT NULL,
          name TEXT,
          phone TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `
      await db`CREATE UNIQUE INDEX IF NOT EXISTS idx_guardians_email ON guardians (LOWER(email))`
      await db`
        CREATE TABLE IF NOT EXISTS students (
          id BIGSERIAL PRIMARY KEY,
          guardian_id BIGINT NOT NULL REFERENCES guardians(id),
          name TEXT NOT NULL,
          age TEXT,
          instrument TEXT,
          first_no_show_forgiven_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `
      await db`CREATE UNIQUE INDEX IF NOT EXISTS idx_students_guardian_name ON students (guardian_id, LOWER(name))`
      await db`
        CREATE TABLE IF NOT EXISTS purchases (
          id BIGSERIAL PRIMARY KEY,
          guardian_id BIGINT NOT NULL REFERENCES guardians(id),
          student_id BIGINT NOT NULL REFERENCES students(id),
          source TEXT NOT NULL DEFAULT 'stripe',
          lesson_request_id BIGINT,
          stripe_session_id TEXT,
          stripe_payment_id TEXT,
          package_id TEXT,
          package_name TEXT,
          minutes INTEGER NOT NULL,
          lessons_total INTEGER NOT NULL,
          lessons_used INTEGER NOT NULL DEFAULT 0,
          amount_cents INTEGER,
          status TEXT NOT NULL DEFAULT 'paid',
          paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          expires_at TIMESTAMPTZ NOT NULL,
          refunded_at TIMESTAMPTZ,
          note TEXT,
          created_by TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          CHECK (lessons_used >= 0 AND lessons_used <= lessons_total)
        )
      `
      await db`CREATE UNIQUE INDEX IF NOT EXISTS idx_purchases_stripe_session ON purchases (stripe_session_id) WHERE stripe_session_id IS NOT NULL`
      await db`CREATE INDEX IF NOT EXISTS idx_purchases_student ON purchases (student_id, expires_at)`
      await db`CREATE INDEX IF NOT EXISTS idx_purchases_payment ON purchases (stripe_payment_id)`
      await db`
        CREATE TABLE IF NOT EXISTS lessons (
          id BIGSERIAL PRIMARY KEY,
          student_id BIGINT NOT NULL REFERENCES students(id),
          purchase_id BIGINT REFERENCES purchases(id),
          minutes INTEGER NOT NULL,
          lesson_date DATE NOT NULL,
          status TEXT NOT NULL,
          credit_restored_at TIMESTAMPTZ,
          note TEXT,
          recorded_by TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `
      await db`CREATE INDEX IF NOT EXISTS idx_lessons_student ON lessons (student_id, lesson_date DESC)`
      await db`
        CREATE TABLE IF NOT EXISTS credit_ledger (
          id BIGSERIAL PRIMARY KEY,
          student_id BIGINT NOT NULL REFERENCES students(id),
          purchase_id BIGINT REFERENCES purchases(id),
          lesson_id BIGINT REFERENCES lessons(id),
          delta INTEGER NOT NULL,
          reason TEXT NOT NULL,
          note TEXT,
          created_by TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `
      await db`CREATE INDEX IF NOT EXISTS idx_credit_ledger_student ON credit_ledger (student_id, created_at DESC)`
    })().catch((error) => {
      ensured = null // retry on next call
      throw error
    })
  }
  return ensured
}
