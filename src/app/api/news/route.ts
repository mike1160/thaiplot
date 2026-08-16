import { NextResponse } from 'next/server'

export const revalidate = 1800

const FEEDS = [
  {
    key: 'bangkokpost',
    url: 'https://www.bangkokpost.com/rss/data/topstories.xml',
    label: 'Bangkok Post',
  },
  {
    key: 'thaiger',
    url: 'https://thethaiger.com/feed',
    label: 'The Thaiger',
  },
  {
    key: 'reddit',
    url: 'https://www.reddit.com/r/Thailand/top.rss?t=day&limit=10',
    label: 'r/Thailand',
  },
] as const

type FeedItem = {
  title: string
  link: string
  pubDate: string
  source: string
  sourceKey: string
}

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

function parseBlocks(xml: string, tag: 'item' | 'entry', label: string, key: string): FeedItem[] {
  const items: FeedItem[] = []
  const regex = new RegExp(`<${tag}[\\s>]([\\s\\S]*?)</${tag}>`, 'gi')
  let match: RegExpExecArray | null
  while ((match = regex.exec(xml)) !== null) {
    const block = match[1]
    const rawTitle = pick(block, [
      /<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i,
      /<title[^>]*>([\s\S]*?)<\/title>/i,
    ])
    const title = decodeHtml(rawTitle.trim()).replace(/\s+/g, ' ')
    const link = pick(block, [
      /<link><!\[CDATA\[([\s\S]*?)\]\]><\/link>/i,
      /<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i,
      /<link[^>]*>([\s\S]*?)<\/link>/i,
      /<id>([\s\S]*?)<\/id>/i,
      /<guid[^>]*>([\s\S]*?)<\/guid>/i,
    ])
    const pubDate = pick(block, [
      /<pubDate>([\s\S]*?)<\/pubDate>/i,
      /<published>([\s\S]*?)<\/published>/i,
      /<updated>([\s\S]*?)<\/updated>/i,
      /<dc:date>([\s\S]*?)<\/dc:date>/i,
    ])
    if (title && link) {
      items.push({
        title,
        link,
        pubDate,
        source: label,
        sourceKey: key,
      })
    }
  }
  return items
}

function parseItems(xml: string, label: string, key: string): FeedItem[] {
  const rss = parseBlocks(xml, 'item', label, key)
  if (rss.length > 0) return rss.slice(0, 10)
  return parseBlocks(xml, 'entry', label, key).slice(0, 10)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const source = searchParams.get('source') || 'all'
  const feeds =
    source === 'all' ? [...FEEDS] : FEEDS.filter((f) => f.key === source)

  if (feeds.length === 0) {
    return NextResponse.json({ items: [] }, { status: 200 })
  }

  const results = await Promise.allSettled(
    feeds.map(async (f) => {
      const res = await fetch(f.url, {
        next: { revalidate: 1800 },
        headers: {
          'User-Agent': 'ThaiPlot/1.0 (+https://www.thaiplot.com)',
          Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
        },
      })
      if (!res.ok) throw new Error(`${f.key} ${res.status}`)
      const xml = await res.text()
      return parseItems(xml, f.label, f.key)
    })
  )

  const items = results
    .filter((r): r is PromiseFulfilledResult<FeedItem[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value)
    .sort((a, b) => {
      const ta = new Date(a.pubDate).getTime() || 0
      const tb = new Date(b.pubDate).getTime() || 0
      return tb - ta
    })
    .slice(0, source === 'all' ? 24 : 10)

  return NextResponse.json(
    { items },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    }
  )
}
