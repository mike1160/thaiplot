'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import InfoHero from '@/components/InfoHero'
import TurnstileWidget from '@/components/TurnstileWidget'
import type { ListingCategory } from '@/lib/listing-ui'
import { HERO_PHOTOS } from '@/lib/hero-photos'
import {
  buildTemplateDescription,
  composePriceValue,
  composeSizeValue,
  defaultSizeUnit,
  formatPriceInput,
  isValidThaiPhone,
  LIST_PROPERTY_DRAFT_KEY,
  slugifyListing,
} from '@/lib/list-property-form'
import LocationMapPicker from '@/components/LocationMapPicker'
import ListingCard from '@/components/ListingCard'
import ProvinceSelect from '@/components/ProvinceSelect'
import PhotoUploader from '@/components/PhotoUploader'
import type { PublicListing } from '@/lib/listings'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const LANG_OPTIONS = ['EN', 'NL', 'DE', 'TH', 'SV', 'DA', 'FR', 'RU', 'ZH', 'JA'] as const

const SIZE_UNITS = ['Rai', 'Ngan', 'Sq.Wah', 'Sq.m', 'Sq.ft'] as const
const CURRENCIES = ['THB', 'USD', 'EUR'] as const
const PRICE_TYPES = ['Total price', 'Per Rai', 'Per Sq.m', 'Per month'] as const

const TYPE_KEYS = [
  { value: 'Land', labelKey: 'typeLand' as const },
  { value: 'House', labelKey: 'typeHouse' as const },
  { value: 'Villa', labelKey: 'typeVilla' as const },
  { value: 'Condo', labelKey: 'typeCondo' as const },
  { value: 'Apartment', labelKey: 'typeApartment' as const },
  { value: 'Commercial', labelKey: 'typeCommercial' as const },
  { value: 'Boat', labelKey: 'typeBoat' as const },
  { value: 'Vehicle', labelKey: 'typeVehicle' as const },
  { value: 'Business', labelKey: 'typeBusiness' as const },
  { value: 'Other', labelKey: 'typeOther' as const },
]

const TRANSACTION_KEYS = [
  { value: 'For Sale', labelKey: 'transactionSale' as const },
  { value: 'For Rent', labelKey: 'transactionRent' as const },
  { value: 'Both', labelKey: 'transactionBoth' as const },
]

const TITLE_KEYS = [
  { value: 'Chanote', labelKey: 'titleChanote' as const },
  { value: 'Nor Sor 3 Kor', labelKey: 'titleNorSor3Kor' as const },
  { value: 'Nor Sor 3', labelKey: 'titleNorSor3' as const },
  { value: 'Nor Sor Kru Ta Daeng', labelKey: 'titleNorSorKruTaDaeng' as const },
  { value: 'Sor Por Kor', labelKey: 'titleSorPorKor' as const },
  { value: 'Unknown/Other', labelKey: 'titleUnknownOther' as const },
]

const FORM_STEPS = [
  { id: 1, labelKey: 'stepDetails' as const },
  { id: 2, labelKey: 'stepPhotos' as const },
  { id: 3, labelKey: 'stepContact' as const },
  { id: 4, labelKey: 'stepSubmit' as const },
]

const REFERRAL_OPTIONS = [
  { value: '', labelKey: 'referralPlaceholder' as const },
  { value: 'Facebook', labelKey: 'referralFacebook' as const },
  { value: 'Google', labelKey: 'referralGoogle' as const },
  { value: 'Friend', labelKey: 'referralFriend' as const },
  { value: 'Hua Hin Land', labelKey: 'referralHuaHinLand' as const },
  { value: 'Other', labelKey: 'referralOther' as const },
]

function detectPreferredLanguage(locale: string): (typeof LANG_OPTIONS)[number] {
  const fromApp = locale.toUpperCase()
  if ((LANG_OPTIONS as readonly string[]).includes(fromApp)) {
    return fromApp as (typeof LANG_OPTIONS)[number]
  }
  if (typeof navigator !== 'undefined') {
    const browser = (navigator.language || '').slice(0, 2).toUpperCase()
    if ((LANG_OPTIONS as readonly string[]).includes(browser)) {
      return browser as (typeof LANG_OPTIONS)[number]
    }
  }
  return 'EN'
}

const CATEGORY_OPTIONS: {
  value: ListingCategory
  emoji: string
  labelKey:
    | 'catLandProperty'
    | 'catVehicle'
    | 'catBoat'
    | 'catBusiness'
    | 'catOther'
}[] = [
  { value: 'Land & Property', emoji: '🏔️', labelKey: 'catLandProperty' },
  { value: 'Vehicle', emoji: '🚗', labelKey: 'catVehicle' },
  { value: 'Boat', emoji: '🚤', labelKey: 'catBoat' },
  { value: 'Business', emoji: '🏪', labelKey: 'catBusiness' },
  { value: 'Other', emoji: '📦', labelKey: 'catOther' },
]

const VEHICLE_TYPES = [
  { value: 'Car', labelKey: 'vehicleTypeCar' as const },
  { value: 'Motorcycle', labelKey: 'vehicleTypeMotorcycle' as const },
  { value: 'Truck', labelKey: 'vehicleTypeTruck' as const },
  { value: 'Van', labelKey: 'vehicleTypeVan' as const },
  { value: 'Other', labelKey: 'vehicleTypeOther' as const },
]

