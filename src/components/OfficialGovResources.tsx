const EXTERNAL_ICON = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    className="shrink-0 opacity-70"
  >
    <path
      d="M14 4h6v6M10 14L20 4M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

function CategoryIcon({ type }: { type: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    'aria-hidden': true,
  }
  const stroke = { stroke: '#C8973A', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

  switch (type) {
    case 'land':
      return (
        <svg {...common}>
          <path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6" {...stroke} />
        </svg>
      )
    case 'visa':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" {...stroke} />
          <circle cx="9" cy="12" r="2" {...stroke} />
          <path d="M14 10h4M14 14h3" {...stroke} />
        </svg>
      )
    case 'business':
      return (
        <svg {...common}>
          <path d="M4 20V9l8-5 8 5v11M9 20v-5h6v5M8 12h8" {...stroke} />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" {...stroke} />
          <path d="M12 8v4l2.5 2.5" {...stroke} />
        </svg>
      )
  }
}

export type GovLink = {
  name: string
  description: string
  href: string
}

export type GovCategory = {
  title: string
  icon: string
  links: GovLink[]
}

type Props = {
  title: string
  intro: string
  note: string
  categories: GovCategory[]
}

export default function OfficialGovResources({ title, intro, note, categories }: Props) {
  return (
    <section
      id="official-resources"
      className="scroll-mt-24 mb-12"
    >
      <div className="mb-8">
        <p className="text-[#C8973A] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
          .go.th
        </p>
        <h2
          className="text-2xl md:text-3xl font-bold text-[#1A2744] mb-3"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {title}
        </h2>
        <p className="text-[#5C5247] leading-relaxed text-sm md:text-base max-w-2xl">
          {intro}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {categories.map((category) => (
          <article
            key={category.title}
            className="group/card bg-white border border-[#E8E2D6] rounded-[12px] p-5 md:p-6 transition-all duration-200 hover:border-[#C8973A]/55 hover:shadow-[0_10px_28px_rgba(26,39,68,0.08)]"
          >
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8E2D6]">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#FAF7F0] border border-[#C8973A]/25">
                <CategoryIcon type={category.icon} />
              </div>
              <h3
                className="text-lg font-bold text-[#1A2744]"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {category.title}
              </h3>
            </div>

            <ul className="space-y-2">
              {category.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 rounded-[10px] px-3 py-2.5 -mx-1 text-[#1A2744] transition-colors hover:bg-[#FAF7F0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C8973A]"
                  >
                    <span className="mt-0.5 text-[#C8973A]">{EXTERNAL_ICON}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-sm md:text-[15px] group-hover/card:text-[#1A2744]">
                        {link.name}
                        <span className="ml-1.5 text-[#C8973A] font-medium">↗</span>
                      </span>
                      <span className="block text-[#5C5247] text-xs md:text-sm leading-relaxed mt-0.5">
                        {link.description}
                      </span>
                      <span className="block text-[11px] text-[#C8973A]/80 mt-1 truncate">
                        {link.href.replace(/^https?:\/\//, '')}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <p className="mt-5 text-xs text-[#5C5247]/90 leading-relaxed">{note}</p>
    </section>
  )
}
