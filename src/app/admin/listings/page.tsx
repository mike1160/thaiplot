import type { CSSProperties } from 'react'
import Link from 'next/link'
import { getProfile } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'
import { adminListingsUrl, adminSecretsMatch } from '@/lib/admin'
import AdminListingsTable, { type AdminListingRow } from '@/components/admin/AdminListingsTable'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams?: { secret?: string; flash?: string; user_id?: string; status?: string }
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

function tabStyle(active: boolean): CSSProperties {
  return {
    display: 'inline-block',
    padding: '8px 14px',
    borderRadius: 8,
    background: active ? '#1A2744' : '#fff',
    color: active ? '#fff' : '#1A2744',
    border: active ? '1px solid #1A2744' : '1px solid #E8E2D6',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 600,
    marginRight: 8,
    marginBottom: 8,
  }
}

export default async function AdminListingsPage({ searchParams }: Props) {
  const secret = searchParams?.secret || ''
  const userId = searchParams?.user_id || ''
  const statusFilter = (searchParams?.status || 'alle').toLowerCase()
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

  let listings: AdminListingRow[] = []
  let loadError: string | null = null
  let filterUserName: string | null = null

  try {
    const supabase = getSupabaseAdmin()
    let query = supabase
      .from('listings')
      .select(
        'id, name, email, location, property_type, status, created_at, price, region, user_id, slug, photo_1, photo_2, photo_3, photo_4, photo_5'
      )
      .order('created_at', { ascending: false })

    if (userId) {
      query = query.eq('user_id', userId)
      const { data: owner } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', userId)
        .maybeSingle()
      filterUserName = owner?.full_name || owner?.email || userId
    }

    if (['pending', 'approved', 'rejected'].includes(statusFilter)) {
      query = query.eq('status', statusFilter)
    }

    const { data, error } = await query

    if (error) {
      console.error('[admin/listings]', error)
      loadError = error.message
    } else {
      listings = (data || []) as AdminListingRow[]

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
  const qs = new URLSearchParams()
  if (secret) qs.set('secret', secret)
  if (userId) qs.set('user_id', userId)
  const baseQs = qs.toString()
  const withStatus = (status: string) => {
    const p = new URLSearchParams(qs)
    if (status !== 'alle') p.set('status', status)
    else p.delete('status')
    const s = p.toString()
    return s ? `?${s}` : ''
  }
  const secretQs = secret ? `?secret=${encodeURIComponent(secret)}` : ''
  const clearUserHref = (() => {
    const p = new URLSearchParams()
    if (secret) p.set('secret', secret)
    if (statusFilter !== 'alle') p.set('status', statusFilter)
    const s = p.toString()
    return `/admin/listings${s ? `?${s}` : ''}`
  })()

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
      {userId ? (
        <p style={{ color: '#5C5247', margin: '0 0 8px' }}>
          Listings van <strong>{filterUserName}</strong>{' '}
          <Link href={clearUserHref} style={{ color: '#C8973A', fontWeight: 600 }}>
            Toon alle listings
          </Link>
        </p>
      ) : null}
      <p style={{ color: '#5C5247', marginBottom: 16 }}>
        {listings.length} listings
        {loadError ? ` · Load error: ${loadError}` : ''}
      </p>

      <div style={{ marginBottom: 8 }}>
        <Link href={`/admin/listings${withStatus('alle')}`} style={tabStyle(statusFilter === 'alle')}>
          Alle
        </Link>
        <Link
          href={`/admin/listings${withStatus('pending')}`}
          style={tabStyle(statusFilter === 'pending')}
        >
          Pending
        </Link>
        <Link
          href={`/admin/listings${withStatus('approved')}`}
          style={tabStyle(statusFilter === 'approved')}
        >
          Approved
        </Link>
        <Link
          href={`/admin/listings${withStatus('rejected')}`}
          style={tabStyle(statusFilter === 'rejected')}
        >
          Rejected
        </Link>
      </div>

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

      <AdminListingsTable
        listings={listings}
        secretQs={secretQs}
        approveBase={`/api/listing-action?secret=${enc}`}
      />

      <p style={{ marginTop: 16, color: '#5C5247', fontSize: 13 }}>
        Bookmark:{' '}
        <code style={{ color: '#1A2744' }}>{adminListingsUrl(adminSecret)}</code>
        {baseQs ? ` · filter: ${baseQs}` : ''}
      </p>
    </div>
  )
}
