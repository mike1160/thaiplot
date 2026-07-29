'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'

const TABS = [
  { href: '/info/drinking-water-thailand', key: 'situation' as const, exact: true },
  { href: '/info/drinking-water-thailand/options', key: 'options' as const },
  { href: '/info/drinking-water-thailand/vending', key: 'vending' as const },
  { href: '/info/drinking-water-thailand/costs', key: 'costs' as const },
  { href: '/info/drinking-water-thailand/advice', key: 'advice' as const },
]

export default function DrinkWaterSubnav() {
  const t = useTranslations('infoDrinkWater.tabs')
  const pathname = usePathname()

  return (
    <nav
      aria-label={t('navLabel')}
      className="flex flex-wrap gap-2 mb-8 -mt-2"
    >
      {TABS.map((tab) => {
        const active = tab.exact
          ? pathname === tab.href
          : pathname === tab.href || pathname.startsWith(`${tab.href}/`)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 rounded-full border-2 text-sm font-semibold transition-colors ${
              active
                ? 'bg-[#1A7BA4] border-[#1A7BA4] text-white'
                : 'bg-white border-[#1A7BA4] text-[#1A7BA4] hover:bg-[#E8F4F9]'
            }`}
          >
            {t(tab.key)}
          </Link>
        )
      })}
    </nav>
  )
}
