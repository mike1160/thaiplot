import type { CSSProperties } from 'react'
import Link from 'next/link'
import { getProfile } from '@/lib/auth'
import { getSupabaseAdmin, type ListingRow } from '@/lib/supabase'
import { adminListingsUrl, adminSecretsMatch } from '@/lib/admin'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams?: { secret?: string; flash?: string }
}

type AdminListing = Pick<
  ListingRow,
  | 'id'
  | 'name'
  | 'email'
  | 'location'
  | 'property_type'
  | 'status'
  | 'created_at'
  | 'price'
  | 'region'
  | 'user_id'
  | 'slug'
  | 'photo_1'
  | 'photo_2'
  | 'photo_3'
  | 'photo_4'
  | 'photo_5'
> & {
  owner_name?: string | null
}

function statusColor(status: string) {
  if (status === 'approved') return '#16a34a'
  if (status === 'rejected') return '#dc2626'
  return '#C8973A'
}

function actionButtonStyle(bg: string): CSSProperties {
  return {
    display: 'inline-block',
    marginRight: 8,
    marginBottom: 4,
    padding: '6px 12px',
    borderRadius: 8,
    background: bg,
    color: '#fff',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 600,
  }
}

function flashMessage(flash?: string): string | null {
  switch (flash) {
    case 'approved':
      return 'Listing approved.'
    case 'rejected':
      return 'Listing rejected.'
    case 'deleted':
      return 'Listing deleted.'
    case 'not_found':
      return 'Listing not found.'
    case 'delete_error':
    case 'update_error':
    case 'error':
      return 'Action failed. Check server logs.'
    default:
      return null
  }
}

function photoCount(row: AdminListing) {
  return [row.photo_1, row.photo_2, row.photo_3, row.photo_4, row.photo_5].filter(Boolean).length
}

export default async function AdminListingsPage({ searchParams }: Props) {
  const secret = searchParams?.secret || ''
  const adminSecret = process.env.ADMIN_SECRET || ''
  const flash = flashMessage(searchParams?.flash)
  const profile = await getProfile()
  const allowed =
    adminSecretsMatch(secret, adminSecret) || profile?.role === 'admin'

  if (!allowed) {
    return (
      <main
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          padding: 40,
          color: '#1A2744',
        }}
      >
        <div
          style={{
            maxWidth: 480,
            margin: '10vh auto 0',
            background: '#fff',
            border: '1px solid #E8E2D6',
            borderRadius: 12,
            padding: 32,
          }}
        >
          <p style={{ color: '#C8973A', fontWeight: 600, margin: '0 0 8px' }}>403</p>
          <h1 style={{ fontFamily: 'Playfair Display, serif', margin: '0 0 12px' }}>
            Forbidden
          </h1>
          <p style={{ color: '#5C5247', margin: 0, lineHeight: 1.6 }}>
            Log in at <code>/admin/login</code> as admin, or pass a valid{' '}
            <code>?secret=…</code> matching <code>ADMIN_SECRET</code>.
          </p>
        </div>
      </main>
    )
  }

  let listings: AdminListing[] = []
  let loadError: string | null = null

  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('listings')
      .select(
        'id, name, email, location, property_type, status, created_at, price, region, user_id, slug, photo_1, photo_2, photo_3, photo_4, photo_5'
      )
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[admin/listings]', error)
      loadError = error.message
    } else {
      listings = (data || []) as AdminListing[]

      const userIds = Array.from(
        new Set(listings.map((l) => l.user_id).filter(Boolean) as string[])
      )
      if (userIds.length) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds)

        const nameById = new Map(
          (profiles || []).map((p: { id: string; full_name: string | null }) => [
            p.id,
            p.full_name,
          ])
        )
        listings = listings.map((l) => ({
          ...l,
          owner_name: l.user_id ? nameById.get(l.user_id) || null : null,
        }))
      }
    }
  } catch (error) {
    console.error('[admin/listings]', error)
    loadError = error instanceof Error ? error.message : 'Failed to load listings'
  }

  const enc = encodeURIComponent(adminSecret)
  const secretQs = secret ? `?secret=${encodeURIComponent(secret)}` : ''

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#1A2744', maxWidth: 1200, margin: '0 auto' }}>
      <h1
        style={{
          fontFamily: 'Playfair Display, serif',
          margin: '0 0 8px',
          fontSize: 32,
        }}
      >
        ThaiPlot — Listings
      </h1>
      <p style={{ color: '#5C5247', marginBottom: 16 }}>
        {listings.length} total listings
        {loadError ? ` · Load error: ${loadError}` : ''}
      </p>

      {flash ? (
        <p
          style={{
            marginBottom: 16,
            padding: '10px 14px',
            borderRadius: 8,
            background: '#FAF7F0',
            border: '1px solid #C8973A',
            color: '#1A2744',
            fontWeight: 500,
          }}
        >
          {flash}
        </p>
      ) : null}

      <div
        style={{
          overflowX: 'auto',
          background: '#fff',
          border: '1px solid #E8E2D6',
          borderRadius: 12,
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: '#1A2744', color: '#fff' }}>
              <th style={{ padding: 12 }}>Name</th>
              <th style={{ padding: 12 }}>Email</th>
              <th style={{ padding: 12 }}>Location</th>
              <th style={{ padding: 12 }}>Property type</th>
              <th style={{ padding: 12 }}>Price</th>
              <th style={{ padding: 12 }}>Region</th>
              <th style={{ padding: 12 }}>Owner</th>
              <th style={{ padding: 12 }}>Photos</th>
              <th style={{ padding: 12 }}>Status</th>
              <th style={{ padding: 12 }}>Created</th>
              <th style={{ padding: 12 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((row) => (
              <tr key={row.id} style={{ borderTop: '1px solid #E8E2D6' }}>
                <td style={{ padding: 12 }}>{row.name || '—'}</td>
                <td style={{ padding: 12 }}>{row.email || '—'}</td>
                <td style={{ padding: 12 }}>{row.location || '—'}</td>
                <td style={{ padding: 12 }}>{row.property_type || '—'}</td>
                <td style={{ padding: 12 }}>{row.price || '—'}</td>
                <td style={{ padding: 12 }}>{row.region || '—'}</td>
                <td style={{ padding: 12 }}>{row.owner_name || 'Onbekend'}</td>
                <td style={{ padding: 12 }}>{photoCount(row)}</td>
                <td
                  style={{
                    padding: 12,
                    color: statusColor(row.status),
                    fontWeight: 600,
                    textTransform: 'capitalize',
                  }}
                >
                  {row.status}
                </td>
                <td style={{ padding: 12, whiteSpace: 'nowrap', color: '#5C5247' }}>
                  {row.created_at ? new Date(row.created_at).toLocaleString() : '—'}
                </td>
                <td style={{ padding: 12, whiteSpace: 'nowrap' }}>
                  <Link
                    href={`/admin/listings/${row.id}${secretQs}`}
                    style={actionButtonStyle('#1A2744')}
                  >
                    Detail
                  </Link>
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
                </td>
              </tr>
            ))}
            {listings.length === 0 && !loadError && (
              <tr>
                <td
                  colSpan={11}
                  style={{ padding: 24, textAlign: 'center', color: '#5C5247' }}
                >
                  No listings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: 16, color: '#5C5247', fontSize: 13 }}>
        Bookmark:{' '}
        <code style={{ color: '#1A2744' }}>{adminListingsUrl(adminSecret)}</code>
      </p>
    </div>
  )
}
