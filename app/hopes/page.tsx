export const dynamic = 'force-static'
export const revalidate = 86400

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BillyChat from '@/components/BillyChat'
import HopesContent from '@/components/HopesContent'
import ShareButtons from '@/components/ShareButtons'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hopes Chance — Free Youth Resources | Las Vegas, NV',
  description: 'Hopes Chance by BasmaWorld — free resource navigator connecting youth ages 16-30 in Las Vegas to housing, jobs, mental health, food, and more. No judgment, confidential.',
  keywords: ['youth resources las vegas', 'hopes chance', 'free resources las vegas', 'las vegas youth programs', 'housing help las vegas', 'mental health resources las vegas', 'job help las vegas youth', 'food assistance las vegas', 'free community resources nevada'],
  openGraph: {
    title: 'Hopes Chance — Free Youth Resources | Las Vegas, NV',
    description: 'Free resource navigator for youth ages 16-30 in Las Vegas. Housing, jobs, mental health, food & more.',
    url: 'https://basmaworld.com/hopes',
    siteName: 'BasmaWorld',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Hopes Chance — free youth resources navigator in Las Vegas NV' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@basma_singer',
    creator: '@basma_singer',
    title: 'Hopes Chance — Free Youth Resources Las Vegas',
    description: 'Housing, jobs, mental health, food & more for youth ages 16-30.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://basmaworld.com/hopes',
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
        <ShareButtons />
      </main>
      <Footer />
      <BillyChat page="hopes" />
    </>
  )
}
