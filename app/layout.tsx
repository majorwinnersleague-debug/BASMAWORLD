import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://basmaworld.com'),
  title: { default: 'BasmaWorld — Music Academy, Community & Youth Resources | Las Vegas', template: '%s | BasmaWorld' },
  description: 'BasmaWorld is home to BASMA Music Academy, Major Winners League community content, and Hopes Chance youth resources. Las Vegas based. Learn music, find community, get support.',
  keywords: ['music academy', 'Las Vegas', 'youth resources', 'Billy the Puppet', 'BasmaTeach Me', 'Hopes Chance', 'Major Winners League', 'singing lessons', 'piano lessons', 'guitar lessons', 'vocal coach', 'music lessons las vegas'],
  openGraph: { type: 'website', locale: 'en_US', url: 'https://basmaworld.com', siteName: 'BasmaWorld', images: [{ url: '/images/basma-hero.jpg', width: 1200, height: 630, alt: 'BasmaWorld — Music Academy, Community & Youth Resources in Las Vegas' }] },
  twitter: { card: 'summary_large_image', site: '@basma_singer', creator: '@basma_singer' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  verification: {
    // Add these when you have the verification codes:
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-code',
  },
  alternates: {
    canonical: 'https://basmaworld.com',
  },
  other: {
    'geo.region': 'US-NV',
    'geo.placename': 'Las Vegas',
    'geo.position': '36.0738;-115.2642',
    'ICBM': '36.0738, -115.2642',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BASMA LLC',
  url: 'https://basmaworld.com',
  logo: 'https://basmaworld.com/og-image.jpg',
  description: 'BasmaWorld is home to BASMA Music Academy, Major Winners League community content, and Hopes Chance youth resources. Las Vegas based.',
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
    'https://www.tiktok.com/@basmateachme',
    'https://www.instagram.com/basma.tea',
    'https://linktr.ee/BASMATea',
    'https://www.youtube.com/channel/UChszcJ6HQ4u1NoTs4-06H3w',
    'https://www.youtube.com/channel/UC7Okrsw96-s0bHg9wEPkvuQ',
    'https://open.spotify.com/artist/1PA6WUf27E53oaHmWPVNBt',
    'https://itunes.apple.com/us/artist/1543777421',
    'https://discord.gg/4nzX2Wb5HW',
    'https://m.twitch.tv/basmasinger',
    'https://www.facebook.com/share/y5V8Jm2dKTpCGbc4/',
    'https://twitter.com/BASMA_music',
    'https://v.lemon8-app.com/al/OgQQshrUcv',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased"
        style={{ background: 'linear-gradient(160deg, #0f0320 0%, #1a0533 40%, #0d1a2e 100%)', minHeight: '100vh' }}
      >
        {children}
      </body>
    </html>
  )
}
