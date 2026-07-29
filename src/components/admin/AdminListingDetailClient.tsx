'use client'

import { FormEvent, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Listing = {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  location: string | null
  region: string | null
  price: string | null
  description: string | null
  property_type: string | null
  category: string | null
  status: string | null
  created_at: string | null
  approved_at: string | null
  slug: string | null
  line_id: string | null
  whatsapp: string | null
  contact_preferences: string[] | string | null
  user_id: string | null
  photo_1: string | null
  photo_2: string | null
  photo_3: string | null
  photo_4: string | null
  photo_5: string | null
}

type Props = {
  listing: Listing
  ownerName: string | null
  ownerEmail: string | null
  photos: string[]
  secretQs: string
  approveUrl: string
  rejectUrl: string
  deleteUrl: string
  publicPath: string
}

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
]

const inputStyle: CSSProperties = {
  width: '100%',
  borderRadius: 10,
  border: '1px solid #E8E2D6',
  padding: '10px 12px',
  fontSize: 14,
  color: '#1A2744',
}

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 6,
  color: '#C8973A',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
}

function actionButtonStyle(bg: string): CSSProperties {
  return {
    display: 'inline-block',
    marginRight: 8,
    marginBottom: 4,
    padding: '8px 14px',
    borderRadius: 8,
    background: bg,
    color: '#fff',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
  }
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={labelStyle}>{label}</p>
      <div style={{ fontSize: 14, color: '#1A2744', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {value || '—'}
      </div>
    </div>
  )
}

export default function AdminListingDetailClient({
  listing,
  ownerName,
  ownerEmail,
  photos,
  secretQs,
  approveUrl,
  rejectUrl,
  deleteUrl,
  publicPath,
}: Props) {
  const router = useRouter()
  const [description, setDescription] = useState(listing.description || '')
  const [price, setPrice] = useState(listing.price || '')
  const [location, setLocation] = useState(listing.location || '')
  const [region, setRegion] = useState(listing.region || 'Other')
  const [status, setStatus] = useState(listing.status || 'pending')
  const [slug, setSlug] = useState(listing.slug || '')
  const [reden, setReden] = useState('')
  const [saving, setSaving] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const prefs = useMemo(() => {
    if (Array.isArray(listing.contact_preferences)) {
      return listing.contact_preferences.join(', ')
    }
    return listing.contact_preferences || null
  }, [listing.contact_preferences])

  const title =
    listing.property_type && listing.location
      ? `${listing.property_type} — ${listing.location}`
      : listing.location || listing.property_type || listing.id

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/update-listing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: listing.id,
          description,
          price,
          location,
          region,
          slug,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Opslaan mislukt')
        setSaving(false)
        return
      }
      setMessage('Opgeslagen!')
      setSaving(false)
      router.refresh()
    } catch {
      setError('Opslaan mislukt')
      setSaving(false)
    }
  }

  async function handleRejectWithReason() {
    if (!reden.trim()) {
      setError('Vul een reden in')
      return
    }
    setRejecting(true)
    setError(null)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/reject-with-reason', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: listing.id,
          email: listing.email,
          name: listing.name,
          location: listing.location,
          reden: reden.trim(),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Afwijzen mislukt')
        setRejecting(false)
        return
      }
      setMessage('Afwijzing verstuurd!')
      setStatus('rejected')
      setRejecting(false)
      router.refresh()
    } catch {
      setError('Afwijzen mislukt')
      setRejecting(false)
    }
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#1A2744', maxWidth: 1100, margin: '0 auto' }}>
      <Link
        href={`/admin/listings${secretQs}`}
        style={{ color: '#C8973A', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}
      >
        ← Terug naar listings
      </Link>

      <h1 style={{ fontFamily: 'Playfair Display, serif', margin: '16px 0 8px', fontSize: 28 }}>
        {title}
      </h1>
      <p style={{ color: '#5C5247', marginBottom: 16, fontSize: 13 }}>
        ID: {listing.id}
        {status ? ` · ${status}` : ''}
      </p>

      <div style={{ marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <a href={publicPath} target="_blank" rel="noopener noreferrer" style={actionButtonStyle('#1A2744')}>
          Bekijk publieke pagina
        </a>
        <a href={approveUrl} style={actionButtonStyle('#16a34a')}>
          Approve
        </a>
        <a href={rejectUrl} style={actionButtonStyle('#C8973A')}>
          Reject
        </a>
        <a href={deleteUrl} style={actionButtonStyle('#dc2626')}>
          Delete
        </a>
      </div>

      <div
        style={{
          marginBottom: 24,
          background: '#fff',
          border: '1px solid #E8E2D6',
          borderRadius: 12,
          padding: 16,
        }}
      >
        <label htmlFor="reject-reason" style={labelStyle}>
          Reden voor afwijzing (wordt gemaild naar eigenaar)
        </label>
        <textarea
          id="reject-reason"
          value={reden}
          onChange={(e) => setReden(e.target.value)}
          rows={3}
          placeholder="Bijv. onvolledige informatie, geen titelakte, …"
          style={{ ...inputStyle, resize: 'vertical', marginBottom: 10 }}
        />
        <button
          type="button"
          onClick={handleRejectWithReason}
          disabled={rejecting}
          style={actionButtonStyle(rejecting ? '#9a7d1e' : '#dc2626')}
        >
          {rejecting ? 'Bezig…' : 'Afwijzen met reden'}
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
          marginBottom: 24,
        }}
      >
        <div style={{ background: '#FAF7F0', border: '1px solid #E8E2D6', borderRadius: 12, padding: 20 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 16 }}>Details</h2>
          <Field label="Name" value={listing.name} />
          <Field label="Email" value={listing.email} />
          <Field label="Phone" value={listing.phone} />
          <Field label="Location" value={listing.location} />
          <Field label="Region" value={listing.region} />
          <Field label="Price" value={listing.price} />
          <Field label="Description" value={listing.description} />
          <Field label="Property type" value={listing.property_type} />
          <Field label="Category" value={listing.category} />
          <Field label="Status" value={listing.status} />
          <Field
            label="Created"
            value={listing.created_at ? new Date(listing.created_at).toLocaleString() : null}
          />
          <Field
            label="Approved at"
            value={listing.approved_at ? new Date(listing.approved_at).toLocaleString() : null}
          />
          <Field label="Slug" value={listing.slug} />
          <Field label="LINE ID" value={listing.line_id} />
          <Field label="WhatsApp" value={listing.whatsapp} />
          <Field label="Contact preferences" value={prefs} />
          <Field label="User ID" value={listing.user_id} />
          <Field
            label="Owner"
            value={
              listing.user_id
                ? `${ownerName || 'Onbekend'}${ownerEmail ? ` · ${ownerEmail}` : ''}`
                : 'Onbekend'
            }
          />
        </div>

        <div style={{ background: '#FAF7F0', border: '1px solid #E8E2D6', borderRadius: 12, padding: 20 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 16 }}>Foto’s ({photos.length})</h2>
          {photos.length === 0 ? (
            <p style={{ color: '#5C5247', margin: 0 }}>Geen foto’s</p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: 12,
              }}
            >
              {photos.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    objectFit: 'cover',
                    borderRadius: 10,
                    border: '1px solid #E8E2D6',
                    background: '#fff',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={handleSave}
        style={{
          background: '#fff',
          border: '1px solid #E8E2D6',
          borderRadius: 12,
          padding: 20,
          display: 'grid',
          gap: 14,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontFamily: 'Playfair Display, serif' }}>
          Admin bewerken
        </h2>

        <div>
          <label htmlFor="admin-desc" style={labelStyle}>
            Description
          </label>
          <textarea
            id="admin-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>
        <div>
          <label htmlFor="admin-price" style={labelStyle}>
            Price
          </label>
          <input
            id="admin-price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="admin-location" style={labelStyle}>
            Location
          </label>
          <input
            id="admin-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="admin-region" style={labelStyle}>
            Region
          </label>
          <select
            id="admin-region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            style={inputStyle}
          >
            {!REGIONS.includes(region) && region ? <option value={region}>{region}</option> : null}
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="admin-slug" style={labelStyle}>
            Slug
          </label>
          <input id="admin-slug" value={slug} onChange={(e) => setSlug(e.target.value)} style={inputStyle} />
        </div>

        {error ? (
          <p style={{ margin: 0, color: '#B91C1C', fontSize: 13 }}>{error}</p>
        ) : null}
        {message ? (
          <p style={{ margin: 0, color: '#166534', fontSize: 13, fontWeight: 600 }}>{message}</p>
        ) : null}

        <button type="submit" disabled={saving} style={actionButtonStyle(saving ? '#9a7d1e' : '#C8973A')}>
          {saving ? 'Opslaan…' : 'Opslaan'}
        </button>
      </form>
    </div>
  )
}
