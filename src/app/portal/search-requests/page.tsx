import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getProfile } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

type SearchRequestRow = {
  id: string
  description: string
  region: string | null
  budget: string | null
  created_at: string
}

const goldButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 44,
  padding: '0 16px',
  borderRadius: 10,
  background: '#C8973A',
  color: '#fff',
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 700,
} as const

export default async function PortalSearchRequestsPage() {
  const profile = await getProfile()
  if (!profile) {
    redirect('/portal/login')
  }

  let rows: SearchRequestRow[] = []
  let loadError: string | null = null

  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('search_requests')
      .select('id, description, region, budget, created_at')
      .eq('email', profile.email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[portal/search-requests]', error)
      loadError = error.message
    } else {
      rows = (data || []) as SearchRequestRow[]
    }
  } catch (error) {
    console.error('[portal/search-requests]', error)
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
            Zoekopdrachten
          </h1>
        </div>
        <Link href="/portal/search-requests/new" style={goldButtonStyle}>
          Nieuwe zoekopdracht
        </Link>
      </div>

      {loadError ? (
        <p style={{ color: '#B91C1C', marginBottom: 16 }}>Fout: {loadError}</p>
      ) : null}

      {rows.length === 0 && !loadError ? (
        <div
          style={{
            background: '#fff',
            border: '1px solid #E8E2D6',
            borderRadius: 14,
            padding: 32,
            textAlign: 'center',
          }}
        >
          <p style={{ margin: '0 0 16px', color: '#5C5247', fontSize: 15 }}>
            U heeft nog geen zoekopdrachten ingediend
          </p>
          <Link href="/portal/search-requests/new" style={goldButtonStyle}>
            Nieuwe zoekopdracht indienen
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {rows.map((row) => (
            <div
              key={row.id}
              style={{
                background: '#fff',
                border: '1px solid #E8E2D6',
                borderRadius: 12,
                padding: '16px 18px',
              }}
            >
              <p
                style={{
                  margin: '0 0 10px',
                  fontSize: 15,
                  color: '#1A2744',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {row.description || '—'}
              </p>
              <p style={{ margin: 0, fontSize: 13, color: '#5C5247' }}>
                {row.region || 'Geen regio'}
                {' · '}
                {row.budget || 'Geen budget'}
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
          ))}
        </div>
      )}
    </main>
  )
}
