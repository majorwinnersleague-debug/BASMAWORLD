import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BasmaWorld — Music. Community. Opportunity.',
  description: 'BASMA Music Academy, Major Winners League & Hopes Chance — unified on one platform.',
  openGraph: {
    title: 'BasmaWorld — Music. Community. Opportunity.',
    description: 'Gamified music school, content agency & youth resource navigator — all in one.',
    url: 'https://basmaworld.com',
    siteName: 'BasmaWorld',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BasmaWorld',
    description: 'Music. Community. Opportunity.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  )
}
