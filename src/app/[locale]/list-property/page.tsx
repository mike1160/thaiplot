'use client'

import { FormEvent, useCallback, useState } from 'react'
import { useTranslations } from 'next-intl'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import TurnstileWidget from '@/components/TurnstileWidget'
import { LIST_REGIONS } from '@/i18n/routing'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const LANG_OPTIONS = ['EN', 'NL', 'DE', 'TH', 'SV', 'DA', 'FR', 'RU', 'ZH', 'JA'] as const
const TYPE_KEYS = [
  { value: 'Land', labelKey: 'typeLand' as const },
  { value: 'House', labelKey: 'typeHouse' as const },
  { value: 'Condo', labelKey: 'typeCondo' as const },
  { value: 'Villa', labelKey: 'typeVilla' as const },
  { value: 'Commercial', labelKey: 'typeCommercial' as const },
]
const TITLE_KEYS = [
  { value: 'Chanote', labelKey: 'titleChanote' as const },
  { value: 'Nor Sor 3 Gor', labelKey: 'titleNorSor' as const },
  { value: 'Other', labelKey: 'titleOther' as const },
  { value: 'Unknown', labelKey: 'titleUnknown' as const },
]

const inputClass =
  'w-full rounded-[12px] border border-[#E8E2D6] bg-white px-4 py-3 text-sm text-[#1A2744] placeholder:text-[#5C5247]/60 focus:outline-none focus:ring-2 focus:ring-amber-600/40 focus:border-amber-600'
const labelClass = 'block text-sm font-medium text-[#1A2744] mb-2'

export default function ListPropertyPage() {
  const t = useTranslations('listProperty')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [description, setDescription] = useState('')
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

    const payload = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      language: String(data.get('language') || ''),
      type: String(data.get('type') || ''),
      transaction: String(data.get('transaction') || ''),
      region: String(data.get('region') || ''),
      location: String(data.get('location') || '').trim(),
      size: String(data.get('size') || '').trim(),
      price: String(data.get('price') || '').trim(),
      titleDeed: String(data.get('titleDeed') || ''),
      description: String(data.get('description') || '').trim().slice(0, 500),
      consent: data.get('consent') === 'on',
      turnstileToken,
    }

    try {
      const res = await fetch('/api/list-property', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
      setDescription('')
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

      <section className="bg-[#FAF7F0] py-12 md:py-20 px-6">
        <div className="max-w-3xl mx-auto">
          {status === 'success' ? (
            <div className="bg-white border border-[#E8E2D6] rounded-[12px] p-8 md:p-10 text-center">
              <h2
                className="text-[#1A2744] text-2xl md:text-3xl font-bold mb-3"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {t('successTitle')}
              </h2>
              <p className="text-[#5C5247] text-sm md:text-base">{t('successMessage')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="bg-white border border-[#E8E2D6] rounded-[12px] p-6 md:p-8 space-y-5">
                <h2
                  className="text-[#1A2744] text-xl md:text-2xl font-bold"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {t('sectionContact')}
                </h2>

                <div>
                  <label htmlFor="name" className={labelClass}>
                    {t('name')} *
                  </label>
                  <input id="name" name="name" type="text" required className={inputClass} />
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>
                    {t('email')} *
                  </label>
                  <input id="email" name="email" type="email" required className={inputClass} />
                </div>

                <div>
                  <label htmlFor="phone" className={labelClass}>
                    {t('phone')} *
                  </label>
                  <input id="phone" name="phone" type="text" required className={inputClass} />
                </div>

                <div>
                  <label htmlFor="language" className={labelClass}>
                    {t('language')}
                  </label>
                  <select id="language" name="language" defaultValue="EN" className={inputClass}>
                    {LANG_OPTIONS.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-white border border-[#E8E2D6] rounded-[12px] p-6 md:p-8 space-y-5">
                <h2
                  className="text-[#1A2744] text-xl md:text-2xl font-bold"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {t('sectionProperty')}
                </h2>

                <div>
                  <label htmlFor="type" className={labelClass}>
                    {t('type')}
                  </label>
                  <select id="type" name="type" defaultValue="Land" className={inputClass}>
                    {TYPE_KEYS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(opt.labelKey)}
                      </option>
                    ))}
                  </select>
                </div>

                <fieldset>
                  <legend className={labelClass}>{t('transaction')}</legend>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                    {[
                      { value: 'For Sale', labelKey: 'transactionSale' as const },
                      { value: 'For Rent', labelKey: 'transactionRent' as const },
                      { value: 'Both', labelKey: 'transactionBoth' as const },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className="inline-flex items-center gap-2 text-sm text-[#1A2744] cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="transaction"
                          value={opt.value}
                          defaultChecked={opt.value === 'For Sale'}
                          className="accent-amber-600"
                          required
                        />
                        {t(opt.labelKey)}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="region" className={labelClass}>
                    {t('region')} *
                  </label>
                  <select id="region" name="region" defaultValue="Hua Hin" required className={inputClass}>
                    {LIST_REGIONS.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className={labelClass}>
                    {t('location')} *
                  </label>
                  <input id="location" name="location" type="text" required className={inputClass} />
                </div>

                <div>
                  <label htmlFor="size" className={labelClass}>
                    {t('size')}
                  </label>
                  <input id="size" name="size" type="text" className={inputClass} />
                </div>

                <div>
                  <label htmlFor="price" className={labelClass}>
                    {t('price')}
                  </label>
                  <input id="price" name="price" type="text" className={inputClass} />
                </div>

                <div>
                  <label htmlFor="titleDeed" className={labelClass}>
                    {t('titleDeed')}
                  </label>
                  <select id="titleDeed" name="titleDeed" defaultValue="Unknown" className={inputClass}>
                    {TITLE_KEYS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(opt.labelKey)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className={labelClass}>
                    {t('description')}
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    maxLength={500}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`${inputClass} resize-y min-h-[120px]`}
                  />
                  <p className="mt-1.5 text-xs text-[#5C5247] text-right">{description.length}/500</p>
                </div>
              </div>

              <div className="bg-white border border-[#E8E2D6] rounded-[12px] p-6 md:p-8 space-y-5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    className="mt-1 accent-amber-600 w-4 h-4 flex-shrink-0"
                  />
                  <span className="text-sm text-[#1A2744] leading-relaxed">{t('consent')}</span>
                </label>

                {(status === 'error' || securityError) && (
                  <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    {securityError ? 'Security check failed' : t('errorMessage')}
                  </p>
                )}

                <TurnstileWidget onToken={onToken} />

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full md:w-auto min-w-[200px] px-6 py-3 rounded-[12px] text-[15px] font-semibold bg-amber-600 hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-colors duration-200"
                >
                  {status === 'loading' ? t('submitting') : t('submit')}
                </button>
              </div>
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
