'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function LegalFooterBar() {
  const t = useTranslations('common')

  return (
    <footer className="border-t border-[#E8E2D6] bg-[#FAF7F0] py-4 px-6">
      <p className="max-w-5xl mx-auto text-center text-xs text-stone-500 leading-relaxed">
        {t('globalLegalBar')}{' '}
        <Link
          href="/legal/disclaimer"
          className="text-[#A67B2E] hover:text-[#8F6826] transition-colors underline underline-offset-2 whitespace-nowrap"
        >
          {t('globalLegalBarLink')}
        </Link>
      </p>
      <div className="max-w-5xl mx-auto mt-3 flex flex-wrap items-center justify-center gap-3 text-[#5C5247] text-xs">
        <Link href="/legal/disclaimer" className="text-[#A67B2E] hover:text-[#8F6826] transition-colors">
          {t('legalFooterDisclaimer')}
        </Link>
        <span>·</span>
        <Link href="/legal/privacy" className="text-[#A67B2E] hover:text-[#8F6826] transition-colors">
          {t('legalFooterPrivacy')}
        </Link>
      </div>
    </footer>
  )
}
