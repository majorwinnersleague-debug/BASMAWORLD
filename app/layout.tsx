import type { Metadata } from 'next'
import './globals.css'
import { PostHogProvider } from '@/components/PostHogProvider'

export const metadata: Metadata = {
  metadataBase: new URL('https://basmaworld.com'),
  title: { default: 'BasmaWorld — Music Academy, Community & Youth Resources | Las Vegas', template: '%s | BasmaWorld' },
  description: 'BasmaWorld is home to BASMA Music Academy, Major Winners League community content, and Hopes Chance youth resources. Las Vegas based. Learn music, find community, get support.',
  keywords: ['music academy', 'Las Vegas', 'youth resources', 'Billy the Puppet', 'BasmaTeach Me', 'Hopes Chance', 'Major Winners League', 'singing lessons', 'piano lessons', 'guitar lessons'],
  openGraph: { type: 'website', locale: 'en_US', url: 'https://basmaworld.com', siteName: 'BasmaWorld', images: [{ url: '/og-image.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', creator: '@basma_singer' },
  robots: { index: true, follow: true },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BASMA LLC',
  url: 'https://basmaworld.com',
  logo: 'https://basmaworld.com/og-image.jpg',
  description: 'BasmaWorld is home to BASMA Music Academy, Major Winners League community content, and Hopes Chance youth resources. Las Vegas based.',
  sameAs: [
    'https://www.tiktok.com/@basma_singer',
    'https://www.tiktok.com/@basmateachme',
    'https://www.instagram.com/basma.tea',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="bg-black text-white antialiased">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  )
}
