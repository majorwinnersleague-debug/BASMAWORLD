import type { Metadata } from 'next'
import PrivateLessonsContent from './PrivateLessonsContent'

export const metadata: Metadata = {
  title: 'Private Lessons — BASMA Music Academy | BasmaWorld',
  description: 'Book private music lessons with BASMA. Individual lessons are $45 for 30 minutes or $70 for 60 minutes. Monthly 4-lesson packages are $135 or $200.',
  keywords: ['private music lessons las vegas', 'music tutoring', 'piano lessons', 'vocal lessons', 'basma music academy'],
  openGraph: {
    title: 'Private Music Lessons — BASMA',
    description: 'Book a 30- or 60-minute private lesson, or choose a monthly 4-lesson package.',
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
