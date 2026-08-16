'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useLocale } from 'next-intl'
import type {
  ExchangeRatesData,
  MarketStats,
  PropertyNewsItem,
  WeatherCity,
} from '@/lib/home-widgets-types'

const COPY = {
  en: {
    sectionAria: 'Live Thailand data',
    propertyNews: 'Property news',
    propertyNewsSource: 'Bangkok Post Property',
    propertyNewsEmpty: 'Property news is temporarily unavailable.',
    exchangeRate: 'Exchange rate',
    exchangeEmpty: 'Exchange rates are temporarily unavailable.',
    updated: 'Updated',
    weather: 'Thailand weather',
    weatherEmpty: 'Weather data is temporarily unavailable.',
    humidity: 'Humidity',
    marketData: 'Market data',
    marketEmpty: 'No market data available yet.',
    totalListings: 'Active listings',
    avgPrice: 'Average price',
    topRegion: 'Top region',
    newestListing: 'Latest listing',
    byType: 'Listings by type',
  },
  nl: {
    sectionAria: 'Live Thailand data',
    propertyNews: 'Vastgoed nieuws',
    propertyNewsSource: 'Bangkok Post Property',
    propertyNewsEmpty: 'Vastgoednieuws is tijdelijk niet beschikbaar.',
    exchangeRate: 'Wisselkoers',
    exchangeEmpty: 'Wisselkoersen zijn tijdelijk niet beschikbaar.',
    updated: 'Bijgewerkt',
    weather: 'Weer Thailand',
    weatherEmpty: 'Weerdata is tijdelijk niet beschikbaar.',
    humidity: 'Luchtvochtigheid',
    marketData: 'Marktdata',
    marketEmpty: 'Nog geen marktdata beschikbaar.',
    totalListings: 'Actieve listings',
    avgPrice: 'Gemiddelde prijs',
    topRegion: 'Populairste regio',
    newestListing: 'Nieuwste listing',
    byType: 'Listings per type',
  },
  th: {
    sectionAria: 'ข้อมูลประเทศไทยแบบเรียลไทม์',
    propertyNews: 'ข่าวอสังหาริมทรัพย์',
    propertyNewsSource: 'Bangkok Post Property',
    propertyNewsEmpty: 'ข่าวอสังหาริมทรัพย์ยังไม่พร้อมใช้งานชั่วคราว',
    exchangeRate: 'อัตราแลกเปลี่ยน',
    exchangeEmpty: 'อัตราแลกเปลี่ยนยังไม่พร้อมใช้งานชั่วคราว',
    updated: 'อัปเดต',
    weather: 'สภาพอากาศประเทศไทย',
    weatherEmpty: 'ข้อมูลสภาพอากาศยังไม่พร้อมใช้งานชั่วคราว',
    humidity: 'ความชื้น',
    marketData: 'ข้อมูลตลาด',
    marketEmpty: 'ยังไม่มีข้อมูลตลาด',
    totalListings: 'ประกาศที่ใช้งาน',
    avgPrice: 'ราคาเฉลี่ย',
    topRegion: 'พื้นที่ยอดนิยม',
    newestListing: 'ประกาศล่าสุด',
    byType: 'ประกาศตามประเภท',
  },
} as const

type CopyKey = keyof typeof COPY.en

function t(locale: string, key: CopyKey): string {
  if (locale === 'nl') return COPY.nl[key]
  if (locale === 'th') return COPY.th[key]
  return COPY.en[key]
}

function formatNewsDate(value: string, locale: string): string {
  const d = new Date(value)
  if (!Number.isFinite(d.getTime())) return ''
  try {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d)
  } catch {
    return d.toISOString().slice(0, 10)
  }
}

function formatRate(value: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(value)
  } catch {
    return value.toFixed(4)
  }
}

function formatMoney(value: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'THB',
      maximumFractionDigits: 0,
    }).format(value)
  } catch {
    return `฿${Math.round(value).toLocaleString()}`
  }
}

function formatUpdated(value: string, locale: string): string {
  const d = new Date(value)
  if (!Number.isFinite(d.getTime())) return ''
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d)
  } catch {
    return d.toISOString()
  }
}

