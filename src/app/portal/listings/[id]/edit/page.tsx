'use client'

import { FormEvent, useEffect, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import PhotoUploader from '@/components/PhotoUploader'
import { getSupabaseBrowser } from '@/lib/supabase-browser'

const REGIONS = [
  'Hua Hin',
  'Pranburi',
  'Prachuap Khiri Khan',
  'Phuket',
  'Bangkok',
  'Chiang Mai',
  'Koh Samui',
  'Pattaya',
  'Chiang Rai',
  'Other',
] as const

/** Stored values match list-property form (phone/email lowercase). */
const CONTACT_OPTIONS = [
  { value: 'phone', label: 'Phone' },
  { value: 'LINE', label: 'LINE' },
  { value: 'WhatsApp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' },
] as const

const inputStyle: CSSProperties = {
  width: '100%',
  borderRadius: 12,
  border: '1px solid #E8E2D6',
  padding: '12px 14px',
  fontSize: 14,
  color: '#1A2744',
  outline: 'none',
  background: '#fff',
}

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 6,
  color: '#1A2744',
}

type ListingData = {
  id: string
  property_type: string | null
  location: string | null
  description: string | null
  price: string | null
  region: string | null
  phone: string | null
  line_id: string | null
  whatsapp: string | null
  contact_preferences: string[] | null
  slug: string | null
  status: string | null
  photo_1: string | null
  photo_2: string | null
  photo_3: string | null
  photo_4: string | null
  photo_5: string | null
}

function httpPhotosFromListing(listing: ListingData): string[] {
  return [
    listing.photo_1,
    listing.photo_2,
    listing.photo_3,
    listing.photo_4,
    listing.photo_5,
  ].filter((p): p is string => !!p && p.startsWith('http'))
}

function normalizePrefs(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((p) => String(p || '').trim())
    .filter(Boolean)
    .map((p) => {
      const lower = p.toLowerCase()
      if (lower === 'phone') return 'phone'
      if (lower === 'email') return 'email'
      if (lower === 'line') return 'LINE'
      if (lower === 'whatsapp') return 'WhatsApp'
      return p
    })
}

