'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { useScrolledHeader } from '@/hooks/useScrolledHeader'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import BrandHomeLink from '@/components/BrandHomeLink'
import { GUIDE_LINKS } from '@/content/guide-links'

const INFO_PAGES: Record<string, string> = {
  'buying-land-thailand': 'pages.buyingLand',
  'chanote-title-deed': 'pages.chanote',
  'hua-hin-property-market': 'pages.huaHinMarket',
  'pranburi-property': 'pages.pranburi',
  'visa-retirement-thailand': 'pages.visa',
  'paperwork-thailand': 'pages.paperwork',
  'official-thai-downloads': 'pages.officialDownloads',
  'thim-app': 'pages.thimApp',
  'thailand-digital-arrival-card': 'pages.tdac',
  'drinking-water-thailand': 'pages.drinkWater',
  'health-accidents-thailand': 'pages.health',
  'food-thailand': 'pages.food',
}

const DRINK_WATER_SUBPAGES: Record<string, string> = {
  options: 'pages.drinkWaterOptions',
  vending: 'pages.drinkWaterVending',
  costs: 'pages.drinkWaterCosts',
  advice: 'pages.drinkWaterAdvice',
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
    if (pageSlug === 'drinking-water-thailand') {
      crumbs.push({
        labelKey: 'pages.drinkWater',
        href: '/info/drinking-water-thailand',
      })
      const sub = rest[1]
      if (sub && DRINK_WATER_SUBPAGES[sub]) {
        crumbs.push({ labelKey: DRINK_WATER_SUBPAGES[sub] })
      }
      return crumbs
    }
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
  const [guideOpen, setGuideOpen] = useState(false)
  const guideRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setGuideOpen(false)
  }, [pathname])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!guideRef.current?.contains(e.target as Node)) setGuideOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <>
      {/* Reserves space so content is never hidden behind fixed header */}
      <div className="h-12 w-full shrink-0" aria-hidden />

      <nav
        aria-label="Breadcrumb"
        className={`fixed top-0 left-0 z-[100] w-full border-b transition-all duration-[350ms] ease-[ease] tp-frost-bar ${
          scrolled
            ? 'border-stone-200/80 shadow-[0_1px_12px_rgba(0,0,0,0.08)]'
            : 'border-stone-200/70 shadow-none'
        } ${className}`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-12 flex items-center gap-2 sm:gap-3">
          <BrandHomeLink
            className="flex-shrink-0 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#1A2744] hover:text-[#C8973A] transition-colors"
            style={{ fontFamily: 'Playfair Display, serif' }}
            onNavigate={() => setGuideOpen(false)}
          >
            {tn('brandTitle')}
          </BrandHomeLink>

          <ol className="hidden md:flex flex-1 min-w-0 items-center justify-end gap-1.5 text-xs text-stone-500 overflow-hidden">
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1
              const label = t(crumb.labelKey)
              return (
                <li
                  key={`${crumb.labelKey}-${index}`}
                  className="flex items-center gap-1.5 min-w-0 max-w-[40%]"
                >
                  {index > 0 && (
                    <span className="text-stone-300 select-none flex-shrink-0" aria-hidden>
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
                    <Link
                      href={crumb.href}
                      className="truncate hover:text-amber-600 transition-colors"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              )
            })}
          </ol>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-auto md:ml-0">
            <Link
              href="/listings"
              className="hidden sm:inline-flex px-2 py-1.5 text-[12px] font-medium text-[#5C5247] hover:text-[#1A2744] transition-colors"
            >
              {tn('listings')}
            </Link>

            <div ref={guideRef} className="relative">
              <button
                type="button"
                onClick={() => setGuideOpen((v) => !v)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[12px] font-medium text-[#1A2744] bg-white border border-[#E8E2D6] rounded-[12px] hover:border-[#C8973A]/50 transition-colors min-h-[36px]"
                aria-expanded={guideOpen}
                aria-haspopup="true"
              >
                {tn('guide')}
                <span className={`text-[9px] text-[#5C5247] transition-transform ${guideOpen ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </button>
              {guideOpen ? (
                <div
                  className="absolute top-full right-0 mt-2 w-[min(100vw-2rem,280px)] max-h-[70vh] overflow-y-auto bg-white rounded-[12px] py-2 z-50"
                  style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                  role="menu"
                >
                  {GUIDE_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setGuideOpen(false)}
                      className={`block px-4 py-2.5 text-sm transition-colors ${
                        pathname === item.href || pathname.startsWith(`${item.href}/`)
                          ? 'text-[#C8973A] bg-[#FAF7F0] font-medium'
                          : 'text-[#1A2744] hover:text-[#C8973A] hover:bg-[#FAF7F0]'
                      }`}
                    >
                      {tn(item.key)}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            <LanguageSwitcher variant="solid" className="flex-shrink-0" />
          </div>
        </div>
      </nav>
    </>
  )
}
