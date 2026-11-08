import type { Metadata } from 'next'
import PrivateLessonsContent from './PrivateLessonsContent'
import { getPrice, formatUsd, isHolidaySpecialActive, HOLIDAY_SPECIAL } from '@/lib/pricing'

// Re-render every 5 minutes so prices (e.g. the end of the holiday special at
// midnight Pacific on January 1) update without a redeploy.
export const revalidate = 300

export function generateMetadata(): Metadata {
  const p = (id: Parameters<typeof getPrice>[0]) => formatUsd(getPrice(id))
  const monthly = `Monthly 4-lesson packages are ${p('monthly-4x30min')} or ${p('monthly-4x60min')}${isHolidaySpecialActive() ? ` (${HOLIDAY_SPECIAL.label.toLowerCase()} ${HOLIDAY_SPECIAL.endsLabel})` : ''}.`
  return {
    title: 'Private Lessons — BASMA Music Academy | BasmaWorld',
    description: `Book private music lessons with BASMA. Individual lessons are ${p('individual-30min')} for 30 minutes or ${p('individual-60min')} for 60 minutes. ${monthly} Free 15-minute trial lesson available.`,
    keywords: ['private music lessons las vegas', 'music tutoring', 'piano lessons', 'vocal lessons', 'basma music academy'],
    openGraph: {
      title: 'Private Music Lessons — BASMA',
      description: 'Book a 30- or 60-minute private lesson, choose a monthly 4-lesson package, or request a free 15-minute trial.',
      url: 'https://basmaworld.com/private-lessons',
      siteName: 'BasmaWorld',
      type: 'website',
      locale: 'en_US',
    },
    alternates: { canonical: 'https://basmaworld.com/private-lessons' },
  }
}

export default function PrivateLessonsPage() {
  return <PrivateLessonsContent />
}
