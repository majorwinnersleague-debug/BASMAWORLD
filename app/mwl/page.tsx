import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MWLContent from './MWLContent'

export const metadata: Metadata = {
  title: 'Major Winners League — Community, Youth Resources & Gaming | Las Vegas',
  description: 'Major Winners League: community events, Hopes Chance youth resources, gaming, podcasts, and motivational content. Las Vegas, NV. Part of BasmaWorld.',
  keywords: ['major winners league', 'hopes chance las vegas', 'youth resources las vegas', 'community events', 'gaming community', 'basmaworld', 'basma awada', 'las vegas community'],
  openGraph: {
    title: 'Major Winners League — Community & Youth Resources | Las Vegas',
    description: 'Community events, youth resources, gaming, podcasts, and motivational content.',
    url: 'https://basmaworld.com/mwl',
    siteName: 'BasmaWorld',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/basma-community.jpg', width: 1200, height: 630, alt: 'Major Winners League — Community & Youth Resources' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@basma_singer',
    creator: '@basma_singer',
    title: 'Major Winners League — Community & Impact',
    description: 'Community, youth resources, gaming & podcasts. Las Vegas.',
    images: ['/images/basma-community.jpg'],
  },
  alternates: {
    canonical: 'https://basmaworld.com/mwl',
  },
}

const mwlJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Major Winners League',
  url: 'https://basmaworld.com/mwl',
  description: 'Community events, youth resources, gaming, podcasts, and motivational content in Las Vegas.',
  parentOrganization: {
    '@type': 'Organization',
    name: 'BASMA LLC',
    url: 'https://basmaworld.com',
  },
}

export default function MWLPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mwlJsonLd) }}
      />
      <Navbar />
      <MWLContent />
      <Footer />
    </>
  )
}
