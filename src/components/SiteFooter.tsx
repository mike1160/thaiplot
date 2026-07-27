'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { REGIONS } from '@/i18n/routing'

export default function SiteFooter() {
  const t = useTranslations('homepage')
  const tn = useTranslations('navigation')

  return (
    <footer>
      <div className="border-t border-[#E8E2D6] bg-[#FAF7F0]">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-[#1A2744] font-semibold text-lg mb-1">{t('donateTitle')}</p>
            <p className="text-[#5C5247] text-sm">{t('donateText')}</p>
          </div>
          <a
            href="https://www.savedsouls-foundation.org/en/donate"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-white font-bold px-8 py-3 rounded-[12px] transition-all hover:brightness-110 text-sm whitespace-nowrap"
            style={{ background: '#C8973A' }}
          >
            {t('donateCta')}
          </a>
        </div>
      </div>

      <div className="bg-[#1A2744] text-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="min-w-0">
            <p className="text-[#C8973A] text-xs uppercase tracking-widest font-medium mb-4">
              {t('footerExplore')}
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/listings" className="text-white/70 hover:text-[#C8973A] transition-colors">
                  {tn('listings')}
                </Link>
              </li>
              <li>
                <Link href="/list-property" className="text-white/70 hover:text-[#C8973A] transition-colors">
                  {tn('listProperty')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-[#C8973A] transition-colors">
                  {tn('contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="min-w-0">
            <p className="text-[#C8973A] text-xs uppercase tracking-widest font-medium mb-4">
              {t('footerRegions')}
            </p>
            <ul className="space-y-2.5 text-sm">
              {REGIONS.filter((r) => r !== 'All').map((region) => (
                <li key={region}>
                  <Link
                    href={`/listings?region=${encodeURIComponent(region)}`}
                    className="text-white/70 hover:text-[#C8973A] transition-colors"
                  >
                    {region}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <p className="text-[#C8973A] text-xs uppercase tracking-widest font-medium mb-4">
              {t('footerResources')}
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/legal/disclaimer" className="text-white/70 hover:text-[#C8973A] transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-white/70 hover:text-[#C8973A] transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <a
                  href="https://www.hua-hin-land.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-[#C8973A] transition-colors"
                >
                  Hua Hin Land
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-white/45">
            <p className="text-center lg:text-left">{t('footerCopyright')}</p>
            <a
              href="https://allesis.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C8973A] transition-colors"
            >
              {tn('webdesignBy')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
