import { NextResponse } from "next/server";
import { getStaffSession, staffUnauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || "";
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || "appK3o119Z5r9AY6j";
const LEADS_TABLE = "tbl1diIEhM9MtKViE"; // BASMA Marketing Leads
const SUMMER_TABLE = "tblfOnRDkfgZoCF9X"; // Summer 2026 Registrations
const CHECKIN_TABLE = "tbl7vzQgS5o67kDYv"; // Check-In Log (walk-in families)
const BLOCKED_TABLE = process.env.BLOCKED_TABLE_ID || "tbleV623dZRhgmULJ"; // Blocked Contacts (teacher portal removals)

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

/**
 * GET /api/registrations?source=all — teacher portal master roster.
 * Staff session required. The old public "name + phone" family lookup was
 * removed in Phase 0 (no page used it, and it exposed family data).
 */
export async function GET(req: Request) {
  const staff = await getStaffSession();
  if (!staff) return staffUnauthorized();

  try {
    const url = new URL(req.url);
    const source = url.searchParams.get("source")?.trim() || "";

    // Teacher portal: BASMA Marketing Leads is the single master roster.
    // Historical tables are read-only fallbacks for legacy health/check-in data.
    if (source === "all") {
      const [leadRecords, summerRecords, checkinRecords] = await Promise.all([
        fetchAllRecords(LEADS_TABLE), fetchAllRecords(SUMMER_TABLE), fetchAllRecords(CHECKIN_TABLE),
      ]);

      const normalizePhone = (value: string) => {
        const digits = value.replace(/\D/g, "");
        return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
      };
      const summerByStudentEmail = new Map<string, Record<string, any>>();
      const summerByStudent = new Map<string, Record<string, any>>();
      for (const s of summerRecords) {
        const f = s.fields;
        const student = String(f["Student Name"] || "").trim().toLowerCase();
        const em = String(f["Parent Email"] || "").trim().toLowerCase();
        if (student && em) summerByStudentEmail.set(student + "|" + em, f);
        if (student) summerByStudent.set(student, f);
      }
      const lastCheckInByPhone = new Map<string, string>();
      for (const c of checkinRecords) {
        const f = c.fields;
        const ph = normalizePhone(String(f["Parent Phone"] || ""));
        if (ph) lastCheckInByPhone.set(ph, String(f["Check-In Time"] || f["Timestamp"] || c.createdTime || ""));
      }

      const EXCLUDED_NAMES = ["mitzi", "frank vecchio"];
      const EXCLUDED_PHONES = new Set(["7028846787"]);
      const registrations = leadRecords.map((r) => {
        const f = r.fields;
        const parsed = parseStudentInfo(f.Message || "");
        const parentName = String(f["Full Name"] || "").trim();
        const em = String(f.Email || "").trim().toLowerCase();
        const ph = normalizePhone(String(f.Phone || ""));
        const studentName = String(f["Student Name"] || parsed?.studentName || "").trim();
        const studentAge = String(f["Student Age"] || parsed?.studentAge || "");
        const summer = summerByStudentEmail.get(studentName.toLowerCase() + "|" + em) || summerByStudent.get(studentName.toLowerCase());
        const waiverForm = String(f["Waiver Form"] || "");
        const liabilityAgreed = String(f["Liability Agreed"] || summer?.["Liability Agreed"] || "");
        const hasWaiver = waiverForm.toLowerCase() === "complete" || liabilityAgreed === "Yes";
        const isRegistrationComplete = !!(parentName && em && ph && studentName && hasWaiver);
        const missingFields: string[] = [];
        if (!parentName) missingFields.push("Parent Name");
        if (!em) missingFields.push("Email");
        if (!ph) missingFields.push("Phone");
        if (!studentName) missingFields.push("Student Name");
        if (!hasWaiver) missingFields.push("Waiver");
        return {
          id: r.id, parentName, email: f.Email || "", phone: f.Phone || "", studentName, studentAge,
          interests: f.Interests || "", status: f.Status || "New", source: f.Source || "",
          ageGroup: f["Age Group"] || "", experienceLevel: f["Experience Level"] || "",
          referralSource: f["Referral Source"] || "", message: f.Message || "",
          discoveryWeek: f["Discovery Week"] || "", timeSlot: f["Time Slot"] || "",
          paymentStatus: "Not tracked", enrolledClass: f["Lesson Type"] || "", hasWaiver, createdAt: r.createdTime,
          allergies: f["Allergies"] || summer?.["Allergies"] || "",
          medicalConditions: f["Medical Conditions"] || summer?.["Medical Conditions"] || "",
          emergencyContactName: f["Emergency Contact Name"] || summer?.["Emergency Contact"] || "",
          emergencyContactPhone: f["Emergency Contact Phone"] || summer?.["Emergency Phone"] || "",
          liabilityAgreed: liabilityAgreed === "Yes",
          waiverFormStatus: waiverForm || (liabilityAgreed === "Yes" ? "Complete" : "Not Started"),
          lastCheckIn: lastCheckInByPhone.get(ph) || null, isRegistrationComplete, missingFields,
          onlineInterest: f["Online Interest"] === true || String(f["Online Interest"] || "").toLowerCase() === "true",
          lessonType: f["Lesson Type"] || "Private",
        };
      }).filter(r => {
        if (!r.studentName && !r.parentName) return false;
        if (EXCLUDED_NAMES.includes(r.parentName.toLowerCase())) return false;
        if (EXCLUDED_PHONES.has(normalizePhone(r.phone))) return false;
        return true;
      });

      const blockedFromAirtable: string[] = [];
      if (BLOCKED_TABLE) {
        try {
          const blockedRes = await fetch("https://api.airtable.com/v0/" + AIRTABLE_BASE + "/" + BLOCKED_TABLE + "?fields%5B%5D=Phone", { headers: { Authorization: "Bearer " + AIRTABLE_PAT }, cache: "no-store" });
          const blockedData = await blockedRes.json();
          for (const rec of (blockedData.records || [])) {
            const ph = normalizePhone(String(rec.fields?.Phone || ""));
            if (ph.length >= 7) blockedFromAirtable.push(ph);
          }
        } catch (_) {}
      }
      const blocked = new Set([...blockedFromAirtable, ...Array.from(EXCLUDED_PHONES)]);
      const allContactsMap = new Map<string, { name: string; phone: string; studentName: string; email: string; source: string }>();
      for (const r of leadRecords) {
        const f = r.fields, ph = normalizePhone(String(f.Phone || "")), name = String(f["Full Name"] || "").trim();
        if (ph.length < 7 || blocked.has(ph) || EXCLUDED_NAMES.includes(name.toLowerCase()) || allContactsMap.has(ph)) continue;
        allContactsMap.set(ph, { name: name || String(f["Student Name"] || ""), phone: String(f.Phone || ""), studentName: String(f["Student Name"] || ""), email: String(f.Email || ""), source: String(f.Source || "") });
      }
      return NextResponse.json({ registrations, allContacts: Array.from(allContactsMap.values()) });
    }
    return NextResponse.json({ error: "Unsupported query" }, { status: 400 });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}
