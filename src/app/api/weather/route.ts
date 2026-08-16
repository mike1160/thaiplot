import { NextResponse } from 'next/server'
import { fetchThailandWeather } from '@/lib/home-widgets'

export const revalidate = 3600

export async function GET() {
  const cities = await fetchThailandWeather()
  return NextResponse.json(
    { cities },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    }
  )
}
