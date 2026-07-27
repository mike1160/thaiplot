'use client'

import { useTranslations } from 'next-intl'
import { LINE_AGENT_URL } from '@/lib/contact'

type LineButtonProps = {
  className?: string
  size?: 'lg' | 'md' | 'sm'
  label?: string
}

const sizeClass: Record<NonNullable<LineButtonProps['size']>, string> = {
  lg: 'min-h-[52px] px-8 py-3.5 rounded-xl text-base md:text-lg font-semibold shadow-lg hover:shadow-xl',
  md: 'min-h-[48px] px-8 py-3 rounded-[12px] text-sm font-semibold',
  sm: 'min-h-[44px] px-5 py-2.5 rounded-[12px] text-sm font-semibold',
}

export default function LineButton({ className = '', size = 'md', label }: LineButtonProps) {
  const t = useTranslations('common')

  return (
    <a
      href={LINE_AGENT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 text-white transition-all hover:brightness-110 ${sizeClass[size]} ${className}`}
      style={{ background: '#06C755' }}
    >
      {label || t('lineAgent')}
    </a>
  )
}
