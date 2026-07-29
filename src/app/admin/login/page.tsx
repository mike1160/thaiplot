'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase-browser'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)

    const formData = new FormData(e.currentTarget)
    const emailValue = String(formData.get('email') || email).trim()
    const passwordValue = String(formData.get('password') || password)

    if (!emailValue || !passwordValue) {
      setError('Vul uw e-mail en wachtwoord in')
      return
    }

    setError('')
    setLoading(true)

    try {
      const supabase = getSupabaseBrowser()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: emailValue,
        password: passwordValue,
      })

      if (signInError) {
        setError(signInError.message || 'Login failed')
        setLoading(false)
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('Login failed')
        setLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        await supabase.auth.signOut()
        setError('This account is not an admin.')
        setLoading(false)
        return
      }

      router.replace('/admin/listings')
      router.refresh()
    } catch {
      setError('Login failed')
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
          ADMIN
        </p>
        <h1
          style={{
            fontFamily: 'Playfair Display, serif',
            margin: '0 0 8px',
            fontSize: 28,
          }}
        >
          ThaiPlot
        </h1>
        <p style={{ color: '#5C5247', margin: '0 0 28px', fontSize: 14 }}>
          Log in to manage listings and search requests.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }} noValidate>
          <div>
            <label
              htmlFor="admin-email"
              style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}
            >
              Email
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              style={{
                width: '100%',
                borderRadius: 12,
                border: '1px solid #E8E2D6',
                padding: '12px 14px',
                fontSize: 14,
                color: '#1A2744',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}
            >
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              style={{
                width: '100%',
                borderRadius: 12,
                border: '1px solid #E8E2D6',
                padding: '12px 14px',
                fontSize: 14,
                color: '#1A2744',
                outline: 'none',
              }}
            />
          </div>

          {submitted && error ? (
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
      </div>
    </main>
  )
}
