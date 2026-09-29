import type { Metadata } from 'next'
import PrivateLessonsContent from './PrivateLessonsContent'

export const metadata: Metadata = {
  title: 'Private Lessons — BASMA Music Academy | BasmaWorld',
  description: 'Book private music lessons with BASMA. Private lessons. Packages of 4 lessons starting at $45/lesson.',
  keywords: ['private music lessons las vegas', 'music tutoring', 'piano lessons', 'vocal lessons', 'basma music academy'],
  openGraph: {
    title: 'Private Music Lessons — BASMA',
    description: 'Book your free 20-minute trial lesson. Monthly packages available for 4 lessons.',
    url: 'https://basmaworld.com/private-lessons',
    siteName: 'BasmaWorld',
    type: 'website',
    locale: 'en_US',
  },
  alternates: { canonical: 'https://basmaworld.com/private-lessons' },
}

export default function PrivateLessonsPage() {
  return <PrivateLessonsContent />
}