const BOAT_TYPES = [
  { value: 'Speedboat', labelKey: 'boatTypeSpeedboat' as const },
  { value: 'Longtail', labelKey: 'boatTypeLongtail' as const },
  { value: 'Yacht', labelKey: 'boatTypeYacht' as const },
  { value: 'Fishing', labelKey: 'boatTypeFishing' as const },
  { value: 'Other', labelKey: 'boatTypeOther' as const },
]

const CONDITIONS = [
  { value: 'New', labelKey: 'conditionNew' as const },
  { value: 'Like new', labelKey: 'conditionLikeNew' as const },
  { value: 'Good', labelKey: 'conditionGood' as const },
  { value: 'Fair', labelKey: 'conditionFair' as const },
]

const inputClass =
  'w-full rounded-[12px] border border-[#E8E2D6] bg-white px-4 py-3 text-sm text-[#1A2744] placeholder:text-[#5C5247]/60 focus:outline-none focus:ring-2 focus:ring-amber-600/40 focus:border-amber-600'
const labelClass = 'block text-sm font-medium text-[#1A2744] mb-2'

export default function ListPropertyPage() {
  const t = useTranslations('listProperty')
  const locale = useLocale()
  const [status, setStatus] = useState<FormStatus>('idle')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<ListingCategory>('Land & Property')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileResetKey, setTurnstileResetKey] = useState(0)
  const [securityError, setSecurityError] = useState(false)
  const [photoError, setPhotoError] = useState(false)
  const [apiError, setApiError] = useState('')
  const [language, setLanguage] = useState<(typeof LANG_OPTIONS)[number]>('EN')
  const [propertyType, setPropertyType] = useState('Land')
  const [sizeUnit, setSizeUnit] = useState('Rai')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState<(typeof CURRENCIES)[number]>('THB')
  const [priceType, setPriceType] = useState<(typeof PRICE_TYPES)[number]>('Total price')
  const [location, setLocation] = useState('')
  const [contactPhone, setContactPhone] = useState(true)
  const [contactEmail, setContactEmail] = useState(true)
  const [contactLine, setContactLine] = useState(false)
  const [contactWhatsapp, setContactWhatsapp] = useState(false)
  const [lineId, setLineId] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [sizeValue, setSizeValue] = useState('')
  const [titleDeed, setTitleDeed] = useState('Unknown/Other')
  const [transaction, setTransaction] = useState('For Sale')
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState(false)
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  const [referralSource, setReferralSource] = useState('')
  const [duplicateWarning, setDuplicateWarning] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [region, setRegion] = useState('')
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [photosUploading, setPhotosUploading] = useState(false)

  const listingSlug = useMemo(
    () => slugifyListing(location, propertyType),
    [location, propertyType]
  )
  const descriptionRemaining = 500 - description.length
  const composedSizePreview = composeSizeValue(sizeValue, sizeUnit) || sizeValue
  const composedPricePreview = composePriceValue(price, currency, priceType)

  const previewListing = useMemo<PublicListing>(() => {
    return {
      id: 'preview',
      created_at: new Date().toISOString(),
      status: 'pending',
      name: name || 'Seller',
      email: email || null,
      phone: phone || null,
      property_type: propertyType,
      transaction_type: transaction,
      location: location || t('location'),
      size: composedSizePreview || null,
      price: composedPricePreview,
      title_deed: titleDeed,
      description: description || null,
      region: region || 'Thailand',
      approved_at: null,
      category: category,
      vehicle_type: null,
      vehicle_brand: null,
      vehicle_year: null,
      vehicle_mileage: null,
      condition: null,
      photo_1: photoUrls[0] || null,
      photo_2: photoUrls[1] || null,
      photo_3: photoUrls[2] || null,
      photo_4: photoUrls[3] || null,
      photo_5: photoUrls[4] || null,
    }
  }, [
    name,
    email,
    phone,
    propertyType,
    transaction,
    location,
    composedSizePreview,
    composedPricePreview,
    titleDeed,
    description,
    region,
    category,
    photoUrls,
    t,
  ])

  useEffect(() => {
    setLanguage(detectPreferredLanguage(locale))
  }, [locale])

  useEffect(() => {
    setSizeUnit(defaultSizeUnit(propertyType))
  }, [propertyType])

  // Restore draft once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LIST_PROPERTY_DRAFT_KEY)
      if (!raw) return
      const draft = JSON.parse(raw) as Record<string, unknown>
      if (typeof draft.name === 'string') setName(draft.name)
      if (typeof draft.email === 'string') setEmail(draft.email)
      if (typeof draft.phone === 'string') setPhone(draft.phone)
      if (typeof draft.location === 'string') setLocation(draft.location)
      if (typeof draft.description === 'string') setDescription(draft.description)
      if (typeof draft.propertyType === 'string') setPropertyType(draft.propertyType)
      if (typeof draft.sizeValue === 'string') setSizeValue(draft.sizeValue)
      if (typeof draft.sizeUnit === 'string') setSizeUnit(draft.sizeUnit)
      if (typeof draft.price === 'string') setPrice(draft.price)
      if (typeof draft.currency === 'string')
        setCurrency(draft.currency as (typeof CURRENCIES)[number])
      if (typeof draft.priceType === 'string')
        setPriceType(draft.priceType as (typeof PRICE_TYPES)[number])
      if (typeof draft.titleDeed === 'string') setTitleDeed(draft.titleDeed)
      if (typeof draft.transaction === 'string') setTransaction(draft.transaction)
      if (typeof draft.region === 'string') setRegion(draft.region)
      if (typeof draft.lineId === 'string') setLineId(draft.lineId)
      if (typeof draft.whatsapp === 'string') setWhatsapp(draft.whatsapp)
      if (typeof draft.referralSource === 'string') setReferralSource(draft.referralSource)
      if (typeof draft.lat === 'number') setLat(draft.lat)
      if (typeof draft.lng === 'number') setLng(draft.lng)
      if (Array.isArray(draft.photoUrls)) {
        setPhotoUrls(
          (draft.photoUrls as unknown[])
            .map((u) => String(u || '').trim())
            .filter(Boolean)
            .slice(0, 5)
        )
      }
      if (typeof draft.category === 'string') setCategory(draft.category as ListingCategory)
    } catch {
      // ignore corrupt draft
    }
  }, [])

  // Duplicate warning
  useEffect(() => {
    if (location.trim().length < 3) {
      setDuplicateWarning(false)
      return
    }
    const timer = setTimeout(() => {
      const params = new URLSearchParams({
        location: location.trim(),
        size: sizeValue.trim(),
      })
      fetch(`/api/check-similar-listing?${params.toString()}`)
        .then((r) => r.json())
        .then((json) => setDuplicateWarning(Boolean(json?.similar)))
        .catch(() => setDuplicateWarning(false))
    }, 600)
    return () => clearTimeout(timer)
  }, [location, sizeValue])

  const onToken = useCallback((token: string) => {
    setTurnstileToken(token)
    if (token) setSecurityError(false)
  }, [])

  const onTurnstileError = useCallback(() => {
    setSecurityError(true)
  }, [])

  function refreshTurnstile() {
    setTurnstileToken('')
    setTurnstileResetKey((k) => k + 1)
  }

  function saveDraft() {
    const draft = {
      name,
      email,
      phone,
      location,
      description,
      propertyType,
      sizeValue,
      sizeUnit,
      price,
      currency,
      priceType,
      titleDeed,
      transaction,
      region,
      lineId,
      whatsapp,
      referralSource,
      lat,
      lng,
      photoUrls,
      category,
      contactPhone,
      contactEmail,
      contactLine,
      contactWhatsapp,
      language,
    }
    localStorage.setItem(LIST_PROPERTY_DRAFT_KEY, JSON.stringify(draft))
    setDraftSaved(true)
    setTimeout(() => setDraftSaved(false), 2500)
  }

  function generateDescription() {
    const text = buildTemplateDescription({
      propertyType,
      location,
      size: composedSizePreview || sizeValue,
      titleDeed,
      price: composedPricePreview || price || 'on request',
      transaction,
    })
    setDescription(text)
  }

  function resetFormExtras() {
    setDescription('')
    setCategory('Land & Property')
    setLanguage(detectPreferredLanguage(locale))
    setPropertyType('Land')
    setSizeUnit('Rai')
    setPrice('')
    setCurrency('THB')
    setPriceType('Total price')
    setLocation('')
    setContactPhone(true)
    setContactEmail(true)
    setContactLine(false)
    setContactWhatsapp(false)
    setLineId('')
    setWhatsapp('')
    setSizeValue('')
    setTitleDeed('Unknown/Other')
    setTransaction('For Sale')
    setPhone('')
    setPhoneError(false)
    setLat(null)
    setLng(null)
    setReferralSource('')
    setDuplicateWarning(false)
    setName('')
    setEmail('')
    setRegion('')
    setPhotoUrls([])
    setPhotosUploading(false)
    setTurnstileToken('')
    setPhotoError(false)
    setApiError('')
    setTurnstileResetKey((k) => k + 1)
    localStorage.removeItem(LIST_PROPERTY_DRAFT_KEY)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!turnstileToken) {
      setSecurityError(true)
      setApiError('')
      return
    }

    const phoneValue = phone.trim() || String(new FormData(e.currentTarget).get('phone') || '').trim()
    if (!isValidThaiPhone(phoneValue)) {
      setPhoneError(true)
      setStatus('error')
      setApiError('')
      return
    }

    if (photosUploading) {
      setPhotoError(true)
      setStatus('error')
      setApiError('')
      return
    }

    setStatus('loading')
    setSecurityError(false)
    setPhotoError(false)
    setPhoneError(false)
    setApiError('')

    const form = e.currentTarget
    const data = new FormData(form)

    const finalPhotos = photoUrls.map((u) => u.trim()).filter(Boolean).slice(0, 5)

    const sizeRaw = sizeValue || String(data.get('size') || '').trim()
    const sizeUnitValue = String(data.get('sizeUnit') || sizeUnit)
    const composedSize = composeSizeValue(sizeRaw, sizeUnitValue)
    const composedPrice = composePriceValue(price, currency, priceType)

    const contactPrefs = [
      contactPhone ? 'phone' : null,
      contactEmail ? 'email' : null,
      contactLine ? 'LINE' : null,
      contactWhatsapp ? 'WhatsApp' : null,
    ].filter(Boolean) as string[]

    const payload = {
      category,
      name: name || String(data.get('name') || '').trim(),
      email: email || String(data.get('email') || '').trim(),
      phone: phoneValue,
      language: String(data.get('language') || language),
      type: String(data.get('type') || propertyType),
      transaction: transaction || 'For Sale',
      region: region || String(data.get('region') || ''),
      location: (location.trim() || String(data.get('location') || '').trim()),
      size: composedSize || sizeRaw,
      sizeUnit: sizeUnitValue,
      price: composedPrice,
      currency,
      priceType,
      titleDeed,
      description: description.trim().slice(0, 500),
      vehicleType: String(data.get('vehicleType') || '').trim(),
      vehicleBrand: String(data.get('vehicleBrand') || '').trim(),
      vehicleYear: String(data.get('vehicleYear') || '').trim(),
      vehicleMileage: String(data.get('vehicleMileage') || '').trim(),
      condition: String(data.get('condition') || '').trim(),
      boatType: String(data.get('boatType') || '').trim(),
      boatLength: String(data.get('boatLength') || '').trim(),
      engineType: String(data.get('engineType') || '').trim(),
      businessType: String(data.get('businessType') || '').trim(),
      annualRevenue: String(data.get('annualRevenue') || '').trim(),
      reasonForSelling: String(data.get('reasonForSelling') || '').trim(),
      itemName: String(data.get('itemName') || '').trim(),
      otherCategory: String(data.get('otherCategory') || '').trim(),
      photos: finalPhotos,
      consent: data.get('consent') === 'on',
      turnstileToken,
      slug: listingSlug,
      contactPreferences: contactPrefs,
      lineId: contactLine ? lineId.trim() : '',
      whatsapp: contactWhatsapp ? whatsapp.trim() || phoneValue : '',
      lat,
      lng,
      referralSource,
    }

    const apiUrl = '/api/list-property'

    try {
      if (process.env.NODE_ENV === 'development') {
        console.info('[list-property] submitting', {
          apiUrl,
          locale,
          category: payload.category,
          hasTurnstile: Boolean(payload.turnstileToken),
          photoCount: finalPhotos.length,
        })
      }

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      let json: { success?: boolean; error?: string; code?: string; detail?: string } = {}
      try {
        json = await res.json()
      } catch {
        json = { error: `Request failed (${res.status})` }
      }

      if (process.env.NODE_ENV === 'development') {
        console.info('[list-property] response', { status: res.status, json })
      }

      if (!res.ok || !json.success) {
        const message =
          typeof json?.error === 'string' && json.error.trim()
            ? json.detail
              ? `${json.error}: ${json.detail}`
              : json.error
            : t('errorMessage')

        if (json?.error === 'Security check failed' || json?.code === 'turnstile_failed') {
          setSecurityError(true)
        }
        if (json?.error === 'Invalid Thai phone number' || json?.code === 'invalid_phone') {
          setPhoneError(true)
        }
        setApiError(message)
        setStatus('error')
        // Tokens are single-use — always mint a fresh challenge after any failed submit
        refreshTurnstile()
        return
      }
      setStatus('success')
      form.reset()
      resetFormExtras()
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[list-property] network error', err)
      }
      setApiError(t('errorMessage'))
      setStatus('error')
      refreshTurnstile()
    }
  }

  return (
    <main className="min-h-screen text-[#142038]">
      <BreadcrumbNav />

      <InfoHero
        eyebrow={t('heroEyebrow')}
        title={t('pageTitle')}
        subtitle={t('pageSubtitle')}
        image={HERO_PHOTOS.listProperty}
        size="main"
      />

      <section className="py-12 md:py-20 px-6">
        <div className="max-w-3xl mx-auto">
          {status === 'success' ? (
            <div className="bg-white/80 border border-white/70 rounded-[14px] p-8 md:p-10 text-center shadow-[0_12px_32px_rgba(20,32,56,0.06)] backdrop-blur-md">
              <h2 className="tp-section-title mb-3">
                {t('successTitle')}
              </h2>
              <p className="text-[#5C5247] text-sm md:text-base">{t('successMessage')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="bg-white border border-[#E8E2D6] rounded-[12px] px-4 py-4 md:px-6">
                <ol className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 text-sm">
                  {FORM_STEPS.map((step, index) => (
                    <li key={step.id} className="inline-flex items-center gap-2 text-[#1A2744]">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1A2744] text-white text-xs font-semibold">
                        {step.id}
                      </span>
                      <span className="font-medium">{t(step.labelKey)}</span>
                      {index < FORM_STEPS.length - 1 ? (
                        <span className="hidden sm:inline text-[#C8973A] mx-1">→</span>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-white/75 border border-white/70 rounded-[14px] p-6 md:p-8 space-y-5 shadow-[0_10px_28px_rgba(20,32,56,0.05)] backdrop-blur-sm">
                <h2 className="tp-section-title">
                  {t('sectionCategory')}
                </h2>
                <fieldset>
                  <legend className={labelClass}>{t('category')} *</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CATEGORY_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-3 rounded-[12px] border px-4 py-3 text-sm cursor-pointer transition-colors ${
                          category === opt.value
                            ? 'border-amber-600 bg-amber-50 text-[#1A2744]'
                            : 'border-[#E8E2D6] bg-white text-[#1A2744] hover:border-amber-600/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={opt.value}
                          checked={category === opt.value}
                          onChange={() => setCategory(opt.value)}
                          className="accent-amber-600"
                          required
                        />
                        <span>
                          {opt.emoji} {t(opt.labelKey)}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              <div className="bg-white/75 border border-white/70 rounded-[14px] p-6 md:p-8 space-y-5 shadow-[0_10px_28px_rgba(20,32,56,0.05)] backdrop-blur-sm">
                <h2 className="tp-section-title">
                  {t('sectionContact')}
                </h2>

                <div>
                  <label htmlFor="name" className={labelClass}>
                    {t('name')} *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>
                    {t('email')} *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className={labelClass}>
                    {t('phone')} *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value)
                      setPhoneError(false)
                    }}
                    className={inputClass}
                    placeholder="08X-XXX-XXXX"
                  />
                  {phoneError ? (
                    <p className="mt-1.5 text-sm text-red-700">{t('phoneInvalid')}</p>
                  ) : (
                    <p className="mt-1.5 text-xs text-[#5C5247]">{t('phoneHint')}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="language" className={labelClass}>
                    {t('language')}
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={language}
                    onChange={(e) =>
                      setLanguage(e.target.value as (typeof LANG_OPTIONS)[number])
                    }
                    className={inputClass}
                  >
                    {LANG_OPTIONS.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <fieldset className="space-y-3">
                  <legend className={labelClass}>{t('contactPreferences')}</legend>
                  <label className="flex items-center gap-2 text-sm text-[#1A2744] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={contactPhone}
                      onChange={(e) => setContactPhone(e.target.checked)}
                      className="accent-amber-600"
                    />
                    {t('contactViaPhone')}
                  </label>
                  <label className="flex items-center gap-2 text-sm text-[#1A2744] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={contactEmail}
                      onChange={(e) => setContactEmail(e.target.checked)}
                      className="accent-amber-600"
                    />
                    {t('contactViaEmail')}
                  </label>
                  <label className="flex items-center gap-2 text-sm text-[#1A2744] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={contactLine}
                      onChange={(e) => setContactLine(e.target.checked)}
                      className="accent-amber-600"
                    />
                    {t('contactViaLine')}
                  </label>
                  {contactLine ? (
                    <div className="pl-6">
                      <label htmlFor="lineId" className={labelClass}>
                        {t('lineId')}
                      </label>
                      <input
                        id="lineId"
                        name="lineId"
                        type="text"
                        value={lineId}
                        onChange={(e) => setLineId(e.target.value)}
                        className={inputClass}
                        placeholder={t('lineIdPlaceholder')}
                      />
                    </div>
                  ) : null}
                  <label className="flex items-center gap-2 text-sm text-[#1A2744] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={contactWhatsapp}
                      onChange={(e) => setContactWhatsapp(e.target.checked)}
                      className="accent-amber-600"
                    />
                    {t('contactViaWhatsapp')}
                  </label>
                  {contactWhatsapp ? (
                    <div className="pl-6">
                      <label htmlFor="whatsapp" className={labelClass}>
                        {t('whatsappNumber')}
                      </label>
                      <input
                        id="whatsapp"
                        name="whatsapp"
                        type="text"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className={inputClass}
                        placeholder={phone || '08X-XXX-XXXX'}
                      />
                    </div>
                  ) : null}
                </fieldset>
              </div>

              {category === 'Land & Property' && (
                <div className="bg-white/75 border border-white/70 rounded-[14px] p-6 md:p-8 space-y-5 shadow-[0_10px_28px_rgba(20,32,56,0.05)] backdrop-blur-sm">
                <h2 className="tp-section-title">
                  {t('sectionProperty')}
                </h2>

                  <div>
                    <label htmlFor="type" className={labelClass}>
                      {t('type')}
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className={inputClass}
                    >
                      {TYPE_KEYS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {t(opt.labelKey)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="transaction" className={labelClass}>
                      {t('transaction')}
                    </label>
                    <select
                      id="transaction"
                      name="transaction"
                      value={transaction}
                      onChange={(e) => setTransaction(e.target.value)}
                      className={inputClass}
                    >
                      {TRANSACTION_KEYS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {t(opt.labelKey)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <ProvinceSelect
                    value={region}
                    onChange={setRegion}
                    label={t('region')}
                    placeholder={t('regionPlaceholder')}
                  />

                  <div>
                    <label htmlFor="location" className={labelClass}>
                      {t('location')} *
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={inputClass}
                    />
                    {location.trim() ? (
                      <p className="mt-1.5 text-xs text-[#5C5247]">
                        {t('slugPreview')}: <code className="text-[#1A2744]">{listingSlug}</code>
                      </p>
                    ) : null}
                    {duplicateWarning ? (
                      <p className="mt-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        {t('duplicateWarning')}
                      </p>
                    ) : null}
                  </div>

                  <LocationMapPicker
                    lat={lat}
                    lng={lng}
                    onChange={(nextLat, nextLng) => {
                      setLat(nextLat)
                      setLng(nextLng)
                    }}
                    label={t('mapLabel')}
                    hint={t('mapHint')}
                  />

                  <div>
                    <label htmlFor="size" className={labelClass}>
                      {t('size')}
                    </label>
                    <div className="grid grid-cols-[1fr_140px] gap-2">
                      <input
                        id="size"
                        name="size"
                        type="text"
                        value={sizeValue}
                        onChange={(e) => setSizeValue(e.target.value)}
                        className={inputClass}
                      />
                      <select
                        id="sizeUnit"
                        name="sizeUnit"
                        value={sizeUnit}
                        onChange={(e) => setSizeUnit(e.target.value)}
                        className={inputClass}
                      >
                        {SIZE_UNITS.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="price" className={labelClass}>
                      {t('price')}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr_150px] gap-2">
                      <select
                        id="currency"
                        name="currency"
                        value={currency}
                        onChange={(e) =>
                          setCurrency(e.target.value as (typeof CURRENCIES)[number])
                        }
                        className={inputClass}
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <input
                        id="price"
                        name="price"
                        type="text"
                        inputMode="numeric"
                        value={price}
                        onChange={(e) => setPrice(formatPriceInput(e.target.value))}
                        className={inputClass}
                        placeholder="2,300,000"
                      />
                      <select
                        id="priceType"
                        name="priceType"
                        value={priceType}
                        onChange={(e) =>
                          setPriceType(e.target.value as (typeof PRICE_TYPES)[number])
                        }
                        className={inputClass}
                      >
                        {PRICE_TYPES.map((pt) => (
                          <option key={pt} value={pt}>
                            {t(
                              pt === 'Total price'
                                ? 'priceTypeTotal'
                                : pt === 'Per Rai'
                                  ? 'priceTypePerRai'
                                  : pt === 'Per Sq.m'
                                    ? 'priceTypePerSqm'
                                    : 'priceTypePerMonth'
                            )}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="titleDeed" className={labelClass}>
                      {t('titleDeed')}
                    </label>
                    <select
                      id="titleDeed"
                      name="titleDeed"
                      value={titleDeed}
                      onChange={(e) => setTitleDeed(e.target.value)}
                      className={inputClass}
                    >
                      {TITLE_KEYS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {t(opt.labelKey)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <label htmlFor="description" className={labelClass + ' mb-0'}>
                        {t('description')}
                      </label>
                      <button
                        type="button"
                        onClick={generateDescription}
                        className="text-sm font-medium text-[#C8973A] hover:underline"
                      >
                        {t('generateDescription')}
                      </button>
                    </div>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      maxLength={500}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={`${inputClass} resize-y min-h-[120px]`}
                    />
                    <p className="mt-1.5 text-xs text-[#5C5247] text-right">
                      {t('charsRemaining', { count: descriptionRemaining })}
                    </p>
                  </div>

                  <div className="space-y-3 border-t border-[#E8E2D6] pt-5">
                    <PhotoUploader
                      value={photoUrls}
                      onChange={setPhotoUrls}
                      onUploadingChange={setPhotosUploading}
                      label={t('photos')}
                      dropzoneText={t('photosDropzone')}
                      hint={t('photosUploadHint')}
                      removeLabel={t('photosRemove')}
                      errorTooLarge={t('photosTooLarge')}
                      errorType={t('photosTypeInvalid')}
                      errorUpload={t('photosUploadFailed')}
                      errorMax={t('photosMax')}
                    />
                    {photoError ? (
                      <p className="text-sm text-red-700">
                        {photosUploading ? t('photosStillUploading') : t('photosInvalid')}
                      </p>
                    ) : null}
                  </div>
                </div>
              )}

              {category === 'Vehicle' && (
                <div className="bg-white/75 border border-white/70 rounded-[14px] p-6 md:p-8 space-y-5 shadow-[0_10px_28px_rgba(20,32,56,0.05)] backdrop-blur-sm">
                <h2 className="tp-section-title">
                  {t('sectionVehicle')}
                </h2>

                  <div>
                    <label htmlFor="vehicleType" className={labelClass}>
                      {t('vehicleType')} *
                    </label>
                    <select id="vehicleType" name="vehicleType" required className={inputClass}>
                      {VEHICLE_TYPES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {t(opt.labelKey)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="vehicleBrand" className={labelClass}>
                      {t('vehicleBrand')} *
                    </label>
                    <input id="vehicleBrand" name="vehicleBrand" type="text" required className={inputClass} />
                  </div>

                  <div>
                    <label htmlFor="vehicleYear" className={labelClass}>
                      {t('vehicleYear')}
                    </label>
                    <input id="vehicleYear" name="vehicleYear" type="number" min={1950} max={2035} className={inputClass} />
                  </div>

                  <div>
                    <label htmlFor="vehicleMileage" className={labelClass}>
                      {t('vehicleMileage')}
                    </label>
                    <input id="vehicleMileage" name="vehicleMileage" type="text" className={inputClass} />
                  </div>

                  <div>
                    <label htmlFor="condition" className={labelClass}>
                      {t('condition')}
                    </label>
                    <select id="condition" name="condition" defaultValue="Good" className={inputClass}>
                      {CONDITIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {t(opt.labelKey)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="price" className={labelClass}>
                      {t('priceRequired')} *
                    </label>
                    <input id="price" name="price" type="text" required className={inputClass} />
                  </div>

                  <ProvinceSelect
                    value={region}
                    onChange={setRegion}
                    label={t('region')}
                    placeholder={t('regionPlaceholder')}
                  />

                  <div>
                    <label htmlFor="location" className={labelClass}>
                      {t('locationThailand')} *
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className={labelClass}>
                      {t('description')}
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      maxLength={500}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={`${inputClass} resize-y min-h-[120px]`}
                    />
                    <p className="mt-1.5 text-xs text-[#5C5247] text-right">
                      {t('charsRemaining', { count: descriptionRemaining })}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <PhotoUploader
                      value={photoUrls}
                      onChange={setPhotoUrls}
                      onUploadingChange={setPhotosUploading}
                      label={t('photos')}
                      dropzoneText={t('photosDropzone')}
                      hint={t('photosUploadHint')}
                      removeLabel={t('photosRemove')}
                      errorTooLarge={t('photosTooLarge')}
                      errorType={t('photosTypeInvalid')}
                      errorUpload={t('photosUploadFailed')}
                      errorMax={t('photosMax')}
                    />
                    {photoError ? (
                      <p className="text-sm text-red-700">
                        {photosUploading ? t('photosStillUploading') : t('photosInvalid')}
                      </p>
                    ) : null}
                  </div>
                </div>
              )}

              {category === 'Boat' && (
                <div className="bg-white/75 border border-white/70 rounded-[14px] p-6 md:p-8 space-y-5 shadow-[0_10px_28px_rgba(20,32,56,0.05)] backdrop-blur-sm">
                <h2 className="tp-section-title">
                  {t('sectionBoat')}
                </h2>

                  <div>
                    <label htmlFor="boatType" className={labelClass}>
                      {t('boatType')} *
                    </label>
                    <select id="boatType" name="boatType" required className={inputClass}>
                      {BOAT_TYPES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {t(opt.labelKey)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="boatLength" className={labelClass}>
                      {t('boatLength')}
                    </label>
                    <input id="boatLength" name="boatLength" type="text" className={inputClass} />
                  </div>

                  <div>
                    <label htmlFor="engineType" className={labelClass}>
                      {t('engineType')}
                    </label>
                    <input id="engineType" name="engineType" type="text" className={inputClass} />
                  </div>

                  <div>
                    <label htmlFor="vehicleYear" className={labelClass}>
                      {t('vehicleYear')}
                    </label>
                    <input id="vehicleYear" name="vehicleYear" type="number" min={1950} max={2035} className={inputClass} />
                  </div>

                  <div>
                    <label htmlFor="condition" className={labelClass}>
                      {t('condition')}
                    </label>
                    <select id="condition" name="condition" defaultValue="Good" className={inputClass}>
                      {CONDITIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {t(opt.labelKey)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="price" className={labelClass}>
                      {t('priceRequired')} *
                    </label>
                    <input id="price" name="price" type="text" required className={inputClass} />
                  </div>

                  <ProvinceSelect
                    value={region}
                    onChange={setRegion}
                    label={t('region')}
                    placeholder={t('regionPlaceholder')}
                  />

                  <div>
                    <label htmlFor="location" className={labelClass}>
                      {t('locationMooring')} *
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className={labelClass}>
                      {t('description')}
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      maxLength={500}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={`${inputClass} resize-y min-h-[120px]`}
                    />
                    <p className="mt-1.5 text-xs text-[#5C5247] text-right">
                      {t('charsRemaining', { count: descriptionRemaining })}
                    </p>
                  </div>

                  <PhotoUploader
                    value={photoUrls}
                    onChange={setPhotoUrls}
                    onUploadingChange={setPhotosUploading}
                    label={t('photos')}
                    dropzoneText={t('photosDropzone')}
                    hint={t('photosUploadHint')}
                    removeLabel={t('photosRemove')}
                    errorTooLarge={t('photosTooLarge')}
                    errorType={t('photosTypeInvalid')}
                    errorUpload={t('photosUploadFailed')}
                    errorMax={t('photosMax')}
                  />
                </div>
              )}

              {category === 'Business' && (
                <div className="bg-white/75 border border-white/70 rounded-[14px] p-6 md:p-8 space-y-5 shadow-[0_10px_28px_rgba(20,32,56,0.05)] backdrop-blur-sm">
                <h2 className="tp-section-title">
                  {t('sectionBusiness')}
                </h2>

                  <div>
                    <label htmlFor="businessType" className={labelClass}>
                      {t('businessType')} *
                    </label>
                    <input id="businessType" name="businessType" type="text" required className={inputClass} />
                  </div>

                  <div>
                    <label htmlFor="annualRevenue" className={labelClass}>
                      {t('annualRevenue')}
                    </label>
                    <input id="annualRevenue" name="annualRevenue" type="text" className={inputClass} />
                  </div>

                  <div>
                    <label htmlFor="price" className={labelClass}>
                      {t('askingPrice')} *
                    </label>
                    <input id="price" name="price" type="text" required className={inputClass} />
                  </div>

                  <ProvinceSelect
                    value={region}
                    onChange={setRegion}
                    label={t('region')}
                    placeholder={t('regionPlaceholder')}
                  />

                  <div>
                    <label htmlFor="location" className={labelClass}>
                      {t('location')} *
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="reasonForSelling" className={labelClass}>
                      {t('reasonForSelling')}
                    </label>
                    <input id="reasonForSelling" name="reasonForSelling" type="text" className={inputClass} />
                  </div>

                  <div>
                    <label htmlFor="description" className={labelClass}>
                      {t('description')}
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      maxLength={500}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={`${inputClass} resize-y min-h-[120px]`}
                    />
                    <p className="mt-1.5 text-xs text-[#5C5247] text-right">
                      {t('charsRemaining', { count: descriptionRemaining })}
                    </p>
                  </div>

                  <PhotoUploader
                    value={photoUrls}
                    onChange={setPhotoUrls}
                    onUploadingChange={setPhotosUploading}
                    label={t('photos')}
                    dropzoneText={t('photosDropzone')}
                    hint={t('photosUploadHint')}
                    removeLabel={t('photosRemove')}
                    errorTooLarge={t('photosTooLarge')}
                    errorType={t('photosTypeInvalid')}
                    errorUpload={t('photosUploadFailed')}
                    errorMax={t('photosMax')}
                  />
                </div>
              )}

              {category === 'Other' && (
                <div className="bg-white/75 border border-white/70 rounded-[14px] p-6 md:p-8 space-y-5 shadow-[0_10px_28px_rgba(20,32,56,0.05)] backdrop-blur-sm">
                <h2 className="tp-section-title">
                  {t('sectionOther')}
                </h2>

                  <div>
                    <label htmlFor="itemName" className={labelClass}>
                      {t('itemName')} *
                    </label>
                    <input id="itemName" name="itemName" type="text" required className={inputClass} />
                  </div>

                  <div>
                    <label htmlFor="otherCategory" className={labelClass}>
                      {t('otherCategory')}
                    </label>
                    <input id="otherCategory" name="otherCategory" type="text" className={inputClass} />
                  </div>

                  <div>
                    <label htmlFor="price" className={labelClass}>
                      {t('priceRequired')} *
                    </label>
                    <input id="price" name="price" type="text" required className={inputClass} />
                  </div>

                  <ProvinceSelect
                    value={region}
                    onChange={setRegion}
                    label={t('region')}
                    placeholder={t('regionPlaceholder')}
                  />

                  <div>
                    <label htmlFor="location" className={labelClass}>
                      {t('location')} *
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className={labelClass}>
                      {t('description')}
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      maxLength={500}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={`${inputClass} resize-y min-h-[120px]`}
                    />
                    <p className="mt-1.5 text-xs text-[#5C5247] text-right">
                      {t('charsRemaining', { count: descriptionRemaining })}
                    </p>
                  </div>

                  <PhotoUploader
                    value={photoUrls}
                    onChange={setPhotoUrls}
                    onUploadingChange={setPhotosUploading}
                    label={t('photos')}
                    dropzoneText={t('photosDropzone')}
                    hint={t('photosUploadHint')}
                    removeLabel={t('photosRemove')}
                    errorTooLarge={t('photosTooLarge')}
                    errorType={t('photosTypeInvalid')}
                    errorUpload={t('photosUploadFailed')}
                    errorMax={t('photosMax')}
                  />
                </div>
              )}

              <div className="bg-white/75 border border-white/70 rounded-[14px] p-6 md:p-8 space-y-5 shadow-[0_10px_28px_rgba(20,32,56,0.05)] backdrop-blur-sm">
                <h2 className="tp-section-title">
                  {t('previewTitle')}
                </h2>
                <p className="text-sm text-[#5C5247]">{t('previewSubtitle')}</p>
                <div className="max-w-md">
                  <ListingCard listing={previewListing} />
                </div>
              </div>

              <div className="bg-white border border-[#E8E2D6] rounded-[12px] p-6 md:p-8 space-y-5">
                <div>
                  <label htmlFor="referralSource" className={labelClass}>
                    {t('referralLabel')}
                  </label>
                  <select
                    id="referralSource"
                    name="referralSource"
                    value={referralSource}
                    onChange={(e) => setReferralSource(e.target.value)}
                    className={inputClass}
                  >
                    {REFERRAL_OPTIONS.map((opt) => (
                      <option key={opt.value || 'empty'} value={opt.value}>
                        {t(opt.labelKey)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-[12px] border border-[#E8E2D6] bg-[#FAF7F0] p-4 space-y-2">
                  <p className="text-sm font-semibold text-[#1A2744]">{t('termsTitle')}</p>
                  <ul className="space-y-1.5 text-sm text-[#5C5247]">
                    <li>✓ {t('termsReview')}</li>
                    <li>✓ {t('termsEmail')}</li>
                    <li>✓ {t('termsLive')}</li>
                  </ul>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    className="mt-1 accent-amber-600 w-4 h-4 flex-shrink-0"
                  />
                  <span className="text-sm text-[#1A2744] leading-relaxed">{t('consent')}</span>
                </label>

                {(status === 'error' || securityError || phoneError || apiError) && (
                  <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    {securityError
                      ? 'Security check failed — please complete the check again and retry.'
                      : phoneError
                        ? t('phoneInvalid')
                        : photoError
                          ? t('photosInvalid')
                          : apiError || t('errorMessage')}
                  </p>
                )}

                <TurnstileWidget
                  key={turnstileResetKey}
                  resetKey={turnstileResetKey}
                  onToken={onToken}
                  onError={onTurnstileError}
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={saveDraft}
                    className="w-full sm:w-auto min-w-[180px] px-6 py-3 rounded-[12px] text-[15px] font-semibold border border-amber-600 text-amber-700 hover:bg-amber-50 transition-colors"
                  >
                    {draftSaved ? t('draftSaved') : t('saveDraft')}
                  </button>
                  <button
                    type="submit"
                    disabled={status === 'loading' || photosUploading}
                    className="w-full sm:w-auto min-w-[200px] px-6 py-3 rounded-[12px] text-[15px] font-semibold bg-amber-600 hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-colors duration-200"
                  >
                    {status === 'loading' ? t('submitting') : t('submit')}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <DisclaimerFooter />
      </div>
    </main>
  )
}
