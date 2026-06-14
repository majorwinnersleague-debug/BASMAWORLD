import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL = "BASMA <noreply@basmaworld.com>";

// Simple in-memory rate limit: max 1 alert per email per 30 minutes
const recentAlerts = new Map<string, number>();
const RATE_LIMIT_MS = 30 * 60 * 1000; // 30 minutes

export async function POST(req: NextRequest) {
  try {
    const { parentEmail, searchTerm } = await req.json();

    if (!parentEmail || !searchTerm) {
      return NextResponse.json({ ok: false, reason: "missing fields" });
    }

    // Rate limit check
    const key = parentEmail.toLowerCase().trim();
    const lastSent = recentAlerts.get(key);
    if (lastSent && Date.now() - lastSent < RATE_LIMIT_MS) {
      return NextResponse.json({ ok: true, reason: "rate-limited" });
    }

    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set — alert email not sent");
      return NextResponse.json({ ok: false, reason: "no api key" });
    }

    const now = new Date();
    const timeStr = now.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #4a0e78, #6b21a8); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h2 style="color: #ffd700; margin: 0; font-size: 22px;">🔔 BASMA Security Alert</h2>
        </div>
        <div style="background: #fff; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
          <p style="font-size: 15px; color: #333; margin: 0 0 12px;">
            Someone looked up a registration on <strong>basmaworld.com/portal</strong> that matched your account.
          </p>
          <div style="background: #f9fafb; padding: 14px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              <strong>Time:</strong> ${timeStr} (Pacific)<br>
              <strong>Search used:</strong> ${searchTerm.includes("@") ? "Email address" : "Phone number"}
            </p>
          </div>
          <p style="font-size: 14px; color: #333;">
            <strong>If this was you</strong> — no action needed! ✅
          </p>
          <p style="font-size: 14px; color: #333;">
            <strong>If this wasn't you</strong> — please contact us immediately at
            <a href="mailto:becomeasingermusicacademy@gmail.com" style="color: #6b21a8;">becomeasingermusicacademy@gmail.com</a>
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">
            Become A Singer Music Academy · <a href="https://basmaworld.com" style="color: #6b21a8;">basmaworld.com</a>
          </p>
        </div>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: key,
        subject: "🔔 Someone looked up your BASMA registration",
        html,
        text: `Security Alert: Someone searched for a registration matching your account on basmaworld.com/portal at ${timeStr}. If this was you, no action needed. If not, contact becomeasingermusicacademy@gmail.com immediately.`,
      }),
    });

    if (res.ok) {
      recentAlerts.set(key, Date.now());
      return NextResponse.json({ ok: true });
    } else {
      const err = await res.text();
      console.error("Resend error:", err);
      return NextResponse.json({ ok: false, reason: "send failed" });
    }
  } catch (err: any) {
    console.error("Search alert error:", err);
    return NextResponse.json({ ok: false, reason: err.message });
  }
}
