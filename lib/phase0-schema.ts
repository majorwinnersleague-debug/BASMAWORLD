import { sql } from './db'

/**
 * Phase 0 tables (login codes + Stripe event log).
 *
 * The canonical migration is db/migrations/001_phase0_security.sql — run it in
 * the Neon console. This helper runs the same idempotent CREATE ... IF NOT
 * EXISTS statements once per server instance as a safety net, so login and
 * the Stripe webhook don't break if the migration hasn't been applied yet.
 */
let ensured: Promise<void> | null = null

export function ensurePhase0Tables(): Promise<void> {
  if (!sql) return Promise.reject(new Error('DATABASE_URL is not configured'))
  const db = sql
  if (!ensured) {
    ensured = (async () => {
      await db`
        CREATE TABLE IF NOT EXISTS auth_codes (
          id BIGSERIAL PRIMARY KEY,
          email TEXT NOT NULL,
          purpose TEXT NOT NULL,
          code_hash TEXT NOT NULL,
          attempts INTEGER NOT NULL DEFAULT 0,
          expires_at TIMESTAMPTZ NOT NULL,
          consumed_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `
      await db`
        CREATE INDEX IF NOT EXISTS idx_auth_codes_lookup
          ON auth_codes (email, purpose, created_at DESC)
      `
      await db`
        CREATE TABLE IF NOT EXISTS stripe_events (
          event_id TEXT PRIMARY KEY,
          type TEXT NOT NULL,
          endpoint TEXT NOT NULL,
          received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          processed_at TIMESTAMPTZ,
          attempts INTEGER NOT NULL DEFAULT 1,
          last_error TEXT
        )
      `
    })().catch((error) => {
      ensured = null // retry on next call
      throw error
    })
  }
  return ensured
}
