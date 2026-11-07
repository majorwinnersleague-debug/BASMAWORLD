import { NextResponse } from 'next/server'

/**
 * RETIRED in Phase 0.
 * This was the old "free 20-minute private lesson" request/approval endpoint.
 * No page calls it any more, and its PATCH let anyone approve/deny requests and
 * trigger emails to families. Paid lessons go through
 * /api/stripe/private-lesson-checkout; a new free-trial flow is planned for
 * Phase 1. The previous implementation is in git history.
 */
function gone() {
  return NextResponse.json({ error: 'This endpoint has been retired.' }, { status: 410 })
}

export const GET = gone
export const POST = gone
export const PATCH = gone
