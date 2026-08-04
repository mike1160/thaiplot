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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'search' // 'search' of 'latest'
  const pageSize = searchParams.get('pageSize') || '20'

  const apiKey = process.env.CURRENTS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    let url: string

    if (type === 'search') {
      url = `https://api.currentsapi.services/v1/search?keywords=Thailand+property+expat+Hua+Hin&language=en&page_size=${pageSize}&apiKey=${apiKey}`
    } else {
      url = `https://api.currentsapi.services/v1/latest-news?language=en&country=TH&page_size=${pageSize}&apiKey=${apiKey}`
    }

    const res = await fetch(url, {
      next: { revalidate: 1800 },
    })

    if (!res.ok) {
      throw new Error(`Currents API error: ${res.status}`)
    }

    const data = await res.json()
    const seen = new Set<string>()
    const limit = Number.parseInt(pageSize, 10) || 20

    const articles = ((data.news || []) as CurrentsArticle[])
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
