import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BasmaWorld — Music. Community. Opportunity.',
  description: 'BASMA Music Academy, Major Winners League & Hopes Chance — unified on one platform.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{__html: `
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  basma: { purple: '#7c3aed', yellow: '#eab308', green: '#16a34a' }
                }
              }
            }
          }
        `}} />
      </head>
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  )
}
