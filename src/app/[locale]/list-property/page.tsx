'use client'

import { FormEvent, useCallback, useState } from 'react'
import { useTranslations } from 'next-intl'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import InfoHero from '@/components/InfoHero'
import TurnstileWidget from '@/components/TurnstileWidget'
import { LIST_REGIONS } from '@/i18n/routing'
import type { ListingCategory } from '@/lib/listing-ui'
import { HERO_PHOTOS } from '@/lib/hero-photos'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const LANG_OPTIONS = ['EN', 'NL', 'DE', 'TH', 'SV', 'DA', 'FR', 'RU', 'ZH', 'JA'] as const
const TYPE_KEYS = [
  { value: 'Land', labelKey: 'typeLand' as const },
  { value: 'House', labelKey: 'typeHouse' as const },
  { value: 'Condo', labelKey: 'typeCondo' as const },
  { value: 'Villa', labelKey: 'typeVilla' as const },
  { value: 'Commercial', labelKey: 'typeCommercial' as const },
]
const TITLE_KEYS = [
  { value: 'Chanote', labelKey: 'titleChanote' as const },
  { value: 'Nor Sor 3 Gor', labelKey: 'titleNorSor' as const },
  { value: 'Other', labelKey: 'titleOther' as const },
  { value: 'Unknown', labelKey: 'titleUnknown' as const },
]

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
  const [status, setStatus] = useState<FormStatus>('idle')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<ListingCategory>('Land & Property')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [securityError, setSecurityError] = useState(false)

  const onToken = useCallback((token: string) => {
    setTurnstileToken(token)
    if (token) setSecurityError(false)
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!turnstileToken) {
      setSecurityError(true)
      return
    }
    setStatus('loading')
    setSecurityError(false)

    const form = e.currentTarget
    const data = new FormData(form)

    const photos = [1, 2, 3, 4, 5]
      .map((n) => String(data.get(`photo${n}`) || '').trim())
      .filter(Boolean)

    const payload = {
      category,
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      language: String(data.get('language') || ''),
      type: String(data.get('type') || ''),
      transaction: String(data.get('transaction') || ''),
      region: String(data.get('region') || ''),
      location: String(data.get('location') || '').trim(),
      size: String(data.get('size') || '').trim(),
      price: String(data.get('price') || '').trim(),
      titleDeed: String(data.get('titleDeed') || ''),
      description: String(data.get('description') || '').trim().slice(0, 500),
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
      photos,
      consent: data.get('consent') === 'on',
      turnstileToken,
    }

    try {
      const res = await fetch('/api/list-property', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        if (json?.error === 'Security check failed') {
          setSecurityError(true)
        }
        setStatus('error')
        return
      }
      setStatus('success')
      form.reset()
      setDescription('')
      setCategory('Land & Property')
      setTurnstileToken('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#1A2744]">
      <BreadcrumbNav />

      <InfoHero
        eyebrow={t('heroEyebrow')}
        title={t('pageTitle')}
        subtitle={t('pageSubtitle')}
        image={HERO_PHOTOS.listProperty}
        size="main"
      />

      <section className="bg-[#FAF7F0] py-12 md:py-20 px-6">
        <div className="max-w-3xl mx-auto">
          {status === 'success' ? (
            <div className="bg-white border border-[#E8E2D6] rounded-[12px] p-8 md:p-10 text-center">
              <h2
                className="text-[#1A2744] text-2xl md:text-3xl font-bold mb-3"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {t('successTitle')}
              </h2>
              <p className="text-[#5C5247] text-sm md:text-base">{t('successMessage')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="bg-white border border-[#E8E2D6] rounded-[12px] p-6 md:p-8 space-y-5">
                <h2
                  className="text-[#1A2744] text-xl md:text-2xl font-bold"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
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

              <div className="bg-white border border-[#E8E2D6] rounded-[12px] p-6 md:p-8 space-y-5">
                <h2
                  className="text-[#1A2744] text-xl md:text-2xl font-bold"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {t('sectionContact')}
                </h2>

                <div>
                  <label htmlFor="name" className={labelClass}>
                    {t('name')} *
                  </label>
                  <input id="name" name="name" type="text" required className={inputClass} />
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>
                    {t('email')} *
                  </label>
                  <input id="email" name="email" type="email" required className={inputClass} />
                </div>

                <div>
                  <label htmlFor="phone" className={labelClass}>
                    {t('phone')} *
                  </label>
                  <input id="phone" name="phone" type="text" required className={inputClass} />
                </div>

                <div>
                  <label htmlFor="language" className={labelClass}>
                    {t('language')}
                  </label>
                  <select id="language" name="language" defaultValue="EN" className={inputClass}>
                    {LANG_OPTIONS.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {category === 'Land & Property' && (
                <div className="bg-white border border-[#E8E2D6] rounded-[12px] p-6 md:p-8 space-y-5">
                  <h2
                    className="text-[#1A2744] text-xl md:text-2xl font-bold"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {t('sectionProperty')}
                  </h2>

                  <div>
                    <label htmlFor="type" className={labelClass}>
                      {t('type')}
                    </label>
                    <select id="type" name="type" defaultValue="Land" className={inputClass}>
                      {TYPE_KEYS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {t(opt.labelKey)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <fieldset>
                    <legend className={labelClass}>{t('transaction')}</legend>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                      {[
                        { value: 'For Sale', labelKey: 'transactionSale' as const },
                        { value: 'For Rent', labelKey: 'transactionRent' as const },
                        { value: 'Both', labelKey: 'transactionBoth' as const },
                      ].map((opt) => (
                        <label
                          key={opt.value}
                          className="inline-flex items-center gap-2 text-sm text-[#1A2744] cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="transaction"
                            value={opt.value}
                            defaultChecked={opt.value === 'For Sale'}
                            className="accent-amber-600"
                            required
                          />
                          {t(opt.labelKey)}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div>
                    <label htmlFor="region" className={labelClass}>
                      {t('region')} *
                    </label>
                    <select id="region" name="region" defaultValue="Hua Hin" required className={inputClass}>
                      {LIST_REGIONS.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="location" className={labelClass}>
                      {t('location')} *
                    </label>
                    <input id="location" name="location" type="text" required className={inputClass} />
                  </div>

                  <div>
                    <label htmlFor="size" className={labelClass}>
                      {t('size')}
                    </label>
                    <input id="size" name="size" type="text" className={inputClass} />
                  </div>

                  <div>
                    <label htmlFor="price" className={labelClass}>
                      {t('price')}
                    </label>
                    <input id="price" name="price" type="text" className={inputClass} />
                  </div>

                  <div>
                    <label htmlFor="titleDeed" className={labelClass}>
                      {t('titleDeed')}
                    </label>
                    <select id="titleDeed" name="titleDeed" defaultValue="Unknown" className={inputClass}>
                      {TITLE_KEYS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {t(opt.labelKey)}
                        </option>
                      ))}
                    </select>
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
                    <p className="mt-1.5 text-xs text-[#5C5247] text-right">{description.length}/500</p>
                  </div>
                </div>
              )}

              {category === 'Vehicle' && (
                <div className="bg-white border border-[#E8E2D6] rounded-[12px] p-6 md:p-8 space-y-5">
                  <h2
                    className="text-[#1A2744] text-xl md:text-2xl font-bold"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
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

                  <div>
                    <label htmlFor="location" className={labelClass}>
                      {t('locationThailand')} *
                    </label>
                    <input id="location" name="location" type="text" required className={inputClass} />
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
                    <p className="mt-1.5 text-xs text-[#5C5247] text-right">{description.length}/500</p>
                  </div>

                  <div className="space-y-3">
                    <p className={labelClass}>{t('photos')}</p>
                    <p className="text-xs text-[#5C5247] -mt-2">{t('photosHint')}</p>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <input
                        key={n}
                        name={`photo${n}`}
                        type="url"
                        placeholder={t('photoUrlPlaceholder', { n })}
                        className={inputClass}
                      />
                    ))}
                  </div>
                </div>
              )}

              {category === 'Boat' && (
                <div className="bg-white border border-[#E8E2D6] rounded-[12px] p-6 md:p-8 space-y-5">
                  <h2
                    className="text-[#1A2744] text-xl md:text-2xl font-bold"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
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

                  <div>
                    <label htmlFor="location" className={labelClass}>
                      {t('locationMooring')} *
                    </label>
                    <input id="location" name="location" type="text" required className={inputClass} />
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
                    <p className="mt-1.5 text-xs text-[#5C5247] text-right">{description.length}/500</p>
                  </div>
                </div>
              )}

              {category === 'Business' && (
                <div className="bg-white border border-[#E8E2D6] rounded-[12px] p-6 md:p-8 space-y-5">
                  <h2
                    className="text-[#1A2744] text-xl md:text-2xl font-bold"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
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

                  <div>
                    <label htmlFor="location" className={labelClass}>
                      {t('location')} *
                    </label>
                    <input id="location" name="location" type="text" required className={inputClass} />
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
                    <p className="mt-1.5 text-xs text-[#5C5247] text-right">{description.length}/500</p>
                  </div>
                </div>
              )}

              {category === 'Other' && (
                <div className="bg-white border border-[#E8E2D6] rounded-[12px] p-6 md:p-8 space-y-5">
                  <h2
                    className="text-[#1A2744] text-xl md:text-2xl font-bold"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
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

                  <div>
                    <label htmlFor="location" className={labelClass}>
                      {t('location')} *
                    </label>
                    <input id="location" name="location" type="text" required className={inputClass} />
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
                    <p className="mt-1.5 text-xs text-[#5C5247] text-right">{description.length}/500</p>
                  </div>
                </div>
              )}

              <div className="bg-white border border-[#E8E2D6] rounded-[12px] p-6 md:p-8 space-y-5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    className="mt-1 accent-amber-600 w-4 h-4 flex-shrink-0"
                  />
                  <span className="text-sm text-[#1A2744] leading-relaxed">{t('consent')}</span>
                </label>

                {(status === 'error' || securityError) && (
                  <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    {securityError ? 'Security check failed' : t('errorMessage')}
                  </p>
                )}

                <TurnstileWidget onToken={onToken} />

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full md:w-auto min-w-[200px] px-6 py-3 rounded-[12px] text-[15px] font-semibold bg-amber-600 hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-colors duration-200"
                >
                  {status === 'loading' ? t('submitting') : t('submit')}
                </button>
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
