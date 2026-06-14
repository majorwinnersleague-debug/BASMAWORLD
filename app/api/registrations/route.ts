import { NextResponse } from "next/server";

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || "";
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || "appK3o119Z5r9AY6j";
const LEADS_TABLE = "tbl1diIEhM9MtKViE"; // BASMA Marketing Leads
const ENROLLMENTS_TABLE = "tblelNWN2hed8OclX"; // Enrollments (waivers/medical)
const PAYMENTS_TABLE = "tblfTQQEciBFqovYU"; // Stripe Payments

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL = "BASMA <noreply@basmaworld.com>";

// Rate limit: max 1 alert per email per 30 minutes
const recentAlerts = new Map<string, number>();
const RATE_LIMIT_MS = 30 * 60 * 1000;

async function sendVerificationAlert(parentEmail: string, verifyMethod: string): Promise<string> {
  const key = parentEmail.toLowerCase().trim();
  if (!key || !key.includes("@")) return "skipped:invalid-email";
  if (!RESEND_API_KEY) return "skipped:no-api-key";

  const lastSent = recentAlerts.get(key);
  if (lastSent && Date.now() - lastSent < RATE_LIMIT_MS) return "skipped:rate-limited";

  const now = new Date();
  const timeStr = now.toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #4a0e78, #6b21a8); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
        <h2 style="color: #ffd700; margin: 0; font-size: 22px;">🔔 BASMA Portal Access Alert</h2>
      </div>
      <div style="background: #fff; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
        <p style="font-size: 15px; color: #333; margin: 0 0 12px;">
          Someone just accessed your family's registration on <strong>basmaworld.com/portal</strong>.
        </p>
        <div style="background: #f9fafb; padding: 14px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            <strong>Time:</strong> ${timeStr} (Pacific)<br>
            <strong>Verified with:</strong> ${verifyMethod}
          </p>
        </div>
        <p style="font-size: 14px; color: #333;">
          <strong>Was this you?</strong>
        </p>
        <p style="font-size: 14px; color: #333;">
          ✅ <strong>Yes</strong> — no action needed!
        </p>
        <p style="font-size: 14px; color: #333;">
          ❌ <strong>No</strong> — please contact us immediately at
          <a href="mailto:becomeasingermusicacademy@gmail.com" style="color: #6b21a8;">becomeasingermusicacademy@gmail.com</a>
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          Become A Singer Music Academy · <a href="https://basmaworld.com" style="color: #6b21a8;">basmaworld.com</a>
        </p>
      </div>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: key,
        subject: "🔔 Someone accessed your BASMA registration — was this you?",
        html,
        text: `Someone accessed your family's registration on basmaworld.com/portal at ${timeStr}. Verified with: ${verifyMethod}. If this was you, no action needed. If not, contact becomeasingermusicacademy@gmail.com immediately.`,
      }),
    });
    if (res.ok) {
      recentAlerts.set(key, Date.now());
      return "sent:ok";
    } else {
      const errBody = await res.text();
      console.error("Resend error:", res.status, errBody);
      return `error:${res.status}:${errBody.slice(0, 200)}`;
    }
  } catch (e: any) {
    console.error("Alert email error:", e);
    return `error:exception:${e.message}`;
  }
}

interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

function parseStudentInfo(message: string): { studentName: string; studentAge: string; address?: string } | null {
  if (!message) return null;
  const studentMatch = message.match(/Student:\s*(.+?)(?:,|$)/);
  const ageMatch = message.match(/Age:\s*(\d+)/);
  const addressMatch = message.match(/Address:\s*(.+?)$/);
  if (studentMatch) {
    return {
      studentName: studentMatch[1].trim(),
      studentAge: ageMatch ? ageMatch[1] : "",
      address: addressMatch ? addressMatch[1].trim() : undefined,
    };
  }
  return null;
}

