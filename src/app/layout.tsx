import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/react'
import './[locale]/globals.css'

type Props = { children: ReactNode }

export const metadata: Metadata = {
  other: {
    'llms-txt': 'https://www.thaiplot.com/llms.txt',
  },
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="p:domain_verify" content="607976f15f114c1775ec4024af8f60e7" />
        <meta name="llms-txt" content="https://www.thaiplot.com/llms.txt" />
      </head>
      <body className="min-h-screen text-[#142038] antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
