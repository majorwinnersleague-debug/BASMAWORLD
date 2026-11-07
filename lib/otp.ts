import { createHmac, randomInt, timingSafeEqual } from 'crypto'
import { sql } from './db'
import { getJwtSecretKey } from './auth'
import { ensurePhase0Tables } from './phase0-schema'

/**
 * One-time login codes stored in Neon (table auth_codes).
 * - Works across serverless instances (the old in-memory Map did not).
 * - Only an HMAC of the code is stored.
 * - Each code expires after 10 minutes, allows 5 guesses, and is single-use.
 * - Issuing a new code invalidates any older unused code for that email.
 */

export type OtpPurpose = 'parent' | 'staff'

const CODE_TTL_MINUTES = 10
const MAX_ATTEMPTS = 5
const MAX_CODES_PER_WINDOW = 5
const WINDOW_MINUTES = 15

export class OtpRateLimitError extends Error {
  constructor() {
    super('Too many codes requested')
    this.name = 'OtpRateLimitError'
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function hashCode(purpose: OtpPurpose, email: string, code: string): string {
  return createHmac('sha256', getJwtSecretKey())
    .update(`${purpose}:${email}:${code}`)
    .digest('hex')
}

function requireDb() {
  if (!sql) throw new Error('DATABASE_URL is not configured')
  return sql
}

/** Creates and stores a new 6-digit code. Returns the plain code for emailing. */
export async function issueLoginCode(rawEmail: string, purpose: OtpPurpose): Promise<string> {
  const db = requireDb()
  await ensurePhase0Tables()
  const email = normalizeEmail(rawEmail)

  const [{ count }] = await db`
    SELECT COUNT(*)::int AS count FROM auth_codes
    WHERE email = ${email} AND purpose = ${purpose}
      AND created_at > NOW() - make_interval(mins => ${WINDOW_MINUTES}::int)
  `
  if (Number(count) >= MAX_CODES_PER_WINDOW) throw new OtpRateLimitError()

  const code = String(randomInt(0, 1_000_000)).padStart(6, '0')
  const codeHash = hashCode(purpose, email, code)

  // Invalidate older unused codes, then store the new one.
  await db`
    UPDATE auth_codes SET consumed_at = NOW()
    WHERE email = ${email} AND purpose = ${purpose} AND consumed_at IS NULL
  `
  await db`
    INSERT INTO auth_codes (email, purpose, code_hash, expires_at)
    VALUES (${email}, ${purpose}, ${codeHash},
            NOW() + make_interval(mins => ${CODE_TTL_MINUTES}::int))
  `
  return code
}

/** Returns true exactly once for a correct, unexpired code. */
export async function verifyLoginCode(rawEmail: string, purpose: OtpPurpose, rawCode: string): Promise<boolean> {
  const db = requireDb()
  await ensurePhase0Tables()
  const email = normalizeEmail(rawEmail)
  const code = String(rawCode || '').replace(/\D/g, '')
  if (code.length !== 6) return false

  // Count this guess atomically against the latest live code.
  const rows = await db`
    UPDATE auth_codes SET attempts = attempts + 1
    WHERE id = (
      SELECT id FROM auth_codes
      WHERE email = ${email} AND purpose = ${purpose}
        AND consumed_at IS NULL AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    )
    RETURNING id, code_hash, attempts
  `
  const row = rows[0]
  if (!row) return false

  if (Number(row.attempts) > MAX_ATTEMPTS) {
    await db`UPDATE auth_codes SET consumed_at = NOW() WHERE id = ${row.id}`
    return false
  }

  const expected = Buffer.from(String(row.code_hash), 'hex')
  const actual = Buffer.from(hashCode(purpose, email, code), 'hex')
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return false

  // Single use: only one concurrent request can consume it.
  const consumed = await db`
    UPDATE auth_codes SET consumed_at = NOW()
    WHERE id = ${row.id} AND consumed_at IS NULL
    RETURNING id
  `
  return consumed.length === 1
}
