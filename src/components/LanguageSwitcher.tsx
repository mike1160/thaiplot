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
  sv: '🇸🇪',
  da: '🇩🇰',
  fr: '🇫🇷',
  ru: '🇷🇺',
  zh: '🇨🇳',
  ja: '🇯🇵',
}

type LanguageSwitcherProps = {
  className?: string
  align?: 'left' | 'right'
  /** solid = light header; ghost = over dark hero */
  variant?: 'solid' | 'ghost'
  /** Compact control for tight mobile headers */
  compact?: boolean
}

export default function LanguageSwitcher({
  className = '',
  align = 'right',
  variant = 'solid',
  compact = false,
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
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'language_switch', {
        from_locale: locale,
        to_locale: next,
      })
    }
    router.replace(pathname, { locale: next })
  }

  return (
    <div ref={rootRef} className={`relative flex-shrink-0 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center font-medium rounded-[12px] transition-all duration-[350ms] ease-[ease] flex-shrink-0 ${
          compact ? 'gap-1 px-2 py-1 text-[12px] min-h-[36px]' : 'gap-1.5 px-2.5 sm:px-3 py-1.5 text-[12px] sm:text-[13px] min-h-[36px]'
        } ${
          variant === 'ghost'
            ? 'text-white bg-white/10 border border-white/30 hover:bg-white/20'
            : 'text-[#1A2744] bg-white border border-[#E8E2D6] hover:border-[#C8973A]/50'
        }`}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t(current.code)}
      >
        <span aria-hidden="true">{current.flag}</span>
        <span>{current.code.toUpperCase()}</span>
        <span
          className={`text-[9px] transition-transform ${open ? 'rotate-180' : ''} ${
            variant === 'ghost' ? 'text-white/80' : 'text-[#5C5247]'
          } ${compact ? 'hidden sm:inline' : ''}`}
        >
          ▾
        </span>
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
