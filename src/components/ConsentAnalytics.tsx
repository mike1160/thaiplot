'use client'

import { useEffect, useState, type ComponentType } from 'react'
import Script from 'next/script'
import {
  CONSENT_EVENT,
  hasAcceptedCookieConsent,
} from '@/lib/cookie-consent'

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-LR89JN9T3L'

/** Loads GA4 only after cookie consent is accepted. */
export default function ConsentAnalytics() {
  const [allowed, setAllowed] = useState(false)
  const [VercelAnalytics, setVercelAnalytics] = useState<ComponentType | null>(null)

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

    // Optional Cloudflare Web Analytics — only after Accept
    const token = process.env.NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN
    if (token && !document.querySelector('script[data-cf-beacon]')) {
      const script = document.createElement('script')
      script.defer = true
      script.src = 'https://static.cloudflareinsights.com/beacon.min.js'
      script.setAttribute('data-cf-beacon', JSON.stringify({ token }))
      document.head.appendChild(script)
    }

    // Load Vercel Analytics client-only after consent
    let cancelled = false
    void import('@vercel/analytics/react').then((mod) => {
      if (!cancelled) setVercelAnalytics(() => mod.Analytics)
    })
    return () => {
      cancelled = true
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
      {VercelAnalytics ? <VercelAnalytics /> : null}
    </>
  )
}
