'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import {
  CONSENT_EVENT,
  hasAcceptedCookieConsent,
} from '@/lib/cookie-consent'

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-LR89JN9T3L'

/** Loads GA4 (and optional Cloudflare beacon) only after cookie consent is accepted. */
export default function ConsentAnalytics() {
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const sync = () => setAllowed(hasAcceptedCookieConsent())
    sync()
    window.addEventListener(CONSENT_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(CONSENT_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  useEffect(() => {
    if (!allowed) return

    const token = process.env.NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN
    if (token && !document.querySelector('script[data-cf-beacon]')) {
      const script = document.createElement('script')
      script.defer = true
      script.src = 'https://static.cloudflareinsights.com/beacon.min.js'
      script.setAttribute('data-cf-beacon', JSON.stringify({ token }))
      document.head.appendChild(script)
    }
  }, [allowed])

  if (!allowed) return null

  return (
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
  )
}
