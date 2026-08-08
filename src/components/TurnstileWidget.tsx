'use client'

import { useEffect, useRef } from 'react'

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
const SCRIPT_ID = 'cf-turnstile-script'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          theme?: 'light' | 'dark' | 'auto'
          callback?: (token: string) => void
          'error-callback'?: () => void
          'expired-callback'?: () => void
        }
      ) => string
      remove: (widgetId: string) => void
      reset?: (widgetId: string) => void
    }
  }
}

type TurnstileWidgetProps = {
  onToken: (token: string) => void
  onError?: () => void
  className?: string
  /** Change this value to force a fresh widget (e.g. after a failed submit). */
  resetKey?: number | string
}

function loadTurnstileScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve()
      return
    }

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Failed to load Turnstile')), {
        once: true,
      })
      return
    }

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Turnstile'))
    document.head.appendChild(script)
  })
}

/**
 * Managed/light Turnstile widget.
 * Callbacks are stored in refs so parent re-renders do NOT remount the widget
 * (remounting mid-form invalidates tokens and causes timeout-or-duplicate 400s).
 */
export default function TurnstileWidget({
  onToken,
  onError,
  className = '',
  resetKey = 0,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string>()
  const onTokenRef = useRef(onToken)
  const onErrorRef = useRef(onError)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  onTokenRef.current = onToken
  onErrorRef.current = onError

  useEffect(() => {
    if (!siteKey || !containerRef.current) return

    let cancelled = false

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return

        // Clear previous instance before re-render (resetKey change)
        if (widgetIdRef.current) {
          window.turnstile.remove(widgetIdRef.current)
          widgetIdRef.current = undefined
        }
        containerRef.current.innerHTML = ''

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: 'light',
          callback: (token: string) => {
            onTokenRef.current(token)
          },
          'error-callback': () => {
            onTokenRef.current('')
            onErrorRef.current?.()
          },
          'expired-callback': () => {
            onTokenRef.current('')
          },
        })
      })
      .catch(() => {
        onTokenRef.current('')
        onErrorRef.current?.()
      })

    return () => {
      cancelled = true
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = undefined
      }
    }
  }, [siteKey, resetKey])

  if (!siteKey) {
    return (
      <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-[12px] px-4 py-3">
        Security check not configured. Add NEXT_PUBLIC_TURNSTILE_SITE_KEY and
        TURNSTILE_SECRET_KEY to .env.local, then restart the dev server.
      </p>
    )
  }

  return <div ref={containerRef} className={className} />
}
