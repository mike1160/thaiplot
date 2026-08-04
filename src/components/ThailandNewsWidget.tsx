'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'

interface Article {
  id: string
  title: string
  description: string
  url: string
  published: string
  image?: string
  author?: string
}

interface Props {
  limit?: number
  showImages?: boolean
  showMoreLink?: boolean
}

export default function ThailandNewsWidget({
  limit = 4,
  showImages = false,
  showMoreLink = true,
}: Props) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/thailand-news?type=search&pageSize=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        setArticles(data.articles || [])
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setError(true)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [limit])

  if (loading) {
    return (
      <div className="py-4 text-sm text-[#5C5247]/70">Loading latest Thailand news…</div>
    )
  }

  if (error || articles.length === 0) return null

  return (
    <section className="mt-2">
      <h2 className="tp-section-title mb-6">Latest Thailand news</h2>
      <ul className="m-0 list-none space-y-0 p-0">
        {articles.map((article) => (
          <li
            key={article.id}
            className="mb-4 border-b border-[#E8E2D6] pb-4 last:mb-0 last:border-b-0 last:pb-0"
          >
            {showImages && article.image ? (
              <img
                src={article.image}
                alt={article.title}
                className="mb-3 h-[180px] w-full rounded-[8px] object-cover"
                loading="lazy"
              />
            ) : null}
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-1 block text-base font-semibold leading-snug text-[#142038] transition-colors hover:text-[#C8973A]"
            >
              {article.title}
            </a>
            {article.description ? (
              <p className="mb-1 line-clamp-2 text-sm leading-relaxed text-[#5C5247]">
                {article.description}
              </p>
            ) : null}
            {article.published ? (
              <span className="text-xs text-[#5C5247]/70">
                {new Date(article.published).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
      {showMoreLink ? (
        <Link
          href="/news"
          className="mt-4 inline-block text-sm font-semibold text-[#C8973A] underline-offset-2 hover:underline"
        >
          → More Thailand news
        </Link>
      ) : null}
    </section>
  )
}
