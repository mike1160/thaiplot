import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getSupabaseAdmin } from '@/lib/supabase'
import { requestClientIp, verifyTurnstileToken } from '@/lib/turnstile'
import { LISTING_CATEGORIES, type ListingCategory } from '@/lib/listing-ui'

const resend = new Resend(process.env.RESEND_API_KEY)

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function siteBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`
  }
  return 'http://localhost:3001'
}

function isListingCategory(value: unknown): value is ListingCategory {
  return typeof value === 'string' && LISTING_CATEGORIES.includes(value as ListingCategory)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      category: rawCategory,
      name,
      email,
      phone,
      language,
      type,
      transaction,
      region,
      location,
      size,
      price,
      titleDeed,
      description,
      vehicleType,
      vehicleBrand,
      vehicleYear,
      vehicleMileage,
      condition,
      boatType,
      boatLength,
      engineType,
      businessType,
      annualRevenue,
      reasonForSelling,
      itemName,
      otherCategory,
      photos,
      consent,
      turnstileToken,
      slug,
      contactPreferences,
      lineId,
      whatsapp,
      lat,
      lng,
      referralSource,
    } = body

    const turnstile = await verifyTurnstileToken(turnstileToken, requestClientIp(req))
    if (!turnstile.ok) {
      return NextResponse.json({ error: 'Security check failed' }, { status: 400 })
    }

    const category: ListingCategory = isListingCategory(rawCategory)
      ? rawCategory
      : 'Land & Property'

    if (!name || !email || !phone || !location || !consent) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Soft Thai mobile validation on server too
    const phoneClean = String(phone).replace(/[\s\-().]/g, '')
    const phoneOk =
      /^\+66[689]\d{8}$/.test(phoneClean) || /^0[689]\d{8}$/.test(phoneClean)
    if (!phoneOk) {
      return NextResponse.json({ error: 'Invalid Thai phone number' }, { status: 400 })
    }

    const adminSecret = process.env.ADMIN_SECRET
    if (!adminSecret) {
      console.error('ADMIN_SECRET is not set')
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const photoList = Array.isArray(photos)
      ? photos.map((p: unknown) => String(p || '').trim()).filter(Boolean).slice(0, 5)
      : []

    let propertyType: string | null = type || null
    let transactionType: string | null = transaction || 'For Sale'
    let sizeValue: string | null = size || null
    let titleDeedValue: string | null = titleDeed || null
    let descriptionValue = String(description || '').trim().slice(0, 500)
    let vehicleTypeValue: string | null = null
    let vehicleBrandValue: string | null = null
    let vehicleYearValue: string | null = vehicleYear ? String(vehicleYear) : null
    let vehicleMileageValue: string | null = null
    let conditionValue: string | null = condition || null
    let regionValue = region || 'Other'

    const prefs = Array.isArray(contactPreferences)
      ? contactPreferences.map((p: unknown) => String(p || '').trim()).filter(Boolean)
      : []
    const slugValue = typeof slug === 'string' ? slug.trim().slice(0, 80) : ''
    const lineIdValue = typeof lineId === 'string' ? lineId.trim() : ''
    const whatsappValue = typeof whatsapp === 'string' ? whatsapp.trim() : ''
    const referralValue = typeof referralSource === 'string' ? referralSource.trim() : ''
    const latValue =
      typeof lat === 'number' && Number.isFinite(lat)
        ? lat
        : typeof lat === 'string' && lat.trim()
          ? Number(lat)
          : null
    const lngValue =
      typeof lng === 'number' && Number.isFinite(lng)
        ? lng
        : typeof lng === 'string' && lng.trim()
          ? Number(lng)
          : null

    if (category === 'Vehicle') {
      propertyType = vehicleType || 'Vehicle'
      vehicleTypeValue = vehicleType || null
      vehicleBrandValue = vehicleBrand || null
      vehicleMileageValue = vehicleMileage || null
      transactionType = 'For Sale'
      titleDeedValue = null
      sizeValue = null
    } else if (category === 'Boat') {
      propertyType = boatType || 'Boat'
      vehicleTypeValue = boatType || null
      vehicleBrandValue = engineType || null
      sizeValue = boatLength ? `${boatLength} m` : null
      transactionType = 'For Sale'
      titleDeedValue = null
    } else if (category === 'Business') {
      propertyType = businessType || 'Business'
      sizeValue = annualRevenue || null
      titleDeedValue = reasonForSelling || null
      transactionType = 'For Sale'
      if (reasonForSelling) {
        descriptionValue = descriptionValue
          ? `Reason for selling: ${reasonForSelling}\n\n${descriptionValue}`
          : `Reason for selling: ${reasonForSelling}`
        descriptionValue = descriptionValue.slice(0, 500)
      }
    } else if (category === 'Other') {
      propertyType = itemName || otherCategory || 'Other'
      vehicleTypeValue = otherCategory || null
      transactionType = 'For Sale'
      titleDeedValue = null
      sizeValue = null
    }

    const supabase = getSupabaseAdmin()
    const marketplaceRow = {
      status: 'pending' as const,
      name,
      email,
      phone,
      preferred_language: language || null,
      property_type: propertyType,
      transaction_type: transactionType,
      location,
      size: sizeValue,
      price: price || null,
      title_deed: titleDeedValue,
      description: descriptionValue || null,
      region: regionValue,
      category,
      vehicle_type: vehicleTypeValue,
      vehicle_brand: vehicleBrandValue,
      vehicle_year: vehicleYearValue,
      vehicle_mileage: vehicleMileageValue,
      condition: conditionValue,
      photo_1: photoList[0] || null,
      photo_2: photoList[1] || null,
      photo_3: photoList[2] || null,
      photo_4: photoList[3] || null,
      photo_5: photoList[4] || null,
      lat: latValue,
      lng: lngValue,
      line_id: lineIdValue || null,
      whatsapp: whatsappValue || null,
      contact_preferences: prefs.length ? prefs : null,
      referral_source: referralValue || null,
      slug: slugValue || null,
    }

    const legacyRow = {
      status: 'pending' as const,
      name,
      email,
      phone,
      preferred_language: language || null,
      property_type: propertyType,
      transaction_type: transactionType,
      location,
      size: sizeValue,
      price: price || null,
      title_deed: titleDeedValue,
      description: descriptionValue || null,
      region: regionValue,
    }

    let listing: { id: string } | null = null
    let insertError: { message?: string } | null = null

    ;({ data: listing, error: insertError } = await supabase
      .from('listings')
      .insert(marketplaceRow)
      .select('id')
      .single())

    if (
      insertError &&
      /(category|vehicle_|condition|photo_|lat|lng|line_id|whatsapp|contact_preferences|referral_source|slug)/i.test(
        insertError.message || ''
      )
    ) {
      ;({ data: listing, error: insertError } = await supabase
        .from('listings')
        .insert(legacyRow)
        .select('id')
        .single())
    }

    if (insertError && /region/i.test(insertError.message || '')) {
      const withoutRegion = { ...legacyRow, region: undefined }
      delete (withoutRegion as { region?: string }).region
      ;({ data: listing, error: insertError } = await supabase
        .from('listings')
        .insert(withoutRegion)
        .select('id')
        .single())
    }

    if (insertError || !listing?.id) {
      console.error(insertError)
      return NextResponse.json({ error: 'Failed to save listing' }, { status: 500 })
    }

    const base = siteBaseUrl()
    const approveUrl = `${base}/api/listing-action?id=${listing.id}&action=approve&secret=${encodeURIComponent(adminSecret)}`
    const rejectUrl = `${base}/api/listing-action?id=${listing.id}&action=reject&secret=${encodeURIComponent(adminSecret)}`
    const deleteUrl = `${base}/api/listing-action?id=${listing.id}&action=delete&secret=${encodeURIComponent(adminSecret)}`

    const summaryType = propertyType || category

    await resend.emails.send({
      from: 'ThaiPlot <noreply@hua-hin-land.com>',
      to: 'kleinjansmike@gmail.com',
      reply_to: email,
      subject: `New listing pending approval — ${category}: ${summaryType} in ${regionValue || location}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1120; color: #f0f4ff; padding: 32px; border-radius: 12px;">
          <h2 style="color: #C8973A; margin-bottom: 8px;">New listing pending approval</h2>
          <p style="color: #94a3b8; margin: 0 0 24px; font-size: 13px;">ID: ${escapeHtml(listing.id)} · ThaiPlot · ${escapeHtml(category)}</p>

          <h3 style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 24px 0 12px;">Contact</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #94a3b8; width: 140px;">Name</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Email</td><td style="padding: 8px 0; color: #C8973A;"><a href="mailto:${escapeHtml(email)}" style="color: #C8973A;">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Phone / WhatsApp</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(phone)}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Language</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(language)}</td></tr>
          </table>

          <h3 style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 24px 0 12px;">Listing</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #94a3b8; width: 140px;">Category</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(category)}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Type</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(propertyType)}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Brand / engine</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(vehicleBrandValue) || '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Year</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(vehicleYearValue) || '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Mileage</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(vehicleMileageValue) || '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Condition</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(conditionValue) || '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Transaction</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(transactionType)}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Region</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(regionValue)}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Location</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(location)}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Slug</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(slugValue) || '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Coords</td><td style="padding: 8px 0; color: #f0f4ff;">${latValue != null && lngValue != null ? `${escapeHtml(latValue)}, ${escapeHtml(lngValue)}` : '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Referral</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(referralValue) || '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Contact prefs</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(prefs.join(', ') || '—')}${lineIdValue ? ` · LINE: ${escapeHtml(lineIdValue)}` : ''}${whatsappValue ? ` · WA: ${escapeHtml(whatsappValue)}` : ''}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Size / length</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(sizeValue) || '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Price</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(price) || '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Title / reason</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(titleDeedValue) || '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8; vertical-align: top;">Description</td><td style="padding: 8px 0; color: #f0f4ff; white-space: pre-wrap;">${escapeHtml(descriptionValue) || '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8; vertical-align: top;">Photos</td><td style="padding: 8px 0; color: #f0f4ff;">${photoList.length ? photoList.map((u: string) => escapeHtml(u)).join('<br/>') : '—'}</td></tr>
          </table>

          <div style="margin-top: 32px; display: flex; gap: 12px; flex-wrap: wrap;">
            <a href="${approveUrl}" style="display: inline-block; padding: 14px 22px; background: #16a34a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">✅ APPROVE</a>
            <a href="${rejectUrl}" style="display: inline-block; padding: 14px 22px; background: #dc2626; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">❌ REJECT</a>
            <a href="${deleteUrl}" style="display: inline-block; padding: 14px 22px; background: #64748b; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">🗑️ DELETE</a>
          </div>

          <div style="margin-top: 24px; padding: 16px; background: #1e2a4a; border-radius: 8px;">
            <p style="margin: 0; color: #64748b; font-size: 12px;">Sent from thaiplot.com · List on ThaiPlot · ${new Date().toISOString()}</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
