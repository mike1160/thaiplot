import { fetchApprovedListings, type PublicListing } from '@/lib/listings'
import type {
  ExchangeRatesData,
  MarketStats,
  PropertyNewsItem,
  WeatherCity,
} from '@/lib/home-widgets-types'

export type {
  ExchangeRatesData,
  MarketStats,
  PropertyNewsItem,
  WeatherCity,
} from '@/lib/home-widgets-types'

function decodeHtml(html: string): string {
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8216;/g, '\u2018')
    .replace(/&#8220;/g, '\u201C')
    .replace(/&#8221;/g, '\u201D')
    .replace(/&#8211;/g, '\u2013')
    .replace(/&#8212;/g, '\u2014')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) =>
      String.fromCodePoint(Number.parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, dec: string) =>
      String.fromCodePoint(Number.parseInt(dec, 10))
    )
    .trim()
}

function pick(block: string, patterns: RegExp[]): string {
  for (const re of patterns) {
    const m = block.match(re)
    if (m?.[1]) return decodeHtml(m[1])
  }
  return ''
}

export async function fetchPropertyNews(): Promise<PropertyNewsItem[]> {
  try {
    const res = await fetch('https://www.bangkokpost.com/rss/data/property.xml', {
      next: { revalidate: 1800 },
      headers: {
        'User-Agent': 'ThaiPlot/1.0 (+https://www.thaiplot.com)',
        Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
      },
    })
    if (!res.ok) return []
    const xml = await res.text()
    const items: PropertyNewsItem[] = []
    const regex = /<item[\s>]([\s\S]*?)<\/item>/gi
    let match: RegExpExecArray | null
    while ((match = regex.exec(xml)) !== null && items.length < 5) {
      const block = match[1]
      const title = pick(block, [
        /<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i,
        /<title[^>]*>([\s\S]*?)<\/title>/i,
      ])
        .replace(/\s+/g, ' ')
        .trim()
      const url = pick(block, [
        /<link><!\[CDATA\[([\s\S]*?)\]\]><\/link>/i,
        /<link[^>]*>([\s\S]*?)<\/link>/i,
        /<guid[^>]*>([\s\S]*?)<\/guid>/i,
      ]).trim()
      const published = pick(block, [
        /<pubDate>([\s\S]*?)<\/pubDate>/i,
        /<dc:date>([\s\S]*?)<\/dc:date>/i,
      ])
      if (title && url) {
        items.push({
          title,
          url,
          published,
          source: 'Bangkok Post Property',
        })
      }
    }
    return items
  } catch {
    return []
  }
}

export async function fetchExchangeRates(): Promise<ExchangeRatesData | null> {
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/THB', {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const data = (await res.json()) as {
      rates?: Record<string, number>
      time_last_updated?: number
      date?: string
    }
    const rates = data.rates
    if (!rates?.EUR || !rates?.USD || !rates?.GBP || !rates?.AUD) return null
    const updatedAt =
      typeof data.time_last_updated === 'number'
        ? new Date(data.time_last_updated * 1000).toISOString()
        : data.date
          ? new Date(data.date).toISOString()
          : new Date().toISOString()
    return {
      rates: {
        EUR: rates.EUR,
        USD: rates.USD,
        GBP: rates.GBP,
        AUD: rates.AUD,
      },
      updatedAt,
    }
  } catch {
    return null
  }
}

const WEATHER_CITIES = [
  { id: 'bangkok', name: 'Bangkok', lat: 13.7563, lon: 100.5018 },
  { id: 'phuket', name: 'Phuket', lat: 7.8804, lon: 98.3923 },
  { id: 'hua-hin', name: 'Hua Hin', lat: 12.5684, lon: 99.9577 },
  { id: 'chiang-mai', name: 'Chiang Mai', lat: 18.7883, lon: 98.9853 },
  { id: 'koh-samui', name: 'Koh Samui', lat: 9.512, lon: 100.0136 },
] as const

export async function fetchThailandWeather(): Promise<WeatherCity[]> {
  const key =
    process.env.NEXT_PUBLIC_OPENWEATHER_KEY || process.env.OPENWEATHER_API_KEY || ''
  if (!key) return []

  const results = await Promise.allSettled(
    WEATHER_CITIES.map(async (city) => {
      const url = new URL('https://api.openweathermap.org/data/2.5/weather')
      url.searchParams.set('lat', String(city.lat))
      url.searchParams.set('lon', String(city.lon))
      url.searchParams.set('units', 'metric')
      url.searchParams.set('appid', key)
      const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
      if (!res.ok) throw new Error(`weather ${city.id} ${res.status}`)
      const data = (await res.json()) as {
        main?: { temp?: number; humidity?: number }
        weather?: Array<{ description?: string; main?: string }>
      }
      return {
        id: city.id,
        name: city.name,
        temp: Math.round(data.main?.temp ?? 0),
        condition: data.weather?.[0]?.description || data.weather?.[0]?.main || '—',
        humidity: data.main?.humidity ?? 0,
      } satisfies WeatherCity
    })
  )

  return results
    .filter((r): r is PromiseFulfilledResult<WeatherCity> => r.status === 'fulfilled')
    .map((r) => r.value)
}

function parsePriceNumber(price: string | null | undefined): number | null {
  if (!price) return null
  const lower = price.toLowerCase()
  if (lower.includes('request') || lower.includes('aanvraag')) return null
  // Take the first currency-like number only (avoid concatenating multiple amounts)
  const match = price.match(/(\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?/)
  if (!match) return null
  const n = Number.parseFloat(match[1].replace(/,/g, ''))
  return Number.isFinite(n) && n > 0 ? n : null
}

export function computeMarketStats(listings: PublicListing[]): MarketStats {
  const totalListings = listings.length
  const prices = listings
    .map((l) => parsePriceNumber(l.price))
    .filter((n): n is number => n != null)
  const averagePrice =
    prices.length > 0
      ? Math.round(prices.reduce((sum, n) => sum + n, 0) / prices.length)
      : null

  const regionCounts = new Map<string, number>()
  for (const listing of listings) {
    const region = (listing.region || '').trim() || 'Other'
    regionCounts.set(region, (regionCounts.get(region) || 0) + 1)
  }
  let topRegion: string | null = null
  let topCount = 0
  for (const [region, count] of regionCounts) {
    if (count > topCount) {
      topRegion = region
      topCount = count
    }
  }

  const typeCounts = new Map<string, number>()
  for (const listing of listings) {
    const type = (listing.property_type || '').trim() || 'Other'
    typeCounts.set(type, (typeCounts.get(type) || 0) + 1)
  }
  const byType = [...typeCounts.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)

  let newestListingAt: string | null = null
  let newestTs = 0
  for (const listing of listings) {
    const raw = listing.approved_at || listing.created_at
    if (!raw) continue
    const ts = new Date(raw).getTime()
    if (Number.isFinite(ts) && ts > newestTs) {
      newestTs = ts
      newestListingAt = raw
    }
  }

  return {
    totalListings,
    averagePrice,
    topRegion,
    byType,
    newestListingAt,
  }
}

export async function fetchMarketStats(): Promise<MarketStats> {
  try {
    const listings = await fetchApprovedListings({ limit: 500 })
    return computeMarketStats(listings)
  } catch {
    return {
      totalListings: 0,
      averagePrice: null,
      topRegion: null,
      byType: [],
      newestListingAt: null,
    }
  }
}
