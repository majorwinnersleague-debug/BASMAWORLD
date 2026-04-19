import type { Metadata } from 'next'
import HomeContent from './HomeContent'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'BasmaWorld — Marketing, Music & Community | Las Vegas',
  description: 'BasmaWorld: Major Winners Marketing (social media services), BASMA Music Academy (singing, piano, guitar lessons), and Major Winners League (community & youth resources). Las Vegas, NV.',
  keywords: ['basmaworld', 'social media marketing las vegas', 'music lessons las vegas', 'singing lessons', 'piano lessons', 'community events las vegas', 'basma awada', 'major winners league', 'major winners marketing', 'youth resources las vegas'],
  openGraph: {
    title: 'BasmaWorld — Marketing, Music & Community | Las Vegas',
    description: 'Grow your brand. Learn music. Build community. Powered by real people and AI.',
    url: 'https://basmaworld.com',
    siteName: 'BasmaWorld',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/basma-hero.jpg', width: 1200, height: 630, alt: 'BasmaWorld — Marketing, Music & Community in Las Vegas' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@basma_singer',
    creator: '@basma_singer',
    title: 'BasmaWorld — Marketing, Music & Community',
    description: 'Grow your brand. Learn music. Build community. Las Vegas, NV.',
    images: ['/images/basma-hero.jpg'],
  },
  alternates: {
    canonical: 'https://basmaworld.com',
  },
}

const homeJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://basmaworld.com/#org',
    name: 'BasmaWorld',
    alternateName: 'BASMA LLC',
    url: 'https://basmaworld.com',
    logo: 'https://basmaworld.com/og-image.jpg',
    description: 'BasmaWorld is home to Major Winners Marketing, BASMA Music Academy, and Major Winners League. Las Vegas based.',
    telephone: '+1-702-788-7369',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '9205 W Russell Rd Building 3',
      addressLocality: 'Las Vegas',
      addressRegion: 'NV',
      postalCode: '89148',
      addressCountry: 'US',
    },
    sameAs: [
      'https://www.tiktok.com/@basma_singer',
      'https://www.instagram.com/basma.tea',
      'https://linktr.ee/BASMATea',
      'https://www.youtube.com/channel/UChszcJ6HQ4u1NoTs4-06H3w',
      'https://open.spotify.com/artist/1PA6WUf27E53oaHmWPVNBt',
      'https://discord.gg/4nzX2Wb5HW',
      'https://twitter.com/BASMA_music',
    ],
    founder: {
      '@type': 'Person',
      name: 'Basma Awada',
      url: 'https://basmaworld.com/basma',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://basmaworld.com/#website',
    name: 'BasmaWorld',
    url: 'https://basmaworld.com',
    publisher: { '@id': 'https://basmaworld.com/#org' },
  },
]

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <Navbar />
      <HomeContent />
      <Footer />
    </>
  )
}
