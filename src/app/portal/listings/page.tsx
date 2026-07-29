import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getProfile } from '@/lib/auth'
import { getSupabaseAdmin, type ListingRow } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

type PortalListing = Pick<
  ListingRow,
  | 'id'
  | 'property_type'
  | 'location'
  | 'region'
  | 'description'
  | 'status'
  | 'created_at'
  | 'slug'
>

function statusBadge(status: string) {
  const normalized = (status || 'pending').toLowerCase()
  let bg = '#FEF3C7'
  let color = '#92400E'
  if (normalized === 'approved') {
    bg = '#DCFCE7'
    color = '#166534'
  } else if (normalized === 'rejected') {
    bg = '#FEE2E2'
    color = '#991B1B'
  }
  return { bg, color, label: normalized }
}

function listingTitle(row: PortalListing) {
  if (row.property_type && row.location) return `${row.property_type} — ${row.location}`
  if (row.property_type) return row.property_type
  if (row.location) return row.location
  if (row.description) {
    const trimmed = row.description.trim()
    return trimmed.length > 60 ? `${trimmed.slice(0, 60)}…` : trimmed
  }
  return 'Aanbod'
}

export default async function PortalListingsPage() {
  const profile = await getProfile()
  if (!profile) {
    redirect('/portal/login')
  }

  let listings: PortalListing[] = []
  let loadError: string | null = null

  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('listings')
      .select('id, property_type, location, region, description, status, created_at, slug')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[portal/listings]', error)
      loadError = error.message
    } else {
      listings = (data || []) as PortalListing[]
    }
  } catch (error) {
    console.error('[portal/listings]', error)
    loadError = error instanceof Error ? error.message : 'Laden mislukt'
  }

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px 48px' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
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
            PORTAL
          </p>
          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              margin: 0,
              fontSize: 28,
              color: '#1A2744',
            }}
          >
            Mijn aanbod
          </h1>
        </div>
        <Link
          href="/nl/list-property"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: 44,
            padding: '0 16px',
            borderRadius: 10,
            background: '#C8973A',
            color: '#fff',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          Nieuw aanbod plaatsen
        </Link>
      </div>

      {loadError ? (
        <p style={{ color: '#B91C1C', marginBottom: 16 }}>Fout: {loadError}</p>
      ) : null}

      {listings.length === 0 && !loadError ? (
        <div
          style={{
            background: '#fff',
            border: '1px solid #E8E2D6',
            borderRadius: 14,
            padding: 32,
            textAlign: 'center',
          }}
        >
          <p style={{ margin: '0 0 12px', color: '#5C5247', fontSize: 15 }}>
            U heeft nog geen aanbod geplaatst
          </p>
          <Link href="/nl/list-property" style={{ color: '#C8973A', fontWeight: 600 }}>
            Plaats uw eerste aanbod →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {listings.map((row) => {
            const badge = statusBadge(row.status)
            const publicHref = `/en/listings/${(row.slug || '').trim() || row.id}`
            return (
              <div
                key={row.id}
                style={{
                  background: '#fff',
                  border: '1px solid #E8E2D6',
                  borderRadius: 12,
                  padding: '16px 18px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ margin: '0 0 6px', fontWeight: 600, fontSize: 15, color: '#1A2744' }}>
                    {listingTitle(row)}
                  </p>
                  <p style={{ margin: 0, fontSize: 13, color: '#5C5247' }}>
                    {row.region || row.location || '—'}
                    {' · '}
                    {row.created_at
                      ? new Date(row.created_at).toLocaleDateString('nl-NL', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'}
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: 999,
                      background: badge.bg,
                      color: badge.color,
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: 'capitalize',
                    }}
                  >
                    {badge.label}
                  </span>
                  <a
                    href={publicHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      minHeight: 36,
                      padding: '0 12px',
                      borderRadius: 8,
                      border: '1px solid #E8E2D6',
                      color: '#1A2744',
                      textDecoration: 'none',
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Bekijk advertentie
                  </a>
                  <Link
                    href={`/portal/listings/${row.id}/edit`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      minHeight: 36,
                      padding: '0 12px',
                      borderRadius: 8,
                      background: '#1A2744',
                      color: '#fff',
                      textDecoration: 'none',
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Bewerken
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
