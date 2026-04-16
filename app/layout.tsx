import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BasmaWorld — Music. Community. Opportunity.',
  description: 'BASMA Music Academy, Major Winners League & Hopes Chance — unified on one platform.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
