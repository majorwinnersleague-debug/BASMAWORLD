import { NextResponse } from "next/server";

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || "";
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || "appK3o119Z5r9AY6j";
const BLOCKED_TABLE = process.env.BLOCKED_TABLE_ID || "tbleV623dZRhgmULJ"; // Blocked Contacts

// Normalize phone: strip non-digits, strip leading 1 for US numbers
function normalizePhone(raw: string): string {
  const d = raw.replace(/\D/g, "");
  return d.length === 11 && d.startsWith("1") ? d.slice(1) : d;
}

// GET — list all blocked contacts
export async function GET() {
  if (!BLOCKED_TABLE) {
    return NextResponse.json({ blocked: [] });
  }

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${BLOCKED_TABLE}?sort%5B0%5D%5Bfield%5D=Blocked+At&sort%5B0%5D%5Bdirection%5D=desc`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_PAT}` },
      cache: "no-store",
    });
    const data = await res.json();
    const blocked = (data.records || []).map((r: any) => ({
      id: r.id,
      phone: r.fields?.Phone || "",
      name: r.fields?.Name || "",
      blockedAt: r.fields?.["Blocked At"] || "",
    }));
    return NextResponse.json({ blocked });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST — block a contact by phone number
export async function POST(req: Request) {
  if (!BLOCKED_TABLE) {
    return NextResponse.json({ error: "Blocked contacts table not configured" }, { status: 500 });
  }

  try {
    const { phone, name } = await req.json();
    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const normalized = normalizePhone(phone);
    if (normalized.length < 7) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    // Check if already blocked
    const checkUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${BLOCKED_TABLE}?filterByFormula=SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE({Phone},"-",""),"(",""),")","")," ","")="${normalized}"`;
    const checkRes = await fetch(checkUrl, {
      headers: { Authorization: `Bearer ${AIRTABLE_PAT}` },
      cache: "no-store",
    });
    const checkData = await checkRes.json();
    if (checkData.records && checkData.records.length > 0) {
      return NextResponse.json({ error: "This number is already blocked" }, { status: 409 });
    }

    // Create blocked record
    const createUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${BLOCKED_TABLE}`;
    const createRes = await fetch(createUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_PAT}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              Phone: normalized,
              Name: name || "",
              "Blocked At": new Date().toISOString(),
            },
          },
        ],
      }),
    });
    const createData = await createRes.json();
    return NextResponse.json({ success: true, record: createData.records?.[0] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE — unblock a contact by record ID
export async function DELETE(req: Request) {
  if (!BLOCKED_TABLE) {
    return NextResponse.json({ error: "Blocked contacts table not configured" }, { status: 500 });
  }

  try {
    const { recordId } = await req.json();
    if (!recordId) {
      return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
    }

    const deleteUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${BLOCKED_TABLE}/${recordId}`;
    await fetch(deleteUrl, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${AIRTABLE_PAT}` },
    });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
