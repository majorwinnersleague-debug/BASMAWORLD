import { NextResponse } from "next/server";
import { getStaffSession } from "@/lib/auth";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";

// Admin-only helper for Resend domain setup. Previously protected by the
// hard-coded shared teacher code; now requires a signed admin staff session.
export async function POST(request: Request) {
  const staff = await getStaffSession();
  if (!staff || staff.role !== "admin") {
    return NextResponse.json({ error: "Admin sign-in required" }, { status: 401 });
  }

  try {
    const { action } = await request.json();

    if (action === "add") {
      // Add basmaworld.com domain to Resend
      const res = await fetch("https://api.resend.com/domains", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "basmaworld.com" }),
      });
      const data = await res.json();
      return NextResponse.json(data);
    }

    if (action === "list") {
      const res = await fetch("https://api.resend.com/domains", {
        headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
      });
      const data = await res.json();
      return NextResponse.json(data);
    }

    if (action === "verify") {
      // List domains to get the domain ID, then verify
      const listRes = await fetch("https://api.resend.com/domains", {
        headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
      });
      const domains = await listRes.json();
      const domain = domains.data?.find((d: { name: string }) => d.name === "basmaworld.com");
      if (!domain) {
        return NextResponse.json({ error: "Domain not found" }, { status: 404 });
      }
      const verifyRes = await fetch(`https://api.resend.com/domains/${domain.id}/verify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
      });
      const verifyData = await verifyRes.json();
      return NextResponse.json({ domain, verification: verifyData });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