async function fetchAllRecords(tableId: string): Promise<AirtableRecord[]> {
  const allRecords: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const params = new URLSearchParams({ pageSize: "100" });
    if (offset) params.set("offset", offset);

    const resp = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE}/${tableId}?${params}`,
      {
        headers: { Authorization: `Bearer ${AIRTABLE_PAT}` },
        next: { revalidate: 60 },
      }
    );

    if (!resp.ok) {
      console.error("Airtable error:", resp.status, await resp.text());
      break;
    }

    const data = await resp.json();
    allRecords.push(...(data.records || []));
    offset = data.offset;
  } while (offset);

  return allRecords;
}

// Determine class recommendations based on student data
function getRecommendations(age: number, interests: string, experience: string) {
  const recs: { name: string; description: string; link: string; match: string }[] = [];
  const interestLower = (interests || "").toLowerCase();
  const allInterests = interestLower.includes("all of the above") || interestLower.includes("all");

  if (age >= 2 && age <= 4) {
    recs.push({
      name: "🎒 Tiny Tots Music (Ages 2-4)",
      description: "Fun musical exploration with singing, movement, and rhythm for little ones!",
      link: "/enroll?program=tiny-tots&month=july",
      match: "Perfect age match",
    });
  }

  if (age >= 5 && age <= 10) {
    if (allInterests || interestLower.includes("voice") || interestLower.includes("sing") || interestLower.includes("performance") || interestLower.includes("dance")) {
      recs.push({
        name: "🎤 Kids Music & Performance (Ages 5-10)",
        description: "Singing, performing, and creative expression for kids!",
        link: "/enroll?program=kids-5-10&month=july",
        match: "Age + interest match",
      });
    }
    if (allInterests || interestLower.includes("piano")) {
      recs.push({
        name: "🎹 Kids Piano (Ages 5-10)",
        description: "Learn piano basics with fun songs and exercises.",
        link: "/enroll?program=piano&month=july",
        match: "Age + interest match",
      });
    }
    if (recs.length === 0) {
      recs.push({
        name: "🎤 Kids Music & Performance (Ages 5-10)",
        description: "Singing, performing, and creative expression for kids!",
        link: "/enroll?program=kids-5-10&month=july",
        match: "Age match",
      });
    }
  }

  if (age >= 11 && age <= 17) {
    if (allInterests || interestLower.includes("voice") || interestLower.includes("sing") || interestLower.includes("performance")) {
      recs.push({
        name: "🎤 Kids Music & Performance (Ages 11-17)",
        description: "Advanced vocal training and stage performance for teens.",
        link: "/enroll?program=kids-11-17&month=july",
        match: "Age + interest match",
      });
    }
    if (allInterests || interestLower.includes("piano")) {
      recs.push({
        name: "🎹 Piano Lessons (Ages 11-17)",
        description: "Piano for intermediate and advanced students.",
        link: "/enroll?program=piano&month=july",
        match: "Age + interest match",
      });
    }
    if (allInterests || interestLower.includes("record") || interestLower.includes("produc")) {
      recs.push({
        name: "🎧 Teens Recording Studio",
        description: "Learn music production, recording, and mixing in a real studio!",
        link: "/enroll?program=teens-recording&month=july",
        match: "Age + interest match",
      });
    }
    if (recs.length === 0) {
      recs.push({
        name: "🎤 Kids Music & Performance (Ages 11-17)",
        description: "Advanced vocal training and stage performance.",
        link: "/enroll?program=kids-11-17&month=july",
        match: "Age match",
      });
    }
  }

  // Weekly bundle recommendation for everyone
  if (recs.length > 0) {
    recs.push({
      name: "💰 Weekly Bundle — Save $$$",
      description: "Get all classes for the week at a discounted rate ($350/week).",
      link: "/enroll?program=weekly-bundle",
      match: "Best value",
    });
  }

  return recs;
}

/**
 * SECURE PARENT PORTAL — identity verification
 * 
 * Phone number is ALWAYS required, plus at least one of:
 *   - First name (case-insensitive match)
 *   - Email address (exact match)
 * 
 * Valid combos: name+phone, email+phone, name+email+phone
 * If fields don't match the same record → returns empty results.
 * No single-field searches, no browsing.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const name = url.searchParams.get("name")?.trim().toLowerCase() || "";
    const email = url.searchParams.get("email")?.trim().toLowerCase() || "";
    const phone = url.searchParams.get("phone")?.trim() || "";
    const teacherCode = url.searchParams.get("teacherCode")?.trim() || "";
    const source = url.searchParams.get("source")?.trim() || "";

    // Teacher portal: authenticated with code 1515 + source=all → return all records
    const TEACHER_CODE = process.env.TEACHER_ACCESS_CODE || "1515";
    if (source === "all" && teacherCode === TEACHER_CODE) {
      const [leadRecords, enrollmentRecords, paymentRecords] = await Promise.all([
        fetchAllRecords(LEADS_TABLE),
        fetchAllRecords(ENROLLMENTS_TABLE),
        fetchAllRecords(PAYMENTS_TABLE),
      ]);

      const enrollmentsByEmail: Record<string, AirtableRecord[]> = {};
      for (const e of enrollmentRecords) {
        const em = (e.fields.Email || "").toLowerCase().trim();
        if (em) {
          if (!enrollmentsByEmail[em]) enrollmentsByEmail[em] = [];
          enrollmentsByEmail[em].push(e);
        }
      }

      const paymentsByEmail: Record<string, AirtableRecord[]> = {};
      for (const p of paymentRecords) {
        const em = (p.fields.Email || p.fields.email || "").toLowerCase().trim();
        if (em) {
          if (!paymentsByEmail[em]) paymentsByEmail[em] = [];
          paymentsByEmail[em].push(p);
        }
      }

      const registrations = leadRecords.map((r) => {
        const f = r.fields;
        const parsed = parseStudentInfo(f.Message || "");
        return {
          id: r.id,
          parentName: f["Full Name"] || "",
          email: f.Email || "",
          phone: f.Phone || "",
          studentName: f["Student Name"] || parsed?.studentName || "",
          studentAge: f["Student Age"] || parsed?.studentAge || "",
          interests: f.Interests || "",
          status: f.Status || "Unknown",
          source: f.Source || "",
          ageGroup: f["Age Group"] || "",
          experienceLevel: f["Experience Level"] || "",
          referralSource: f["Referral Source"] || "",
          message: f.Message || "",
          createdAt: r.createdTime,
        };
      });

      return NextResponse.json({ registrations });
    }

    // Legacy single-search param — block it entirely
    const legacySearch = url.searchParams.get("search");
    if (legacySearch) {
      return NextResponse.json({
        total: 0,
        filtered: 0,
        families: 0,
        registrations: [],
        byParent: {},
        error: "Please use the updated portal with verification fields.",
      });
    }

    // Phone is ALWAYS required
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 7) {
      return NextResponse.json({
        total: 0,
        filtered: 0,
        families: 0,
        registrations: [],
        byParent: {},
      });
    }

    // Must also have at least name OR email
    const hasName = name.length >= 2;
    const hasEmail = email.includes("@");
    if (!hasName && !hasEmail) {
      return NextResponse.json({
        total: 0,
        filtered: 0,
        families: 0,
        registrations: [],
        byParent: {},
      });
    }

    // Fetch from all three tables in parallel
    const [leadRecords, enrollmentRecords, paymentRecords] = await Promise.all([
      fetchAllRecords(LEADS_TABLE),
      fetchAllRecords(ENROLLMENTS_TABLE),
      fetchAllRecords(PAYMENTS_TABLE),
    ]);

    // Index enrollments by email for cross-reference
    const enrollmentsByEmail: Record<string, AirtableRecord[]> = {};
    for (const e of enrollmentRecords) {
      const em = (e.fields.Email || "").toLowerCase().trim();
      if (em) {
        if (!enrollmentsByEmail[em]) enrollmentsByEmail[em] = [];
        enrollmentsByEmail[em].push(e);
      }
    }

    // Index payments by email
    const paymentsByEmail: Record<string, AirtableRecord[]> = {};
    for (const p of paymentRecords) {
      const em = (p.fields.Email || p.fields.email || "").toLowerCase().trim();
      if (em) {
        if (!paymentsByEmail[em]) paymentsByEmail[em] = [];
        paymentsByEmail[em].push(p);
      }
    }

    // Transform lead records
    const registrations = leadRecords.map((r) => {
      const f = r.fields;
      const parsed = parseStudentInfo(f.Message || "");
      const em = (f.Email || "").toLowerCase().trim();
      const studentName = f["Student Name"] || parsed?.studentName || "";
      const studentAge = f["Student Age"] || parsed?.studentAge || "";
      const age = parseInt(studentAge) || 0;

      // Compute form completion checklist
      const forms = {
        parentInfo: !!(f["Full Name"] && f.Email && f.Phone),
        studentInfo: !!(studentName && studentAge),
        interests: !!(f.Interests || f["Experience Level"]),
        waiver: !!(enrollmentsByEmail[em] && enrollmentsByEmail[em].length > 0),
        payment: !!(paymentsByEmail[em] && paymentsByEmail[em].length > 0),
      };

      const completedSteps = Object.values(forms).filter(Boolean).length;
      const totalSteps = Object.keys(forms).length;
      const completionPct = Math.round((completedSteps / totalSteps) * 100);

      // Get recommendations
      const recommendations = getRecommendations(age, f.Interests || "", f["Experience Level"] || "");

      return {
        id: r.id,
        parentName: f["Full Name"] || "",
        email: f.Email || "",
        phone: f.Phone || "",
        studentName,
        studentAge,
        interests: f.Interests || "",
        status: f.Status || "Unknown",
        source: f.Source || "",
        ageGroup: f["Age Group"] || "",
        experienceLevel: f["Experience Level"] || "",
        referralSource: f["Referral Source"] || "",
        message: f.Message || "",
        address: parsed?.address || "",
        createdAt: r.createdTime,
        forms,
        completedSteps,
        totalSteps,
        completionPct,
        recommendations,
      };
    });

    // VERIFICATION: Phone is always matched. Plus name and/or email.
    // Find records where phone matches first.
    const phoneMatches = registrations.filter((r) => {
      const recDigits = r.phone.replace(/\D/g, "");
      return (
        recDigits.length >= 7 &&
        (recDigits.includes(phoneDigits) || phoneDigits.includes(recDigits))
      );
    });

    if (phoneMatches.length === 0) {
      return NextResponse.json({
        total: 0,
        filtered: 0,
        families: 0,
        registrations: [],
        byParent: {},
      });
    }

    // Now verify that at least one phone-matched record also matches name OR email
    const verified = phoneMatches.some((r) => {
      // Check first name match (case-insensitive)
      const recordFirstName = r.parentName.toLowerCase().trim().split(/\s+/)[0];
      const inputFirstName = name.split(/\s+/)[0];
      const nameMatch = hasName && recordFirstName === inputFirstName;

      // Check email match (exact)
      const emailMatch = hasEmail && r.email.toLowerCase().trim() === email;

      // Either name or email must match (on top of phone which already matched)
      return nameMatch || emailMatch;
    });

    if (!verified) {
      return NextResponse.json({
        total: 0,
        filtered: 0,
        families: 0,
        registrations: [],
        byParent: {},
      });
    }

    // Verified! Now return ALL records for this family (expand by phone)
    const familyEmails = new Set<string>();
    const familyPhones = new Set<string>();

    for (const r of phoneMatches) {
      // Only seed from verified records
      const recDigits = r.phone.replace(/\D/g, "");
      const recordFirstName = r.parentName.toLowerCase().trim().split(/\s+/)[0];
      const inputFirstName = name.split(/\s+/)[0];
      const nameMatch = hasName && recordFirstName === inputFirstName;
      const emailMatch = hasEmail && r.email.toLowerCase().trim() === email;

      if (nameMatch || emailMatch) {
        const em = r.email.toLowerCase().trim();
        const ph = r.phone.replace(/\D/g, "");
        if (em && em.includes("@")) familyEmails.add(em);
        if (ph.length >= 7) familyPhones.add(ph);
      }
    }

    // Transitive closure to find all family records
    let prevSize = 0;
    while (familyEmails.size + familyPhones.size > prevSize) {
      prevSize = familyEmails.size + familyPhones.size;
      for (const r of registrations) {
        const em = r.email.toLowerCase().trim();
        const ph = r.phone.replace(/\D/g, "");
        const emailHit = em && familyEmails.has(em);
        const phoneHit =
          ph.length >= 7 &&
          Array.from(familyPhones).some((fp) => fp.includes(ph) || ph.includes(fp));
        if (emailHit || phoneHit) {
          if (em && em.includes("@")) familyEmails.add(em);
          if (ph.length >= 7) familyPhones.add(ph);
        }
      }
    }

    const filtered = registrations.filter((r) => {
      const em = r.email.toLowerCase().trim();
      const ph = r.phone.replace(/\D/g, "");
      return (
        (em && familyEmails.has(em)) ||
        (ph.length >= 7 &&
          Array.from(familyPhones).some((fp) => fp.includes(ph) || ph.includes(fp)))
      );
    });

    // Send verification alert emails (server-side, before stripping PII)
    // Must await — on Vercel serverless, fire-and-forget won't complete before function exits
    const verifyMethod = hasName && hasEmail ? "Name + Email + Phone" : hasName ? "Name + Phone" : "Email + Phone";
    const alertedEmails = new Set<string>();
    const alertResults: string[] = [];
    for (const r of filtered) {
      const em = r.email?.toLowerCase().trim();
      if (em && em.includes("@") && !alertedEmails.has(em)) {
        alertedEmails.add(em);
        const result = await sendVerificationAlert(em, verifyMethod);
        alertResults.push(`${em.slice(0, 3)}***:${result}`);
      }
    }

    // Privacy: show student FIRST NAME ONLY — no last name, no initial
    for (const r of filtered) {
      if (r.studentName) {
        r.studentName = r.studentName.trim().split(/\s+/)[0];
      }
      // Strip parent PII from response — they already verified identity
      r.email = "";
      r.phone = "";
      r.address = "";
      r.message = "";
    }

    // Group by parent
    const byParent: Record<string, typeof filtered> = {};
    for (const r of filtered) {
      const key = r.email.toLowerCase() || r.phone || r.parentName.toLowerCase();
      if (!byParent[key]) byParent[key] = [];
      byParent[key].push(r);
    }

    return NextResponse.json({
      total: registrations.length,
      filtered: filtered.length,
      families: Object.keys(byParent).length,
      registrations: filtered,
      byParent,
      _alertDebug: alertResults,
    });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch registrations", detail: err.message },
      { status: 500 }
    );
  }
}
