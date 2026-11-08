import type { Metadata } from 'next'
import ScheduleContent from './ScheduleContent'

export const metadata: Metadata = {
  title: 'Schedule — BASMA Teacher Portal',
  robots: { index: false, follow: false },
}

export default function TeacherSchedulePage() {
  return <ScheduleContent />
}
