/**
 * Private-lesson pricing: the single source of truth (Phase 1).
 *
 * Used by the private-lessons page, the Stripe checkout route, the Stripe
 * webhook and every page or email that shows a price. Checkout always
 * re-prices on the server with this module; prices sent by a browser are
 * never trusted.
 *
 * All amounts are whole US dollars.
 */

export type PackageId =
  | 'individual-30min'
  | 'individual-60min'
  | 'monthly-4x30min'
  | 'monthly-4x60min'

export interface LessonPackage {
  id: PackageId
  name: string
  shortName: string
  duration: '30 min' | '1 hour'
  minutes: 30 | 60
  sessions: 1 | 4
  desc: string
  popular: boolean
}

export const PACKAGES: readonly LessonPackage[] = [
  {
    id: 'individual-30min',
    name: 'Individual 30-Minute Lesson',
    shortName: '30-Minute Individual Lesson',
    duration: '30 min',
    minutes: 30,
    sessions: 1,
    desc: 'A single personalized 30-minute private lesson.',
    popular: false,
  },
  {
    id: 'individual-60min',
    name: 'Individual 60-Minute Lesson',
    shortName: '60-Minute Individual Lesson',
    duration: '1 hour',
    minutes: 60,
    sessions: 1,
    desc: 'A single personalized 60-minute private lesson.',
    popular: false,
  },
  {
    id: 'monthly-4x30min',
    name: 'Monthly 4 × 30-Minute Lessons',
    shortName: '4 × 30-Minute Monthly Package',
    duration: '30 min',
    minutes: 30,
    sessions: 4,
    desc: 'Four 30-minute private lessons paid in advance each month.',
    popular: true,
  },
  {
    id: 'monthly-4x60min',
    name: 'Monthly 4 × 60-Minute Lessons',
    shortName: '4 × 60-Minute Monthly Package',
    duration: '1 hour',
    minutes: 60,
    sessions: 4,
    desc: 'Four 60-minute private lessons paid in advance each month.',
    popular: false,
  },
]

/** Regular public prices. */
export const STANDARD_PRICES: Readonly<Record<PackageId, number>> = {
  'individual-30min': 45,
  'individual-60min': 70,
  'monthly-4x30min': 160,
  'monthly-4x60min': 260,
}

/**
 * Synergy rates. Synergy families register through Synergy for these; the
 * website never offers them. They are recorded here so every BASMA price
 * lives in one place. (During the holiday special everyone, including
 * Synergy families, gets the special monthly price.)
 */
export const SYNERGY_PRICES: Readonly<Record<PackageId, number>> = {
  'individual-30min': 35,
  'individual-60min': 65,
  'monthly-4x30min': 140,
  'monthly-4x60min': 240,
}

/**
 * Holiday special for monthly packages, for everyone, November–December 2026.
 * Ends at midnight Pacific time on January 1, 2027 (= 08:00 UTC).
 */
export const HOLIDAY_SPECIAL = {
  label: 'Holiday special',
  endsLabel: 'through December 31',
  endsAt: Date.UTC(2027, 0, 1, 8, 0, 0),
  prices: {
    'monthly-4x30min': 120,
    'monthly-4x60min': 200,
  } as Readonly<Partial<Record<PackageId, number>>>,
}

/** Minimum allowed price per lesson. A price below this is refused. */
export const FLOOR_PER_LESSON: Readonly<Record<30 | 60, number>> = { 30: 30, 60: 50 }

export function getPackage(id: unknown): LessonPackage | undefined {
  return typeof id === 'string' ? PACKAGES.find((p) => p.id === id) : undefined
}

export function isHolidaySpecialActive(now: Date = new Date()): boolean {
  return now.getTime() < HOLIDAY_SPECIAL.endsAt
}

export class PriceBelowFloorError extends Error {
  constructor(id: PackageId, total: number) {
    super(`Price for ${id} ($${total}) is below the minimum allowed per lesson`)
    this.name = 'PriceBelowFloorError'
  }
}

/** Throws if a total for this package works out below the per-lesson floor. */
export function assertAboveFloor(pkg: LessonPackage, total: number): void {
  if (!Number.isFinite(total) || total / pkg.sessions < FLOOR_PER_LESSON[pkg.minutes]) {
    throw new PriceBelowFloorError(pkg.id, total)
  }
}

/** The public price a family pays right now (holiday special applied when active). */
export function getPrice(id: PackageId, now: Date = new Date()): number {
  const pkg = getPackage(id)
  if (!pkg) throw new Error(`Unknown package: ${id}`)
  const special = isHolidaySpecialActive(now) ? HOLIDAY_SPECIAL.prices[id] : undefined
  const total = special ?? STANDARD_PRICES[id]
  assertAboveFloor(pkg, total)
  return total
}

/** True when the current price is lower than the regular price. */
export function isDiscounted(id: PackageId, now: Date = new Date()): boolean {
  return getPrice(id, now) < STANDARD_PRICES[id]
}

/** "$45", "$120", "$33.75" */
export function formatUsd(amount: number): string {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`
}

/** Short price text used across the site, e.g. "$120/month" or "$45". */
export function priceLabel(id: PackageId, now: Date = new Date()): string {
  const pkg = getPackage(id)
  const amount = formatUsd(getPrice(id, now))
  return pkg && pkg.sessions > 1 ? `${amount}/month` : amount
}
