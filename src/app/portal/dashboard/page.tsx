import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getProfile } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function PortalDashboardPage() {
  const profile = await getProfile()
  if (!profile) {
    redirect('/portal/login')
  }

  const supabase = getSupabaseAdmin()

  const [{ count: listingsCount }, { count: searchCount }] = await Promise.all([
    supabase
      .from('listings')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', profile.id),
    supabase
      .from('search_requests')
      .select('id', { count: 'exact', head: true })
      .eq('email', profile.email),
  ])

  const name = profile.full_name || profile.email

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px 48px' }}>
      <p
        style={{
          color: '#C8973A',
          fontWeight: 600,
          margin: '0 0 8px',
          letterSpacing: '0.04em',
          fontSize: 12,
        }}
      >
        DASHBOARD
      </p>
      <h1
        style={{
          fontFamily: 'Playfair Display, serif',
          margin: '0 0 28px',
          fontSize: 32,
          color: '#1A2744',
        }}
      >
        Welkom, {name}
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
        }}
      >
        <Link
          href="/portal/listings"
          style={{
            display: 'block',
            background: '#fff',
            border: '1px solid #E8E2D6',
            borderRadius: 14,
            padding: '24px 22px',
            textDecoration: 'none',
            color: 'inherit',
            boxShadow: '0 4px 16px rgba(26, 39, 68, 0.05)',
          }}
        >
          <p style={{ margin: '0 0 8px', color: '#C8973A', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em' }}>
            MIJN AANBOD
          </p>
          <p style={{ margin: '0 0 4px', fontSize: 36, fontWeight: 700, color: '#1A2744', fontFamily: 'Playfair Display, serif' }}>
            {listingsCount ?? 0}
          </p>
          <p style={{ margin: 0, fontSize: 14, color: '#5C5247' }}>Bekijk en beheer uw listings →</p>
        </Link>

        <Link
          href="/portal/search-requests"
          style={{
            display: 'block',
            background: '#fff',
            border: '1px solid #E8E2D6',
            borderRadius: 14,
            padding: '24px 22px',
            textDecoration: 'none',
            color: 'inherit',
            boxShadow: '0 4px 16px rgba(26, 39, 68, 0.05)',
          }}
        >
          <p style={{ margin: '0 0 8px', color: '#C8973A', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em' }}>
            MIJN ZOEKOPDRACHTEN
          </p>
          <p style={{ margin: '0 0 4px', fontSize: 36, fontWeight: 700, color: '#1A2744', fontFamily: 'Playfair Display, serif' }}>
            {searchCount ?? 0}
          </p>
          <p style={{ margin: 0, fontSize: 14, color: '#5C5247' }}>Bekijk uw zoekopdrachten →</p>
        </Link>
      </div>
    </main>
  )
}
