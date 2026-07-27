'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { LINE_AGENT_URL } from '@/lib/contact'
import { listingPhotoUrl } from '@/lib/listing-ui'
import { truncateText, transactionBadgeKey, type PublicListing } from '@/lib/listings'

type ListingCardProps = {
  listing: PublicListing
  contactHref?: string
  index?: number
}

const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi

function hrefFromMatch(match: string): string {
  return match.startsWith('http') ? match : `https://${match}`
}

function DescriptionWithLinks({ text }: { text: string }) {
  const parts = text.split(URL_REGEX)
  return (
    <p className="text-[#5C5247] text-sm leading-relaxed mb-3 flex-1">
      {parts.map((part, index) => {
        if (!part) return null
        if (/^(https?:\/\/|www\.)/i.test(part)) {
          const href = hrefFromMatch(part)
          const label = part.replace(/^https?:\/\//i, '')
          return (
            <a
              key={`${part}-${index}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C8973A] font-medium hover:underline"
            >
              {label}
            </a>
          )
        }
        return <span key={`${index}-${part.slice(0, 12)}`}>{part}</span>
      })}
    </p>
  )
}

export default function ListingCard({ listing, contactHref, index = 0 }: ListingCardProps) {
  const t = useTranslations('listings')
  const badgeKey = transactionBadgeKey(listing.transaction_type)
  const fullDescription = (listing.description || '').trim()
  const href = contactHref || LINE_AGENT_URL
  const photo = listingPhotoUrl(listing.property_type, index)
  const isSoi112 = (listing.location || '').toLowerCase().includes('soi 112')
  const hasHuaHinLandLink =
    /hua-hin-land\.com/i.test(fullDescription) || isSoi112

  // Keep URLs readable: truncate plain text, then re-attach any www/http matches from full text
  const urls = fullDescription.match(URL_REGEX) || []
  const plain = fullDescription.replace(URL_REGEX, ' ').replace(/\s+/g, ' ').trim()
  const truncatedPlain = truncateText(plain, 80)
  const descriptionForRender =
    urls.length > 0 ? `${truncatedPlain}${truncatedPlain ? ' ' : ''}${urls.join(' ')}` : truncatedPlain

  return (
    <article className="bg-white border border-[#E8E2D6] rounded-[12px] overflow-hidden flex flex-col">
      <div className="relative h-[180px] bg-[#E8E2D6]">
        <img
          src={photo}
          alt=""
          className="absolute inset-0 w-full h-full object-cover rounded-t-[12px]"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold bg-[#1A2744] text-white">
            {listing.property_type || '—'}
          </span>
          <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-600/90 text-white">
            {t(badgeKey)}
          </span>
        </div>
        <span className="absolute bottom-2 right-2 text-[10px] text-white/90 bg-black/40 px-1.5 py-0.5 rounded">
          Photo: Pexels
        </span>
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
          {listing.price ? (
            <div className="flex justify-between gap-4 border-b border-[#E8E2D6] pb-2">
              <dt className="text-[#5C5247]">{t('price')}</dt>
              <dd className="text-[#1A2744] font-medium text-right">{listing.price}</dd>
            </div>
          ) : null}
        </dl>

        {descriptionForRender ? (
          <DescriptionWithLinks text={descriptionForRender} />
        ) : (
          <div className="flex-1" />
        )}

        {hasHuaHinLandLink ? (
          <a
            href="https://www.hua-hin-land.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#C8973A] hover:underline mb-5"
          >
            🌐 www.hua-hin-land.com
          </a>
        ) : null}

        {href.startsWith('http') ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full min-h-[44px] px-4 rounded-[12px] text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors mt-auto"
          >
            {t('contact')}
          </a>
        ) : (
          <Link
            href={href}
            className="inline-flex items-center justify-center w-full min-h-[44px] px-4 rounded-[12px] text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors mt-auto"
          >
            {t('contact')}
          </Link>
        )}
      </div>
    </article>
  )
}
