'use client'

import { useTranslations } from 'next-intl'

const THAI_DATA_URL = 'https://data.hua-hin-land.com'

type ThaiDataCardProps = {
  className?: string
  compact?: boolean
}

export default function ThaiDataCard({ className = '', compact = false }: ThaiDataCardProps) {
  const t = useTranslations('thaiData')

  return (
    <div
      className={`border border-[#C8973A]/40 bg-[#FAF7F0] rounded-[12px] ${
        compact ? 'p-5 md:p-6' : 'p-6 md:p-8'
      } ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
        <div className="flex-1 text-center md:text-left">
          <h2
            className={`${compact ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'} font-bold text-[#1A2744] mb-2`}
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('title')}
          </h2>
          <p className="text-[#5C5247] text-sm md:text-base leading-relaxed">{t('subtitle')}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-shrink-0">
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: 'Playfair Display, serif', color: '#C8973A' }}
          >
            ThaiData.
          </span>
          <a
            href={THAI_DATA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-[12px] text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ background: '#C8973A' }}
          >
            {t('button')}
          </a>
        </div>
      </div>
    </div>
  )
}

export function TitleVerifyCta({ className = '' }: { className?: string }) {
  const t = useTranslations('thaiData')

  return (
    <div
      className={`bg-[#1A2744] rounded-[12px] px-6 py-10 md:py-12 text-center text-white ${className}`}
    >
      <h2
        className="text-2xl md:text-3xl font-bold mb-3"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {t('verifyTitle')}
      </h2>
      <p className="text-white/75 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-6">
        {t('verifyText')}
      </p>
      <a
        href={THAI_DATA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center min-h-[48px] px-7 rounded-[12px] text-sm font-semibold text-white transition-all hover:brightness-110"
        style={{ background: '#C8973A' }}
      >
        {t('verifyButton')}
      </a>
    </div>
  )
}
