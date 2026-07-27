/** Helpers for the list-property submission form. */

const IMAGE_EXT_RE = /\.(jpe?g|png|webp)(\?.*)?$/i

export function slugifyListing(location: string, propertyType: string): string {
  const raw = `${location}-${propertyType}`
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
  return raw || 'listing'
}

export function formatPriceInput(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '')
  if (!digits) return ''
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function unformatPrice(value: string): string {
  return value.replace(/[^\d]/g, '')
}

export function isDirectImageUrl(url: string): boolean {
  const trimmed = url.trim()
  if (!trimmed) return true
  try {
    const parsed = new URL(trimmed)
    if (!/^https?:$/i.test(parsed.protocol)) return false
    return IMAGE_EXT_RE.test(parsed.pathname)
  } catch {
    return false
  }
}

export function defaultSizeUnit(propertyType: string): string {
  const type = propertyType.toLowerCase()
  if (type === 'land' || type === '') return 'Rai'
  if (['house', 'villa', 'condo', 'apartment', 'commercial'].includes(type)) return 'Sq.m'
  return 'Sq.m'
}

export function composeSizeValue(size: string, unit: string): string | null {
  const trimmed = size.trim()
  if (!trimmed) return null
  return `${trimmed} ${unit}`.trim()
}

export function composePriceValue(
  amount: string,
  currency: string,
  priceType: string
): string | null {
  const digits = unformatPrice(amount)
  if (!digits) return null
  const formatted = formatPriceInput(digits)
  const symbol = currency === 'THB' ? '฿' : currency
  const typeLabel =
    priceType === 'Total price'
      ? ''
      : priceType === 'Per Rai'
        ? '/Rai'
        : priceType === 'Per Sq.m'
          ? '/Sq.m'
          : priceType === 'Per month'
            ? '/month'
            : ''
  return typeLabel ? `${symbol}${formatted} ${typeLabel}` : `${symbol}${formatted}`
}

/** Thai mobile: 06/08/09xxxxxxxx or +66 6/8/9xxxxxxxx */
export function isValidThaiPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-().]/g, '')
  if (/^\+66[689]\d{8}$/.test(cleaned)) return true
  if (/^0[689]\d{8}$/.test(cleaned)) return true
  return false
}

export function buildTemplateDescription(input: {
  propertyType: string
  location: string
  size: string
  titleDeed: string
  price: string
  transaction?: string
}): string {
  const type = input.propertyType || 'property'
  const location = input.location || 'Thailand'
  const size = input.size || '—'
  const deed = input.titleDeed && input.titleDeed !== 'Unknown/Other' ? input.titleDeed : null
  const price = input.price || 'on request'
  const tx = (input.transaction || 'For Sale').toLowerCase().includes('rent')
    ? 'for rent'
    : 'for sale'

  const deedPart = deed ? `${deed} title deed. ` : ''
  return `Beautiful ${type} ${tx} in ${location}. Size: ${size}. ${deedPart}Asking price: ${price}.`.slice(
    0,
    500
  )
}

export const LIST_PROPERTY_DRAFT_KEY = 'thaiplot-list-property-draft-v1'

