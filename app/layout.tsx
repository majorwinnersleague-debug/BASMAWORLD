import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BasmaWorld — Music. Community. Opportunity.',
  description: 'BASMA Music Academy, Major Winners League & Hopes Chance — unified on one platform.',
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
