import { NextResponse } from "next/server";

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || "";
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || "appK3o119Z5r9AY6j";
const AIRTABLE_TABLE = "tbl1diIEhM9MtKViE"; // BASMA Marketing Leads

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

async function fetchAllAirtableRecords(): Promise<AirtableRecord[]> {
  const allRecords: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const params = new URLSearchParams({ pageSize: "100" });
    if (offset) params.set("offset", offset);

    const resp = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}?${params}`,
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

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search")?.toLowerCase() || "";
    const source = url.searchParams.get("source") || "";

    const records = await fetchAllAirtableRecords();

    // Transform records into a cleaner format
    const registrations = records.map((r) => {
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
        address: parsed?.address || "",
        createdAt: r.createdTime,
      };
    });

    // Filter
    let filtered = registrations;
    if (search) {
      filtered = filtered.filter(
        (r) =>
          r.parentName.toLowerCase().includes(search) ||
          r.email.toLowerCase().includes(search) ||
          r.studentName.toLowerCase().includes(search) ||
          r.phone.includes(search)
      );
    }
    if (source) {
      filtered = filtered.filter((r) => r.source === source);
    }

    // Group by parent for the portal view
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
      stats: {
        total: registrations.length,
        newLead: registrations.filter((r) => r.status === "New Lead").length,
        incomplete: registrations.filter((r) => r.status === "Incomplete").length,
        withStudent: registrations.filter((r) => r.studentName).length,
        sources: registrations.reduce((acc, r) => {
          acc[r.source] = (acc[r.source] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
    });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch registrations", detail: err.message },
      { status: 500 }
    );
  }
}
