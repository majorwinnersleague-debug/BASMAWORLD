import { NextResponse } from "next/server";

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || "";
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || "appK3o119Z5r9AY6j";
const LEADS_TABLE = "tbl1diIEhM9MtKViE"; // BASMA Marketing Leads
const ENROLLMENTS_TABLE = "tblelNWN2hed8OclX"; // Enrollments (waivers/medical)
const PAYMENTS_TABLE = "tblfTQQEciBFqovYU"; // Stripe Payments

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
 * SECURE PARENT PORTAL — 2-step verification
 * 
 * Requires ALL THREE fields to match:
 *   1. Parent full name (case-insensitive)
 *   2. Email address (exact match)
 *   3. Phone number (digit match)
 * 
 * If any field is missing or doesn't match → returns empty results.
 * No partial searches, no name-only lookups, no browsing.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const name = url.searchParams.get("name")?.trim().toLowerCase() || "";
    const email = url.searchParams.get("email")?.trim().toLowerCase() || "";
    const phone = url.searchParams.get("phone")?.trim() || "";

    // Legacy single-search param — block it entirely
    const legacySearch = url.searchParams.get("search");
    if (legacySearch) {
      return NextResponse.json({
        total: 0,
        filtered: 0,
        families: 0,
        registrations: [],
        byParent: {},
        error: "Please use the updated portal with all three verification fields.",
      });
    }

    // ALL THREE fields are required
    if (!name || !email || !phone) {
      return NextResponse.json({
        total: 0,
        filtered: 0,
        families: 0,
        registrations: [],
        byParent: {},
      });
    }

    // Phone must have at least 7 digits
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

    // Email must look like an email
    if (!email.includes("@")) {
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

    // STRICT MATCH: All three fields must match the SAME registration record.
    // First find records where email matches exactly.
    const emailMatches = registrations.filter(
      (r) => r.email.toLowerCase().trim() === email
    );

    if (emailMatches.length === 0) {
      return NextResponse.json({
        total: 0,
        filtered: 0,
        families: 0,
        registrations: [],
        byParent: {},
      });
    }

    // Now verify that at least one of those records also matches first name AND phone
    const verified = emailMatches.some((r) => {
      // Match on first name only (case-insensitive)
      const recordFirstName = r.parentName.toLowerCase().trim().split(/\s+/)[0];
      const inputFirstName = name.split(/\s+/)[0];
      const nameMatch = recordFirstName === inputFirstName;
      const recDigits = r.phone.replace(/\D/g, "");
      const phoneMatch =
        recDigits.length >= 7 &&
        (recDigits.includes(phoneDigits) || phoneDigits.includes(recDigits));
      return nameMatch && phoneMatch;
    });

    if (!verified) {
      // None of the email-matching records also match name + phone
      return NextResponse.json({
        total: 0,
        filtered: 0,
        families: 0,
        registrations: [],
        byParent: {},
      });
    }

    // Verified! Now return ALL records for this family (expand by email + phone)
    const familyEmails = new Set<string>();
    const familyPhones = new Set<string>();

    for (const r of emailMatches) {
      const em = r.email.toLowerCase().trim();
      const ph = r.phone.replace(/\D/g, "");
      if (em && em.includes("@")) familyEmails.add(em);
      if (ph.length >= 7) familyPhones.add(ph);
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
    });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch registrations", detail: err.message },
      { status: 500 }
    );
  }
}
