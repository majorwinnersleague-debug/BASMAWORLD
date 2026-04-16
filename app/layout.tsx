import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BasmaWorld — Music. Community. Opportunity.',
  description: 'BASMA Become A Singer Music Academy, Major Winners League community & Hopes Chance youth resources — unified on one platform.',
  keywords: 'BasmaWorld, become a singer music academy, professional singing lessons, vocal coach Las Vegas, online singing lessons, Las Vegas community events, motivational speaker Las Vegas, youth resources Las Vegas',
  openGraph: {
    title: 'BasmaWorld — Music. Community. Opportunity.',
    description: 'Gamified music academy, community impact platform & youth resource navigator — all in one.',
    url: 'https://basmaworld.com',
    siteName: 'BasmaWorld',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BasmaWorld',
    description: 'Music. Community. Opportunity.',
    creator: '@basma_singer',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  )
}
