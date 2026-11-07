import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Weekday marketing email ("we'd love to have X back…") to opted-in families.
 * Called by the Vercel cron in vercel.json (0 16 * * 1-5).
 *
 * ── PAUSED in Phase 0 ───────────────────────────────────────────────────────
 * The cron schedule is still in vercel.json and still calls this route, but
 * the route returns { paused: true } and sends nothing unless the environment
 * variable MARKETING_REMINDERS_ENABLED is set to exactly "true".
 *
 * To re-enable:
 *   1. (Recommended first) fix the prices in the email copy below (Phase 1)
 *      and consider a less frequent schedule in vercel.json, e.g. monthly
 *      "0 16 1 * *", since families currently get this up to 5×/week.
 *   2. In Vercel → Project → Settings → Environment Variables (Production),
 *      add MARKETING_REMINDERS_ENABLED = true.
 *   3. Redeploy. To pause again, delete the variable (or set it to false)
 *      and redeploy.
 * CRON_SECRET must also be set or the route refuses to run at all.
 * ────────────────────────────────────────────────────────────────────────────
 */

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || ''
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
const LEADS_TABLE = 'tbl1diIEhM9MtKViE'
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const FROM_EMAIL = process.env.EMAIL_FROM || 'BASMA Academy <onboarding@resend.dev>'
const CRON_SECRET = process.env.CRON_SECRET || ''
const SITE = 'https://basmaworld.com'

async function fetchAllRecords(tableId: string) {
  const all: { id: string; fields: Record<string, any>; createdTime: string }[] = []
  let offset: string | undefined
  do {
    const params = new URLSearchParams({ pageSize: '100' })
    if (offset) params.set('offset', offset)
    const resp = await fetch(`${'https://api.airtable.com/v0/'}${AIRTABLE_BASE}/${tableId}?${params}`, {
      headers: { Authorization: `Bearer ${AIRTABLE_PAT}` }, cache: 'no-store'
    })
    if (!resp.ok) break
    const data = await resp.json()
    all.push(...(data.records || []))
    offset = data.offset
  } while (offset)
  return all
}

function esc(value: string) {
  return value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] || c))
}

async function sendReminderEmail(to: string, firstName: string, students: string[]) {
  if (!RESEND_API_KEY || !to) return false
  const studentList = students.map(esc).join(' & ')
  const unsubscribeUrl = `${SITE}/unsubscribe?email=${encodeURIComponent(to)}`
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#0D0118;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;margin-bottom:24px;">
      <h1 style="color:#F0C850;font-size:28px;margin:0;letter-spacing:2px;">B.A.S.M.A.</h1>
      <p style="color:rgba(255,255,255,.45);font-size:12px;margin:5px 0 0;">Become A Singer Music Academy</p>
    </div>
    <div style="background:linear-gradient(135deg,#1a0d30,#2D1B4E);border:1px solid rgba(240,200,80,.22);border-radius:16px;padding:32px 26px;">
      <p style="color:#F0C850;font-size:13px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 10px;">A friendly BASMA update</p>
      <h2 style="color:#fff;font-size:25px;line-height:1.25;margin:0 0 16px;">Hi ${esc(firstName)} — we'd love to have ${studentList} back!</h2>
      <p style="color:rgba(255,255,255,.72);font-size:15px;line-height:1.7;margin:0 0 18px;">
        If you're still interested in music lessons, we're currently booking <strong style="color:#fff;">private lessons</strong> at BASMA.
        No need to complete an old registration just to hear from us — simply choose the lesson option that works for your family.
      </p>
      <div style="background:rgba(240,200,80,.08);border:1px solid rgba(240,200,80,.22);border-radius:12px;padding:20px;margin:22px 0;">
        <p style="color:#F0C850;font-size:17px;font-weight:700;margin:0 0 8px;">Our monthly deal</p>
        <p style="color:#fff;font-size:15px;line-height:1.6;margin:0;">
          4 × 30-minute private lessons — <strong>$135/month</strong><br>
          4 × 60-minute private lessons — <strong>$200/month</strong>
        </p>
        <p style="color:rgba(255,255,255,.55);font-size:13px;line-height:1.5;margin:10px 0 0;">Monthly packages are paid in advance and are our best value for families who want consistent lessons.</p>
      </div>
      <div style="text-align:center;margin:26px 0 10px;">
        <a href="${SITE}/private-lessons" style="display:inline-block;background:linear-gradient(135deg,#F0C850,#c9a84c);color:#0D0118;font-weight:700;font-size:16px;padding:14px 32px;border-radius:12px;text-decoration:none;">View Private Lessons →</a>
      </div>
      <p style="color:rgba(255,255,255,.48);font-size:13px;line-height:1.6;margin:22px 0 0;text-align:center;">
        We also share occasional BASMA events and special opportunities with our community — including special student experiences and event tickets when available.
      </p>
    </div>
    <div style="text-align:center;margin-top:22px;">
      <p style="color:rgba(255,255,255,.25);font-size:11px;margin:0 0 8px;">BASMA Academy · 6787 W Tropicana Ave Suite 260 · Las Vegas, NV</p>
      <a href="${unsubscribeUrl}" style="color:rgba(255,255,255,.42);font-size:11px;">Unsubscribe or tell us why you're stepping away</a>
    </div>
  </div></body></html>`
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method:'POST', headers:{Authorization:`Bearer ${RESEND_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({from:FROM_EMAIL,to,subject:`🎵 ${firstName}, private music lessons are open at BASMA`,html})
    })
    return res.ok
  } catch { return false }
}

