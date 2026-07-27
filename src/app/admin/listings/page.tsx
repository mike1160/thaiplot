import type { CSSProperties } from 'react'
import { getSupabaseAdmin, type ListingRow } from '@/lib/supabase'
import { adminListingsUrl, adminSecretsMatch } from '@/lib/admin'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams?: { secret?: string; flash?: string }
}

type AdminListing = Pick<
  ListingRow,
  'id' | 'name' | 'email' | 'location' | 'property_type' | 'status' | 'created_at'
>

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

export default async function AdminListingsPage({ searchParams }: Props) {
  const secret = searchParams?.secret || ''
  const adminSecret = process.env.ADMIN_SECRET || ''
  const flash = flashMessage(searchParams?.flash)

  if (!adminSecretsMatch(secret, adminSecret)) {
    return (
      <main
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          padding: 40,
          background: '#FAF7F0',
          minHeight: '100vh',
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
            Pass a valid <code>?secret=…</code> query param matching{' '}
            <code>ADMIN_SECRET</code>. If your secret contains <code>%</code>, encode it as{' '}
            <code>%25</code> in the URL.
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
      .select('id, name, email, location, property_type, status, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[admin/listings]', error)
      loadError = error.message
    } else {
      listings = (data || []) as AdminListing[]
    }
  } catch (error) {
    console.error('[admin/listings]', error)
    loadError = error instanceof Error ? error.message : 'Failed to load listings'
  }

  const enc = encodeURIComponent(adminSecret)

  return (
    <main
      style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: 24,
        background: '#FAF7F0',
        minHeight: '100vh',
        color: '#1A2744',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <p style={{ color: '#C8973A', fontWeight: 600, margin: '0 0 8px', letterSpacing: '0.04em' }}>
          ADMIN
        </p>
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
              background: '#fff',
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
                    colSpan={7}
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
    </main>
  )
}
