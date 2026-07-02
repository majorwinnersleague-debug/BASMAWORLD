import type { Metadata } from 'next'
import ScholarshipContent from './ScholarshipContent'

export const metadata: Metadata = {
  title: 'BASMA World Scholarship — Affordable Music for Families',
  description: 'The BASMA World Scholarship offers families unlimited music classes for just $250/month. Priority for June program families. Las Vegas music academy.',
}

export default function ScholarshipPage() {
  return <ScholarshipContent />
}
