import { NextResponse } from "next/server";

const CONVEX_URL = "https://mellow-robin-248.convex.cloud";
const MAX_PER_SLOT = 15;

interface Registration {
  weekLabel: string;
  startTime: string;
  endTime: string;
  name: string;
}

interface SlotInfo {
  enrolled: number;
  spotsLeft: number;
  maxCapacity: number;
}

interface WeekInfo {
  week: string;
  morning: SlotInfo;
  midday: SlotInfo;
  totalEnrolled: number;
  totalSpotsLeft: number;
}

export async function GET() {
  try {
    const resp = await fetch(`${CONVEX_URL}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "registrations:listAll", args: {} }),
      next: { revalidate: 30 }, // Cache for 30s
    });

    if (!resp.ok) {
      throw new Error(`Convex error: ${resp.status}`);
    }

    const data = await resp.json();
    const regs: Registration[] = data.value || [];

    // Count by week and time slot
    const weekMap: Record<string, { morning: number; midday: number }> = {};

    for (const r of regs) {
      const week = r.weekLabel || "";
      if (!week) continue;
      if (!weekMap[week]) weekMap[week] = { morning: 0, midday: 0 };

      if (r.startTime === "10:00") {
        weekMap[week].morning++;
      } else if (r.startTime === "12:00") {
        weekMap[week].midday++;
      }
    }

    // Build response — only future/current weeks
    const weeks: WeekInfo[] = [
      "June 16 – 19",
      "June 23 – 26",
      "June 30 – July 3",
    ].map((week) => {
      // Try both dash styles (Convex uses en-dash)
      const counts = weekMap[week] ||
        weekMap[week.replace("–", "–")] ||
        weekMap[week.replace("–", "-")] ||
        { morning: 0, midday: 0 };

      return {
        week,
        morning: {
          enrolled: counts.morning,
          spotsLeft: Math.max(0, MAX_PER_SLOT - counts.morning),
          maxCapacity: MAX_PER_SLOT,
        },
        midday: {
          enrolled: counts.midday,
          spotsLeft: Math.max(0, MAX_PER_SLOT - counts.midday),
          maxCapacity: MAX_PER_SLOT,
        },
        totalEnrolled: counts.morning + counts.midday,
        totalSpotsLeft: Math.max(0, MAX_PER_SLOT - counts.morning) + Math.max(0, MAX_PER_SLOT - counts.midday),
      };
    });

    return NextResponse.json({ weeks, maxPerSlot: MAX_PER_SLOT, totalRegistrations: regs.length });
  } catch (err: any) {
    console.error("Camp spots error:", err);
    return NextResponse.json(
      { error: "Failed to fetch camp spots", detail: err.message },
      { status: 500 }
    );
  }
}
