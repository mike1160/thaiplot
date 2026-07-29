import type { CSSProperties, ReactNode } from 'react'
import Link from 'next/link'
import { getProfile } from '@/lib/auth'
import { getSupabaseAdmin, type ListingRow } from '@/lib/supabase'
import { adminSecretsMatch } from '@/lib/admin'
import { absoluteAssetUrl } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = {
  params: { id: string }
  searchParams?: { secret?: string }
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
  }
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <p
        style={{
          margin: '0 0 4px',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: '#C8973A',
        }}
      >
        {label}
      </p>
      <div style={{ fontSize: 14, color: '#1A2744', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {value || '—'}
      </div>
    </div>
  )
}

function photoUrl(raw: string | null | undefined): string | null {
  if (!raw) return null
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  try {
    return absoluteAssetUrl(raw)
  } catch {
    return raw
  }
}

export default async function AdminListingDetailPage({ params, searchParams }: Props) {
  const secret = searchParams?.secret || ''
  const adminSecret = process.env.ADMIN_SECRET || ''
  const profile = await getProfile()
  const allowed =
    adminSecretsMatch(secret, adminSecret) || profile?.role === 'admin'

  if (!allowed) {
    return (
      <main style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: 40, color: '#1A2744' }}>
        <p style={{ color: '#C8973A', fontWeight: 600 }}>403 Forbidden</p>
        <p style={{ color: '#5C5247' }}>
          Log in at <code>/admin/login</code> or pass a valid <code>?secret=…</code>.
        </p>
      </main>
    )
  }

  const supabase = getSupabaseAdmin()
  const { data: listing, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', params.id)
    .maybeSingle()

  if (error || !listing) {
    return (
      <main style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#1A2744' }}>
        <p>Listing not found.</p>
        <Link href={`/admin/listings${secret ? `?secret=${encodeURIComponent(secret)}` : ''}`}>
          ← Terug naar listings
        </Link>
      </main>
    )
  }

  const row = listing as ListingRow
  let ownerName: string | null = null
  let ownerEmail: string | null = null

  if (row.user_id) {
    const { data: owner } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', row.user_id)
      .maybeSingle()
    ownerName = owner?.full_name || null
    ownerEmail = owner?.email || null
  }

  const enc = encodeURIComponent(adminSecret)
  const secretQs = secret ? `?secret=${encodeURIComponent(secret)}` : ''
  const publicPath = `/en/listings/${(row.slug || '').trim() || row.id}`
  const photos = [row.photo_1, row.photo_2, row.photo_3, row.photo_4, row.photo_5]
    .map(photoUrl)
    .filter(Boolean) as string[]
  const prefs = Array.isArray(row.contact_preferences)
    ? row.contact_preferences.join(', ')
    : row.contact_preferences || null

  const title =
    row.property_type && row.location
      ? `${row.property_type} — ${row.location}`
      : row.location || row.property_type || row.id

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#1A2744', maxWidth: 1100, margin: '0 auto' }}>
      <Link
        href={`/admin/listings${secretQs}`}
        style={{ color: '#C8973A', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}
      >
        ← Terug naar listings
      </Link>

      <h1
        style={{
          fontFamily: 'Playfair Display, serif',
          margin: '16px 0 8px',
          fontSize: 28,
        }}
      >
        {title}
      </h1>
      <p style={{ color: '#5C5247', marginBottom: 16, fontSize: 13 }}>
        ID: {row.id}
        {row.status ? ` · ${row.status}` : ''}
      </p>

      <div style={{ marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <a href={publicPath} target="_blank" rel="noopener noreferrer" style={actionButtonStyle('#1A2744')}>
          Bekijk publieke pagina
        </a>
        <a
          href={`/api/listing-action?id=${row.id}&action=approve&secret=${enc}`}
          style={actionButtonStyle('#16a34a')}
        >
          Approve
        </a>
        <a
          href={`/api/listing-action?id=${row.id}&action=reject&secret=${enc}`}
          style={actionButtonStyle('#C8973A')}
        >
          Reject
        </a>
        <a
          href={`/api/listing-action?id=${row.id}&action=delete&secret=${enc}`}
          style={actionButtonStyle('#dc2626')}
        >
          Delete
        </a>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}
      >
        <div
          style={{
            background: '#FAF7F0',
            border: '1px solid #E8E2D6',
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h2 style={{ margin: '0 0 16px', fontSize: 16, color: '#1A2744' }}>Details</h2>
          <Field label="Name" value={row.name} />
          <Field label="Email" value={row.email} />
          <Field label="Phone" value={row.phone} />
          <Field label="Location" value={row.location} />
          <Field label="Region" value={row.region} />
          <Field label="Price" value={row.price} />
          <Field label="Description" value={row.description} />
          <Field label="Property type" value={row.property_type} />
          <Field label="Category" value={row.category} />
          <Field label="Status" value={row.status} />
          <Field
            label="Created"
            value={row.created_at ? new Date(row.created_at).toLocaleString() : null}
          />
          <Field
            label="Approved at"
            value={row.approved_at ? new Date(row.approved_at).toLocaleString() : null}
          />
          <Field label="Slug" value={row.slug} />
          <Field label="LINE ID" value={row.line_id} />
          <Field label="WhatsApp" value={row.whatsapp} />
          <Field label="Contact preferences" value={prefs} />
          <Field label="User ID" value={row.user_id} />
          <Field
            label="Owner"
            value={
              row.user_id
                ? `${ownerName || 'Onbekend'}${ownerEmail ? ` · ${ownerEmail}` : ''}`
                : 'Onbekend'
            }
          />
        </div>

        <div
          style={{
            background: '#FAF7F0',
            border: '1px solid #E8E2D6',
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h2 style={{ margin: '0 0 16px', fontSize: 16, color: '#1A2744' }}>
            Foto’s ({photos.length})
          </h2>
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
    </div>
  )
}
