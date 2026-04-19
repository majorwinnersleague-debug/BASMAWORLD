import type { Metadata } from 'next'
import HomeContent from './HomeContent'

export const metadata: Metadata = {
  title: 'BasmaWorld — Music Lessons Las Vegas | Singing, Piano & Guitar Academy',
  description: 'Las Vegas music academy offering singing, piano, guitar & vocal lessons for kids and adults. $29 trial lesson. Founded by Basma Awada with 300K+ community. Book today!',
  keywords: ['music lessons las vegas', 'singing lessons las vegas', 'piano lessons las vegas', 'guitar lessons las vegas', 'vocal coach las vegas', 'kids music lessons las vegas', 'music academy las vegas', 'voice lessons near me', 'basma awada', 'become a singer academy', 'las vegas music teacher', 'online singing lessons'],
  openGraph: {
    title: 'BasmaWorld — Music Lessons Las Vegas | Singing, Piano & Guitar',
    description: 'Las Vegas music academy — singing, piano, guitar & vocal coaching for kids & adults. $29 trial. 300K+ community.',
    url: 'https://basmaworld.com',
    siteName: 'BasmaWorld',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/basma-hero.jpg', width: 1200, height: 630, alt: 'BasmaWorld Music Academy — Singing, Piano & Guitar Lessons in Las Vegas NV' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@basma_singer',
    creator: '@basma_singer',
    title: 'BasmaWorld — Music Lessons Las Vegas',
    description: 'Singing, piano, guitar & vocal coaching in Las Vegas. $29 trial. 300K+ community.',
    images: ['/images/basma-hero.jpg'],
  },
  alternates: {
    canonical: 'https://basmaworld.com',
  },
}

const homeJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'MusicSchool',
    '@id': 'https://basmaworld.com/#musicschool',
    name: 'BASMA Music Academy — Become A Singer',
    alternateName: 'BasmaWorld',
    url: 'https://basmaworld.com',
    logo: 'https://basmaworld.com/og-image.jpg',
    image: 'https://basmaworld.com/images/basma-academy.jpg',
    description: 'Professional singing, piano, guitar & vocal coaching for kids and adults in Las Vegas. Gamified learning with XP system. Trial lesson $29.',
    telephone: '+1-702-788-7369',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '9205 W Russell Rd Building 3',
      addressLocality: 'Las Vegas',
      addressRegion: 'NV',
      postalCode: '89148',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 36.0738,
      longitude: -115.2642,
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '20:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '10:00', closes: '16:00' },
    ],
    sameAs: [
      'https://www.tiktok.com/@basma_singer',
      'https://www.tiktok.com/@basmateachme',
      'https://www.instagram.com/basma.tea',
      'https://linktr.ee/BASMATea',
    ],
    founder: {
      '@type': 'Person',
      name: 'Basma Awada',
      jobTitle: 'Vocal Coach & Music Educator',
      url: 'https://basmaworld.com/basma/artist',
    },
    areaServed: {
      '@type': 'City',
      name: 'Las Vegas',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Music Lessons',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Singing Lessons' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Piano Lessons' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Guitar Lessons' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Vocal Coaching' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Violin Lessons' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Drums Lessons' } },
      ],
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://basmaworld.com/#website',
    name: 'BasmaWorld',
    url: 'https://basmaworld.com',
    publisher: { '@id': 'https://basmaworld.com/#musicschool' },
  },
]

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <HomeContent />
    </>
  )
}
