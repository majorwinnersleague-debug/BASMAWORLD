-- Phase 2 — guardian accounts, students, lesson credits
-- Safe to run more than once. Creates new tables only; existing tables
-- (lesson_requests, active_students, auth_codes, stripe_events) are untouched.
-- (The app also creates these lazily via lib/phase2-schema.ts.)

CREATE TABLE IF NOT EXISTS guardians (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,                 -- stored lower-cased
  name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_guardians_email ON guardians (LOWER(email));

CREATE TABLE IF NOT EXISTS students (
  id BIGSERIAL PRIMARY KEY,
  guardian_id BIGINT NOT NULL REFERENCES guardians(id),
  name TEXT NOT NULL,
  age TEXT,
  instrument TEXT,
  first_no_show_forgiven_at TIMESTAMPTZ,  -- set when the one forgiven no-show is used
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_students_guardian_name ON students (guardian_id, LOWER(name));

-- One row per purchase = one "credit lot" of a single lesson length.
CREATE TABLE IF NOT EXISTS purchases (
  id BIGSERIAL PRIMARY KEY,
  guardian_id BIGINT NOT NULL REFERENCES guardians(id),
  student_id BIGINT NOT NULL REFERENCES students(id),
  source TEXT NOT NULL DEFAULT 'stripe',   -- 'stripe' | 'manual'
  lesson_request_id BIGINT,
  stripe_session_id TEXT,
  stripe_payment_id TEXT,
  package_id TEXT,
  package_name TEXT,
  minutes INTEGER NOT NULL,                -- 30 | 60
  lessons_total INTEGER NOT NULL,
  lessons_used INTEGER NOT NULL DEFAULT 0,
  amount_cents INTEGER,
  status TEXT NOT NULL DEFAULT 'paid',     -- 'paid' | 'refunded'
  paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,         -- 3 months after paid_at unless changed by an admin
  refunded_at TIMESTAMPTZ,
  note TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (lessons_used >= 0 AND lessons_used <= lessons_total)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_purchases_stripe_session ON purchases (stripe_session_id) WHERE stripe_session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_purchases_student ON purchases (student_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_purchases_payment ON purchases (stripe_payment_id);

CREATE TABLE IF NOT EXISTS lessons (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES students(id),
  purchase_id BIGINT REFERENCES purchases(id),  -- NULL when no credit was used (forgiven no-show)
  minutes INTEGER NOT NULL,
  lesson_date DATE NOT NULL,
  status TEXT NOT NULL,                    -- 'attended' | 'no_show' | 'no_show_forgiven'
  credit_restored_at TIMESTAMPTZ,          -- set when an admin gives the credit back
  note TEXT,
  recorded_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_lessons_student ON lessons (student_id, lesson_date DESC);

-- Audit trail: every credit change, who made it and why.
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
);
CREATE INDEX IF NOT EXISTS idx_credit_ledger_student ON credit_ledger (student_id, created_at DESC);
