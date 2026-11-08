import type { Metadata } from 'next'
import CreditsContent from './CreditsContent'

export const metadata: Metadata = {
  title: 'Lesson Credits — BASMA Teacher Portal',
  robots: { index: false, follow: false },
}

export default function TeacherCreditsPage() {
  return <CreditsContent />
}
