import { NextRequest, NextResponse } from "next/server";
import { getActiveStudents, getLessonRequests } from "@/lib/active-db";

const COOKIE_NAME = "basma_teacher_database";

export async function GET(request: NextRequest) {
  if (request.cookies.get(COOKIE_NAME)?.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
