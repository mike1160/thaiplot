import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'

export const SITE_URL = 'https://www.thaiplot.com'

const DEFAULT_KEYWORDS =
  'land for sale Thailand, Hua Hin property, vastgoed Thailand, huizen te koop Thailand, real estate Thailand, grond kopen Thailand, buy land Thailand foreigner, houses for sale Thailand, Chanote land, Pranburi land, Thailand real estate marketplace, health insurance Thailand, medical costs Thailand'

const KEYWORDS_BY_NAMESPACE: Record<string, string> = {
  infoPaperwork:
    'Thai paperwork foreigners, Tabien Baan yellow book blue book, red Chanote, pink ID Thailand, Thai driving licence, TM30, 90 day report Thailand, Papieren Thailand',
  infoThim:
    'THIM app, THIM Thailand, Thailand Immigration Management, Thai Immigration app, THIM download, THIM Google Play, TDAC THIM, Royal Thai Police THIM',
  infoTdac:
    'Thailand Digital Arrival Card, TDAC Thailand, TDAC immigration, digital arrival card Thailand, TM6 Thailand, tdac.immigration.go.th, Thailand arrival card online',
  infoOfficialDownloads:
    'THIM Thai Immigration app, Thailand Digital Arrival Card, TDAC Thailand, tdac.immigration.go.th, official Thai websites, Thai government downloads, immigration.go.th, DLT Thailand, Department of Lands, Thai e-Visa, Officiële Thaise websites',
  infoDrinkWater:
    'drinking water Thailand, Thai tap water, RO filter Thailand, water vending machine Thailand, drinkwater Thailand',
  infoBuying:
    'buy land Thailand foreigner, grond kopen Thailand, leasehold Thailand, Chanote, Thai company land, vastgoed kopen Thailand, real estate Thailand foreigners',
  infoChanote: 'Chanote title deed, Nor Sor 4 Jor, Thai land title, eigendomsakte Thailand',
  infoVisa: 'Thailand retirement visa, OA visa, Elite visa, LTR visa, pensioenvisum Thailand',
  infoHuaHin:
    'Hua Hin property market, Hua Hin real estate, huizen Hua Hin, vastgoed Hua Hin, land for sale Hua Hin',
  infoPranburi:
    'Pranburi property, Pranburi real estate, land for sale Pranburi, huizen Pranburi',
  infoHealth:
    'health insurance Thailand, medical costs Thailand, hospital Thailand foreigners, accident insurance Thailand, OTC medicine Thailand, pharmacy Thailand, worldwide health insurance Thailand, IPMI Thailand, zorgverzekering Thailand, medische kosten Thailand, ongevallen Thailand, apotheek Thailand',
  infoFood:
    'food Thailand, Thai street food, vegetarian Thailand, vegan Thailand, gluten free Thailand, Thai restaurant phrases, alcohol Thailand, cannabis Thailand law, eten Thailand, vegetarisch Thailand, glutenvrij Thailand',
  infoTransport:
    'transport Thailand, traffic accidents Thailand, motorcycle safety Thailand, Grab Bolt taxi Thailand, BTS MRT Bangkok, domestic flights Thailand, ferry Thailand, 12Go Thailand, verkeersveiligheid Thailand, vervoer Thailand',
  infoLiving:
    'cost of living Thailand, taxes Thailand foreigners, open bank account Thailand, international schools Thailand, driving in Thailand, levensonderhoud Thailand, belasting Thailand, bankrekening Thailand, scholen Thailand',
  infoIslands:
    'Thai islands, Koh Samui, Koh Phangan, Koh Tao, Koh Phi Phi, Koh Lanta, Koh Lipe, Similan Islands, diving Thailand, snorkeling Thailand, ferry Thailand islands, Thaise eilanden, duiken Thailand, snorkelen Thailand',
}

export function localizedPath(locale: string, path: string): string {
  const clean = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  if (locale === routing.defaultLocale) {
    return clean ? `${SITE_URL}${clean}` : SITE_URL
  }
  return clean ? `${SITE_URL}/${locale}${clean}` : `${SITE_URL}/${locale}`
}

/** Make image URLs absolute for Open Graph / Twitter cards. */
export function absoluteAssetUrl(pathOrUrl: string): string {
  const value = (pathOrUrl || '').trim()
  if (!value) return `${SITE_URL}/hero.jpg`
  if (/^https?:\/\//i.test(value)) return value
  return `${SITE_URL}${value.startsWith('/') ? value : `/${value}`}`
}

export async function buildPageMetadata({
  locale,
  namespace,
  path,
  ogImage,
}: {
  locale: string
  namespace: string
  path: string
  /** Optional Open Graph / Twitter image path (e.g. /thim-app.png) */
  ogImage?: string
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace })
  const title = t('metaTitle')
  const description = t('metaDescription')
  const canonical = localizedPath(locale, path)
  const languages: Record<string, string> = {}
  for (const loc of routing.locales) {
    languages[loc] = localizedPath(loc, path)
  }

  return {
    title,
    description,
    keywords: KEYWORDS_BY_NAMESPACE[namespace] ?? DEFAULT_KEYWORDS,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'ThaiPlot',
      locale: locale === 'zh' ? 'zh_CN' : locale,
      type: 'article',
      ...(ogImage
        ? { images: [{ url: absoluteAssetUrl(ogImage), alt: title }] }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [absoluteAssetUrl(ogImage)] } : {}),
    },
  }
}
