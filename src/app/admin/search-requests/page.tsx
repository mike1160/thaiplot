import { getProfile } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'
import { adminSecretsMatch } from '@/lib/admin'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams?: { secret?: string }
}

type SearchRequestRow = {
  id: string
  name: string
  email: string
  description: string
  region: string | null
  budget: string | null
  locale: string | null
  created_at: string
}

export default async function AdminSearchRequestsPage({ searchParams }: Props) {
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

  let rows: SearchRequestRow[] = []
  let loadError: string | null = null

  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('search_requests')
      .select('id, name, email, description, region, budget, locale, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[admin/search-requests]', error)
      loadError = error.message
    } else {
      rows = (data || []) as SearchRequestRow[]
    }
  } catch (error) {
    console.error('[admin/search-requests]', error)
    loadError = error instanceof Error ? error.message : 'Failed to load search requests'
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#1A2744', maxWidth: 1200, margin: '0 auto' }}>
      <h1
        style={{
          fontFamily: 'Playfair Display, serif',
          margin: '0 0 8px',
          fontSize: 32,
        }}
      >
        ThaiPlot — Search Requests
      </h1>
      <p style={{ color: '#5C5247', marginBottom: 16 }}>
        {rows.length} total requests
        {loadError ? ` · Load error: ${loadError}` : ''}
      </p>

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
              <th style={{ padding: 12 }}>Date</th>
              <th style={{ padding: 12 }}>Name</th>
              <th style={{ padding: 12 }}>Email</th>
              <th style={{ padding: 12 }}>Description</th>
              <th style={{ padding: 12 }}>Region</th>
              <th style={{ padding: 12 }}>Budget</th>
              <th style={{ padding: 12 }}>Locale</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} style={{ borderTop: '1px solid #E8E2D6' }}>
                <td style={{ padding: 12, whiteSpace: 'nowrap', color: '#5C5247' }}>
                  {row.created_at ? new Date(row.created_at).toLocaleString() : '—'}
                </td>
                <td style={{ padding: 12 }}>{row.name || '—'}</td>
                <td style={{ padding: 12 }}>
                  {row.email ? (
                    <a href={`mailto:${row.email}`} style={{ color: '#C8973A' }}>
                      {row.email}
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td style={{ padding: 12, maxWidth: 320, whiteSpace: 'pre-wrap' }}>
                  {row.description || '—'}
                </td>
                <td style={{ padding: 12 }}>{row.region || '—'}</td>
                <td style={{ padding: 12 }}>{row.budget || '—'}</td>
                <td style={{ padding: 12 }}>{row.locale || '—'}</td>
              </tr>
            ))}
            {rows.length === 0 && !loadError && (
              <tr>
                <td
                  colSpan={7}
                  style={{ padding: 24, textAlign: 'center', color: '#5C5247' }}
                >
                  No search requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