export async function GET(request: NextRequest) {
  // Fail closed: without CRON_SECRET nobody can trigger this mass email.
  if (!CRON_SECRET) {
    console.error('[cron/reminders] CRON_SECRET is not configured; refusing to run')
    return NextResponse.json({ error: 'Cron not configured' }, { status: 503 })
  }
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${CRON_SECRET}`) return NextResponse.json({error:'Unauthorized'},{status:401})

  // PAUSED (Phase 0): this weekday marketing email is switched off unless
  // MARKETING_REMINDERS_ENABLED is exactly "true". See the header comment
  // for how to re-enable it.
  if (process.env.MARKETING_REMINDERS_ENABLED !== 'true') {
    return NextResponse.json({ success: true, paused: true, message: 'Marketing reminder email is paused (set MARKETING_REMINDERS_ENABLED=true to re-enable).' })
  }

  try {
    const records = await fetchAllRecords(LEADS_TABLE)
    const families: Record<string,{firstName:string;students:string[]}> = {}
    let studentsChecked = 0
    for (const record of records) {
      const f = record.fields || {}
      const email = String(f.Email || '').trim().toLowerCase()
      const student = String(f['Student Name'] || '').trim()
      if (!email || !student) continue
      studentsChecked++
      // Only contact people who have explicitly opted into email updates.
      // Historical/unfinished records are not automatically treated as marketing subscribers.
      if (f['Marketing Opt Out'] === true) continue
      const emailUpdates = f['Email Updates']
      if (emailUpdates !== true && String(emailUpdates || '').toLowerCase() !== 'true') continue
      if (!families[email]) families[email] = {firstName:String(f['Full Name'] || '').trim().split(/\s+/)[0] || 'there',students:[]}
      if (!families[email].students.includes(student)) families[email].students.push(student)
    }
    let emailsSent=0, failed=0
    for (const [email,family] of Object.entries(families)) {
      if (await sendReminderEmail(email,family.firstName,family.students)) emailsSent++; else failed++
      await new Promise(r=>setTimeout(r,500))
    }
    return NextResponse.json({success:true,studentsChecked,familiesContacted:Object.keys(families).length,emailsSent,failed,timestamp:new Date().toISOString()})
  } catch (error:any) {
    console.error('Private lesson reminder error:',error)
    return NextResponse.json({success:false,error:error.message},{status:500})
  }
}
