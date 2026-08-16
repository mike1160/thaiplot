'use client'

import { useTranslations } from 'next-intl'

const APP_STORE_URL = 'https://apps.apple.com/ph/app/waiair/id6798072839'

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

export default function WaiairBanner() {
  const t = useTranslations('homepage.waiairBanner')

  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-4 overflow-x-hidden" aria-label="WaiAir">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 md:gap-8 rounded-[12px] border border-[#1e3550] bg-[#0d1b2e] px-5 py-5 sm:px-7 sm:py-6">
          <a href="/waiair" className="min-w-0 flex-1 no-underline group">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#c9a84c] mb-2">
              {t('badge')}
            </p>
            <h2
              className="text-white text-lg sm:text-xl font-semibold leading-snug mb-2 group-hover:text-[#c9a84c] transition-colors flex items-center gap-2"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              <GlobeIcon className="text-[#ff6400] flex-shrink-0" />
              {t('title')}
            </h2>
            <p className="text-[#8899aa] text-sm leading-relaxed mb-3 max-w-xl flex items-start gap-2">
              <GlobeIcon className="flex-shrink-0 mt-0.5" />
              <span>{t('description')}</span>
            </p>
            <p className="text-[12px] text-[#8899aa] flex items-center gap-2">
              <GlobeIcon className="flex-shrink-0" />
              <span>Worldwide — from Bangkok to New York</span>
            </p>
          </a>

          <div className="flex flex-col items-stretch md:items-end gap-2 flex-shrink-0">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-[10px] bg-[#c9a84c] text-[#0d1b2e] text-sm font-semibold no-underline hover:bg-[#d4b65e] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              {t('cta')}
            </a>
            <span className="text-[11px] text-[#8899aa] text-center md:text-right">
              {t('note')}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
