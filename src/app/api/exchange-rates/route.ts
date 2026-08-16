import { NextResponse } from 'next/server'
import { fetchExchangeRates } from '@/lib/home-widgets'

export const revalidate = 3600

export async function GET() {
  const data = await fetchExchangeRates()
  if (!data) {
    return NextResponse.json({ error: 'unavailable' }, { status: 503 })
  }
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  })
}
