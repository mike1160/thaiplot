import { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/react'
import './[locale]/globals.css'

type Props = { children: ReactNode }

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
      </head>
      <body className="min-h-screen text-[#142038] antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
