import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'

export const SITE_URL = 'https://www.thaiplot.com'

const DEFAULT_KEYWORDS =
  'land for sale Thailand, Hua Hin property, chanote land, buy land Thailand foreigner, Pranburi land, Thailand real estate'

const KEYWORDS_BY_NAMESPACE: Record<string, string> = {
  infoPaperwork:
    'Thai paperwork foreigners, Tabien Baan yellow book, blue Chanote, pink ID Thailand, Thai driving licence, TM30, 90 day report Thailand, Papieren Thailand',
  infoOfficialDownloads:
    'official Thai websites, Thai government downloads, immigration.go.th, DLT Thailand, Department of Lands, Thai e-Visa, official forms Thailand',
  infoDrinkWater:
    'drinking water Thailand, Thai tap water, RO filter Thailand, water vending machine Thailand',
  infoBuying:
    'buy land Thailand foreigner, leasehold Thailand, Chanote, Thai company land',
  infoChanote: 'Chanote title deed, Nor Sor 4 Jor, Thai land title',
  infoVisa: 'Thailand retirement visa, OA visa, Elite visa, LTR visa',
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
}: {
  locale: string
  namespace: string
  path: string
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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}
