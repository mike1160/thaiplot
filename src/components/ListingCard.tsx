'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { trackGaEvent } from '@/lib/ga'
import { LINE_AGENT_URL } from '@/lib/contact'
import {
  isFeaturedHomepageListing,
  resolveListingPhotos,
  resolveListingPriceDisplay,
  resolveListingTitleDeed,
} from '@/lib/listing-ui'
import { truncateText, transactionBadgeKey, type PublicListing } from '@/lib/listings'

type ListingCardProps = {
  listing: PublicListing
  contactHref?: string
}

const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi

function hrefFromMatch(match: string): string {
  return match.startsWith('http') ? match : `https://${match}`
}

function DescriptionWithLinks({
  text,
  className = '',
  expanded = false,
}: {
  text: string
  className?: string
  expanded?: boolean
}) {
  const parts = text.split(URL_REGEX)
  return (
    <p
      className={`text-[#5C5247] text-sm leading-relaxed whitespace-pre-line break-words ${className}`.trim()}
      style={
        expanded
          ? {
              overflow: 'visible',
              maxHeight: 'none',
              WebkitLineClamp: 'unset',
            }
          : undefined
      }
    >
      {parts.map((part, index) => {
        if (!part) return null
        if (/^(https?:\/\/|www\.)/i.test(part)) {
          const href = hrefFromMatch(part)
          const label = part.replace(/^https?:\/\//i, '').replace(/\/$/, '')
          return (
            <a
              key={`${part}-${index}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-medium hover:underline"
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

export default function ListingCard({ listing, contactHref }: ListingCardProps) {
  const t = useTranslations('listings')
  const locale = useLocale()
  const badgeKey = transactionBadgeKey(listing.transaction_type)
  const fullDescription = (listing.description || '').trim()
  const href = contactHref || LINE_AGENT_URL
  const photos = resolveListingPhotos(listing)
  const titleDeed = resolveListingTitleDeed(listing)
  const priceDisplay = resolveListingPriceDisplay(listing)
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const isFeatured = isFeaturedHomepageListing(listing.id)
  const hasHuaHinLandLink = /www\.hua-hin-land\.com/i.test(fullDescription)
  const mainPhoto = photos[activeIndex] || photos[0]
  const thumbnails = photos.length > 1 ? photos : []

  const needsDescriptionToggle = fullDescription.length > 120
  const descriptionForRender =
    descriptionExpanded || !needsDescriptionToggle
      ? fullDescription
      : truncateText(fullDescription, 120)

  useEffect(() => {
    if (!lightboxOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxOpen(false)
      if (event.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length)
      }
      if (event.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % photos.length)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [lightboxOpen, photos.length])

  function trackPhotoClick(photoIndex: number) {
    console.log('photo_clicked', listing.id, photoIndex)
    trackGaEvent('listing_photo_click', {
      listing_id: listing.id,
      photo_index: photoIndex,
    })
  }

  function trackContactClick() {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'listing_contact_click', {
        listing_id: listing.id,
        listing_location: listing.location,
        listing_price: listing.price,
      })
    }

    void fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listing_id: listing.id,
        listing_location: listing.location,
        locale,
      }),
      keepalive: true,
    }).catch(() => {
      // non-blocking
    })
  }

  function selectPhoto(photoIndex: number) {
    setActiveIndex(photoIndex)
    trackPhotoClick(photoIndex)
  }

  function openLightbox() {
    trackPhotoClick(activeIndex)
    setLightboxOpen(true)
  }

  function goPrev() {
    const next = (activeIndex - 1 + photos.length) % photos.length
    setActiveIndex(next)
    trackPhotoClick(next)
  }

  function goNext() {
    const next = (activeIndex + 1) % photos.length
    setActiveIndex(next)
    trackPhotoClick(next)
  }

  return (
    <article
      className={`bg-white border rounded-[12px] overflow-hidden flex flex-col ${
        isFeatured ? 'border-amber-500 border-2' : 'border-[#E8E2D6]'
      }`}
    >
      <div className="relative">
        <button
          type="button"
          onClick={openLightbox}
          className="relative block w-full h-[220px] bg-[#E8E2D6] cursor-zoom-in"
          aria-label="Open photo gallery"
        >
          <img
            src={mainPhoto}
            alt=""
            className="absolute inset-0 w-full h-full object-cover rounded-t-[12px]"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {isFeatured ? (
              <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500 text-white">
                ⭐ Featured
              </span>
            ) : null}
            <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold bg-[#1A2744] text-white">
              {listing.property_type || '—'}
            </span>
            <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-600/90 text-white">
              {t(badgeKey)}
            </span>
          </div>
        </button>

        {thumbnails.length > 0 ? (
          <div className="flex gap-1.5 px-2 py-2 bg-[#F7F4EE] overflow-x-auto">
            {thumbnails.map((photo, index) => (
              <button
                key={`${photo}-${index}`}
                type="button"
                onClick={() => selectPhoto(index)}
                className={`relative shrink-0 h-[60px] w-[80px] overflow-hidden rounded-md border-2 transition-colors ${
                  index === activeIndex ? 'border-amber-500' : 'border-transparent'
                }`}
                aria-label={`Show photo ${index + 1}`}
              >
                <img src={photo} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="p-5 md:p-6 flex flex-col flex-1">
        <p className="text-[#C8973A] text-xs font-medium uppercase tracking-wider mb-1">
          {[listing.category && listing.category !== 'Land & Property' ? listing.category : null, listing.region || listing.location || 'Thailand']
            .filter(Boolean)
            .join(' · ')}
        </p>
        <h3
          className="text-lg md:text-xl font-bold text-[#1A2744] mb-3"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {listing.vehicle_brand
            ? `${listing.vehicle_brand}${listing.vehicle_year ? ` (${listing.vehicle_year})` : ''}`
            : listing.location || 'Thailand'}
        </h3>

        <dl className="space-y-2 text-sm mb-3">
          {listing.vehicle_type ? (
            <div className="flex justify-between gap-4 border-b border-[#E8E2D6] pb-2">
              <dt className="text-[#5C5247]">{t('propertyType')}</dt>
              <dd className="text-[#1A2744] font-medium text-right">{listing.vehicle_type}</dd>
            </div>
          ) : null}
          {listing.vehicle_mileage ? (
            <div className="flex justify-between gap-4 border-b border-[#E8E2D6] pb-2">
              <dt className="text-[#5C5247]">{t('mileage')}</dt>
              <dd className="text-[#1A2744] font-medium text-right">{listing.vehicle_mileage}</dd>
            </div>
          ) : null}
          {listing.condition ? (
            <div className="flex justify-between gap-4 border-b border-[#E8E2D6] pb-2">
              <dt className="text-[#5C5247]">{t('condition')}</dt>
              <dd className="text-[#1A2744] font-medium text-right">{listing.condition}</dd>
            </div>
          ) : null}
          {listing.size ? (
            <div className="flex justify-between gap-4 border-b border-[#E8E2D6] pb-2">
              <dt className="text-[#5C5247]">{t('size')}</dt>
              <dd className="text-[#1A2744] font-medium text-right">{listing.size}</dd>
            </div>
          ) : null}
          {titleDeed ? (
            <div className="flex justify-between gap-4 border-b border-[#E8E2D6] pb-2">
              <dt className="text-[#5C5247]">{t('titleDeed')}</dt>
              <dd className="text-[#1A2744] font-medium text-right break-words">
                {titleDeed}
              </dd>
            </div>
          ) : null}
          {priceDisplay.raw ? (
            <div className="flex justify-between gap-4 border-b border-[#E8E2D6] pb-2">
              <dt className="text-[#5C5247] shrink-0">{t('price')}</dt>
              <dd className="text-[#1A2744] font-medium text-right break-words">
                {priceDisplay.sub ? (
                  <div className="space-y-0.5">
                    <p className="text-base md:text-lg font-bold text-[#1A2744] leading-tight">
                      {priceDisplay.main}
                    </p>
                    <p className="text-xs md:text-sm text-[#5C5247] font-medium">
                      {priceDisplay.sub}
                    </p>
                    {priceDisplay.footnote ? (
                      <p className="text-[11px] italic text-[#5C5247]/85 leading-snug pt-0.5">
                        {priceDisplay.footnote}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <span className="whitespace-pre-wrap">{priceDisplay.main}</span>
                )}
              </dd>
            </div>
          ) : null}
          {listing.vehicle_brand && listing.location ? (
            <div className="flex justify-between gap-4 border-b border-[#E8E2D6] pb-2">
              <dt className="text-[#5C5247]">{t('region')}</dt>
              <dd className="text-[#1A2744] font-medium text-right">{listing.location}</dd>
            </div>
          ) : null}
        </dl>

        {fullDescription ? (
          <div className="mb-3">
            <DescriptionWithLinks text={descriptionForRender} expanded={descriptionExpanded} />
            {needsDescriptionToggle ? (
              <button
                type="button"
                onClick={() => setDescriptionExpanded((open) => !open)}
                className="mt-1.5 text-sm text-[#C8973A] cursor-pointer no-underline bg-transparent border-0 p-0 hover:opacity-80 transition-opacity"
              >
                {descriptionExpanded ? t('readLess') : t('readMore')}
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="mt-auto">
          {hasHuaHinLandLink ? (
            <a
              href="https://www.hua-hin-land.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline mb-5"
            >
              🌐 www.hua-hin-land.com
            </a>
          ) : null}

          {href.startsWith('http') ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackContactClick}
              className="inline-flex items-center justify-center w-full min-h-[44px] px-4 rounded-[12px] text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
            >
              {t('contact')}
            </a>
          ) : (
            <Link
              href={href}
              onClick={trackContactClick}
              className="inline-flex items-center justify-center w-full min-h-[44px] px-4 rounded-[12px] text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
            >
              {t('contact')}
            </Link>
          )}

          <p className="text-xs text-stone-400 leading-relaxed text-center mt-3">
            {t('cardLegalNote')}{' '}
            <Link
              href="/legal/disclaimer#warnings"
              className="underline underline-offset-2 hover:text-stone-500 transition-colors"
            >
              {t('cardLegalLink')}
            </Link>
          </p>
        </div>
      </div>

      {lightboxOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white text-3xl leading-none px-3 py-1"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
          >
            ×
          </button>

          {photos.length > 1 ? (
            <button
              type="button"
              className="absolute left-3 md:left-6 text-white text-4xl leading-none px-3 py-2"
              onClick={(e) => {
                e.stopPropagation()
                goPrev()
              }}
              aria-label="Previous photo"
            >
              ‹
            </button>
          ) : null}

          <img
            src={mainPhoto}
            alt=""
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {photos.length > 1 ? (
            <button
              type="button"
              className="absolute right-3 md:right-6 text-white text-4xl leading-none px-3 py-2"
              onClick={(e) => {
                e.stopPropagation()
                goNext()
              }}
              aria-label="Next photo"
            >
              ›
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}
