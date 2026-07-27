import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { localizedPath } from '@/lib/seo'

const ROUTES: Array<{
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
}> = [
  { path: '/', priority: 1.0, changeFrequency: 'monthly' },
  { path: '/listings', priority: 0.9, changeFrequency: 'daily' },
  { path: '/list-property', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/info/buying-land-thailand', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/info/chanote-title-deed', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/info/hua-hin-property-market', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/info/pranburi-property', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/info/visa-retirement-thailand', priority: 0.8, changeFrequency: 'weekly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return routing.locales.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: localizedPath(locale, route.path),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }))
  )
}
