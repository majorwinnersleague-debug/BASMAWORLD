import type { Metadata } from 'next'
import PortalContent from './PortalContent'

export const metadata: Metadata = {
  title: 'Parent Portal — BASMA Music Academy',
  description: 'View your child\'s enrollment, class schedule, and updates from BASMA Music Academy.',
}

export default function PortalPage() {
  return <PortalContent />
}