export default function PortalListingEditPage() {
  const params = useParams()
  const router = useRouter()
  const listingId = typeof params?.id === 'string' ? params.id : ''

  const [listing, setListing] = useState<ListingData | null>(null)
  const [photos, setPhotos] = useState<string[]>([])
  const [contactPreferences, setContactPreferences] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [location, setLocation] = useState('')
  const [region, setRegion] = useState('Other')
  const [phone, setPhone] = useState('')
  const [lineId, setLineId] = useState('')
  const [whatsapp, setWhatsapp] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [photosUploading, setPhotosUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!listingId) {
      router.replace('/portal/listings')
      return
    }

    let cancelled = false

    async function load() {
      try {
        const supabase = getSupabaseBrowser()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.replace('/portal/login')
          return
        }

        const res = await fetch(`/api/update-listing?id=${encodeURIComponent(listingId)}`)
        if (res.status === 401) {
          router.replace('/portal/login')
          return
        }
        if (res.status === 403 || res.status === 404) {
          router.replace('/portal/listings')
          return
        }
        if (!res.ok) {
          throw new Error('Laden mislukt')
        }

        const data = (await res.json()) as { listing: ListingData }
        if (!data.listing || cancelled) return

        const loaded = data.listing
        setListing(loaded)
        setPhotos(httpPhotosFromListing(loaded))
        setContactPreferences(normalizePrefs(loaded.contact_preferences))
        setDescription(String(loaded.description || ''))
        setPrice(String(loaded.price || ''))
        setLocation(String(loaded.location || ''))
        setRegion(String(loaded.region || 'Other'))
        setPhone(String(loaded.phone || ''))
        setLineId(String(loaded.line_id || ''))
        setWhatsapp(String(loaded.whatsapp || ''))
      } catch {
        if (!cancelled) setError('Kon advertentie niet laden')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [listingId, router])

  // Keep photos + prefs in sync if listing object changes
  useEffect(() => {
    if (!listing) return
    setPhotos(httpPhotosFromListing(listing))
    setContactPreferences(normalizePrefs(listing.contact_preferences))
  }, [listing])

  function togglePref(value: string) {
    setContactPreferences((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!listing || photosUploading) return

    setError(null)
    setSaving(true)

    const photoList = photos.filter(Boolean).slice(0, 5)

    try {
      const res = await fetch('/api/update-listing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: listing.id,
          description,
          price,
          location,
          region,
          phone,
          line_id: lineId,
          whatsapp,
          contact_preferences: contactPreferences,
          photo_1: photoList[0] || null,
          photo_2: photoList[1] || null,
          photo_3: photoList[2] || null,
          photo_4: photoList[3] || null,
          photo_5: photoList[4] || null,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Opslaan mislukt')
        setSaving(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/portal/listings')
        router.refresh()
      }, 1500)
    } catch {
      setError('Opslaan mislukt')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px' }}>
        <p style={{ color: '#5C5247' }}>Laden…</p>
      </main>
    )
  }

  if (!listing) {
    return (
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px' }}>
        <p style={{ color: '#B91C1C' }}>{error || 'Advertentie niet gevonden'}</p>
        <Link href="/portal/listings" style={{ color: '#C8973A', fontWeight: 600 }}>
          ← Terug naar mijn aanbod
        </Link>
      </main>
    )
  }

  const heading =
    listing.property_type && listing.location
      ? `${listing.property_type} — ${listing.location}`
      : listing.location || listing.property_type || 'Advertentie bewerken'

  const publicPath = `/en/listings/${(listing.slug || '').trim() || listing.id}`

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px 64px' }}>
      <Link
        href="/portal/listings"
        style={{
          display: 'inline-block',
          marginBottom: 16,
          color: '#C8973A',
          fontWeight: 600,
          fontSize: 14,
          textDecoration: 'none',
        }}
      >
        ← Terug naar mijn aanbod
      </Link>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div>
          <p
            style={{
              color: '#C8973A',
              fontWeight: 600,
              margin: '0 0 8px',
              letterSpacing: '0.04em',
              fontSize: 12,
            }}
          >
            BEWERKEN
          </p>
          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              margin: 0,
              fontSize: 28,
              color: '#1A2744',
            }}
          >
            {heading}
          </h1>
        </div>
        <a
          href={publicPath}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: 40,
            padding: '0 14px',
            borderRadius: 10,
            border: '1px solid #1A2744',
            color: '#1A2744',
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Bekijk advertentie
        </a>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          border: '1px solid #E8E2D6',
          borderRadius: 14,
          padding: '24px 22px',
          display: 'grid',
          gap: 18,
        }}
      >
        <div>
          <label htmlFor="edit-description" style={labelStyle}>
            Beschrijving
          </label>
          <textarea
            id="edit-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            style={{ ...inputStyle, resize: 'vertical', minHeight: 160 }}
          />
        </div>

        <div>
          <label htmlFor="edit-price" style={labelStyle}>
            Prijs
          </label>
          <input
            id="edit-price"
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="edit-location" style={labelStyle}>
            Locatie
          </label>
          <input
            id="edit-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="edit-region" style={labelStyle}>
            Regio
          </label>
          <select
            id="edit-region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            style={inputStyle}
          >
            {!REGIONS.includes(region as (typeof REGIONS)[number]) && region ? (
              <option value={region}>{region}</option>
            ) : null}
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="edit-phone" style={labelStyle}>
            Telefoon
          </label>
          <input
            id="edit-phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="edit-line" style={labelStyle}>
            LINE ID
          </label>
          <input
            id="edit-line"
            type="text"
            value={lineId}
            onChange={(e) => setLineId(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="edit-whatsapp" style={labelStyle}>
            WhatsApp
          </label>
          <input
            id="edit-whatsapp"
            type="text"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <p style={{ ...labelStyle, marginBottom: 10 }}>Contactvoorkeuren</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {CONTACT_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 14,
                  color: '#1A2744',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={contactPreferences.includes(opt.value)}
                  onChange={() => togglePref(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #E8E2D6', paddingTop: 18 }}>
          <PhotoUploader
            value={photos}
            onChange={setPhotos}
            onUploadingChange={setPhotosUploading}
            label="Foto’s"
            dropzoneText="Sleep foto’s hierheen of klik om te uploaden"
            hint="Maximaal 5 foto’s · JPG, PNG of WebP · max 5MB per foto"
            removeLabel="Verwijder foto"
            errorTooLarge="Foto is te groot (max 5MB)"
            errorType="Alleen JPG, PNG of WebP toegestaan"
            errorUpload="Upload mislukt"
            errorMax="Maximaal 5 foto’s"
          />
        </div>

        {error ? (
          <p
            style={{
              margin: 0,
              padding: '10px 12px',
              borderRadius: 8,
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#B91C1C',
              fontSize: 13,
            }}
          >
            {error}
          </p>
        ) : null}

        {success ? (
          <p
            style={{
              margin: 0,
              padding: '10px 12px',
              borderRadius: 8,
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              color: '#166534',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Opgeslagen!
          </p>
        ) : null}

        <button
          type="submit"
          disabled={saving || success || photosUploading}
          style={{
            minHeight: 48,
            borderRadius: 12,
            border: 'none',
            background: saving || photosUploading ? '#9a7d1e' : '#C8973A',
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
            cursor: saving || photosUploading ? 'wait' : 'pointer',
          }}
        >
          {photosUploading ? 'Foto’s uploaden…' : saving ? 'Opslaan…' : 'Opslaan'}
        </button>
      </form>
    </main>
  )
}
