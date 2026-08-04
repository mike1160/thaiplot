'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { useScrolledHeader } from '@/hooks/useScrolledHeader'
import LanguageSwitcher from './LanguageSwitcher'
import PortalAccountLink from './PortalAccountLink'
import BrandHomeLink from '@/components/BrandHomeLink'
import { GUIDE_LINKS, isExternalGuideLink } from '@/content/guide-links'

const HEADER_HEIGHT_CLASS = 'h-14 sm:h-16'

export default function HomeNavbar() {
  const t = useTranslations('navigation')
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
  // Light frosted header after scroll, or while mobile menu is open
  const solid = scrolled || menuOpen

  return (
    <nav
      className={`fixed top-0 left-0 z-[100] w-full transition-all duration-[350ms] ease-[ease] ${
        solid
          ? 'tp-frost-bar border-b border-[#C8973A]/25 shadow-[0_12px_32px_rgba(20,32,56,0.1)]'
          : 'bg-[rgba(15,26,46,0.42)] border-b border-white/10 shadow-none backdrop-blur-[14px]'
      }`}
      style={{
        WebkitBackdropFilter: solid ? undefined : 'blur(14px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className={`${HEADER_HEIGHT_CLASS} flex items-center justify-between gap-2 sm:gap-4`}>
          <BrandHomeLink
            className="group flex-shrink-0 leading-tight min-w-0"
            onNavigate={closeMenu}
          >
            <span
              className={`block text-[16px] sm:text-[18px] font-semibold tracking-wide transition-colors duration-[350ms] ease-[ease] ${
                solid
                  ? 'text-[#1A2744] group-hover:text-[#C8973A]'
                  : 'text-white group-hover:text-white/85'
              }`}
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {t('brandTitle')}
            </span>
            <span
              className={`hidden sm:block text-[10px] tracking-wider uppercase mt-0.5 transition-colors duration-[350ms] ease-[ease] ${
                solid ? 'text-[#5C5247]' : 'text-white/80'
              }`}
            >
              {t('brandSubtitle')}
            </span>
          </BrandHomeLink>

          <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            <Link
              href="/listings"
              className={`px-3 py-2 text-[13px] font-medium transition-colors duration-[350ms] ease-[ease] ${
                solid
                  ? 'text-[#5C5247] hover:text-[#1A2744]'
                  : 'text-white hover:text-white/85'
              }`}
            >
              {t('listings')}
            </Link>

            <div ref={guideRef} className="relative">
              <button
                type="button"
                onClick={() => setGuideOpen((v) => !v)}
                className={`px-3 py-2 text-[13px] font-medium transition-colors duration-[350ms] ease-[ease] inline-flex items-center gap-1 ${
                  solid
                    ? 'text-[#5C5247] hover:text-[#1A2744]'
                    : 'text-white hover:text-white/85'
                }`}
                aria-expanded={guideOpen}
                aria-haspopup="true"
              >
                {t('guide')}
                <span className={`text-[9px] transition-transform ${guideOpen ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </button>
              {guideOpen ? (
                <div
                  className="absolute top-full left-0 mt-2 min-w-[260px] max-h-[70vh] overflow-y-auto bg-white rounded-[12px] py-2 z-50"
                  style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                  role="menu"
                >
                  {GUIDE_LINKS.map((item) =>
                    isExternalGuideLink(item) ? (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        role="menuitem"
                        onClick={() => setGuideOpen(false)}
                        className="block px-5 py-2.5 text-sm text-[#1A2744] hover:text-[#C8973A] hover:bg-[#FAF7F0] transition-colors"
                      >
                        {t(item.key)}
                      </a>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        onClick={() => setGuideOpen(false)}
                        className="block px-5 py-2.5 text-sm text-[#1A2744] hover:text-[#C8973A] hover:bg-[#FAF7F0] transition-colors"
                      >
                        {t(item.key)}
                      </Link>
                    )
                  )}
                </div>
              ) : null}
            </div>

            <Link
              href="/list-property"
              className={`ml-2 px-4 py-1.5 text-[13px] font-semibold rounded-[12px] border transition-all duration-[350ms] ease-[ease] ${
                solid
                  ? 'border-[#C8973A] text-[#C8973A] hover:bg-[#C8973A] hover:text-white'
                  : 'border-white text-white hover:bg-white/15'
              }`}
            >
              {t('listProperty')}
            </Link>
            <Link
              href="/contact"
              className="ml-2 px-4 py-1.5 text-[13px] font-semibold rounded-[12px] bg-[#1A2744] hover:bg-[#C8973A] text-white border border-[#1A2744] hover:border-[#C8973A] transition-all duration-[350ms] ease-[ease]"
            >
              {t('contact')}
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            <div className="hidden md:flex flex-col items-end leading-tight">
              <a
                href="https://allesis.nl"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-[10px] transition-colors duration-[350ms] ease-[ease] ${
                  solid ? 'text-[#5C5247] hover:text-[#C8973A]' : 'text-white/80 hover:text-white'
                }`}
              >
                {t('webdesignBy')}
              </a>
              <span
                className={`text-[9px] transition-colors duration-[350ms] ease-[ease] ${
                  solid ? 'text-[#5C5247]' : 'text-white/70'
                }`}
              >
                {t('webdesignTag')}
              </span>
            </div>
            <div className="hidden sm:block">
              <PortalAccountLink solid={solid} />
            </div>
            {/* Mobile header: language + contact side by side */}
            <div className="lg:hidden flex items-center gap-1.5">
              <LanguageSwitcher
                compact
                variant={solid ? 'solid' : 'ghost'}
              />
              <Link
                href="/contact"
                className="inline-flex items-center justify-center min-h-[36px] px-3 rounded-[12px] text-[12px] font-semibold bg-[#1A2744] text-white border border-[#1A2744] hover:bg-[#C8973A] hover:border-[#C8973A] transition-colors"
                onClick={closeMenu}
              >
                {t('contact')}
              </Link>
            </div>
            <div className="hidden lg:block">
              <LanguageSwitcher variant={solid ? 'solid' : 'ghost'} />
            </div>
            <button
              type="button"
              className={`lg:hidden inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg transition-colors duration-[350ms] ease-[ease] ${
                solid
                  ? 'text-[#1A2744] hover:bg-black/5'
                  : 'text-white hover:bg-white/10'
              }`}
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
          className="lg:hidden border-t border-black/5 bg-[rgba(255,255,255,0.96)] backdrop-blur-[14px] max-h-[calc(100dvh-4rem)] overflow-y-auto"
        >
          <Link
            href="/listings"
            onClick={closeMenu}
            className="flex items-center w-full px-6 min-h-[48px] text-[15px] font-semibold text-[#1A2744] border-b border-[#E8E2D6]"
          >
            {t('listings')}
          </Link>
          <p className="px-6 pt-4 pb-2 text-[11px] uppercase tracking-wider text-[#C8973A] font-semibold">
            {t('guide')}
          </p>
          {GUIDE_LINKS.map((item) =>
            isExternalGuideLink(item) ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="flex items-center w-full px-6 min-h-[44px] text-[14px] text-[#1A2744] border-b border-[#E8E2D6]"
              >
                {t(item.key)}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center w-full px-6 min-h-[44px] text-[14px] text-[#1A2744] border-b border-[#E8E2D6]"
              >
                {t(item.key)}
              </Link>
            )
          )}
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
