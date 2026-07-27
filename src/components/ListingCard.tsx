'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { LINE_AGENT_URL } from '@/lib/contact'
import { truncateText, transactionBadgeKey, type PublicListing } from '@/lib/listings'

type ListingCardProps = {
  listing: PublicListing
  contactHref?: string
}

export default function ListingCard({ listing, contactHref }: ListingCardProps) {
  const t = useTranslations('listings')
  const badgeKey = transactionBadgeKey(listing.transaction_type)
  const description = truncateText(listing.description, 80)
  const href = contactHref || LINE_AGENT_URL

  return (
    <article className="bg-white border border-[#E8E2D6] rounded-[12px] overflow-hidden flex flex-col">
      <div className="relative h-44 bg-[#E8E2D6]">
        <img
          src="/listing-placeholder.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold bg-[#1A2744] text-white">
            {listing.property_type || '—'}
          </span>
          <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-600/90 text-white">
            {t(badgeKey)}
          </span>
        </div>
      </div>

      <div className="p-5 md:p-6 flex flex-col flex-1">
        <p className="text-[#C8973A] text-xs font-medium uppercase tracking-wider mb-1">
          {listing.region || listing.location || 'Thailand'}
        </p>
        <h3
          className="text-lg md:text-xl font-bold text-[#1A2744] mb-3"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {listing.location || 'Thailand'}
        </h3>

        <dl className="space-y-2 text-sm mb-3">
          {listing.size ? (
            <div className="flex justify-between gap-4 border-b border-[#E8E2D6] pb-2">
              <dt className="text-[#5C5247]">{t('size')}</dt>
              <dd className="text-[#1A2744] font-medium text-right">{listing.size}</dd>
            </div>
          ) : null}
          {listing.title_deed ? (
            <div className="flex justify-between gap-4 border-b border-[#E8E2D6] pb-2">
              <dt className="text-[#5C5247]">{t('titleDeed')}</dt>
              <dd className="text-[#1A2744] font-medium text-right">{listing.title_deed}</dd>
            </div>
          ) : null}
        </dl>

        {description ? (
          <p className="text-[#5C5247] text-sm leading-relaxed mb-5 flex-1">{description}</p>
        ) : (
          <div className="flex-1" />
        )}

        {href.startsWith('http') ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full min-h-[44px] px-4 rounded-[12px] text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
          >
            {t('contact')}
          </a>
        ) : (
          <Link
            href={href}
            className="inline-flex items-center justify-center w-full min-h-[44px] px-4 rounded-[12px] text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
          >
            {t('contact')}
          </Link>
        )}
      </div>
    </article>
  )
}