function WidgetShell({
  eyebrow,
  children,
}: {
  eyebrow: string
  children: ReactNode
}) {
  return (
    <div className="rounded-[12px] border border-[#E8E2D6] bg-white overflow-hidden">
      <div className="border-b border-[#E8E2D6] bg-[#FAF7F0] px-4 py-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#C8973A]">
          {eyebrow}
        </p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

export default function HomeDataWidgets() {
  const locale = useLocale()
  const [news, setNews] = useState<PropertyNewsItem[] | null>(null)
  const [rates, setRates] = useState<ExchangeRatesData | null>(null)
  const [weather, setWeather] = useState<WeatherCity[] | null>(null)
  const [market, setMarket] = useState<MarketStats | null>(null)

  useEffect(() => {
    console.log('[HomeDataWidgets] mounted, locale=', locale)
    let cancelled = false

    async function load() {
      try {
        const [newsRes, ratesRes, weatherRes, marketRes] = await Promise.allSettled([
          fetch('/api/property-news').then((r) => {
            if (!r.ok) throw new Error(String(r.status))
            return r.json()
          }),
          fetch('/api/exchange-rates').then((r) => {
            if (!r.ok) throw new Error(String(r.status))
            return r.json()
          }),
          fetch('/api/weather').then((r) => {
            if (!r.ok) throw new Error(String(r.status))
            return r.json()
          }),
          fetch('/api/market-stats').then((r) => {
            if (!r.ok) throw new Error(String(r.status))
            return r.json()
          }),
        ])
        if (cancelled) return

        setNews(
          newsRes.status === 'fulfilled' && Array.isArray(newsRes.value?.items)
            ? newsRes.value.items
            : []
        )
        setRates(
          ratesRes.status === 'fulfilled' && ratesRes.value?.rates ? ratesRes.value : null
        )
        setWeather(
          weatherRes.status === 'fulfilled' && Array.isArray(weatherRes.value?.cities)
            ? weatherRes.value.cities
            : []
        )
        setMarket(
          marketRes.status === 'fulfilled' && typeof marketRes.value?.totalListings === 'number'
            ? marketRes.value
            : {
                totalListings: 0,
                averagePrice: null,
                topRegion: null,
                byType: [],
                newestListingAt: null,
              }
        )
        console.log('[HomeDataWidgets] loaded', {
          newsOk: newsRes.status === 'fulfilled',
          ratesOk: ratesRes.status === 'fulfilled',
          weatherOk: weatherRes.status === 'fulfilled',
          marketOk: marketRes.status === 'fulfilled',
        })
      } catch (err) {
        console.error('[HomeDataWidgets] load error', err)
        setNews([])
        setRates(null)
        setWeather([])
        setMarket({
          totalListings: 0,
          averagePrice: null,
          topRegion: null,
          byType: [],
          newestListingAt: null,
        })
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [locale])

  const newsItems = news ?? []
  const weatherCities = weather ?? []
  const marketStats = market ?? {
    totalListings: 0,
    averagePrice: null,
    topRegion: null,
    byType: [],
    newestListingAt: null,
  }

  const marketCards = [
    { key: 'total', title: t(locale, 'totalListings'), value: String(marketStats.totalListings) },
    {
      key: 'avg',
      title: t(locale, 'avgPrice'),
      value:
        marketStats.averagePrice != null ? formatMoney(marketStats.averagePrice, locale) : '—',
    },
    { key: 'region', title: t(locale, 'topRegion'), value: marketStats.topRegion || '—' },
    {
      key: 'newest',
      title: t(locale, 'newestListing'),
      value: marketStats.newestListingAt
        ? formatNewsDate(marketStats.newestListingAt, locale)
        : '—',
    },
  ]

  return (
    <section
      id="news-data-widgets"
      className="py-2 relative z-10"
      aria-label={t(locale, 'sectionAria')}
    >
      <div className="space-y-6">
        <WidgetShell eyebrow={t(locale, 'propertyNews')}>
          {news === null ? (
            <p className="py-6 text-center text-sm text-[#5C5247]">Laden…</p>
          ) : newsItems.length === 0 ? (
            <p className="py-6 text-center text-sm text-[#5C5247]">
              {t(locale, 'propertyNewsEmpty')}
            </p>
          ) : (
            <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {newsItems.map((item) => (
                <li key={item.url}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full rounded-[10px] border border-[#E8E2D6] bg-white p-4 transition-colors hover:border-[#00c853]/50 hover:bg-[#FAF7F0]"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-[#1a56db]">
                        {t(locale, 'propertyNewsSource')}
                      </span>
                      <span className="text-[11px] text-[#8A7F72]">
                        {formatNewsDate(item.published, locale)}
                      </span>
                    </div>
                    <p className="text-[14px] font-semibold leading-snug text-[#142038]">
                      {item.title}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </WidgetShell>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-[12px] border border-[#1e3550] bg-[#0d1b2e] overflow-hidden h-full">
            <div className="border-b border-[#1e3550] px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#c9a84c]">
                {t(locale, 'exchangeRate')}
              </p>
            </div>
            <div className="p-4">
              {rates === null && news === null ? (
                <p className="py-4 text-center text-sm text-[#8899aa]">Laden…</p>
              ) : !rates ? (
                <p className="py-4 text-center text-sm text-[#8899aa]">
                  {t(locale, 'exchangeEmpty')}
                </p>
              ) : (
                <>
                  <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2">
                    {(
                      [
                        ['EUR', rates.rates.EUR],
                        ['USD', rates.rates.USD],
                        ['GBP', rates.rates.GBP],
                        ['AUD', rates.rates.AUD],
                      ] as const
                    ).map(([code, rate]) => (
                      <li
                        key={code}
                        className="rounded-[10px] border border-[#1e3550] bg-[#142536] px-3 py-3"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8899aa] mb-1">
                          1 THB
                        </p>
                        <p className="text-white text-[15px] font-semibold tabular-nums">
                          {formatRate(rate, locale)}{' '}
                          <span className="text-[#c9a84c]">{code}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[11px] text-[#8899aa]">
                    {t(locale, 'updated')}: {formatUpdated(rates.updatedAt, locale)}
                  </p>
                </>
              )}
            </div>
          </div>

          <WidgetShell eyebrow={t(locale, 'weather')}>
            {weather === null ? (
              <p className="py-6 text-center text-sm text-[#5C5247]">Laden…</p>
            ) : weatherCities.length === 0 ? (
              <p className="py-6 text-center text-sm text-[#5C5247]">
                {t(locale, 'weatherEmpty')}
              </p>
            ) : (
              <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 snap-x snap-mandatory">
                {weatherCities.map((city) => (
                  <div
                    key={city.id}
                    className="min-w-[148px] flex-shrink-0 snap-start rounded-[10px] border border-[#E8E2D6] bg-[#FAF7F0] p-4"
                  >
                    <p className="text-[13px] font-semibold text-[#142038] mb-2">{city.name}</p>
                    <p
                      className="text-2xl font-bold text-[#1A2744] mb-1 tabular-nums"
                      style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                    >
                      {city.temp}°C
                    </p>
                    <p className="text-[12px] text-[#5C5247] capitalize mb-2 leading-snug">
                      {city.condition}
                    </p>
                    <p className="text-[11px] text-[#8A7F72]">
                      {t(locale, 'humidity')}: {city.humidity}%
                    </p>
                  </div>
                ))}
              </div>
            )}
          </WidgetShell>
        </div>

        <WidgetShell eyebrow={t(locale, 'marketData')}>
          {market === null ? (
            <p className="py-6 text-center text-sm text-[#5C5247]">Laden…</p>
          ) : marketStats.totalListings === 0 ? (
            <p className="py-6 text-center text-sm text-[#5C5247]">
              {t(locale, 'marketEmpty')}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {marketCards.map((card) => (
                  <div
                    key={card.key}
                    className="rounded-[10px] border border-[#E8E2D6] bg-[#FAF7F0] px-3 py-4 text-center"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8A7F72] mb-2">
                      {card.title}
                    </p>
                    <p
                      className="text-[18px] sm:text-[20px] font-bold text-[#1A2744] leading-tight"
                      style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                    >
                      {card.value}
                    </p>
                  </div>
                ))}
              </div>
              {marketStats.byType.length > 0 ? (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8A7F72] mb-2">
                    {t(locale, 'byType')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {marketStats.byType.slice(0, 8).map((item) => (
                      <span
                        key={item.type}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#E8E2D6] bg-white px-3 py-1 text-[12px] text-[#142038]"
                      >
                        <span className="font-medium">{item.type}</span>
                        <span className="text-[#C8973A] font-semibold tabular-nums">
                          {item.count}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </WidgetShell>
      </div>
    </section>
  )
}
