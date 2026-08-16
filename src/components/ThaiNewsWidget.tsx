'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'

export type NewsSourceId = 'bangkokpost' | 'thaiger' | 'reddit'

export type NewsItem = {
  id: string
  title: string
  url: string
  published: string
  source: NewsSourceId
  sourceLabel: string
}

type TabId = 'all' | NewsSourceId

type ApiItem = {
  title: string
  link: string
  pubDate: string
  source: string
  sourceKey?: string
}

type CachePayload = {
  ts: number
  bySource: Record<string, NewsItem[]>
}

const CACHE_KEY = 'thaiplot-thai-news-api-v3'
const CACHE_TTL_MS = 30 * 60 * 1000

const SOURCE_META: Record<
  NewsSourceId,
  { label: string; color: string }
> = {
  bangkokpost: { label: 'Bangkok Post', color: '#C0392B' },
  thaiger: { label: 'The Thaiger', color: '#E67E22' },
  reddit: { label: 'r/Thailand', color: '#ff4500' },
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'bangkokpost', label: 'Bangkok Post' },
  { id: 'thaiger', label: 'The Thaiger' },
  { id: 'reddit', label: 'r/Thailand' },
]

function labelToKey(label: string, sourceKey?: string): NewsSourceId | null {
  if (sourceKey === 'bangkokpost' || sourceKey === 'thaiger' || sourceKey === 'reddit') {
    return sourceKey
  }
  const lower = label.toLowerCase()
  if (lower.includes('bangkok')) return 'bangkokpost'
  if (lower.includes('thaiger')) return 'thaiger'
  if (lower.includes('reddit') || lower.includes('thailand')) return 'reddit'
  return null
}

function mapApiItems(raw: ApiItem[]): NewsItem[] {
  return raw
    .map((item, index) => {
      const key = labelToKey(item.source, item.sourceKey)
      if (!key || !item.title || !item.link) return null
      return {
        id: `${key}-${index}-${item.link}`,
        title: item.title,
        url: item.link,
        published: item.pubDate || '',
        source: key,
        sourceLabel: SOURCE_META[key].label,
      } satisfies NewsItem
    })
    .filter((x): x is NewsItem => Boolean(x))
}

function readCache(source: string): NewsItem[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as CachePayload
    if (!data?.ts || !data.bySource) return null
    if (Date.now() - data.ts > CACHE_TTL_MS) return null
    return data.bySource[source] || null
  } catch {
    return null
  }
}

function writeCache(source: string, items: NewsItem[]) {
  try {
    let bySource: Record<string, NewsItem[]> = {}
    const raw = localStorage.getItem(CACHE_KEY)
    if (raw) {
      const prev = JSON.parse(raw) as CachePayload
      if (prev?.bySource && Date.now() - (prev.ts || 0) < CACHE_TTL_MS) {
        bySource = prev.bySource
      }
    }
    bySource[source] = items
    const payload: CachePayload = { ts: Date.now(), bySource }
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
  } catch {
    /* ignore */
  }
}

function clearCache() {
  try {
    localStorage.removeItem(CACHE_KEY)
  } catch {
    /* ignore */
  }
}

function relativeTime(isoOrRfc: string, locale: string): string {
  if (!isoOrRfc) return ''
  const date = new Date(isoOrRfc)
  if (Number.isNaN(date.getTime())) return ''
  const diffSec = Math.round((date.getTime() - Date.now()) / 1000)
  const rtf = new Intl.RelativeTimeFormat(locale.startsWith('nl') ? 'nl' : locale, {
    numeric: 'auto',
  })
  const abs = Math.abs(diffSec)
  if (abs < 60) return rtf.format(diffSec, 'second')
  const mins = Math.round(diffSec / 60)
  if (Math.abs(mins) < 60) return rtf.format(mins, 'minute')
  const hours = Math.round(diffSec / 3600)
  if (Math.abs(hours) < 48) return rtf.format(hours, 'hour')
  const days = Math.round(diffSec / 86400)
  return rtf.format(days, 'day')
}

type Props = {
  variant?: 'home' | 'page'
  homeLimit?: number
}

