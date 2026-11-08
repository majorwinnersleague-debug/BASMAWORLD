/**
 * Online booking rules (Phase 3). One place to change them.
 * All times are America/Los_Angeles (Pacific).
 */

export const TIMEZONE = 'America/Los_Angeles'

/** Parents can book up to this many days ahead. */
export const BOOKING_WINDOW_DAYS = 56

/** Earliest a slot can be booked: this many hours from now. */
export const MIN_NOTICE_HOURS = 12

/** Parents can cancel online (credit returned) up to this many hours before. */
export const CANCEL_CUTOFF_HOURS = 24

/** Lesson start times fall on this grid (minutes past the hour). */
export const LESSON_SLOT_STEP_MINUTES = 30
export const TRIAL_SLOT_STEP_MINUTES = 15
export const TRIAL_MINUTES = 15

export const STUDIO_LOCATION = 'BASMA studio inside Synergy Dance, 9512 W Flamingo Rd, Ste 100, Las Vegas, NV 89147'

export const BOOKING_POLICY_LINES = [
  `Book up to ${BOOKING_WINDOW_DAYS / 7} weeks ahead, at least ${MIN_NOTICE_HOURS} hours before the lesson.`,
  `Need to change? Cancel online up to ${CANCEL_CUTOFF_HOURS} hours before and your lesson credit comes back. Later than that, call (702) 788-7369.`,
  'Booking a time uses one lesson credit. A no-show uses the credit — we forgive the first one per student.',
] as const
