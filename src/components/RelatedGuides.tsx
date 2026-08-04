'use client'

import { Link } from '@/i18n/navigation'

export type RelatedGuideItem = {
  href: string
  label: string
}

type Props = {
  title: string
  links: RelatedGuideItem[]
}

/** Internal ThaiPlot guide links — keeps crawl equity on-site. */
export default function RelatedGuides({ title, links }: Props) {
  if (links.length === 0) return null

  return (
    <section aria-label={title}>
      <h2 className="tp-section-title">{title}</h2>
      <ul className="grid gap-3 sm:grid-cols-2 animate-stagger">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="tp-link-card">
              <span className="text-[#C8973A]" aria-hidden>
                →
              </span>
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
