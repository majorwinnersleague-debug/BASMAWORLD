import { NextResponse } from 'next/server'

/**
 * RETIRED in Phase 0.
 * This served the June 22–25, 2026 summer-camp attendance confirmation page.
 * Its GET returned a family's parent name, phone and children for any email,
 * with no authentication. The /confirm page now redirects to / (next.config.js).
 * The previous implementation is in git history if it is ever needed again.
 */
function gone() {
  return NextResponse.json({ error: 'This endpoint has been retired.' }, { status: 410 })
}

export const GET = gone
export const POST = gone
