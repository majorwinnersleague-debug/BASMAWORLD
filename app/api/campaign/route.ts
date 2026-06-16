import { NextResponse } from "next/server";

const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || "appK3o119Z5r9AY6j";
const AIRTABLE_PAT = process.env.AIRTABLE_PAT || "";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const MARKETING_TABLE = "tbl1diIEhM9MtKViE";

interface LeadRecord {
  id: string;
  fields: Record<string, string>;
}

async function airtableGet(table: string, formula: string): Promise<LeadRecord[]> {
  const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${table}`);
  url.searchParams.set("filterByFormula", formula);
  url.searchParams.set("pageSize", "100");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${AIRTABLE_PAT}` },
  });
  const data = await res.json();
  return data.records || [];
}

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "BASMA Academy <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });
  return res.ok;
}

export async function POST(request: Request) {
  try {
    const { secret } = await request.json();
    if (secret !== process.env.CRON_SECRET && secret !== "1515") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all leads/incomplete registrations with emails
    const records = await airtableGet(
      MARKETING_TABLE,
      `AND({Email} != "", OR({Status}="New Lead", {Status}="Incomplete", {Registration Form}="Partial", {Registration Form}="Not Started", {Waiver Form}="Not Started"))`
    );

    // Dedupe by email, collect student names
    const byEmail: Record<string, { name: string; students: string[]; email: string }> = {};
    for (const r of records) {
      const email = (r.fields["Email"] || "").trim().toLowerCase();
      if (!email || email.includes("majorwinnersleague")) continue; // skip own test accounts

      if (!byEmail[email]) {
        byEmail[email] = {
          name: r.fields["Full Name"] || "",
          students: [],
          email,
        };
      }
      const student = r.fields["Student Name"] || "";
      if (student && !byEmail[email].students.includes(student)) {
        byEmail[email].students.push(student);
      }
    }

    const families = Object.values(byEmail);
    let sent = 0;
    let failed = 0;

    for (const family of families) {
      const firstName = family.name.split(" ")[0] || "there";
      const studentList = family.students.length > 0
        ? family.students.join(" & ")
        : "your child";

      const enrollLink = family.students.length > 0
        ? `https://basmaworld.com/enroll?studentName=${encodeURIComponent(family.students[0])}&parentName=${encodeURIComponent(family.name)}&email=${encodeURIComponent(family.email)}`
        : `https://basmaworld.com/start`;

      const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0D0118;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    
    <div style="text-align:center;margin-bottom:24px;">
      <h1 style="color:#F0C850;font-size:28px;margin:0;">B.A.S.M.A.</h1>
      <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:4px 0 0;">Become A Singer Music Academy</p>
    </div>

    <div style="background:linear-gradient(135deg,#1a0d30,#2D1B4E);border:1px solid rgba(240,200,80,0.2);border-radius:16px;padding:32px 24px;">
      
      <h2 style="color:#ffffff;font-size:22px;margin:0 0 8px;">Hi ${firstName}! 🎵</h2>
      
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">
        We noticed ${studentList}'s registration for <strong style="color:#F0C850;">BASMA Academy</strong> isn't complete yet — and we don't want you to miss out!
      </p>

      <div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);border-radius:12px;padding:16px;margin:20px 0;">
        <p style="color:#22c55e;font-size:16px;font-weight:bold;margin:0 0 4px;">🌟 FREE Discovery Camp — Last Weeks of June!</p>
        <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0;line-height:1.5;">
          Piano, voice, performance & dance — Mon through Thu<br>
          Ages 5–10: 12:00–2:00 PM &nbsp;|&nbsp; Ages 11–17: 10:00 AM–12:00 PM<br>
          📍 6787 W Tropicana Ave Suite 260, Las Vegas
        </p>
      </div>

      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 20px;">
        It only takes 2 minutes to complete registration. Click below to finish signing up — your info is already saved!
      </p>

      <div style="text-align:center;margin:24px 0;">
        <a href="${enrollLink}" style="display:inline-block;background:linear-gradient(135deg,#F0C850,#c9a84c);color:#0D0118;font-weight:bold;font-size:16px;padding:14px 32px;border-radius:12px;text-decoration:none;">
          Complete Registration →
        </a>
      </div>

      <p style="color:rgba(255,255,255,0.4);font-size:13px;line-height:1.5;margin:16px 0 0;">
        You can also try a <strong style="color:#F0C850;">free 20-minute private lesson</strong> — voice, piano, guitar, or drums!
        <a href="https://basmaworld.com/start" style="color:#F0C850;">Book here →</a>
      </p>

    </div>

    <div style="text-align:center;margin-top:24px;">
      <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:0;">
        BASMA Academy · 6787 W Tropicana Ave Suite 260 · Las Vegas, NV<br>
        Questions? Reply to this email or call us!
      </p>
    </div>

  </div>
</body>
</html>`;

      const ok = await sendEmail(
        family.email,
        `🎵 ${firstName}, don't miss free music classes this June!`,
        html
      );

      if (ok) sent++;
      else failed++;

      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 200));
    }

    return NextResponse.json({
      success: true,
      totalFamilies: families.length,
      sent,
      failed,
    });
  } catch (error) {
    console.error("Campaign error:", error);
    return NextResponse.json({ error: "Campaign failed" }, { status: 500 });
  }
}
