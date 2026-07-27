'use client'

import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'

const CONSENT_KEY = 'thaiplot-cookie-consent'

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
  return <Analytics />
}
