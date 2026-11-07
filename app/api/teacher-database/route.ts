import { NextRequest, NextResponse } from "next/server";
import { getActiveStudents, getLessonRequests } from "@/lib/active-db";
import { getStaffSession, staffUnauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Signed staff session required (replaces the old forgeable
  // "basma_teacher_database=authenticated" cookie).
  const staff = await getStaffSession();
  if (!staff) return staffUnauthorized();

  try {
    const query = request.nextUrl.searchParams.get("q")?.trim().toLowerCase() || "";
    const [activeStudents, lessonRequests] = await Promise.all([
      getActiveStudents(),
      getLessonRequests(),
    ]);

    const matches = (row: Record<string, unknown>) =>
      !query ||
      Object.values(row).some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      );

    return NextResponse.json({
      activeStudents: activeStudents.filter(matches),
      lessonRequests: lessonRequests.filter(matches),
    });
  } catch (error) {
    console.error("Teacher database error:", error);
    return NextResponse.json(
      { error: "Unable to load database records." },
      { status: 500 }
    );
  }
}
