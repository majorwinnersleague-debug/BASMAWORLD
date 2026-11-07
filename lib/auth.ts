import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/* ─────────────────────────────────────────────────────────────────────────────
   Secrets — fail closed.
   There is deliberately NO fallback value. If JWT_SECRET is missing or weak,
   every session operation throws and the calling route returns an error,
   instead of silently signing tokens with a string that lives in the repo.
   ───────────────────────────────────────────────────────────────────────────── */

const MIN_SECRET_LENGTH = 32

export class MissingSecretError extends Error {
  constructor(name: string) {
    super(`${name} is not configured (must be set and at least ${MIN_SECRET_LENGTH} characters)`)
    this.name = 'MissingSecretError'
  }
}

export function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    throw new MissingSecretError('JWT_SECRET')
  }
  return new TextEncoder().encode(secret)
}

/* ─────────────────────────────────────────────────────────────────────────────
   Parent session (parent portal, /portal)
   ───────────────────────────────────────────────────────────────────────────── */

const PARENT_COOKIE = 'basma_session'
const PARENT_MAX_AGE = 60 * 60 * 24 * 30 // 30 days
const PARENT_AUDIENCE = 'basma:parent'

export interface SessionUser {
  id: string        // Airtable record ID
  email: string
  phone: string
  parentName: string
  role: 'parent'
}

/* ── Create a parent JWT and set it as an HTTP-only cookie ── */
export async function createSession(user: SessionUser): Promise<string> {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    phone: user.phone,
    parentName: user.parentName,
    role: 'parent',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setAudience(PARENT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getJwtSecretKey())

  const cookieStore = await cookies()
  cookieStore.set(PARENT_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: PARENT_MAX_AGE,
    path: '/',
  })

  return token
}

/* ── Read the parent session from cookies ── */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(PARENT_COOKIE)?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey(), {
      algorithms: ['HS256'],
      audience: PARENT_AUDIENCE,
    })
    if (payload.role !== 'parent') return null
    return {
      id: payload.id as string,
      email: payload.email as string,
      phone: payload.phone as string,
      parentName: payload.parentName as string,
      role: 'parent',
    }
  } catch {
    // Invalid/expired token, or JWT_SECRET missing → treat as logged out.
    return null
  }
}

/* ── Clear the parent session cookie ── */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(PARENT_COOKIE)
}

/* ─────────────────────────────────────────────────────────────────────────────
   Staff session (teacher portal, /teacher and /teacher/database)
   Separate cookie, separate audience, short lifetime. A parent token can never
   be accepted as a staff token and vice versa.
   ───────────────────────────────────────────────────────────────────────────── */

const STAFF_COOKIE = 'basma_staff_session'
const STAFF_MAX_AGE = 60 * 60 * 12 // 12 hours
const STAFF_AUDIENCE = 'basma:staff'

export type StaffRole = 'admin' | 'teacher'

export interface StaffUser {
  email: string
  role: StaffRole
}

// Staff allow-list. ADMIN_EMAILS / TEACHER_EMAILS (comma-separated) override
// these defaults. Emails are not secrets — possession of the inbox (OTP) is
// what proves identity.
const DEFAULT_ADMIN_EMAILS = [
  'becomeasingermusicacademy@gmail.com',
  'majorwinnersleague@gmail.com',
]

function parseEmailList(value: string | undefined): string[] {
  return (value || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.includes('@'))
}

export function getStaffRole(email: string): StaffRole | null {
  const normalized = email.trim().toLowerCase()
  if (!normalized) return null
  const admins = process.env.ADMIN_EMAILS ? parseEmailList(process.env.ADMIN_EMAILS) : DEFAULT_ADMIN_EMAILS
  if (admins.includes(normalized)) return 'admin'
  if (parseEmailList(process.env.TEACHER_EMAILS).includes(normalized)) return 'teacher'
  return null
}

export async function createStaffSession(user: StaffUser): Promise<void> {
  const token = await new SignJWT({ email: user.email, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setAudience(STAFF_AUDIENCE)
    .setSubject(user.email)
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(getJwtSecretKey())

  const cookieStore = await cookies()
  cookieStore.set(STAFF_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: STAFF_MAX_AGE,
    path: '/',
  })
}

/**
 * Returns the signed-in staff member, or null.
 * The role is re-checked against the current allow-list on every request, so
 * removing someone from ADMIN_EMAILS / TEACHER_EMAILS revokes access at once.
 */
export async function getStaffSession(): Promise<StaffUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(STAFF_COOKIE)?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey(), {
      algorithms: ['HS256'],
      audience: STAFF_AUDIENCE,
    })
    const email = String(payload.email || '')
    const role = getStaffRole(email)
    if (!role) return null
    return { email, role }
  } catch {
    return null
  }
}

export async function clearStaffSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(STAFF_COOKIE)
}

/** Standard 401 for staff-only endpoints. */
export function staffUnauthorized(): NextResponse {
  return NextResponse.json({ error: 'Staff sign-in required' }, { status: 401 })
}
