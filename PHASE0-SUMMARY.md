# Phase 0 — Lock down data & fix Stripe delivery

Branch: `phase-0-security`, 6 commits on top of `f7b16fe`. Nothing was pushed, merged or deployed, and no `vercel` command was run.

**Checks run:**
- `tsc --noEmit`: passes.
- `next build`: passes.
- I searched the build output for the old teacher code, `teacherCode`, the old auth route and the fallback JWT string. None were found.
- **Lint was not run.** ESLint isn't set up in this repo. `next lint` only opens an interactive wizard, and that wizard would add packages and a config file, so I left it alone.
- Nothing was run against real data. There are no real `.env` files locally, only `.env.example`.

**Git identity:** this machine has no git user configured. I made each commit with `git -c user.name="majorwinnersleague-debug" -c user.email="majorwinnersleague@gmail.com"`. That matches the author of the existing commits. Your git config was not changed.

---

## ⚠️ Read before deploying

1. **Do the Resend step first.** Login is now code-only for both parents and staff. If the code email can't be sent, nobody gets in. Until `basmaworld.com` is verified in Resend and `EMAIL_FROM` is set, mail goes from `onboarding@resend.dev`. That sender can only deliver to the Resend account owner, so most parents and possibly one of the two staff emails won't get codes.
2. **`JWT_SECRET` must be at least 32 characters.** If it is missing or shorter, parent and staff login fail with an error. Before this change the app quietly signed sessions with a string that is committed in the repo.
3. **Everyone gets logged out once.** Parent sessions now carry an audience claim, so older cookies are rejected. That includes any session created by the old "direct login" bypass.
4. **Run the Neon migration before deploying** (step N1 below). The app creates the tables itself if they're missing, but only if the database role is allowed to create tables.
5. **`DATABASE_URL` is now required for login and the academy webhook.** If Neon is down, the webhook returns 500 and Stripe retries. Before, it returned 200 and the payment was lost.

---

## What changed, file by file

