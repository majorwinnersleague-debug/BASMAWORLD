import type { Metadata } from 'next'
import TeacherContent from './TeacherContent'

export const metadata: Metadata = {
  title: 'Teacher Portal — BASMA Music Academy',
  description: 'Teacher dashboard for BASMA Music Academy. View enrollments, manage schedule, and track attendance.',
}

export default function TeacherPage() {
  return <TeacherContent />
}
