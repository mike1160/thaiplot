'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    turnstileCallback?: (token: string) => void
    turnstileErrorCallback?: () => void
  }
}

type TurnstileWidgetProps = {
  onToken: (token: string) => void
  onError?: () => void
  className?: string
}

/** Same managed/light Turnstile pattern as hua-hin-land.com */
export default function TurnstileWidget({
  onToken,
  onError,
  className = '',
}: TurnstileWidgetProps) {
  useEffect(() => {
    window.turnstileCallback = (token: string) => {
      onToken(token)
    }
    window.turnstileErrorCallback = () => {
      onToken('')
      onError?.()
      const el = document.querySelector('.cf-turnstile') as HTMLElement | null
      if (el) el.style.visibility = 'hidden'
    }

    const existing = document.querySelector(
      'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
    ) as HTMLScriptElement | null

    if (!existing) {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      script.async = true
      document.head.appendChild(script)

      return () => {
        if (script.parentNode) script.parentNode.removeChild(script)
        delete window.turnstileCallback
        delete window.turnstileErrorCallback
      }
    }

    return () => {
      delete window.turnstileCallback
      delete window.turnstileErrorCallback
    }
  }, [onToken, onError])

  const siteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAADwcB6k73kTycYDr'

  return (
    <div
      className={`cf-turnstile ${className}`}
      data-sitekey={siteKey}
      data-callback="turnstileCallback"
      data-error-callback="turnstileErrorCallback"
      data-theme="light"
    />
  )
}
