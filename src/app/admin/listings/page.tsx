import { getSupabaseAdmin, type ListingRow } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams?: { secret?: string }
}

type ClickStat = {
  listing_id: string | null
  listing_location: string
  clicks: number
  last_clicked: string | null
}

function statusColor(status: string) {
  if (status === 'approved') return '#16a34a'
  if (status === 'rejected') return '#dc2626'
  return '#C8973A'
}

async function fetchClickStats(): Promise<ClickStat[]> {
  try {
    const supabase = getSupabaseAdmin()
    const since = new Date()
    since.setDate(since.getDate() - 30)

    const { data, error } = await supabase
      .from('listing_clicks')
      .select('listing_id, listing_location, clicked_at')
      .gte('clicked_at', since.toISOString())

    if (error) {
      console.error(error)
      return []
    }

    const map = new Map<string, ClickStat>()
    for (const row of data || []) {
      const key = row.listing_id || row.listing_location || 'unknown'
      const existing = map.get(key)
      const clickedAt = row.clicked_at as string | null
      if (!existing) {
        map.set(key, {
          listing_id: row.listing_id,
          listing_location: row.listing_location || '—',
          clicks: 1,
          last_clicked: clickedAt,
        })
      } else {
        existing.clicks += 1
        if (
          clickedAt &&
          (!existing.last_clicked || new Date(clickedAt) > new Date(existing.last_clicked))
        ) {
          existing.last_clicked = clickedAt
        }
      }
    }

    return Array.from(map.values()).sort((a, b) => b.clicks - a.clicks)
  } catch (error) {
    console.error(error)
    return []
  }
}

export default async function AdminListingsPage({ searchParams }: Props) {
  const secret = searchParams?.secret || ''
  const adminSecret = process.env.ADMIN_SECRET || ''

  if (!adminSecret || secret !== adminSecret) {
    return (
      <main style={{ fontFamily: 'system-ui', padding: 40, background: '#FAF7F0', minHeight: '100vh' }}>
        <h1>Unauthorized</h1>
        <p>Pass ?secret=ADMIN_SECRET to access this page.</p>
      </main>
    )
  }

  let listings: ListingRow[] = []
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error(error)
    } else {
      listings = (data || []) as ListingRow[]
    }
  } catch (error) {
    console.error(error)
  }

  const clickStats = await fetchClickStats()
  const enc = encodeURIComponent(secret)

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24, background: '#FAF7F0', minHeight: '100vh', color: '#1A2744' }}>
      <h1 style={{ marginBottom: 8 }}>ThaiPlot Admin — Listings</h1>
      <p style={{ color: '#5C5247', marginBottom: 24 }}>{listings.length} total listings</p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #E8E2D6' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: '#1A2744', color: '#fff' }}>
              <th style={{ padding: 10 }}>Name</th>
              <th style={{ padding: 10 }}>Location</th>
              <th style={{ padding: 10 }}>Category</th>
              <th style={{ padding: 10 }}>Type</th>
              <th style={{ padding: 10 }}>Status</th>
              <th style={{ padding: 10 }}>Date</th>
              <th style={{ padding: 10 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((row) => (
              <tr key={row.id} style={{ borderTop: '1px solid #E8E2D6' }}>
                <td style={{ padding: 10 }}>{row.name || '—'}</td>
                <td style={{ padding: 10 }}>
                  {row.location || '—'}
                  {row.region ? ` (${row.region})` : ''}
                </td>
                <td style={{ padding: 10 }}>{row.category || 'Land & Property'}</td>
                <td style={{ padding: 10 }}>{row.property_type || '—'}</td>
                <td style={{ padding: 10, color: statusColor(row.status), fontWeight: 600 }}>
                  {row.status}
                </td>
                <td style={{ padding: 10, whiteSpace: 'nowrap' }}>
                  {row.created_at ? new Date(row.created_at).toLocaleDateString() : '—'}
                </td>
                <td style={{ padding: 10, whiteSpace: 'nowrap' }}>
                  <a
                    href={`/api/listing-action?id=${row.id}&action=approve&secret=${enc}`}
                    style={{ marginRight: 8 }}
                  >
                    ✅ Approve
                  </a>
                  <a
                    href={`/api/listing-action?id=${row.id}&action=reject&secret=${enc}`}
                    style={{ marginRight: 8 }}
                  >
                    ❌ Reject
                  </a>
                  <a href={`/api/listing-action?id=${row.id}&action=delete&secret=${enc}`}>
                    🗑️ Delete
                  </a>
                </td>
              </tr>
            ))}
            {listings.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 20, textAlign: 'center', color: '#5C5247' }}>
                  No listings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 style={{ marginTop: 40, marginBottom: 8 }}>Click Analytics (last 30 days)</h2>
      <p style={{ color: '#5C5247', marginBottom: 16 }}>
        Contact-agent clicks from listing cards. Sorted by most clicked.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #E8E2D6' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: '#1A2744', color: '#fff' }}>
              <th style={{ padding: 10 }}>Location</th>
              <th style={{ padding: 10 }}>Clicks</th>
              <th style={{ padding: 10 }}>Last clicked</th>
            </tr>
          </thead>
          <tbody>
            {clickStats.map((row) => (
              <tr key={`${row.listing_id || row.listing_location}-${row.clicks}`} style={{ borderTop: '1px solid #E8E2D6' }}>
                <td style={{ padding: 10 }}>{row.listing_location}</td>
                <td style={{ padding: 10, fontWeight: 600 }}>{row.clicks}</td>
                <td style={{ padding: 10, whiteSpace: 'nowrap' }}>
                  {row.last_clicked ? new Date(row.last_clicked).toLocaleString() : '—'}
                </td>
              </tr>
            ))}
            {clickStats.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: 20, textAlign: 'center', color: '#5C5247' }}>
                  No clicks in the last 30 days (or listing_clicks table not created yet).
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