export default function ThaiNewsWidget({ variant = 'home', homeLimit = 8 }: Props) {
  const locale = useLocale()
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<TabId>('all')
  const isPage = variant === 'page'
  const perSource = isPage ? 10 : 4

  const loadFeeds = useCallback(
    async (source: TabId, force = false) => {
      setError(null)
      const cacheKey = source

      if (!force) {
        const cached = readCache(cacheKey)
        if (cached && cached.length > 0) {
          setItems(cached)
          setLoading(false)
          return
        }
      }

      setLoading(true)
      try {
        const res = await fetch(`/api/news?source=${source}`)
        const data = (await res.json()) as { items?: ApiItem[] }
        const mapped = mapApiItems(data.items || [])
        if (mapped.length === 0) {
          setError('Geen nieuws beschikbaar')
          setItems([])
        } else {
          setItems(mapped)
          writeCache(cacheKey, mapped)
        }
      } catch {
        setError('Geen nieuws beschikbaar')
        setItems([])
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    void loadFeeds(tab, false)
  }, [tab, loadFeeds])

  const visible = useMemo(() => {
    if (tab === 'all') {
      return isPage ? items.slice(0, 24) : items.slice(0, homeLimit)
    }
    return items.filter((i) => i.source === tab).slice(0, perSource)
  }, [items, tab, isPage, homeLimit, perSource])

  return (
    <section className="w-full" aria-label="Thailand news">
      <div className="overflow-hidden rounded-[12px] border border-[#00c853]/35 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#00c853] px-4 py-3 sm:px-5">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
              Thailand News
            </span>
            <p
              className="text-base font-semibold text-white sm:text-lg"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              {isPage ? 'Daily headlines for expats & buyers' : 'Latest from Thailand'}
            </p>
          </div>
          {isPage ? (
            <button
              type="button"
              onClick={() => {
                clearCache()
                void loadFeeds(tab, true)
              }}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-[8px] border border-white/40 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/25 disabled:opacity-60"
            >
              Vernieuwen
            </button>
          ) : (
            <Link
              href="/news"
              className="text-xs font-semibold text-white/95 underline-offset-2 hover:underline"
            >
              Alle nieuws →
            </Link>
          )}
        </div>

        <div className="border-b border-[#E8E2D6] bg-[#FAF7F0] px-2 sm:px-3">
          <div
            className="flex gap-1 overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="News sources"
          >
            {TABS.map((t) => {
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className={`flex-shrink-0 rounded-[8px] px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                    active
                      ? 'bg-[#0d1b2e] text-white'
                      : 'bg-transparent text-[#5C5247] hover:bg-white'
                  }`}
                >
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-3 sm:p-4">
          {loading && items.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#5C5247]">Laden…</p>
          ) : visible.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#5C5247]">
              {error || 'Geen nieuws beschikbaar'}
            </p>
          ) : (
            <ul
              className={`m-0 grid list-none gap-3 p-0 ${
                isPage
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2'
              }`}
            >
              {visible.flatMap((item, index) => {
                const meta = SOURCE_META[item.source]
                const nodes = [
                  <li key={item.id}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full rounded-[10px] border border-[#E8E2D6] bg-white p-4 transition-colors hover:border-[#00c853]/50 hover:bg-[#FAF7F0]"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span
                          className="text-[11px] font-bold uppercase tracking-wide"
                          style={{ color: meta.color }}
                        >
                          {meta.label}
                        </span>
                        <span className="text-[11px] text-[#8A7F72]">
                          {relativeTime(item.published, locale)}
                        </span>
                      </div>
                      <p className="text-[14px] font-semibold leading-snug text-[#142038]">
                        {item.title}
                      </p>
                    </a>
                  </li>,
                ]

                if (isPage && index === 2) {
                  nodes.push(
                    <li key="promo-waiair" style={{ gridColumn: '1 / -1', listStyle: 'none' }}>
                      <div
                        style={{
                          background: '#0d1b2e',
                          border: '1.5px solid #ff6400',
                          borderRadius: 12,
                          padding: '20px 24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 16,
                          flexWrap: 'wrap',
                        }}
                      >
                        <div>
                          <p
                            style={{
                              color: '#ff6400',
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: '0.08em',
                              margin: '0 0 4px',
                            }}
                          >
                            ✈ GRATIS APP · iOS
                          </p>
                          <p
                            style={{
                              color: '#fff',
                              fontSize: 17,
                              fontWeight: 600,
                              margin: '0 0 4px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#ff6400"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                            WaiAir — vluchttracker
                          </p>
                          <p
                            style={{
                              color: '#8899aa',
                              fontSize: 13,
                              margin: 0,
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 8,
                            }}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                              style={{ flexShrink: 0, marginTop: 2 }}
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                            <span>
                              Realtime vluchtstatus voor 10.000+ luchthavens wereldwijd. Gratis.
                            </span>
                          </p>
                        </div>
                        <a
                          href="https://apps.apple.com/ph/app/waiair/id6798072839"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: '#fff',
                            color: '#000',
                            borderRadius: 9,
                            padding: '10px 20px',
                            fontSize: 13,
                            fontWeight: 700,
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          🍎 Download gratis
                        </a>
                      </div>
                    </li>
                  )
                }

                if (isPage && index === 5) {
                  nodes.push(
                    <li key="promo-saved-souls" style={{ gridColumn: '1 / -1', listStyle: 'none' }}>
                      <div
                        style={{
                          background: 'rgba(200,151,58,0.08)',
                          border: '1px solid rgba(200,151,58,0.3)',
                          borderRadius: 12,
                          padding: '20px 24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 16,
                          flexWrap: 'wrap',
                        }}
                      >
                        <div>
                          <p
                            style={{
                              color: '#C8973A',
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: '0.08em',
                              margin: '0 0 4px',
                            }}
                          >
                            🐾 GOED DOEL · THAILAND
                          </p>
                          <p
                            style={{
                              color: '#1A2744',
                              fontSize: 17,
                              fontWeight: 600,
                              margin: '0 0 4px',
                            }}
                          >
                            Saved Souls Foundation — geef hoop aan straathonden
                          </p>
                          <p style={{ color: '#5C5247', fontSize: 13, margin: 0 }}>
                            Non-profit geregistreerd in Thailand · 100% van elke donatie gaat naar
                            de honden
                          </p>
                        </div>
                        <a
                          href="https://www.savedsouls-foundation.org/en/donate"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: '#C8973A',
                            color: '#fff',
                            borderRadius: 9,
                            padding: '10px 20px',
                            fontSize: 13,
                            fontWeight: 700,
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          🐕 Doneer nu
                        </a>
                      </div>
                    </li>
                  )
                }

                return nodes
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
