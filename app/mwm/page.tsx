import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MWMContent from './MWMContent'

export const metadata: Metadata = {
  title: 'Major Winners Marketing — Social Media Services & AI Tools | Las Vegas',
  description: 'Major Winners Marketing: social media management, content creation, growth strategy, and AI-powered marketing tools. Built on 300K+ followers of organic growth experience. Las Vegas, NV.',
  keywords: ['social media marketing las vegas', 'content creation services', 'social media management', 'AI marketing tools', 'major winners marketing', 'basmaworld', 'brand growth', 'tiktok marketing'],
  openGraph: {
    title: 'Major Winners Marketing — Social Media Services | Las Vegas',
    description: 'Social media management, content creation, and AI-powered growth tools.',
    url: 'https://basmaworld.com/mwm',
    siteName: 'BasmaWorld',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/basma-hero.jpg', width: 1200, height: 630, alt: 'Major Winners Marketing — Social Media Services' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@basma_singer',
    creator: '@basma_singer',
    title: 'Major Winners Marketing — Grow Your Brand',
    description: 'Social media services & AI tools. Las Vegas.',
    images: ['/images/basma-hero.jpg'],
  },
  alternates: {
    canonical: 'https://basmaworld.com/mwm',
  },
}

const mwmJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Major Winners Marketing',
  url: 'https://basmaworld.com/mwm',
  description: 'Social media management, content creation, and AI-powered marketing tools for businesses.',
  telephone: '+1-702-788-7369',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '9205 W Russell Rd Building 3',
    addressLocality: 'Las Vegas',
    addressRegion: 'NV',
    postalCode: '89148',
    addressCountry: 'US',
  },
  parentOrganization: {
    '@type': 'Organization',
    name: 'BASMA LLC',
    url: 'https://basmaworld.com',
  },
}

export default function MWMPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mwmJsonLd) }}
      />
      <Navbar />
      <MWMContent />
      <Footer />
    </>
  )
}
