const HHL_ORIGIN = 'https://www.hua-hin-land.com'

/** Locales that exist on hua-hin-land.com (EN is the unprefixed default). */
const HHL_LOCALES = new Set(['nl', 'de', 'th', 'sv', 'da'])

/**
 * Build a locale-aware Hua Hin Land URL.
 * @param path e.g. `/life/european-retirees`, `/info/chanote`, or `` for homepage
 */
export function hhlUrl(path: string, locale: string): string {
  const prefix = HHL_LOCALES.has(locale) ? `/${locale}` : ''
  const normalized = path.startsWith('/') ? path : path ? `/${path}` : ''
  if (!normalized) {
    return prefix ? `${HHL_ORIGIN}${prefix}` : `${HHL_ORIGIN}/`
  }
  return `${HHL_ORIGIN}${prefix}${normalized}`
}

export const HHL_PATHS = {
  homepage: '',
  faq: '/faq',
  europeanRetirees: '/life/european-retirees',
  usaRetirees: '/life/usa-retirees',
  dutch: '/life/dutch',
  scandinavians: '/life/scandinavians',
  /** Buying land for foreigners (sitemap; `/land/kopen` does not exist) */
  foreignBuyers: '/info/foreign-buyers',
  /** Chanote title deed guide (sitemap; `/land/chanote` does not exist) */
  chanote: '/info/chanote',
} as const
