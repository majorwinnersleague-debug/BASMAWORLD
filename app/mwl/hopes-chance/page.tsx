// Server-side redirect — handled by next.config.js redirects
// This file exists as a fallback
import { redirect } from 'next/navigation'
export default function HopesChanceRedirect() {
  redirect('/hopes')
}
