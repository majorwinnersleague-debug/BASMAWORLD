import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'basma-portal-secret-change-me-in-production'
)

const COOKIE_NAME = 'basma_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export interface SessionUser {
  id: string        // Airtable record ID
  email: string
  phone: string
  parentName: string
  role: 'parent' | 'teacher' | 'admin'
}

/* ── Create a JWT and set it as an HTTP-only cookie ── */
export async function createSession(user: SessionUser): Promise<string> {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    phone: user.phone,
    parentName: user.parentName,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET)

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })

  return token
}

/* ── Read the session from cookies ── */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return {
      id: payload.id as string,
      email: payload.email as string,
      phone: payload.phone as string,
      parentName: payload.parentName as string,
      role: (payload.role as string) as 'parent' | 'teacher' | 'admin',
    }
  } catch {
    return null
  }
}

/* ── Clear the session cookie ── */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

/* ── Generate a 6-digit OTP ── */
export function generateOTP(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

/* ── OTP store (in-memory with expiry — works for single Vercel instance) ── */
const otpStore = new Map<string, { code: string; expires: number; attempts: number }>()

export function storeOTP(email: string, code: string): void {
  // Clean expired entries
  const now = Date.now()
  otpStore.forEach((val, key) => {
    if (val.expires < now) otpStore.delete(key)
  })
  otpStore.set(email.toLowerCase().trim(), {
    code,
    expires: now + 10 * 60 * 1000, // 10 min
    attempts: 0,
  })
}

export function verifyOTP(email: string, code: string): boolean {
  const key = email.toLowerCase().trim()
  const entry = otpStore.get(key)
  if (!entry) return false
  if (entry.expires < Date.now()) {
    otpStore.delete(key)
    return false
  }
  if (entry.attempts >= 5) {
    otpStore.delete(key)
    return false
  }
  entry.attempts++
  if (entry.code === code) {
    otpStore.delete(key)
    return true
  }
  return false
}
