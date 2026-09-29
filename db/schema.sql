-- BASMA active-system database
-- This database is intentionally separate from Airtable.
-- Airtable remains the marketing/history system.

CREATE TABLE IF NOT EXISTS lesson_requests (
  id BIGSERIAL PRIMARY KEY,
  parent_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  student_name TEXT NOT NULL,
  student_age TEXT,
  instrument TEXT,
  preferred_day TEXT,
  preferred_time TEXT,
  notes TEXT,
  package_id TEXT,
  package_name TEXT,
  amount_cents INTEGER,
  status TEXT NOT NULL DEFAULT 'Payment Pending',
  stripe_session_id TEXT UNIQUE,
  stripe_payment_id TEXT,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS active_students (
  id BIGSERIAL PRIMARY KEY,
  student_name TEXT NOT NULL,
  student_age TEXT,
  parent_name TEXT,
  email TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  lesson_type TEXT NOT NULL DEFAULT 'Private',
  instrument TEXT,
  allergies TEXT,
  medical_conditions TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  notes TEXT,
  online_interest BOOLEAN NOT NULL DEFAULT FALSE,
  email_updates BOOLEAN NOT NULL DEFAULT FALSE,
  text_updates BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lesson_requests_email
  ON lesson_requests (LOWER(email));

CREATE INDEX IF NOT EXISTS idx_lesson_requests_status
  ON lesson_requests (status);

CREATE INDEX IF NOT EXISTS idx_active_students_email
  ON active_students (LOWER(email));

CREATE INDEX IF NOT EXISTS idx_active_students_student_name
  ON active_students (LOWER(student_name));
