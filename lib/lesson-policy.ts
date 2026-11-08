/**
 * Lesson credit rules (Phase 2), in one place for code and website text.
 *
 * - A monthly package gives 4 credits; a single lesson gives 1. A credit is
 *   for one lesson of the purchased length (30 or 60 minutes).
 * - Credits must be used within 3 months of purchase, then they expire.
 * - A no-show uses a credit, except the first no-show per student, which is
 *   forgiven once.
 * - Admins can make exceptions (give a credit back, extend an expiry, add
 *   credits). Every change needs a note and is recorded.
 */

export const CREDIT_VALID_MONTHS = 3

export const POLICY_SHORT =
  'Lesson credits are valid for 3 months from purchase. A missed lesson without notice uses a credit — we forgive the first one per student.'

export const POLICY_LINES = [
  'Book and use your lessons within 3 months of purchase — unused lessons expire after that.',
  'If you book a time and don’t show up, that lesson is used. We forgive the first one per student, because emergencies happen.',
  'Questions or special circumstances? Call us at (702) 788-7369.',
] as const

/** Expiry date for credits bought at `paidAt` (same day, 3 months later). */
export function creditExpiry(paidAt: Date): Date {
  const d = new Date(paidAt.getTime())
  d.setUTCMonth(d.getUTCMonth() + CREDIT_VALID_MONTHS)
  return d
}
