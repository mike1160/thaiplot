'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import LineButton from '@/components/LineButton'

export default function DisclaimerFooter() {
  const t = useTranslations('common')
  const locale = useLocale()

  return (
    <div className="border-t border-[#E8E2D6] pt-6">
      <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
        <LineButton size="sm" />
      </div>
      <p className="text-[#5C5247] text-xs leading-relaxed text-center break-words">
        {t('disclaimerFooter')}{' '}
        <Link
          href="/legal/disclaimer"
          className="text-[#A67B2E] hover:text-[#8F6826] transition-colors underline underline-offset-2 whitespace-nowrap"
        >
          {t('disclaimerFooterLink')}
        </Link>
        {locale === 'th' && (
          <>
            {' · '}
            <Link
              href="/legal/privacy"
              className="text-[#A67B2E] hover:text-[#8F6826] transition-colors underline underline-offset-2 whitespace-nowrap"
            >
              {t('legalFooterPrivacy')}
            </Link>
          </>
        )}
      </p>
    </div>
  )
}
