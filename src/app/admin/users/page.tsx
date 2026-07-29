import { getProfile } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'
import { adminSecretsMatch } from '@/lib/admin'
import AdminUsersClient, { type AdminUserRow } from '@/components/admin/AdminUsersClient'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams?: { secret?: string }
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

  let users: AdminUserRow[] = []
  let loadError: string | null = null

  try {
    const supabase = getSupabaseAdmin()
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, created_at, role, disabled')
      .eq('role', 'client')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[admin/users]', error)
      loadError = error.message
    } else {
      const rows = (profiles || []).map((p) => ({
        id: p.id as string,
        email: p.email as string,
        full_name: (p.full_name as string | null) ?? null,
        created_at: p.created_at as string,
        disabled: Boolean((p as { disabled?: boolean }).disabled),
      }))

      const ids = rows.map((p) => p.id)
      const countByUser = new Map<string, number>()
      const lastLoginById = new Map<string, string | null>()

      if (ids.length) {
        const { data: listings } = await supabase
          .from('listings')
          .select('user_id')
          .in('user_id', ids)
        for (const l of listings || []) {
          if (!l.user_id) continue
          countByUser.set(l.user_id, (countByUser.get(l.user_id) || 0) + 1)
        }

        try {
          const { data: listData } = await supabase.auth.admin.listUsers({
            page: 1,
            perPage: 1000,
          })
          for (const u of listData?.users || []) {
            if (ids.includes(u.id)) {
              lastLoginById.set(u.id, u.last_sign_in_at || null)
            }
          }
        } catch (e) {
          console.error('[admin/users] last login', e)
        }
      }

      users = rows.map((p) => ({
        ...p,
        listings_count: countByUser.get(p.id) || 0,
        last_sign_in_at: lastLoginById.get(p.id) || null,
      }))
    }
  } catch (error) {
    console.error('[admin/users]', error)
    loadError = error instanceof Error ? error.message : 'Failed to load users'
  }

  return <AdminUsersClient initialUsers={users} loadError={loadError} />
}
