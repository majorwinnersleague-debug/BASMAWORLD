import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BasmaContent from './BasmaContent'

export const metadata: Metadata = {
  title: 'BASMA Music Academy — Singing, Piano & Guitar Lessons | Las Vegas',
  description: 'BASMA Music Academy: Tiny Tots, Kids Music, Band Academy, and Piano Fundamentals in Las Vegas. Classes Mon–Thu, 9 AM – 2:15 PM. All ages. Founded by Basma Awada.',
  keywords: ['music lessons las vegas', 'singing lessons', 'piano lessons', 'guitar lessons', 'vocal coach las vegas', 'basma awada', 'music academy', 'kids music lessons', 'basmaworld', 'become a singer'],
  openGraph: {
    title: 'BASMA Music Academy — Singing, Piano & Guitar Lessons | Las Vegas',
    description: 'Professional music lessons. Tiny Tots, Kids Music, Band Academy & Piano. Mon–Thu. All ages.',
    url: 'https://basmaworld.com/basma',
    siteName: 'BasmaWorld',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/basma-academy.jpg', width: 1200, height: 630, alt: 'BASMA Music Academy — Singing, Piano & Guitar Lessons' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@basma_singer',
    creator: '@basma_singer',
    title: 'BASMA Music Academy — Las Vegas',
    description: 'Singing, piano, guitar lessons. BASMA Academy. All ages.',
    images: ['/images/basma-academy.jpg'],
  },
  alternates: {
    canonical: 'https://basmaworld.com/basma',
  },
}

const basmaJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'MusicSchool',
    name: 'BASMA Music Academy',
    alternateName: 'Become A Singer Music Academy',
    url: 'https://basmaworld.com/basma',
    telephone: '+1-702-788-7369',
    description: 'Professional singing, piano, guitar, and vocal coaching in Las Vegas. Gamified learning with XP. All ages.',
    priceRange: '$25-$40',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '6787 W Tropicana Ave Suite 260',
      addressLocality: 'Las Vegas',
      addressRegion: 'NV',
      postalCode: '89103',
      addressCountry: 'US',
    },
    parentOrganization: {
      '@type': 'Organization',
      name: 'BASMA LLC',
      url: 'https://basmaworld.com',
    },
    founder: {
      '@type': 'Person',
      name: 'Basma Awada',
      url: 'https://basmaworld.com/basma',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Basma Awada',
    url: 'https://basmaworld.com/basma',
    jobTitle: 'Vocal Coach & Founder',
    worksFor: { '@type': 'Organization', name: 'BASMA LLC' },
    sameAs: [
      'https://www.tiktok.com/@basma_singer',
      'https://www.instagram.com/basma.tea',
      'https://open.spotify.com/artist/1PA6WUf27E53oaHmWPVNBt',
    ],
  },
]

export default function BasmaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(basmaJsonLd) }}
      />
      <Navbar />
      <BasmaContent />
      <Footer />
    </>
  )
}
