'use client'

import { useEffect, useId, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import LanguageSwitcher from './LanguageSwitcher'

export default function HomeNavbar() {
  const t = useTranslations('navigation')
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const mobilePanelId = useId()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="sticky top-0 z-50 bg-[#FAF7F0]/95 border-b border-black/5 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between gap-4">
          <Link href="/" className="group flex-shrink-0 leading-tight" onClick={closeMenu}>
            <span
              className="block text-[18px] font-semibold tracking-wide text-[#1A2744] group-hover:text-[#C8973A] transition-colors"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {t('brandTitle')}
            </span>
            <span className="block text-[10px] text-[#5C5247] tracking-wider uppercase mt-0.5">
              {t('brandSubtitle')}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            <Link
              href="/listings"
              className="px-3 py-2 text-[13px] font-medium text-[#5C5247] hover:text-[#1A2744] transition-colors duration-200"
            >
              {t('listings')}
            </Link>
            <Link
              href="/list-property"
              className="ml-2 px-4 py-1.5 text-[13px] font-semibold rounded-lg border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white transition-all duration-200"
            >
              {t('listProperty')}
            </Link>
            <Link
              href="/contact"
              className="ml-2 px-4 py-1.5 text-[13px] font-semibold rounded-lg bg-[#1A2744] hover:bg-[#C8973A] text-white border border-[#1A2744] hover:border-[#C8973A] transition-all duration-200"
            >
              {t('contact')}
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="hidden md:flex flex-col items-end leading-tight">
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
            <LanguageSwitcher />
            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-[#1A2744] hover:bg-black/5 transition-colors"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls={mobilePanelId}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div
          id={mobilePanelId}
          className="lg:hidden border-t border-black/5 bg-[#FAF7F0] max-h-[calc(100dvh-4rem)] overflow-y-auto"
        >
          <Link
            href="/listings"
            onClick={closeMenu}
            className="flex items-center w-full px-6 min-h-[48px] text-[15px] font-semibold text-[#1A2744] border-b border-[#E8E2D6]"
          >
            {t('listings')}
          </Link>
          <Link
            href="/list-property"
            onClick={closeMenu}
            className="flex items-center justify-center mx-4 mt-4 min-h-[48px] px-4 text-[15px] font-semibold rounded-lg border border-amber-600 text-amber-600"
          >
            {t('listProperty')}
          </Link>
          <Link
            href="/contact"
            onClick={closeMenu}
            className="flex items-center justify-center mx-4 my-4 min-h-[48px] px-4 text-[15px] font-semibold rounded-lg bg-[#1A2744] text-white"
          >
            {t('contact')}
          </Link>
        </div>
      )}
    </nav>
  )
}
