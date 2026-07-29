'use client'

import { FormEvent, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase-browser'

const inputStyle: CSSProperties = {
  width: '100%',
  borderRadius: 12,
  border: '1px solid #E8E2D6',
  padding: '12px 14px',
  fontSize: 14,
  color: '#1A2744',
  outline: 'none',
}

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 6,
  color: '#1A2744',
}

export default function PortalLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = getSupabaseBrowser()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        setError(signInError.message || 'Inloggen mislukt')
        setLoading(false)
        return
      }

      router.replace('/portal/dashboard')
      router.refresh()
    } catch {
      setError('Inloggen mislukt')
      setLoading(false)
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#FAF7F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#1A2744',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#fff',
          border: '1px solid #E8E2D6',
          borderRadius: 16,
          padding: '36px 32px',
          boxShadow: '0 8px 32px rgba(26, 39, 68, 0.08)',
        }}
      >
        <p
          style={{
            color: '#C8973A',
            fontWeight: 600,
            margin: '0 0 8px',
            letterSpacing: '0.06em',
            fontSize: 12,
          }}
        >
          PORTAL
        </p>
        <h1
          style={{
            fontFamily: 'Playfair Display, serif',
            margin: '0 0 8px',
            fontSize: 28,
            color: '#1A2744',
          }}
        >
          ThaiPlot
        </h1>
        <p style={{ color: '#5C5247', margin: '0 0 28px', fontSize: 14 }}>
          Log in om uw aanbod en zoekopdrachten te bekijken.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div>
            <label htmlFor="portal-email" style={labelStyle}>
              E-mail
            </label>
            <input
              id="portal-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="portal-password" style={labelStyle}>
              Wachtwoord
            </label>
            <input
              id="portal-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          {error ? (
            <p
              style={{
                margin: 0,
                padding: '10px 12px',
                borderRadius: 8,
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#B91C1C',
                fontSize: 13,
              }}
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4,
              minHeight: 48,
              borderRadius: 12,
              border: 'none',
              background: loading ? '#9a7d1e' : '#C8973A',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              cursor: loading ? 'wait' : 'pointer',
            }}
          >
            {loading ? 'Bezig…' : 'Inloggen'}
          </button>
        </form>

        <p style={{ margin: '20px 0 0', fontSize: 13, color: '#5C5247', textAlign: 'center' }}>
          <Link href="/portal/register" style={{ color: '#C8973A', fontWeight: 600 }}>
            Account aanmaken
          </Link>
          {' · '}
          <Link href="/portal/reset-password" style={{ color: '#C8973A', fontWeight: 600 }}>
            Wachtwoord vergeten?
          </Link>
        </p>
      </div>
    </main>
  )
}
