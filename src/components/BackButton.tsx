'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

type BackButtonProps = {
  href?: string
  labelKey?: string
  className?: string
}

export default function BackButton({
  href = '/',
  labelKey = 'home',
  className = '',
}: BackButtonProps) {
  const t = useTranslations('breadcrumb')

  return (
    <div className={`max-w-3xl mx-auto px-6 pt-6 ${className}`}>
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 text-sm text-[#5C5247] hover:text-amber-600 transition-colors"
      >
        <span aria-hidden>←</span>
        <span>{t(labelKey)}</span>
      </Link>
    </div>
  )
}
