import { NextResponse } from "next/server"

// Legacy campaign endpoint intentionally disabled.
// Private-lesson reminders are now handled by /api/cron/reminders.
// This prevents the retired registration-completion campaign from sending old emails.
export async function POST() {
  return NextResponse.json({ error: "Legacy campaign disabled. Use the private-lesson reminder system." }, { status: 410 })
}
