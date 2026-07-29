'use client'

import { useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'

export type AdminUserRow = {
  id: string
  email: string
  full_name: string | null
  created_at: string
  disabled: boolean
  listings_count: number
  last_sign_in_at: string | null
}

type Props = {
  initialUsers: AdminUserRow[]
  loadError?: string | null
}

export default function AdminUsersClient({ initialUsers, loadError }: Props) {
  const router = useRouter()
  const [users, setUsers] = useState(initialUsers)
  const [busy, setBusy] = useState<string | null>(null)
  const [resetMsg, setResetMsg] = useState<Record<string, string>>({})

  async function resetPassword(email: string, id: string) {
    setBusy(`reset-${id}`)
    setResetMsg((m) => ({ ...m, [id]: '' }))
    try {
      const res = await fetch('/api/admin/reset-user-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setResetMsg((m) => ({
          ...m,
          [id]: (data as { error?: string }).error || 'Reset mislukt',
        }))
      } else {
        setResetMsg((m) => ({ ...m, [id]: 'Reset mail verstuurd!' }))
      }
    } catch {
      setResetMsg((m) => ({ ...m, [id]: 'Reset mislukt' }))
    } finally {
      setBusy(null)
    }
  }

  async function toggleDisabled(id: string, currentlyDisabled: boolean) {
    setBusy(`toggle-${id}`)
    try {
      const res = await fetch('/api/admin/toggle-user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, disabled: !currentlyDisabled }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        alert((data as { error?: string }).error || 'Mislukt')
        setBusy(null)
        return
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, disabled: !currentlyDisabled } : u))
      )
      router.refresh()
    } catch {
      alert('Mislukt')
    } finally {
      setBusy(null)
    }
  }

  const btn = (bg: string): CSSProperties => ({
    display: 'inline-block',
    marginRight: 6,
    marginBottom: 4,
    padding: '6px 10px',
    borderRadius: 8,
    border: 'none',
    background: bg,
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
  })

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#1A2744', maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', margin: '0 0 8px', fontSize: 32 }}>
        Portal-gebruikers
      </h1>
      <p style={{ color: '#5C5247', marginBottom: 16 }}>
        {users.length} clients
        {loadError ? ` · Load error: ${loadError}` : ''}
      </p>

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
              <th style={{ padding: 12 }}>Name</th>
              <th style={{ padding: 12 }}>Email</th>
              <th style={{ padding: 12 }}>Registered</th>
              <th style={{ padding: 12 }}>Last login</th>
              <th style={{ padding: 12 }}>Listings</th>
              <th style={{ padding: 12 }}>Status</th>
              <th style={{ padding: 12 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                style={{
                  borderTop: '1px solid #E8E2D6',
                  opacity: u.disabled ? 0.55 : 1,
                  background: u.disabled ? '#F5F5F5' : undefined,
                }}
              >
                <td style={{ padding: 12 }}>{u.full_name || '—'}</td>
                <td style={{ padding: 12 }}>
                  {u.email ? (
                    <a href={`mailto:${u.email}`} style={{ color: '#C8973A' }}>
                      {u.email}
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td style={{ padding: 12, whiteSpace: 'nowrap', color: '#5C5247', fontSize: 13 }}>
                  {u.created_at
                    ? new Date(u.created_at).toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '—'}
                </td>
                <td style={{ padding: 12, whiteSpace: 'nowrap', color: '#5C5247', fontSize: 13 }}>
                  {u.last_sign_in_at
                    ? new Date(u.last_sign_in_at).toLocaleString('nl-NL')
                    : '—'}
                </td>
                <td style={{ padding: 12 }}>{u.listings_count}</td>
                <td style={{ padding: 12 }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: 999,
                      background: u.disabled ? '#FEE2E2' : '#DCFCE7',
                      color: u.disabled ? '#991B1B' : '#166534',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {u.disabled ? 'disabled' : 'active'}
                  </span>
                </td>
                <td style={{ padding: 12 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
                    <a href={`/admin/listings?user_id=${u.id}`} style={btn('#1A2744')}>
                      Bekijk listings
                    </a>
                    <button
                      type="button"
                      onClick={() => resetPassword(u.email, u.id)}
                      disabled={busy === `reset-${u.id}`}
                      style={btn('#C8973A')}
                    >
                      {busy === `reset-${u.id}` ? 'Bezig…' : 'Wachtwoord reset sturen'}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleDisabled(u.id, u.disabled)}
                      disabled={busy === `toggle-${u.id}`}
                      style={btn(u.disabled ? '#16a34a' : '#dc2626')}
                    >
                      {busy === `toggle-${u.id}`
                        ? 'Bezig…'
                        : u.disabled
                          ? 'Activeren'
                          : 'Deactiveren'}
                    </button>
                  </div>
                  {resetMsg[u.id] ? (
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        color: resetMsg[u.id].includes('verstuurd') ? '#166534' : '#B91C1C',
                        fontWeight: 600,
                      }}
                    >
                      {resetMsg[u.id]}
                    </p>
                  ) : null}
                </td>
              </tr>
            ))}
            {users.length === 0 && !loadError && (
              <tr>
                <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: '#5C5247' }}>
                  Geen client-accounts gevonden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
