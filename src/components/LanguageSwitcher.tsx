'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { routing } from '@/i18n/routing'

const flags: Record<AppLocale, string> = {
  en: '🇬🇧',
  nl: '🇳🇱',
  de: '🇩🇪',
  th: '🇹🇭',
}

type LanguageSwitcherProps = {
  className?: string
  align?: 'left' | 'right'
}

export default function LanguageSwitcher({
  className = '',
  align = 'right',
}: LanguageSwitcherProps) {
  const t = useTranslations('languages')
  const locale = useLocale() as AppLocale
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const options = routing.locales.map((code) => ({
    code,
    flag: flags[code],
  }))

  const current = options.find((o) => o.code === locale) ?? options[0]

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const select = (next: AppLocale) => {
    setOpen(false)
    if (next === locale) return
    router.replace(pathname, { locale: next })
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[#1A2744] bg-white border border-[#E8E2D6] rounded-[12px] hover:border-[#C8973A]/50 transition-colors"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span aria-hidden="true">{current.flag}</span>
        <span>{current.code.toUpperCase()}</span>
        <span className={`text-[9px] text-[#5C5247] transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div
          className={`absolute top-full mt-2 z-50 min-w-[200px] bg-white py-2 overflow-hidden rounded-[12px] ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
          style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
          role="listbox"
        >
          {options.map((opt) => (
            <button
              key={opt.code}
              type="button"
              role="option"
              aria-selected={opt.code === locale}
              onClick={() => select(opt.code)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-left transition-colors duration-150 ${
                opt.code === locale
                  ? 'text-[#C8973A] bg-[#FAF7F0]'
                  : 'text-[#1A2744] hover:text-[#C8973A] hover:bg-[#F5F5F5]'
              }`}
            >
              <span className="text-base" aria-hidden="true">{opt.flag}</span>
              <span>{t(opt.code)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
