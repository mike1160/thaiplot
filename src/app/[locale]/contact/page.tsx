'use client'

import { FormEvent, useCallback, useState } from 'react'
import { useTranslations } from 'next-intl'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import LineButton from '@/components/LineButton'
import TurnstileWidget from '@/components/TurnstileWidget'
import { AGENT_NAME, AGENT_PHONE_DISPLAY } from '@/lib/contact'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const inputClass =
  'w-full rounded-[12px] border border-[#E8E2D6] bg-white px-4 py-3 text-sm text-[#1A2744] placeholder:text-[#5C5247]/60 focus:outline-none focus:ring-2 focus:ring-amber-600/40 focus:border-amber-600'
const labelClass = 'block text-sm font-medium text-[#1A2744] mb-2'

export default function ContactPage() {
  const t = useTranslations('contact')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [securityError, setSecurityError] = useState(false)

  const onToken = useCallback((token: string) => {
    setTurnstileToken(token)
    if (token) setSecurityError(false)
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!turnstileToken) {
      setSecurityError(true)
      return
    }
    setStatus('loading')
    setSecurityError(false)
    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(data.get('name') || '').trim(),
          email: String(data.get('email') || '').trim(),
          phone: String(data.get('phone') || '').trim(),
          message: String(data.get('message') || '').trim(),
          turnstileToken,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        if (json?.error === 'Security check failed') {
          setSecurityError(true)
        }
        setStatus('error')
        return
      }
      setStatus('success')
      form.reset()
      setTurnstileToken('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#1A2744]">
      <BreadcrumbNav />

      <section className="bg-[#1A2744] py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className="text-white text-3xl md:text-5xl font-bold leading-tight mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('pageTitle')}
          </h1>
          <p className="text-white/75 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            {t('pageSubtitle')}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20 px-6">
        <div className="max-w-3xl mx-auto grid gap-8">
          <div className="border border-[#C8973A]/40 bg-[#FAF7F0] rounded-[12px] p-6 md:p-8 text-center sm:text-left flex flex-col sm:flex-row gap-5 items-center">
            <div className="flex-1">
              <h2
                className="text-2xl font-bold mb-1"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {AGENT_NAME}
              </h2>
              <a
                href={`tel:${AGENT_PHONE_DISPLAY.replace(/-/g, '')}`}
                className="text-[#1A2744] font-semibold hover:text-[#C8973A] transition-colors"
              >
                {AGENT_PHONE_DISPLAY}
              </a>
            </div>
            <LineButton size="md" />
          </div>

          {status === 'success' ? (
            <div className="bg-white border border-[#E8E2D6] rounded-[12px] p-8 text-center">
              <p className="text-[#1A2744] font-medium">{t('sent')}</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-[#E8E2D6] rounded-[12px] p-6 md:p-8 space-y-5"
            >
              <div>
                <label htmlFor="name" className={labelClass}>
                  {t('name')} *
                </label>
                <input id="name" name="name" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>
                  {t('email')} *
                </label>
                <input id="email" name="email" type="email" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>
                  {t('phone')}
                </label>
                <input id="phone" name="phone" className={inputClass} />
              </div>
              <div>
                <label htmlFor="message" className={labelClass}>
                  {t('message')} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className={`${inputClass} resize-y min-h-[120px]`}
                />
              </div>

              {(status === 'error' || securityError) && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  {securityError ? 'Security check failed' : t('error')}
                </p>
              )}

              <TurnstileWidget onToken={onToken} />

              <button
                type="submit"
                disabled={status === 'loading'}
                className="min-w-[180px] px-6 py-3 rounded-[12px] text-[15px] font-semibold bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white transition-colors"
              >
                {status === 'loading' ? t('sending') : t('send')}
              </button>
            </form>
          )}
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <DisclaimerFooter />
      </div>
    </main>
  )
}
