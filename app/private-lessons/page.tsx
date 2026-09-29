import type { Metadata } from 'next'
import PrivateLessonsContent from './PrivateLessonsContent'

export const metadata: Metadata = {
  title: 'Private Lessons — BASMA Music Academy | BasmaWorld',
  description: 'Book private music lessons with BASMA. Monthly 4-lesson packages are $140 for 30-minute lessons or $200 for 60-minute lessons.',
  keywords: ['private music lessons las vegas', 'music tutoring', 'piano lessons', 'vocal lessons', 'basma music academy'],
  openGraph: {
    title: 'Private Music Lessons — BASMA',
    description: 'Choose a monthly 4-lesson private package in 30- or 60-minute sessions.',
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
