import { NextResponse } from "next/server";

const COOKIE_NAME = "basma_teacher_database";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    const expected = process.env.TEACHER_ACCESS_CODE || "1515";

    if (!code || String(code).trim() !== expected) {
      return NextResponse.json({ error: "Invalid access code" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
