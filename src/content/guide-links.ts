/** Shared guide nav links — most-searched / important first */
export const GUIDE_LINKS = [
  { href: '/info/buying-land-thailand', key: 'guideBuying' },
  { href: '/info/chanote-title-deed', key: 'guideChanote' },
  {
    href: 'https://data.hua-hin-land.com/',
    key: 'guideThaiData',
    external: true,
  },
  { href: '/info/visa-retirement-thailand', key: 'guideVisa' },
  {
    href: '/info/thailand-retirement-ranking-2026',
    key: 'guideRetirementRanking',
  },
  { href: '/info/paperwork-thailand', key: 'guidePaperwork' },
  { href: '/info/living-thailand', key: 'guideLiving' },
  { href: '/info/transport-thailand', key: 'guideTransport' },
  { href: '/info/thai-islands', key: 'guideIslands' },
  {
    href: '/koh-phangan-foreign-investors.html',
    key: 'guideKohPhanganInvestors',
    external: true,
  },
  { href: '/info/health-accidents-thailand', key: 'guideHealth' },
  { href: '/info/food-thailand', key: 'guideFood' },
  { href: '/info/thai-culture', key: 'guideCulture' },
  { href: '/info/drinking-water-thailand', key: 'guideDrinkWater' },
  { href: '/info/official-thai-downloads', key: 'guideOfficialDownloads' },
  { href: '/info/thim-app', key: 'guideThim' },
  { href: '/info/thailand-digital-arrival-card', key: 'guideTdac' },
  { href: '/waiair.html', key: 'guideWaiair', external: true },
  { href: '/info/hua-hin-property-market', key: 'guideHuaHin' },
  { href: '/info/pranburi-property', key: 'guidePranburi' },
] as const

export type GuideLink = (typeof GUIDE_LINKS)[number]

export function isExternalGuideLink(
  item: GuideLink
): item is GuideLink & { external: true } {
  return 'external' in item && item.external === true
}

/** Same-site HTML pages get ?lang=; absolute URLs stay as-is. */
export function resolveExternalGuideHref(href: string, locale: string): string {
  if (href.includes('koh-phangan-foreign-investors')) {
    const articleLangs = ['nl', 'en', 'de', 'fr', 'ru', 'th']
    const lang = articleLangs.includes(locale) ? locale : 'en'
    return `/koh-phangan-foreign-investors.html?lang=${lang}`
  }
  return href
}
