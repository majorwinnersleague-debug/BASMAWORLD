-- Phase 3 — online booking (teaching hours, days off, bookings)
-- Safe to run more than once. Creates new tables only.
-- (The app also creates these lazily via lib/phase3-schema.ts.)

CREATE TABLE IF NOT EXISTS availability_rules (
  id BIGSERIAL PRIMARY KEY,
  weekday SMALLINT NOT NULL CHECK (weekday BETWEEN 0 AND 6),   -- 0 = Sunday
  start_time TEXT NOT NULL,                                     -- 'HH:MM' Pacific
  end_time TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,                         -- switched off, never deleted
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (start_time ~ '^[0-2][0-9]:[0-5][0-9]$' AND end_time ~ '^[0-2][0-9]:[0-5][0-9]$' AND start_time < end_time)
);

CREATE TABLE IF NOT EXISTS availability_blocks (
  id BIGSERIAL PRIMARY KEY,
  block_date DATE NOT NULL,                                     -- a day off (Pacific)
  reason TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES students(id),
  purchase_id BIGINT REFERENCES purchases(id),                  -- credit lot reserved (NULL for free trials)
  lesson_id BIGINT REFERENCES lessons(id),                      -- set when marked attended / no-show
  kind TEXT NOT NULL,                                           -- 'lesson' | 'trial'
  minutes INTEGER NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'booked',                        -- booked | completed | no_show | no_show_forgiven | cancelled
  note TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ,
  cancel_reason TEXT,
  CHECK (ends_at > starts_at),
  -- No two active bookings may overlap (one teacher, one room).
  CONSTRAINT bookings_no_overlap EXCLUDE USING gist (tstzrange(starts_at, ends_at) WITH &&)
    WHERE (status <> 'cancelled')
);
CREATE INDEX IF NOT EXISTS idx_bookings_starts ON bookings (starts_at);
CREATE INDEX IF NOT EXISTS idx_bookings_student ON bookings (student_id, starts_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_one_trial ON bookings (student_id) WHERE kind = 'trial' AND status <> 'cancelled';
