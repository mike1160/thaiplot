'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'

const CONSENT_KEY = 'thaiplot-cookie-consent'
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

/** Loads analytics only after cookie consent is accepted. */
export default function ConsentAnalytics() {
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const sync = () => {
      try {
        setAllowed(localStorage.getItem(CONSENT_KEY) === 'accepted')
      } catch {
        setAllowed(false)
      }
    }

    sync()
    window.addEventListener('thaiplot-cookie-consent', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('thaiplot-cookie-consent', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  useEffect(() => {
    if (!allowed) return

    // Optional Cloudflare Web Analytics — only after Accept
    const token = process.env.NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN
    if (!token) return
    if (document.querySelector('script[data-cf-beacon]')) return

    const script = document.createElement('script')
    script.defer = true
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js'
    script.setAttribute('data-cf-beacon', JSON.stringify({ token }))
    document.head.appendChild(script)
  }, [allowed])

  if (!allowed) return null

  return (
    <>
      {GA_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      ) : null}
      <Analytics />
    </>
  )
}
