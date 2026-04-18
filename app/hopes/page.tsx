import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BillyChat from '@/components/BillyChat'
import HopesContent from '@/components/HopesContent'

export const metadata = {
  title: 'Hopes Chance — Free Youth Resources | Las Vegas, NV',
  description: 'Hopes Chance by BasmaWorld — free resource navigator connecting youth ages 16-30 in Las Vegas to housing, jobs, mental health, food, and more. No judgment, confidential.',
  keywords: ['youth resources las vegas', 'hopes chance', 'free resources las vegas', 'music lessons las vegas', 'singing lessons las vegas', 'kids music academy', 'basma music school', 'vocal coach las vegas', 'las vegas youth programs', 'housing help las vegas'],
  openGraph: {
    title: 'Hopes Chance — Free Youth Resources | Las Vegas, NV',
    description: 'Free resource navigator for youth ages 16-30 in Las Vegas. Housing, jobs, mental health, food, and more. Confidential. No judgment.',
    url: 'https://basmaworld.com/hopes',
    siteName: 'BasmaWorld',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Hopes Chance Youth Resources Las Vegas' }],
  },
}

const ngoSchema = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: 'Hopes Chance',
  url: 'https://basmaworld.com/hopes',
  description: 'Free resource navigator connecting youth ages 16–30 to housing, jobs, mental health services, and more in Las Vegas, Nevada.',
  areaServed: {
    '@type': 'City',
    name: 'Las Vegas',
    addressRegion: 'NV',
    addressCountry: 'US',
  },
  parentOrganization: {
    '@type': 'Organization',
    name: 'BASMA LLC',
    url: 'https://basmaworld.com',
  },
  telephone: '+1-702-788-7369',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '9205 W Russell Rd Building 3',
    addressLocality: 'Las Vegas',
    addressRegion: 'NV',
    postalCode: '89148',
    addressCountry: 'US',
  },
  knowsAbout: ['Housing', 'Food Support', 'Mental Health', 'Job Training', 'Healthcare', 'Youth Programs'],
}

export default function HopesChancePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ngoSchema) }}
      />
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
        <HopesContent />
      </main>
      <Footer />
      <BillyChat page="hopes" />
    </>
  )
}