### New files
| File | What it does |
|---|---|
| `lib/auth.ts` *(rewritten)* | `JWT_SECRET` is required, with no fallback and a minimum of 32 characters. Parent session: cookie `basma_session`, audience `basma:parent`, 30 days. New **staff session**: separate cookie `basma_staff_session`, audience `basma:staff`, 12 hours, `SameSite=Strict`. `getStaffRole()` reads `ADMIN_EMAILS` / `TEACHER_EMAILS` (comma-separated). If `ADMIN_EMAILS` is unset it defaults to `becomeasingermusicacademy@gmail.com` and `majorwinnersleague@gmail.com` as admins. The role is re-checked against the list on every request, so removing an email revokes access at once. Also adds `getStaffSession()` and `staffUnauthorized()`. The old in-memory OTP code is gone. |
| `lib/otp.ts` | Login codes stored in Neon `auth_codes`. Only an HMAC-SHA256 of each code is kept (keyed with `JWT_SECRET`). Codes expire after 10 minutes, are single-use, and allow 5 guesses. A new code cancels older ones. Each email can request at most 5 codes per 15 minutes. Codes are compared in constant time. This works across serverless instances, which the old in-memory store did not. |
| `lib/phase0-schema.ts` | Creates `auth_codes` and `stripe_events` with `CREATE TABLE IF NOT EXISTS`, once per server instance. This is a safety net in case the migration wasn't run. |
| `db/migrations/001_phase0_security.sql` | The migration to run in Neon (`auth_codes`, `stripe_events`). Safe to run more than once. |
| `lib/escape.ts` | `airtableString()` makes untrusted text safe inside an Airtable formula. `escapeHtml()` makes it safe inside email HTML. |
| `lib/parent-lookup.ts` | One shared `findParent(email, phone)` with escaped formulas. It replaces two copies that were open to formula injection. |
| `lib/auth-email.ts` | Resend sender that uses `EMAIL_FROM` (falls back to Resend's sandbox sender), plus the login-code email template. |
| `lib/stripe-webhook.ts` | Signature check for each webhook endpoint. Academy uses `STRIPE_WEBHOOK_SECRET_ACADEMY`, social uses `STRIPE_WEBHOOK_SECRET_SOCIAL`. The old shared `STRIPE_WEBHOOK_SECRET` is also tried during the switch-over. |
| `app/api/staff/login/route.ts` | Staff email in, 6-digit code emailed out. The reply is identical whether or not the email is staff, so the staff list can't be probed. Rate-limited. |
| `app/api/staff/verify/route.ts` | Email + code in, signed 12-hour staff cookie out. |
| `app/api/staff/me/route.ts` | Returns the signed-in staff member, or 401. |
| `app/api/staff/logout/route.ts` | Clears the staff cookie. |
| `PHASE0-SUMMARY.md` | This file. |

### Parent login
| File | Change |
|---|---|
| `app/api/auth/login/route.ts` | **Removed the "direct session" fallback**: if the code email fails, it now returns 503 and logs nobody in. Codes are stored in Neon. Lookup uses the shared escaped `findParent`. |
| `app/api/auth/verify/route.ts` | Checks the code against Neon and uses the escaped lookup. |
| `app/portal/PortalContent.tsx` | Removed the `directLogin` branch. Login always goes to the code screen. |

### Endpoints that now require a signed staff session (PLAN.md §6)
| File | Change |
|---|---|
| `app/api/registrations/route.ts` | All of GET is staff-only. The old public "name + phone" family lookup and its alert emails were removed; no page used them. The teacher-code check and the leaking `detail` field in errors are gone. |
| `app/api/dashboard/route.ts` | Staff session instead of `?teacherCode=`. |
| `app/api/checkin/route.ts` | POST and DELETE require a staff session. Airtable formulas and the check-in email HTML are escaped. The sender uses `EMAIL_FROM`. |
| `app/api/calendar/route.ts` | POST and DELETE require a staff session (POST emails every family). GET stays public because the homepage shows closures from it. |
| `app/api/teacher-chat/route.ts` | Staff session required (it spends OpenRouter credit). |
| `app/api/teacher-database/route.ts` | Signed staff session replaces the forgeable `basma_teacher_database=authenticated` cookie. |
| `app/api/teacher-database-auth/route.ts` | **Deleted.** This set the forgeable cookie when given the shared code. |
| `app/api/family/route.ts` | **Every method** (GET, POST, PATCH, DELETE) is staff-only. The public `/family` page already redirects away. PATCH and DELETE check the record ID format. Formulas are escaped. |
| `app/api/lead/route.ts` | GET (all fields, including medical) and PATCH are staff-only. POST stays public because it is the marketing form, but its Airtable lookups are now escaped. |
| `app/api/contacts/block/route.ts` | Was completely open. GET, POST and DELETE now require a staff session. |
| `app/api/resend-domain/route.ts` | Was protected by the literal teacher code. Now requires an **admin** staff session. |

### Retired endpoints for redirected pages
| File | Change |
|---|---|
| `app/api/confirm/route.ts` | Returns **410 Gone**. It served the June 2026 camp confirmation, and its GET leaked parent name, phone and children for any email. |
| `app/api/private-lesson/route.ts` | Returns **410 Gone**. This was the old free-20-minute-trial flow; its PATCH let anyone approve or deny requests and email families. No page called it. |
| `next.config.js` | `/confirm` now redirects to `/` (temporary redirect). |

### Teacher portal UI
| File | Change |
|---|---|
| `app/teacher/TeacherContent.tsx` | The access-code screen is replaced by **email → 6-digit code** login. An existing session is restored through `/api/staff/me`. Added a **Log out** button. Removed the hard-coded code constant and every `teacherCode` field and query parameter. Editing a student no longer asks for the code again. |
| `app/teacher/DatabaseAccessPanel.tsx` | Removed the `teacherCode` prop and query parameter. |

### Marketing cron: paused, not deleted
| File | Change |
|---|---|
| `app/api/cron/reminders/route.ts` | Returns 503 if `CRON_SECRET` is unset (fails closed). Sends **nothing** unless `MARKETING_REMINDERS_ENABLED` is exactly `true`; otherwise it returns `{ paused: true }`. The re-enable steps are written in the file header. |
| `vercel.json` | **Unchanged.** The schedule `0 16 * * 1-5` is still there and still calls the route, which now does nothing. |

**To re-enable the marketing email later:**
1. Recommended first: fix the prices in the email copy (Phase 1), and think about a less frequent schedule in `vercel.json`, e.g. monthly `0 16 1 * *`.
2. In Vercel → Settings → Environment Variables (Production), add `MARKETING_REMINDERS_ENABLED` = `true`.
3. Redeploy. To pause again, remove the variable and redeploy.

### Stripe delivery
| File | Change |
|---|---|
| `app/api/stripe/webhook/route.ts` | Rewritten:<br>- Uses `STRIPE_WEBHOOK_SECRET_ACADEMY`.<br>- Logs every handled event in Neon `stripe_events`. An event already marked processed returns 200 without repeating any side effects.<br>- Returns **500 when the Neon write fails**, so Stripe retries. Also 500 if `DATABASE_URL` is missing.<br>- Also handles `checkout.session.async_payment_succeeded`.<br>- Records the amount Stripe actually charged.<br>- Marks **only the Airtable row for this checkout session** as Paid. Older rows that have no session id fall back to the single newest "Payment Pending" row with the same email and student name.<br>- Sends the **"💰 Paid" admin email after payment**, with HTML escaped.<br>- An unknown `packageId` now logs an error instead of being silently ignored. |
| `app/api/stripe/private-lesson-checkout/route.ts` | Removed the "💰 Purchase" email sent when checkout started (abandoned carts looked like sales). Stores the Stripe session id on the new Airtable row. If that column is missing, it retries without it. **Prices are unchanged** (Phase 1). |
| `app/api/social-media/stripe-webhook/route.ts` | Uses `STRIPE_WEBHOOK_SECRET_SOCIAL`, with the legacy secret as fallback. Nothing else changed. |

### Airtable formula escaping (injection fix)
`app/api/portal/students/route.ts`, `app/api/portal/students/photo/route.ts`, `app/api/portal/students/update/route.ts`, `app/api/portal/payments/route.ts`, `app/api/unsubscribe/route.ts`: all now build formula strings with `airtableString()`.

### Schema
`db/schema.sql`: the two new tables were added to the reference schema.

---

## What you need to do, in this order

### Resend (do this before deploying)
- **R1.** Resend → Domains → add and **verify `basmaworld.com`**: add the DNS records Resend shows and wait for "Verified".
- **R2.** Pick a sender on that domain, e.g. `BASMA Academy <no-reply@basmaworld.com>`. You'll set it as `EMAIL_FROM` in step V1.
- **R3.** Resend → Logs: look for past failed sends to parents from `onboarding@resend.dev`. PLAN.md §1 suspects most parents were logged in without a code because sends failed.

### Neon
- **N1.** Open the Neon SQL editor for the database `DATABASE_URL` points to. Paste and run `db/migrations/001_phase0_security.sql`. It is safe to re-run.

### Vercel (Project → Settings → Environment Variables, **Production** and **Preview**)
- **V1.** Set or check these:
  | Variable | Value |
  |---|---|
  | `JWT_SECRET` | New random value, **at least 32 characters** (e.g. output of `openssl rand -base64 48`). Changing it logs everyone out, which is fine here. |
  | `CRON_SECRET` | New random value. Vercel Cron sends it automatically as `Authorization: Bearer …`. |
  | `EMAIL_FROM` | The sender from R2. |
  | `STRIPE_WEBHOOK_SECRET_ACADEMY` | Signing secret of the academy endpoint (S1). |
  | `STRIPE_WEBHOOK_SECRET_SOCIAL` | Signing secret of the social endpoint (S1). |
  | `ADMIN_EMAILS` | *(optional)* `becomeasingermusicacademy@gmail.com,majorwinnersleague@gmail.com`. That is already the default in code; set it if you want to change the list without a code change. |
  | `TEACHER_EMAILS` | *(optional)* comma-separated emails for non-admin teachers. |
- **V2.** Check that `DATABASE_URL`, `RESEND_API_KEY`, `STRIPE_SECRET_KEY` and `AIRTABLE_PAT` are set. They are not new, but login and the webhook now depend on them.
- **V3.** **Do not** set `MARKETING_REMINDERS_ENABLED`. Leaving it unset keeps the marketing email paused.
- **V4.** **Delete `TEACHER_ACCESS_CODE`.** No code reads it any more. Tell staff the shared code is retired.
- **V5.** After S3 confirms both webhooks work, **delete `STRIPE_WEBHOOK_SECRET`** (the old shared one).

### Stripe (Dashboard → Developers → Webhooks)
- **S1.** Open each endpoint, click "Reveal signing secret", and copy it into the matching Vercel variable:
  - `https://basmaworld.com/api/stripe/webhook` → `STRIPE_WEBHOOK_SECRET_ACADEMY`
  - `https://basmaworld.com/api/social-media/stripe-webhook` → `STRIPE_WEBHOOK_SECRET_SOCIAL`
- **S2.** On the academy endpoint, make sure these events are selected: `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
- **S3.** After deploying, open each endpoint's **event deliveries**:
  - Confirm new deliveries return 2xx.
  - For past `checkout.session.completed` deliveries that failed (e.g. "Invalid signature"), click **Resend**. The webhook is now idempotent, so a payment that was already recorded is not duplicated.
- **S4.** As PLAN.md §3 says, check Settings → Payments / Checkout and the Events log for any account-level restriction. I can't see those from the code.

### Airtable
- **A1.** The "Private Lesson Requests" table should have text fields named **`Stripe Session`**, **`Stripe Payment ID`** and **`Payment Date`**. The old webhook already wrote to them, so they probably exist. If `Stripe Session` is missing, checkout still works, but the webhook can only match rows with the email + student fallback.

### After deploying: quick manual checks
1. `/teacher`: enter a staff email, receive a code, log in. The roster, dashboard, check-ins, closures, chat and Database tab should all load. Log out.
2. `/portal`: log in as a parent with email + phone + code.
3. Optionally, from a logged-out browser, open `/api/registrations?source=all`. It should return 401.
4. In Neon, `SELECT * FROM stripe_events ORDER BY received_at DESC LIMIT 5;` after the next real or resent payment.

---

## Not done in Phase 0
- **Price changes.** Skipped as you asked (Phase 1). The monthly packages are still $135/$200. The paused marketing email copy also still has the old prices.
- Success page server check, `success_url` and `cancel_url` hard-coded to basmaworld.com, refund and dispute handling, a single pricing file: Phases 1–2.
- The per-IP rate limiter is still in memory per instance. The per-email login-code limit is now enforced in Neon across instances.
- The dead client pages `app/family/*` and `app/confirm/*` are still in the repo but unreachable (redirected). Their APIs are locked or retired.
- ESLint is not set up in this repo (see the top).
- I did not edit `.env.example`, to stay clear of `.env*` files. The new variable names are listed above: `STRIPE_WEBHOOK_SECRET_ACADEMY`, `STRIPE_WEBHOOK_SECRET_SOCIAL`, `ADMIN_EMAILS`, `TEACHER_EMAILS`, `MARKETING_REMINDERS_ENABLED`.
