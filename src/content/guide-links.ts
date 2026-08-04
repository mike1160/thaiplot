/** Shared guide nav links — most-searched / important first */
export const GUIDE_LINKS = [
  { href: '/info/buying-land-thailand', key: 'guideBuying' },
  { href: '/info/chanote-title-deed', key: 'guideChanote' },
  {
    href: 'https://data.hua-hin-land.com/',
    key: 'guideThaiData',
    external: true,
  },
  { href: '/info/health-accidents-thailand', key: 'guideHealth' },
  { href: '/info/transport-thailand', key: 'guideTransport' },
  { href: '/info/food-thailand', key: 'guideFood' },
  { href: '/info/paperwork-thailand', key: 'guidePaperwork' },
  { href: '/info/visa-retirement-thailand', key: 'guideVisa' },
  { href: '/info/living-thailand', key: 'guideLiving' },
  { href: '/info/hua-hin-property-market', key: 'guideHuaHin' },
  { href: '/info/pranburi-property', key: 'guidePranburi' },
  { href: '/info/official-thai-downloads', key: 'guideOfficialDownloads' },
  { href: '/info/thim-app', key: 'guideThim' },
  { href: '/info/thailand-digital-arrival-card', key: 'guideTdac' },
  { href: '/info/drinking-water-thailand', key: 'guideDrinkWater' },
] as const

export type GuideLink = (typeof GUIDE_LINKS)[number]

export function isExternalGuideLink(
  item: GuideLink
): item is GuideLink & { external: true } {
  return 'external' in item && item.external === true
}
