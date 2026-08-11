'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { useScrolledHeader } from '@/hooks/useScrolledHeader'
import LanguageSwitcher from './LanguageSwitcher'
import PortalAccountLink from './PortalAccountLink'
import BrandHomeLink from '@/components/BrandHomeLink'
import { GUIDE_LINKS, isExternalGuideLink, resolveExternalGuideHref } from '@/content/guide-links'

const HEADER_HEIGHT_CLASS = 'h-14 sm:h-16'

export default function HomeNavbar() {
  const t = useTranslations('navigation')
  const locale = useLocale()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const mobilePanelId = useId()
  const guideRef = useRef<HTMLDivElement>(null)
  const scrolled = useScrolledHeader()

  useEffect(() => {
    setMenuOpen(false)
    setGuideOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!guideRef.current?.contains(e.target as Node)) setGuideOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav
      className={`fixed top-0 left-0 z-[100] w-full transition-all duration-[350ms] ease-[ease] tp-frost-bar ${
        scrolled || menuOpen
          ? 'tp-frost-bar-scrolled border-b border-[#C8973A]/25'
          : 'bg-white border-b border-[#E8E2D6] shadow-none'
      }`}
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className={`${HEADER_HEIGHT_CLASS} flex items-center justify-between gap-2 sm:gap-4`}>
          <BrandHomeLink
            className="group flex-shrink-0 leading-tight min-w-0"
            onNavigate={closeMenu}
          >
            <span
              className="block text-[16px] sm:text-[18px] font-semibold tracking-wide transition-colors duration-[350ms] ease-[ease] text-[#1A2744] group-hover:text-[#C8973A]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {t('brandTitle')}
            </span>
            <span className="hidden sm:block text-[10px] tracking-wider uppercase mt-0.5 text-[#5C5247]">
              {t('brandSubtitle')}
            </span>
          </BrandHomeLink>

          <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            <Link
              href="/listings"
              className="px-3 py-2 text-[13px] font-medium text-[#5C5247] hover:text-[#1A2744] transition-colors"
            >
              {t('listings')}
            </Link>
            <Link
              href="/list-property"
              className="ml-2 px-4 py-1.5 text-[13px] font-semibold rounded-[12px] border border-[#C8973A] text-[#C8973A] hover:bg-[#C8973A] hover:text-white transition-all"
            >
              {t('listProperty')}
            </Link>
            <Link
              href="/contact"
              className="ml-2 px-4 py-1.5 text-[13px] font-semibold rounded-[12px] border border-[#C8973A] text-[#C8973A] hover:bg-[#C8973A] hover:text-white transition-all"
            >
              {t('contact')}
            </Link>
          </div>

          {/* Right cluster — same order as other pages: Guide, language, (menu) */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-auto lg:ml-0">
            <div className="hidden md:flex flex-col items-end leading-tight mr-1">
              <a
                href="https://allesis.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-[#5C5247] hover:text-[#C8973A] transition-colors"
              >
                {t('webdesignBy')}
              </a>
              <span className="text-[9px] text-[#5C5247]">{t('webdesignTag')}</span>
            </div>

            <div className="hidden sm:block">
              <PortalAccountLink solid />
            </div>

            <div ref={guideRef} className="relative">
              <button
                type="button"
                onClick={() => setGuideOpen((v) => !v)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[12px] font-medium text-[#1A2744] bg-white border border-[#E8E2D6] rounded-[12px] hover:border-[#C8973A]/50 transition-colors min-h-[36px]"
                aria-expanded={guideOpen}
                aria-haspopup="true"
              >
                {t('guide')}
                <span
                  className={`text-[9px] text-[#5C5247] transition-transform ${guideOpen ? 'rotate-180' : ''}`}
                >
                  ▾
                </span>
              </button>
              {guideOpen ? (
                <div
                  className="absolute top-full right-0 mt-2 w-[min(100vw-2rem,280px)] max-h-[70vh] overflow-y-auto bg-white rounded-[12px] py-2 z-50"
                  style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                  role="menu"
                >
                  {GUIDE_LINKS.map((item) =>
                    isExternalGuideLink(item) ? (
                      <a
                        key={item.href}
                        href={resolveExternalGuideHref(item.href, locale)}
                        {...(item.href.startsWith('http')
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        role="menuitem"
                        onClick={() => setGuideOpen(false)}
                        className="block px-4 py-2.5 text-sm text-[#1A2744] hover:text-[#C8973A] hover:bg-[#FAF7F0] transition-colors"
                      >
                        {t(item.key)}
                      </a>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        onClick={() => setGuideOpen(false)}
                        className="block px-4 py-2.5 text-sm text-[#1A2744] hover:text-[#C8973A] hover:bg-[#FAF7F0] transition-colors"
                      >
                        {t(item.key)}
                      </Link>
                    )
                  )}
                </div>
              ) : null}
            </div>

            <LanguageSwitcher compact variant="solid" className="flex-shrink-0" />

            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#1A2744] hover:bg-black/5 transition-colors"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls={mobilePanelId}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div
          id={mobilePanelId}
          className="lg:hidden border-t border-[#E8E2D6] bg-white max-h-[calc(100dvh-4rem)] overflow-y-auto"
        >
          <Link
            href="/listings"
            onClick={closeMenu}
            className="flex items-center w-full px-6 min-h-[48px] text-[15px] font-semibold text-[#1A2744] border-b border-[#E8E2D6]"
          >
            {t('listings')}
          </Link>
          <div className="px-6 py-3 border-b border-[#E8E2D6]">
            <PortalAccountLink
              solid
              alwaysShowLabel
              onNavigate={closeMenu}
              className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#1A2744]"
            />
          </div>
          <Link
            href="/list-property"
            onClick={closeMenu}
            className="tp-btn-outline-gold flex items-center justify-center mx-4 mt-4"
          >
            {t('listProperty')}
          </Link>
          <Link
            href="/contact"
            onClick={closeMenu}
            className="tp-btn-primary flex items-center justify-center mx-4 my-4"
          >
            {t('contact')}
          </Link>
        </div>
      )}
    </nav>
  )
}
