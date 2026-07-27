'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { CONSENT_KEY } from '@/components/CookieConsent'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export function trackGaEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', eventName, params)
}

export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
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

  if (!measurementId || !allowed) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  )
}
