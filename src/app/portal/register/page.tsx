'use client'

import { FormEvent, useState, type CSSProperties } from 'react'
import Link from 'next/link'
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

export default function PortalRegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Wachtwoorden komen niet overeen')
      return
    }

    if (password.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens zijn')
      return
    }

    setLoading(true)

    try {
      const supabase = getSupabaseBrowser()
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() },
        },
      })

      if (signUpError) {
        setError(signUpError.message || 'Registratie mislukt')
        setLoading(false)
        return
      }

      setSuccess(true)
      setLoading(false)
    } catch {
      setError('Registratie mislukt')
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
          Maak een account aan om uw aanbod te beheren.
        </p>

        {success ? (
          <p
            style={{
              margin: 0,
              padding: '14px 16px',
              borderRadius: 8,
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              color: '#166534',
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            Check uw e-mail om uw account te bevestigen
          </p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
            <div>
              <label htmlFor="reg-name" style={labelStyle}>
                Volledige naam
              </label>
              <input
                id="reg-name"
                type="text"
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="reg-email" style={labelStyle}>
                E-mail
              </label>
              <input
                id="reg-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="reg-password" style={labelStyle}>
                Wachtwoord
              </label>
              <input
                id="reg-password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="reg-confirm" style={labelStyle}>
                Bevestig wachtwoord
              </label>
              <input
                id="reg-confirm"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Bezig…' : 'Account aanmaken'}
            </button>
          </form>
        )}

        <p style={{ margin: '20px 0 0', fontSize: 13, color: '#5C5247', textAlign: 'center' }}>
          Al een account?{' '}
          <Link href="/portal/login" style={{ color: '#C8973A', fontWeight: 600 }}>
            Inloggen
          </Link>
        </p>
      </div>
    </main>
  )
}
