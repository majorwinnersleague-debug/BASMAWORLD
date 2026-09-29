import { sql } from "./db";

export async function getActiveStudents() {
  if (!sql) return [];
  return sql`SELECT * FROM active_students ORDER BY LOWER(student_name), id`;
}

export async function getLessonRequests() {
  if (!sql) return [];
  return sql`SELECT * FROM lesson_requests ORDER BY requested_at DESC`;
}
