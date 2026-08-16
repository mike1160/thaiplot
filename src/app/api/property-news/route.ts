import { NextResponse } from 'next/server'
import { fetchPropertyNews } from '@/lib/home-widgets'

export const revalidate = 1800

export async function GET() {
  const items = await fetchPropertyNews()
  return NextResponse.json(
    { items },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    }
  )
}
