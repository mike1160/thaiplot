'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'

export type SearchRequestRow = {
  id: string
  name: string
  email: string
  description: string
  region: string | null
  budget: string | null
  locale: string | null
  created_at: string
  status: string | null
}

type ProfileLite = {
  email: string
  full_name: string | null
}

type Props = {
  initialRows: SearchRequestRow[]
  profiles: ProfileLite[]
  loadError?: string | null
}

function statusBadge(status: string | null) {
  const value = (status || 'nieuw').toLowerCase()
  const behandeld = value === 'behandeld'
  return {
    label: behandeld ? 'behandeld' : 'nieuw',
    bg: behandeld ? '#DCFCE7' : '#FEF3C7',
    color: behandeld ? '#166534' : '#92400E',
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
    fontSize: 13,
    fontWeight: 600,
    marginRight: 8,
    cursor: 'pointer',
  }
}

export default function AdminSearchRequestsClient({
  initialRows,
  profiles,
  loadError,
}: Props) {
  const router = useRouter()
  const [filter, setFilter] = useState<'alle' | 'nieuw' | 'behandeld'>('alle')
  const [rows, setRows] = useState(initialRows)
  const [busyId, setBusyId] = useState<string | null>(null)

  const nameByEmail = useMemo(() => {
    const map = new Map<string, string | null>()
    for (const p of profiles) {
      if (p.email) map.set(p.email.toLowerCase(), p.full_name)
    }
    return map
  }, [profiles])

  const filtered = useMemo(() => {
    if (filter === 'alle') return rows
    return rows.filter((r) => (r.status || 'nieuw').toLowerCase() === filter)
  }, [rows, filter])

  async function markHandled(id: string) {
    setBusyId(id)
    try {
      const res = await fetch('/api/admin/search-request-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'behandeld' }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        alert((data as { error?: string }).error || 'Mislukt')
        setBusyId(null)
        return
      }
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'behandeld' } : r)))
      router.refresh()
    } catch {
      alert('Mislukt')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#1A2744', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', margin: '0 0 8px', fontSize: 32 }}>
        ThaiPlot — Search Requests
      </h1>
      <p style={{ color: '#5C5247', marginBottom: 16 }}>
        {filtered.length} requests
        {loadError ? ` · Load error: ${loadError}` : ''}
      </p>

      <div style={{ marginBottom: 16 }}>
        <button type="button" onClick={() => setFilter('alle')} style={tabStyle(filter === 'alle')}>
          Alle
        </button>
        <button type="button" onClick={() => setFilter('nieuw')} style={tabStyle(filter === 'nieuw')}>
          Nieuw
        </button>
        <button
          type="button"
          onClick={() => setFilter('behandeld')}
          style={tabStyle(filter === 'behandeld')}
        >
          Behandeld
        </button>
      </div>

      <div
        style={{
          overflowX: 'auto',
          background: '#fff',
          border: '1px solid #E8E2D6',
          borderRadius: 12,
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: '#1A2744', color: '#fff' }}>
              <th style={{ padding: 12 }}>Date</th>
              <th style={{ padding: 12 }}>Name</th>
              <th style={{ padding: 12 }}>Email / User</th>
              <th style={{ padding: 12 }}>Description</th>
              <th style={{ padding: 12 }}>Region</th>
              <th style={{ padding: 12 }}>Budget</th>
              <th style={{ padding: 12 }}>Status</th>
              <th style={{ padding: 12 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => {
              const badge = statusBadge(row.status)
              const profileName = row.email
                ? nameByEmail.get(row.email.toLowerCase()) || null
                : null
              return (
                <tr key={row.id} style={{ borderTop: '1px solid #E8E2D6' }}>
                  <td style={{ padding: 12, whiteSpace: 'nowrap', color: '#5C5247', fontSize: 13 }}>
                    {row.created_at ? new Date(row.created_at).toLocaleString() : '—'}
                  </td>
                  <td style={{ padding: 12 }}>{row.name || '—'}</td>
                  <td style={{ padding: 12 }}>
                    {row.email ? (
                      <a href={`mailto:${row.email}`} style={{ color: '#C8973A' }}>
                        {row.email}
                      </a>
                    ) : (
                      '—'
                    )}
                    {profileName ? (
                      <div style={{ fontSize: 12, color: '#5C5247', marginTop: 4 }}>{profileName}</div>
                    ) : null}
                  </td>
                  <td style={{ padding: 12, maxWidth: 280, whiteSpace: 'pre-wrap', fontSize: 13 }}>
                    {row.description || '—'}
                  </td>
                  <td style={{ padding: 12 }}>{row.region || '—'}</td>
                  <td style={{ padding: 12 }}>{row.budget || '—'}</td>
                  <td style={{ padding: 12 }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: 999,
                        background: badge.bg,
                        color: badge.color,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    {badge.label === 'nieuw' ? (
                      <button
                        type="button"
                        onClick={() => markHandled(row.id)}
                        disabled={busyId === row.id}
                        style={{
                          border: 'none',
                          borderRadius: 8,
                          padding: '6px 10px',
                          background: busyId === row.id ? '#9a7d1e' : '#C8973A',
                          color: '#fff',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: busyId === row.id ? 'wait' : 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {busyId === row.id ? 'Bezig…' : 'Markeer als behandeld'}
                      </button>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: 24, textAlign: 'center', color: '#5C5247' }}>
                  No search requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
