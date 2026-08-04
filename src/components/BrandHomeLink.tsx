'use client'

import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import { useLocale } from 'next-intl'
import { usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

type Props = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  onNavigate?: () => void
}

/** Brand mark → homepage on the first click. */
export default function BrandHomeLink({ children, className, style, onNavigate }: Props) {
  const locale = useLocale()
  const pathname = usePathname()
  const href = locale === routing.defaultLocale ? '/' : `/${locale}`

  const goHome = (e: MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.()
    if (pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    // Full navigation so the first click always lands on home (no soft-nav quirks).
    e.preventDefault()
    window.location.assign(href)
  }

  return (
    <a href={href} onClick={goHome} className={className} style={style}>
      {children}
    </a>
  )
}
