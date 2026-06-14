import type { Metadata } from 'next'
import EnrollContent from './EnrollContent'

export const metadata: Metadata = {
  title: 'Enroll — BASMA Summer Classes 2026',
  description: 'Enroll in BASMA Summer Music Classes. Piano, voice, performance & dance for ages 2–17. July & August in Las Vegas.',
}

export default function EnrollPage() {
  return <EnrollContent />
}
