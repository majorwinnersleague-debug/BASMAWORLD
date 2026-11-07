-- Phase 0 — security & Stripe delivery
-- Safe to run more than once. Run in the Neon SQL editor against DATABASE_URL.
-- (The app also creates these lazily via lib/phase0-schema.ts as a safety net.)

-- One-time login codes for parents and staff.
-- Only an HMAC of the code is stored, never the code itself.
CREATE TABLE IF NOT EXISTS auth_codes (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,              -- lower-cased
  purpose TEXT NOT NULL,            -- 'parent' | 'staff'
  code_hash TEXT NOT NULL,          -- HMAC-SHA256(JWT_SECRET, purpose:email:code)
  attempts INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auth_codes_lookup
  ON auth_codes (email, purpose, created_at DESC);

-- Stripe webhook idempotency log. One row per Stripe event id.
CREATE TABLE IF NOT EXISTS stripe_events (
  event_id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  endpoint TEXT NOT NULL,           -- 'academy' | 'social'
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,         -- NULL until handled successfully
  attempts INTEGER NOT NULL DEFAULT 1,
  last_error TEXT
);

-- Optional housekeeping (run occasionally; not required):
-- DELETE FROM auth_codes WHERE created_at < NOW() - INTERVAL '7 days';
