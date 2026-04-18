/**
 * Simple in-memory IP-based rate limiter.
 * Uses a sliding window approach — no external dependencies required.
 * 
 * On serverless (Vercel), each function instance has its own memory,
 * so this provides per-instance limiting (good enough for abuse prevention).
 * For production-scale rate limiting, upgrade to @upstash/ratelimit + Redis.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

/**
 * Check if a request from `key` (usually IP) should be rate limited.
 * @param key      Identifier (IP address or API key)
 * @param limit    Max requests allowed in the window
 * @param windowMs Window size in milliseconds
 * @returns { allowed: boolean, remaining: number, resetAt: number }
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    // New window — start fresh
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs }
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt }
}

/**
 * Get client IP from Next.js request headers.
 * Handles Vercel's x-forwarded-for correctly.
 */
export function getClientIp(req: { headers: { get: (key: string) => string | null } }): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

/**
 * Validate email format (RFC 5322 simplified)
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

/**
 * Sanitize a string — strip HTML tags and limit length
 */
export function sanitizeString(value: string, maxLength = 500): string {
  return value
    .replace(/<[^>]*>/g, '') // strip HTML
    .replace(/[<>'"]/g, '')  // strip dangerous chars
    .trim()
    .slice(0, maxLength)
}
