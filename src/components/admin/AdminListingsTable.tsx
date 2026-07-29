'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'

export type AdminListingRow = {
  id: string
  name: string | null
  email: string | null
  location: string | null
  property_type: string | null
  status: string
  created_at: string
  price: string | null
  region: string | null
  user_id?: string | null
  slug?: string | null
  photo_1?: string | null
  photo_2?: string | null
  photo_3?: string | null
  photo_4?: string | null
  photo_5?: string | null
  owner_name?: string | null
}

type Props = {
  listings: AdminListingRow[]
  secretQs: string
  approveBase: string
}

function statusColor(status: string) {
  if (status === 'approved') return '#16a34a'
  if (status === 'rejected') return '#dc2626'
  return '#C8973A'
}

function actionButtonStyle(bg: string): CSSProperties {
  return {
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    marginBottom: 4,
    padding: '6px 10px',
    borderRadius: 8,
    background: bg,
    color: '#fff',
    textDecoration: 'none',
    fontSize: 12,
    fontWeight: 600,
    textAlign: 'center',
  }
}

function photoCount(row: AdminListingRow) {
  return [row.photo_1, row.photo_2, row.photo_3, row.photo_4, row.photo_5].filter(Boolean).length
}

export default function AdminListingsTable({ listings, secretQs, approveBase }: Props) {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return listings
    return listings.filter((row) => {
      const hay = `${row.name || ''} ${row.location || ''} ${row.region || ''}`.toLowerCase()
      return hay.includes(needle)
    })
  }, [listings, q])

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Zoek op naam of locatie…"
          style={{
            width: '100%',
            maxWidth: 360,
            borderRadius: 10,
            border: '1px solid #E8E2D6',
            padding: '10px 12px',
            fontSize: 14,
            color: '#1A2744',
          }}
        />
      </div>

      <div
        className="admin-listings-scroll"
        style={{
          background: '#fff',
          border: '1px solid #E8E2D6',
          borderRadius: 12,
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: '#1A2744', color: '#fff' }}>
              <th style={{ padding: '10px 8px', fontSize: 12 }}>Name</th>
              <th style={{ padding: '10px 8px', fontSize: 12, width: '18%' }}>Location</th>
              <th style={{ padding: '10px 8px', fontSize: 12 }}>Type</th>
              <th style={{ padding: '10px 8px', fontSize: 12 }}>Price</th>
              <th style={{ padding: '10px 8px', fontSize: 12 }}>Region</th>
              <th style={{ padding: '10px 8px', fontSize: 12 }}>Owner</th>
              <th style={{ padding: '10px 8px', fontSize: 12, width: 52 }}>Photos</th>
              <th style={{ padding: '10px 8px', fontSize: 12 }}>Status</th>
              <th style={{ padding: '10px 8px', fontSize: 12 }}>Created</th>
              <th style={{ padding: '10px 8px', fontSize: 12, width: 100 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} style={{ borderTop: '1px solid #E8E2D6' }}>
                <td style={{ padding: '10px 8px', fontSize: 13, wordBreak: 'break-word' }}>
                  {row.name || '—'}
                </td>
                <td
                  title={row.location || undefined}
                  style={{
                    padding: '10px 8px',
                    fontSize: 13,
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row.location || '—'}
                </td>
                <td style={{ padding: '10px 8px', fontSize: 13 }}>{row.property_type || '—'}</td>
                <td style={{ padding: '10px 8px', fontSize: 13, wordBreak: 'break-word' }}>
                  {row.price || '—'}
                </td>
                <td style={{ padding: '10px 8px', fontSize: 13 }}>{row.region || '—'}</td>
                <td style={{ padding: '10px 8px', fontSize: 13 }}>{row.owner_name || 'Onbekend'}</td>
                <td style={{ padding: '10px 8px', fontSize: 13 }}>{photoCount(row)}</td>
                <td
                  style={{
                    padding: '10px 8px',
                    fontSize: 12,
                    color: statusColor(row.status),
                    fontWeight: 600,
                    textTransform: 'capitalize',
                  }}
                >
                  {row.status}
                </td>
                <td style={{ padding: '10px 8px', fontSize: 12, color: '#5C5247' }}>
                  {row.created_at
                    ? new Date(row.created_at).toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '—'}
                </td>
                <td style={{ padding: '10px 8px', verticalAlign: 'top' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0, minWidth: 88 }}>
                    <Link
                      href={`/admin/listings/${row.id}${secretQs}`}
                      style={actionButtonStyle('#1A2744')}
                    >
                      Detail
                    </Link>
                    <a
                      href={`${approveBase}&id=${row.id}&action=approve`}
                      style={actionButtonStyle('#16a34a')}
                    >
                      Approve
                    </a>
                    <a
                      href={`${approveBase}&id=${row.id}&action=reject`}
                      style={actionButtonStyle('#C8973A')}
                    >
                      Reject
                    </a>
                    <a
                      href={`${approveBase}&id=${row.id}&action=delete`}
                      style={actionButtonStyle('#dc2626')}
                    >
                      Delete
                    </a>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} style={{ padding: 24, textAlign: 'center', color: '#5C5247' }}>
                  No listings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-listings-scroll {
            overflow-x: auto;
          }
          .admin-listings-scroll table {
            min-width: 860px;
            table-layout: auto !important;
          }
        }
      `}</style>
    </>
  )
}
