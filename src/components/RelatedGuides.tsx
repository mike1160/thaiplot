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

/** Internal ThaiPlot guide links — keeps crawl equity on-site (unlike PartnerLinks). */
export default function RelatedGuides({ title, links }: Props) {
  if (links.length === 0) return null

  return (
    <section aria-label={title} className="pt-2">
      <h2
        className="text-xl md:text-2xl font-bold text-[#1A2744] mb-4"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {title}
      </h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex items-center gap-2 border border-[#E8E2D6] bg-white px-4 py-3 text-sm font-semibold text-[#1A2744] transition-colors hover:border-[#C8973A]/60 hover:text-[#C8973A]"
            >
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
