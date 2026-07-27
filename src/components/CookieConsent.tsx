'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export const CONSENT_KEY = 'thaiplot-cookie-consent'

type ConsentValue = 'accepted' | 'declined'

function readStoredConsent(): ConsentValue | null {
  try {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (stored === 'accepted' || stored === 'declined') return stored
    return null
  } catch {
    // Private mode / blocked storage → treat as no consent
    return null
  }
}

export default function CookieConsent() {
  const t = useTranslations('cookieConsent')
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    setMounted(true)
    // First visit, cleared storage, or private/incognito session → show banner
    if (!readStoredConsent()) {
      setVisible(true)
    }
  }, [])

  const dismiss = (value: ConsentValue) => {
    try {
      localStorage.setItem(CONSENT_KEY, value)
    } catch {
      // Still dismiss UI even if storage is blocked
    }
    window.dispatchEvent(new Event('thaiplot-cookie-consent'))
    setLeaving(true)
    window.setTimeout(() => {
      setVisible(false)
      setLeaving(false)
    }, 320)
  }

  if (!mounted || !visible) return null

  const banner = (
    <div
      className={`fixed bottom-0 inset-x-0 z-[9999] ${leaving ? 'cookie-banner-out' : 'cookie-banner-in'}`}
      role="dialog"
      aria-modal="true"
      aria-label={t('title')}
      data-cookie-consent="true"
    >
      <div className="flex flex-col sm:flex-row w-full min-h-[120px] shadow-[0_-8px_32px_rgba(26,39,68,0.18)] overflow-hidden">
        <div className="relative w-full sm:w-[30%] h-24 sm:h-auto sm:min-h-[120px] flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="flex-1 bg-[#FAF7F0] px-5 py-5 sm:px-8 sm:py-6 flex flex-col justify-center">
          <p className="text-[#C8973A] text-[11px] uppercase tracking-[0.2em] font-medium mb-2">
            🍪 {t('title')}
          </p>
          <p className="text-[#1A2744] text-sm leading-relaxed max-w-2xl mb-3">{t('text')}</p>
          <div className="mb-4 max-w-2xl">
            <p className="text-[11px] uppercase tracking-wide text-[#5C5247] font-medium mb-1.5">
              {t('categoriesLabel')}
            </p>
            <ul className="space-y-1 text-xs text-[#5C5247] leading-relaxed">
              <li>
                <span className="font-semibold text-[#1A2744]">{t('catFunctional')}</span>
              </li>
              <li>
                <span className="font-semibold text-[#1A2744]">{t('catAnalytics')}</span>
              </li>
              <li>
                <span className="font-semibold text-[#1A2744]">{t('catAds')}</span>
              </li>
            </ul>
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <button
              type="button"
              onClick={() => dismiss('accepted')}
              className="min-h-[40px] px-5 rounded-[10px] text-sm font-semibold text-white transition-all hover:brightness-110"
              style={{ background: '#C8973A' }}
            >
              {t('accept')}
            </button>
            <button
              type="button"
              onClick={() => dismiss('declined')}
              className="min-h-[40px] px-5 rounded-[10px] text-sm font-semibold text-[#1A2744] bg-white border border-[#1A2744] hover:bg-[#1A2744] hover:text-white transition-all"
            >
              {t('decline')}
            </button>
          </div>
          <Link
            href="/legal/privacy"
            className="text-[#5C5247] text-xs hover:text-[#C8973A] transition-colors w-fit"
          >
            {t('privacy')}
          </Link>
        </div>
      </div>
      <style>{`
        @keyframes cookieSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes cookieSlideDown {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(100%); opacity: 0; }
        }
        .cookie-banner-in { animation: cookieSlideUp 0.4s ease-out both; }
        .cookie-banner-out { animation: cookieSlideDown 0.32s ease-in both; }
      `}</style>
    </div>
  )

  return createPortal(banner, document.body)
}
