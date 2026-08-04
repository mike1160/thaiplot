import { NextResponse } from 'next/server'

// Cache: 30 minuten (1800 seconden)
export const revalidate = 1800

type CurrentsArticle = {
  id?: string
  title?: string
  description?: string
  url?: string
  published?: string
  image?: string
  author?: string
}

const RELEVANCE =
  /\b(thailand|thai|bangkok|hua hin|pranburi|phuket|pattaya|chiang mai|koh |visa|expat|property|real estate|condo|land|immigration)\b/i

function normalizeArticles(news: CurrentsArticle[], limit: number) {
  const seen = new Set<string>()
  return news
    .filter((article) => article.title && article.url)
    .filter((article) => {
      const key = article.url as string
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .slice(0, limit)
    .map((article) => ({
      id: article.id || article.url,
      title: article.title,
      description: article.description || '',
      url: article.url,
      published: article.published || '',
      image: article.image || undefined,
      author: article.author || undefined,
    }))
}

async function fetchCurrents(url: string): Promise<CurrentsArticle[]> {
  const res = await fetch(url, { next: { revalidate: 1800 } })
  if (!res.ok) {
    throw new Error(`Currents API error: ${res.status}`)
  }
  const data = await res.json()
  return (data.news || []) as CurrentsArticle[]
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'search' // 'search' of 'latest'
  const pageSize = searchParams.get('pageSize') || '20'
  const limit = Number.parseInt(pageSize, 10) || 20

  const apiKey = process.env.CURRENTS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    let news: CurrentsArticle[] = []

    if (type === 'latest') {
      news = await fetchCurrents(
        `https://api.currentsapi.services/v1/latest-news?language=en&country=TH&page_size=${Math.min(limit * 2, 50)}&apiKey=${apiKey}`
      )
    } else {
      // Currents treats multi-word keywords as AND — keep queries broad.
      const queries = ['Thailand', 'Hua+Hin', 'Bangkok']
      const batches = await Promise.all(
        queries.map((keywords) =>
          fetchCurrents(
            `https://api.currentsapi.services/v1/search?keywords=${keywords}&language=en&page_size=${Math.min(limit, 20)}&apiKey=${apiKey}`
          ).catch(() => [] as CurrentsArticle[])
        )
      )
      news = batches.flat()

      // Prefer more relevant headlines, but keep enough items to fill the widget.
      const preferred = news.filter((a) =>
        RELEVANCE.test(`${a.title || ''} ${a.description || ''}`)
      )
      if (preferred.length >= Math.min(limit, 4)) {
        news = preferred
      }

      // Fallback: Thailand latest feed if search is empty/thin.
      if (news.length < Math.min(limit, 4)) {
        const latest = await fetchCurrents(
          `https://api.currentsapi.services/v1/latest-news?language=en&country=TH&page_size=${Math.min(limit * 2, 50)}&apiKey=${apiKey}`
        )
        const relevantLatest = latest.filter((a) =>
          RELEVANCE.test(`${a.title || ''} ${a.description || ''}`)
        )
        news = [...news, ...(relevantLatest.length ? relevantLatest : latest)]
      }
    }

    const articles = normalizeArticles(news, limit)

    return NextResponse.json(
      { articles },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
        },
      }
    )
  } catch (error) {
    console.error('Currents API error:', error)
    return NextResponse.json({ articles: [], error: 'Failed to fetch news' }, { status: 200 })
  }
}
