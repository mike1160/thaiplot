const EXTERNAL_ICON = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    className="shrink-0"
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

export type PartnerLinkItem = {
  href: string
  label: string
}

type PartnerLinksProps = {
  title: string
  links: PartnerLinkItem[]
  /** @deprecated kept for call sites that still pass a CTA; unused in grid cards */
  cta?: string
}

export default function PartnerLinks({ title, links }: PartnerLinksProps) {
  if (links.length === 0) return null

  return (
    <section aria-label={title}>
      <h2 className="tp-section-title flex items-center gap-2.5">
        <span>{title}</span>
        <span className="text-[#C8973A]" aria-hidden>
          {EXTERNAL_ICON}
        </span>
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2 animate-stagger">
        {links.map((link) => (
          <li key={link.href} className="min-w-0">
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="tp-link-card h-full"
            >
              <span className="text-[#C8973A] shrink-0" aria-hidden>
                {EXTERNAL_ICON}
              </span>
              <span className="min-w-0 leading-snug">{link.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
