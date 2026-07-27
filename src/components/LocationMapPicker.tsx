'use client'

import { useEffect, useRef } from 'react'

type Props = {
  lat: number | null
  lng: number | null
  onChange: (lat: number, lng: number) => void
  label: string
  hint: string
}

const DEFAULT_LAT = 12.5683
const DEFAULT_LNG = 99.9576
const ZOOM = 12

/**
 * Lightweight OpenStreetMap pin picker (Leaflet via CDN — no npm dependency).
 */
export default function LocationMapPicker({ lat, lng, onChange, label, hint }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<{
    map: { setView: (c: [number, number], z: number) => void; remove: () => void; on: Function }
    marker: { setLatLng: (c: [number, number]) => void }
  } | null>(null)

  useEffect(() => {
    let cancelled = false

    async function init() {
      if (!containerRef.current || mapRef.current) return

      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id = 'leaflet-css'
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js')
      if (cancelled || !containerRef.current) return

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = (window as any).L
      if (!L) return

      const startLat = lat ?? DEFAULT_LAT
      const startLng = lng ?? DEFAULT_LNG

      const map = L.map(containerRef.current).setView([startLat, startLng], ZOOM)
      // Carto Voyager: English place names (standard OSM tiles localize to Thai in Thailand)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(map)

      const marker = L.marker([startLat, startLng], { draggable: true }).addTo(map)

      map.on('click', (e: { latlng: { lat: number; lng: number } }) => {
        marker.setLatLng(e.latlng)
        onChange(Number(e.latlng.lat.toFixed(8)), Number(e.latlng.lng.toFixed(8)))
      })

      marker.on('dragend', () => {
        const pos = marker.getLatLng()
        onChange(Number(pos.lat.toFixed(8)), Number(pos.lng.toFixed(8)))
      })

      mapRef.current = { map, marker }

      // Ensure tiles render after layout
      setTimeout(() => map.invalidateSize(), 100)
    }

    void init()

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.map.remove()
        mapRef.current = null
      }
    }
    // intentionally mount-once; updates handled below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!mapRef.current || lat == null || lng == null) return
    mapRef.current.marker.setLatLng([lat, lng])
    mapRef.current.map.setView([lat, lng], ZOOM)
  }, [lat, lng])

  return (
    <div>
      <p className="block text-sm font-medium text-[#1A2744] mb-2">{label}</p>
      <p className="text-xs text-[#5C5247] mb-2">{hint}</p>
      <div
        ref={containerRef}
        className="h-[260px] w-full rounded-[12px] border border-[#E8E2D6] overflow-hidden z-0"
      />
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-[#5C5247]">
        <p>
          Lat: <span className="text-[#1A2744] font-medium">{lat ?? '—'}</span>
        </p>
        <p>
          Lng: <span className="text-[#1A2744] font-medium">{lng ?? '—'}</span>
        </p>
      </div>
    </div>
  )
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null
    if (existing) {
      if ((window as unknown as { L?: unknown }).L) {
        resolve()
        return
      }
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Failed to load Leaflet')), {
        once: true,
      })
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Leaflet'))
    document.head.appendChild(script)
  })
}
