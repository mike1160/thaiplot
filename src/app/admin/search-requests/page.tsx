import { getProfile } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'
import { adminSecretsMatch } from '@/lib/admin'
import AdminSearchRequestsClient, {
  type SearchRequestRow,
} from '@/components/admin/AdminSearchRequestsClient'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams?: { secret?: string }
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
  let profiles: Array<{ email: string; full_name: string | null }> = []
  let loadError: string | null = null

  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('search_requests')
      .select('id, name, email, description, region, budget, locale, created_at, status')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[admin/search-requests]', error)
      loadError = error.message
    } else {
      rows = (data || []) as SearchRequestRow[]
    }

    const { data: profileRows } = await supabase
      .from('profiles')
      .select('email, full_name')

    profiles = (profileRows || []) as Array<{ email: string; full_name: string | null }>
  } catch (error) {
    console.error('[admin/search-requests]', error)
    loadError = error instanceof Error ? error.message : 'Failed to load'
  }

  return (
    <AdminSearchRequestsClient initialRows={rows} profiles={profiles} loadError={loadError} />
  )
}
