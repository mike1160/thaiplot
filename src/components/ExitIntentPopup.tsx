'use client'

import { FormEvent, useCallback, useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import TurnstileWidget from '@/components/TurnstileWidget'

const STORAGE_SHOWN = 'exitIntentShown'
const STORAGE_SUBMITTED = 'exitIntentSubmitted'

const REGIONS = [
  'Any',
  'Bangkok',
  'Chiang Mai',
  'Phuket',
  'Koh Samui',
  'Pattaya',
  'Hua Hin',
  'Chiang Rai',
  'Other',
] as const

const BUDGETS = [
  'Any',
  'Under ฿1M',
  '฿1M–5M',
  '฿5M–15M',
  '฿15M–50M',
  'Over ฿50M',
] as const

const inputClass =
  'w-full rounded-[12px] border border-[#E8E2D6] bg-white px-4 py-3 text-sm text-[#1A2744] placeholder:text-[#5C5247]/60 focus:outline-none focus:ring-2 focus:ring-amber-600/40 focus:border-amber-600'
const labelClass = 'block text-sm font-medium text-[#1A2744] mb-2'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

type ExitIntentPopupProps = {
  locale?: string
}

function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(max-width: 768px)').matches ||
    window.matchMedia('(pointer: coarse)').matches
  )
}

export default function ExitIntentPopup({ locale: localeProp }: ExitIntentPopupProps) {
  const t = useTranslations('exitIntent')
  const localeFromHook = useLocale()
  const locale = localeProp || localeFromHook

  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [securityError, setSecurityError] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const onToken = useCallback((token: string) => {
    setTurnstileToken(token)
    if (token) setSecurityError(false)
  }, [])

  const close = useCallback(() => {
    setOpen(false)
  }, [])

  useEffect(() => {
    try {
      if (
        sessionStorage.getItem(STORAGE_SHOWN) === '1' ||
        sessionStorage.getItem(STORAGE_SUBMITTED) === '1'
      ) {
        return
      }
    } catch {
      // ignore storage errors
    }

    let shown = false
    const show = () => {
      if (shown) return
      shown = true
      try {
        sessionStorage.setItem(STORAGE_SHOWN, '1')
      } catch {
        // ignore
      }
      setOpen(true)
    }

    if (isMobileDevice()) {
      const timer = window.setTimeout(show, 8000)
      return () => window.clearTimeout(timer)
    }

    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY < 20 && !e.relatedTarget) {
        show()
      }
    }

    document.addEventListener('mouseout', onMouseOut)
    return () => document.removeEventListener('mouseout', onMouseOut)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, close])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)

    if (!turnstileToken) {
      setSecurityError(true)
      setStatus('error')
      return
    }

    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const description = String(data.get('description') || '').trim()
    const region = String(data.get('region') || '').trim()
    const budget = String(data.get('budget') || '').trim()

    if (description.length < 20) {
      setFormError('Description must be at least 20 characters')
      setStatus('error')
      return
    }

    setStatus('loading')
    setSecurityError(false)

    try {
      const res = await fetch('/api/search-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          description,
          region: region === 'Any' ? '' : region,
          budget: budget === 'Any' ? '' : budget,
          locale,
          turnstileToken,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        if (json?.error === 'Security check failed') {
          setSecurityError(true)
        }
        setFormError(typeof json?.error === 'string' ? json.error : 'Failed to send')
        setStatus('error')
        return
      }

      try {
        sessionStorage.setItem(STORAGE_SUBMITTED, '1')
      } catch {
        // ignore
      }
      setStatus('success')
      form.reset()
      setTurnstileToken('')
    } catch {
      setFormError('Failed to send')
      setStatus('error')
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-heading"
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div
        className="relative w-full max-w-[480px] max-h-[90dvh] overflow-y-auto bg-white rounded-2xl shadow-xl"
        style={{ borderRadius: 16 }}
      >
        <button
          type="button"
          onClick={close}
          className="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center rounded-lg text-[#5C5247] hover:bg-black/5 transition-colors"
          aria-label={t('close')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="p-6 sm:p-8">
          {status === 'success' ? (
            <div className="text-center py-6">
              <h2
                id="exit-intent-heading"
                className="text-2xl font-bold text-[#1A2744] mb-3"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {t('successHeading')}
              </h2>
              <p className="text-[#5C5247] text-sm leading-relaxed mb-6">{t('successText')}</p>
              <button
                type="button"
                onClick={close}
                className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-[12px] text-sm font-semibold bg-[#1A2744] text-white hover:bg-[#C8973A] transition-colors"
              >
                {t('close')}
              </button>
            </div>
          ) : (
            <>
              <h2
                id="exit-intent-heading"
                className="text-xl sm:text-2xl font-bold text-[#1A2744] mb-2 pr-8"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {t('heading')}
              </h2>
              <p className="text-[#5C5247] text-sm leading-relaxed mb-6">{t('subtext')}</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="exit-name" className={labelClass}>
                    {t('namePlaceholder')} *
                  </label>
                  <input
                    id="exit-name"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder={t('namePlaceholder')}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="exit-email" className={labelClass}>
                    {t('emailPlaceholder')} *
                  </label>
                  <input
                    id="exit-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder={t('emailPlaceholder')}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="exit-description" className={labelClass}>
                    {t('descriptionLabel')} *
                  </label>
                  <textarea
                    id="exit-description"
                    name="description"
                    required
                    minLength={20}
                    rows={4}
                    placeholder={t('descriptionPlaceholder')}
                    className={`${inputClass} resize-y min-h-[100px]`}
                  />
                </div>
                <div>
                  <label htmlFor="exit-region" className={labelClass}>
                    {t('regionLabel')}
                  </label>
                  <select id="exit-region" name="region" className={inputClass} defaultValue="Any">
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="exit-budget" className={labelClass}>
                    {t('budgetLabel')}
                  </label>
                  <select id="exit-budget" name="budget" className={inputClass} defaultValue="Any">
                    {BUDGETS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {(status === 'error' || securityError || formError) && (
                  <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    {securityError ? 'Security check failed' : formError || 'Failed to send'}
                  </p>
                )}

                <TurnstileWidget onToken={onToken} onError={() => setSecurityError(true)} />

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full inline-flex items-center justify-center min-h-[48px] px-6 rounded-[12px] text-sm font-semibold bg-[#C8973A] text-white hover:brightness-110 disabled:opacity-60 transition-all"
                >
                  {status === 'loading' ? t('submitting') : t('submitButton')}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
