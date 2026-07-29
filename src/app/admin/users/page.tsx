import { getProfile } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'
import { adminSecretsMatch } from '@/lib/admin'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams?: { secret?: string }
}

type ClientProfile = {
  id: string
  email: string
  full_name: string | null
  created_at: string
  listings_count: number
}

export default async function AdminUsersPage({ searchParams }: Props) {
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

  let users: ClientProfile[] = []
  let loadError: string | null = null

  try {
    const supabase = getSupabaseAdmin()
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, created_at, role')
      .eq('role', 'client')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[admin/users]', error)
      loadError = error.message
    } else {
      const rows = profiles || []
      const ids = rows.map((p: { id: string }) => p.id)

      const countByUser = new Map<string, number>()
      if (ids.length) {
        const { data: listings } = await supabase
          .from('listings')
          .select('user_id')
          .in('user_id', ids)

        for (const l of listings || []) {
          if (!l.user_id) continue
          countByUser.set(l.user_id, (countByUser.get(l.user_id) || 0) + 1)
        }
      }

      users = rows.map((p: { id: string; email: string; full_name: string | null; created_at: string }) => ({
        id: p.id,
        email: p.email,
        full_name: p.full_name,
        created_at: p.created_at,
        listings_count: countByUser.get(p.id) || 0,
      }))
    }
  } catch (error) {
    console.error('[admin/users]', error)
    loadError = error instanceof Error ? error.message : 'Failed to load users'
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#1A2744', maxWidth: 1000, margin: '0 auto' }}>
      <h1
        style={{
          fontFamily: 'Playfair Display, serif',
          margin: '0 0 8px',
          fontSize: 32,
        }}
      >
        Portal-gebruikers
      </h1>
      <p style={{ color: '#5C5247', marginBottom: 16 }}>
        {users.length} clients
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
              <th style={{ padding: 12 }}>Name</th>
              <th style={{ padding: 12 }}>Email</th>
              <th style={{ padding: 12 }}>Registered</th>
              <th style={{ padding: 12 }}>Listings</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderTop: '1px solid #E8E2D6' }}>
                <td style={{ padding: 12 }}>{u.full_name || '—'}</td>
                <td style={{ padding: 12 }}>
                  {u.email ? (
                    <a href={`mailto:${u.email}`} style={{ color: '#C8973A' }}>
                      {u.email}
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td style={{ padding: 12, whiteSpace: 'nowrap', color: '#5C5247' }}>
                  {u.created_at
                    ? new Date(u.created_at).toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '—'}
                </td>
                <td style={{ padding: 12 }}>{u.listings_count}</td>
              </tr>
            ))}
            {users.length === 0 && !loadError && (
              <tr>
                <td colSpan={4} style={{ padding: 24, textAlign: 'center', color: '#5C5247' }}>
                  Geen client-accounts gevonden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
