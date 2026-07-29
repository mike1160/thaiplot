import Link from 'next/link'
import { getProfile } from '@/lib/auth'
import { getSupabaseAdmin, type ListingRow } from '@/lib/supabase'
import { adminSecretsMatch } from '@/lib/admin'
import { absoluteAssetUrl } from '@/lib/seo'
import AdminListingDetailClient from '@/components/admin/AdminListingDetailClient'

export const dynamic = 'force-dynamic'

type Props = {
  params: { id: string }
  searchParams?: { secret?: string }
}

function photoUrl(raw: string | null | undefined): string | null {
  if (!raw) return null
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  try {
    return absoluteAssetUrl(raw)
  } catch {
    return raw
  }
}

export default async function AdminListingDetailPage({ params, searchParams }: Props) {
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

  const supabase = getSupabaseAdmin()
  const { data: listing, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', params.id)
    .maybeSingle()

  if (error || !listing) {
    return (
      <main style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#1A2744' }}>
        <p>Listing not found.</p>
        <Link href={`/admin/listings${secret ? `?secret=${encodeURIComponent(secret)}` : ''}`}>
          ← Terug naar listings
        </Link>
      </main>
    )
  }

  const row = listing as ListingRow
  let ownerName: string | null = null
  let ownerEmail: string | null = null

  if (row.user_id) {
    const { data: owner } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', row.user_id)
      .maybeSingle()
    ownerName = owner?.full_name || null
    ownerEmail = owner?.email || null
  }

  const enc = encodeURIComponent(adminSecret)
  const secretQs = secret ? `?secret=${encodeURIComponent(secret)}` : ''
  const publicPath = `/en/listings/${(row.slug || '').trim() || row.id}`
  const photos = [row.photo_1, row.photo_2, row.photo_3, row.photo_4, row.photo_5]
    .map(photoUrl)
    .filter(Boolean) as string[]

  return (
    <AdminListingDetailClient
      listing={{
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        location: row.location,
        region: row.region,
        price: row.price,
        description: row.description,
        property_type: row.property_type,
        category: row.category,
        status: row.status,
        created_at: row.created_at,
        approved_at: row.approved_at,
        slug: row.slug ?? null,
        line_id: row.line_id ?? null,
        whatsapp: row.whatsapp ?? null,
        contact_preferences: row.contact_preferences ?? null,
        user_id: row.user_id ?? null,
        photo_1: row.photo_1,
        photo_2: row.photo_2,
        photo_3: row.photo_3,
        photo_4: row.photo_4,
        photo_5: row.photo_5,
      }}
      ownerName={ownerName}
      ownerEmail={ownerEmail}
      photos={photos}
      secretQs={secretQs}
      approveUrl={`/api/listing-action?id=${row.id}&action=approve&secret=${enc}`}
      rejectUrl={`/api/listing-action?id=${row.id}&action=reject&secret=${enc}`}
      deleteUrl={`/api/listing-action?id=${row.id}&action=delete&secret=${enc}`}
      publicPath={publicPath}
    />
  )
}
