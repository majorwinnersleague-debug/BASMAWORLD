export const dynamic = 'force-static'
export const revalidate = 86400

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | BasmaWorld',
  description: 'Privacy policy for BasmaWorld, Become A Singer Music Academy, and Hopes Chance. BASMA LLC, Las Vegas NV.',
  openGraph: {
    title: 'Privacy Policy | BasmaWorld',
    description: 'Privacy policy for BasmaWorld, BASMA Music Academy & Hopes Chance.',
    url: 'https://basmaworld.com/privacy',
    siteName: 'BasmaWorld',
    type: 'website',
  },
  alternates: {
    canonical: 'https://basmaworld.com/privacy',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-white/30 text-sm mb-10">Last updated: April 2026 · BASMA LLC · Las Vegas, NV</p>

        <div className="prose prose-invert max-w-none space-y-8 text-white/60 text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-bold text-lg mb-3">1. Who We Are</h2>
            <p>BasmaWorld is operated by BASMA LLC, located at 9205 W Russell Rd Building 3, Las Vegas, NV 89148. We operate basmaworld.com, Become A Singer Music Academy, Hopes Chance, and the Gateway Festival.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">2. Information We Collect</h2>
            <p>We collect information you provide directly, such as your name and email address when you book a lesson, sign up for updates, or use our contact form. We also collect analytics data through PostHog to understand how visitors use our site.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">3. Children&apos;s Privacy (COPPA)</h2>
            <p>BasmaWorld serves students of all ages including children under 13. We do not knowingly collect personal information from children under 13 without verifiable parental consent. Parents or guardians who believe their child has provided us personal information may contact us at (702) 788-7369 to request deletion.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">4. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To communicate lesson bookings and schedule updates</li>
              <li>To send educational content you have opted into</li>
              <li>To improve our website and services</li>
              <li>To process payments securely through Stripe</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">5. Third-Party Services</h2>
            <p>We use the following third-party services: Stripe (payments), Airtable (data storage), Resend (email delivery), PostHog (analytics), and Vercel (hosting). Each has their own privacy policy.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">6. Your Rights</h2>
            <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at (702) 788-7369 or through our contact form at basmaworld.com/contact.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">7. Contact</h2>
            <p>BASMA LLC · 9205 W Russell Rd Building 3 · Las Vegas, NV 89148 · (702) 788-7369</p>
          </section>

        </div>
      </div>
    </div>
  )
}
