'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { getSupabaseBrowser } from '@/lib/supabase-browser'

type Props = {
  solid: boolean
  onNavigate?: () => void
  className?: string
  /** When true, always show the label text (e.g. mobile menu). */
  alwaysShowLabel?: boolean
}

export default function PortalAccountLink({
  solid,
  onNavigate,
  className,
  alwaysShowLabel = false,
}: Props) {
  const t = useTranslations('navigation')
  const [href, setHref] = useState('/portal/login')

  useEffect(() => {
    const supabase = getSupabaseBrowser()
    let cancelled = false

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled) {
        setHref(session?.user ? '/portal/dashboard' : '/portal/login')
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setHref(session?.user ? '/portal/dashboard' : '/portal/login')
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  return (
    <a
      href={href}
      onClick={onNavigate}
      className={
        className ||
        `inline-flex items-center gap-1.5 px-2 py-1.5 text-[12px] sm:text-[13px] font-medium transition-colors duration-[350ms] ease-[ease] flex-shrink-0 ${
          solid
            ? 'text-[#5C5247] hover:text-[#C8973A]'
            : 'text-white/85 hover:text-white'
        }`
      }
      aria-label={t('myAccount')}
      title={t('myAccount')}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.75" />
        <path
          d="M5.5 19.5c1.2-3.2 3.4-4.8 6.5-4.8s5.3 1.6 6.5 4.8"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
      <span className={alwaysShowLabel ? 'inline' : 'hidden sm:inline'}>{t('myAccount')}</span>
    </a>
  )
}
