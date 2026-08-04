import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { SITE_URL } from '@/lib/seo'
import { fetchApprovedListingsForSitemap } from '@/lib/listings'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const LOCALES = routing.locales // en, nl, de, th, sv, da, fr, ru, zh, ja

type Freq = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>

const STATIC_ROUTES: Array<{
  path: string
  priority: number
  /** Optional lower priority for non-EN locales (prompt: NL info guides). */
  nlPriority?: number
  changeFrequency: Freq
}> = [
  // Hoofdpagina's
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/listings', priority: 0.9, changeFrequency: 'daily' },
  { path: '/list-property', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/news', priority: 0.6, changeFrequency: 'hourly' },

  // Regio's
  { path: '/hua-hin', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/pranburi', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/black-mountain', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/hin-lek-fai', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/phuket', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/bangkok', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/koh-samui', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/villas-for-sale-hua-hin', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/resort-for-sale-hua-hin', priority: 0.7, changeFrequency: 'weekly' },

  // Info-gidsen
  { path: '/info/buying-land-thailand', priority: 0.8, nlPriority: 0.7, changeFrequency: 'monthly' },
  { path: '/info/chanote-title-deed', priority: 0.8, nlPriority: 0.7, changeFrequency: 'monthly' },
  { path: '/info/visa-retirement-thailand', priority: 0.8, nlPriority: 0.7, changeFrequency: 'monthly' },
  { path: '/info/health-accidents-thailand', priority: 0.8, nlPriority: 0.7, changeFrequency: 'monthly' },
  { path: '/info/transport-thailand', priority: 0.8, nlPriority: 0.7, changeFrequency: 'monthly' },
  { path: '/info/food-thailand', priority: 0.8, nlPriority: 0.7, changeFrequency: 'monthly' },
  { path: '/info/living-thailand', priority: 0.8, nlPriority: 0.7, changeFrequency: 'monthly' },
  { path: '/info/drinking-water-thailand', priority: 0.7, nlPriority: 0.6, changeFrequency: 'monthly' },
  { path: '/info/paperwork-thailand', priority: 0.7, nlPriority: 0.6, changeFrequency: 'monthly' },
  { path: '/info/thim-app', priority: 0.7, nlPriority: 0.6, changeFrequency: 'monthly' },
  { path: '/info/thailand-digital-arrival-card', priority: 0.7, nlPriority: 0.6, changeFrequency: 'monthly' },
  { path: '/info/official-thai-downloads', priority: 0.7, nlPriority: 0.6, changeFrequency: 'monthly' },
  { path: '/info/thai-islands', priority: 0.8, nlPriority: 0.7, changeFrequency: 'monthly' },
  { path: '/info/thai-culture', priority: 0.8, nlPriority: 0.7, changeFrequency: 'monthly' },

  // Extra info (niet in prompt-lijst, wel bestaande pagina's)
  { path: '/info/hua-hin-property-market', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/info/pranburi-property', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/info/drinking-water-thailand/options', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/info/drinking-water-thailand/vending', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/info/drinking-water-thailand/costs', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/info/drinking-water-thailand/advice', priority: 0.5, changeFrequency: 'monthly' },

  // Legal
  { path: '/legal/disclaimer', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/legal/privacy', priority: 0.3, changeFrequency: 'yearly' },
]

/**
 * Public URLs: EN has no locale prefix (redirects strip /en).
 * Other locales: https://www.thaiplot.com/{locale}/...
 */
function sitemapUrl(locale: string, path: string): string {
  const clean = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  if (locale === 'en') {
    return clean ? `${SITE_URL}${clean}` : `${SITE_URL}/`
  }
  return clean ? `${SITE_URL}/${locale}${clean}` : `${SITE_URL}/${locale}`
}

function routePriority(
  locale: string,
  route: (typeof STATIC_ROUTES)[number]
): number {
  if (locale === 'nl' && route.nlPriority != null) return route.nlPriority
  return route.priority
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    STATIC_ROUTES.map((route) => {
      const path =
        locale === 'nl' && route.path === '/info/thai-islands'
          ? '/info/thaise-eilanden'
          : route.path
      return {
        url: sitemapUrl(locale, path),
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: routePriority(locale, route),
      }
    })
  )

  let listings: Awaited<ReturnType<typeof fetchApprovedListingsForSitemap>> = []
  try {
    listings = await fetchApprovedListingsForSitemap()
  } catch (error) {
    console.error('[sitemap] failed to fetch listings', error)
  }

  const listingEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    listings.map((listing) => {
      const modified = listing.approved_at || listing.created_at
      return {
        url: sitemapUrl(locale, `/listings/${listing.id}`),
        lastModified: modified ? new Date(modified) : lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }
    })
  )

  return [...staticEntries, ...listingEntries, {
    url: `${SITE_URL}/waiair.html`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }]
}
