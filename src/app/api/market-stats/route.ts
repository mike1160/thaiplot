import { NextResponse } from 'next/server'
import { fetchMarketStats } from '@/lib/home-widgets'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const stats = await fetchMarketStats()
  return NextResponse.json(stats, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
