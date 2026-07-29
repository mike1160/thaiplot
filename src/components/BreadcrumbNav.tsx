'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { useScrolledHeader } from '@/hooks/useScrolledHeader'

const INFO_PAGES: Record<string, string> = {
  'buying-land-thailand': 'pages.buyingLand',
  'chanote-title-deed': 'pages.chanote',
  'hua-hin-property-market': 'pages.huaHinMarket',
  'pranburi-property': 'pages.pranburi',
  'visa-retirement-thailand': 'pages.visa',
}

const REGION_PAGES: Record<string, string> = {
  'hua-hin': 'pages.huaHinRegion',
  pranburi: 'pages.pranburiRegion',
  'black-mountain': 'pages.blackMountainRegion',
  phuket: 'pages.phuketRegion',
  bangkok: 'pages.bangkokRegion',
  'hin-lek-fai': 'pages.hinLekFaiRegion',
  'villas-for-sale-hua-hin': 'pages.villasHuaHinRegion',
  'resort-for-sale-hua-hin': 'pages.resortHuaHinRegion',
  'koh-samui': 'pages.kohSamuiRegion',
}

function buildCrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  const crumbs: { labelKey: string; href?: string }[] = [{ labelKey: 'home', href: '/' }]

  if (segments.length === 0) return crumbs

  const [section, ...rest] = segments
  const pageSlug = rest[0] || section

  if (section === 'listings') {
    crumbs.push({ labelKey: 'pages.listings', href: '/listings' })
    if (rest[0]) {
      crumbs.push({ labelKey: 'pages.listingDetail' })
    }
    return crumbs
  }
  if (section === 'list-property') {
    crumbs.push({ labelKey: 'pages.listProperty' })
    return crumbs
  }
  if (section === 'contact') {
    crumbs.push({ labelKey: 'pages.contact' })
    return crumbs
  }
  if (section === 'privacy' || (section === 'legal' && pageSlug === 'privacy')) {
    crumbs.push({ labelKey: 'pages.privacy' })
    return crumbs
  }
  if (section === 'disclaimer' || (section === 'legal' && pageSlug === 'disclaimer')) {
    crumbs.push({ labelKey: 'pages.disclaimer' })
    return crumbs
  }
  if (section === 'info') {
    crumbs.push({ labelKey: 'pages.guide', href: '/info/buying-land-thailand' })
    if (pageSlug && INFO_PAGES[pageSlug]) {
      crumbs.push({ labelKey: INFO_PAGES[pageSlug] })
    }
    return crumbs
  }
  if (REGION_PAGES[section]) {
    crumbs.push({ labelKey: REGION_PAGES[section] })
    return crumbs
  }

  return crumbs
}

export default function BreadcrumbNav({ className = '' }: { className?: string }) {
  const t = useTranslations('breadcrumb')
  const tn = useTranslations('navigation')
  const pathname = usePathname()
  const crumbs = buildCrumbs(pathname)
  const scrolled = useScrolledHeader()

  return (
    <>
      {/* Reserves space so content is never hidden behind fixed header */}
      <div className="h-12 w-full shrink-0" aria-hidden />

      <nav
        aria-label="Breadcrumb"
        className={`fixed top-0 left-0 z-[100] w-full border-b transition-all duration-[350ms] ease-[ease] ${
          scrolled
            ? 'bg-[rgba(255,255,255,0.93)] border-stone-200/80 shadow-[0_1px_12px_rgba(0,0,0,0.08)] backdrop-blur-[14px]'
            : 'bg-stone-50 border-stone-200 shadow-none'
        } ${className}`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex-shrink-0 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#1A2744] hover:text-amber-600 transition-colors"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {tn('brandTitle')}
          </Link>

          <ol className="flex items-center gap-1.5 text-xs text-stone-500 min-w-0 flex-wrap justify-end">
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1
              const label = t(crumb.labelKey)
              return (
                <li key={`${crumb.labelKey}-${index}`} className="flex items-center gap-1.5 min-w-0">
                  {index > 0 && (
                    <span className="text-stone-300 select-none" aria-hidden>
                      ›
                    </span>
                  )}
                  {isLast || !crumb.href ? (
                    <span
                      className={`truncate ${isLast ? 'text-stone-700 font-medium' : 'text-stone-500'}`}
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {label}
                    </span>
                  ) : (
                    <Link href={crumb.href} className="truncate hover:text-amber-600 transition-colors">
                      {label}
                    </Link>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </nav>
    </>
  )
}
