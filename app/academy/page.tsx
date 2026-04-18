import { redirect } from 'next/navigation'

// Server-side permanent redirect — avoids the 404 on custom domains
// that a client-side useRouter().replace() can produce before hydration.
export default function AcademyRedirect() {
  redirect('/basma/academy')
}
