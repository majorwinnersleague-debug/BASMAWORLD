import { sql } from "./db";

export async function getActiveStudents() {
  return sql\`SELECT * FROM active_students ORDER BY LOWER(student_name), id\`;
}

export async function getLessonRequests() {
  return sql\`SELECT * FROM lesson_requests ORDER BY requested_at DESC\`;
}
