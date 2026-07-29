'use client'

import { FormEvent, useEffect, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase-browser'

const REGIONS = [
  { value: '', label: "Alle regio's" },
  { value: 'Bangkok', label: 'Bangkok' },
  { value: 'Chiang Mai', label: 'Chiang Mai' },
  { value: 'Phuket', label: 'Phuket' },
  { value: 'Koh Samui', label: 'Koh Samui' },
  { value: 'Pattaya', label: 'Pattaya' },
  { value: 'Hua Hin', label: 'Hua Hin' },
  { value: 'Chiang Rai', label: 'Chiang Rai' },
  { value: 'Pranburi', label: 'Pranburi' },
  { value: 'Other', label: 'Other' },
] as const

const BUDGETS = [
  { value: '', label: 'Geen voorkeur' },
  { value: 'Onder ฿1M', label: 'Onder ฿1M' },
  { value: '฿1M–5M', label: '฿1M–5M' },
  { value: '฿5M–15M', label: '฿5M–15M' },
  { value: '฿15M–50M', label: '฿15M–50M' },
  { value: 'Boven ฿50M', label: 'Boven ฿50M' },
] as const

const inputStyle: CSSProperties = {
  width: '100%',
  borderRadius: 12,
  border: '1px solid #E8E2D6',
  padding: '12px 14px',
  fontSize: 14,
  color: '#1A2744',
  outline: 'none',
  background: '#fff',
}

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 6,
  color: '#1A2744',
}

export default function PortalNewSearchRequestPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')
  const [region, setRegion] = useState('')
  const [budget, setBudget] = useState('')
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadProfile() {
      try {
        const supabase = getSupabaseBrowser()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.replace('/portal/login')
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', user.id)
          .maybeSingle()

        if (cancelled) return

        setName(profile?.full_name || user.user_metadata?.full_name || '')
        setEmail(profile?.email || user.email || '')
      } catch {
        if (!cancelled) setError('Kon profiel niet laden')
      } finally {
        if (!cancelled) setLoadingProfile(false)
      }
    }

    void loadProfile()
    return () => {
      cancelled = true
    }
  }, [router])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const trimmed = description.trim()
    if (trimmed.length < 20) {
      setError('Beschrijving moet minimaal 20 tekens zijn')
      return
    }

    if (!name.trim() || !email.trim()) {
      setError('Naam of e-mail ontbreekt in uw profiel')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/search-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          description: trimmed,
          region: region || '',
          budget: budget || '',
          locale: 'nl',
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Indienen mislukt')
        setSubmitting(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/portal/search-requests')
        router.refresh()
      }, 2000)
    } catch {
      setError('Indienen mislukt')
      setSubmitting(false)
    }
  }

  if (loadingProfile) {
    return (
      <main style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px' }}>
        <p style={{ color: '#5C5247' }}>Laden…</p>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px 64px' }}>
      <Link
        href="/portal/search-requests"
        style={{
          display: 'inline-block',
          marginBottom: 16,
          color: '#C8973A',
          fontWeight: 600,
          fontSize: 14,
          textDecoration: 'none',
        }}
      >
        ← Terug naar zoekopdrachten
      </Link>

      <h1
        style={{
          fontFamily: 'Playfair Display, serif',
          margin: '0 0 8px',
          fontSize: 28,
          color: '#1A2744',
        }}
      >
        Nieuwe zoekopdracht
      </h1>
      <p style={{ margin: '0 0 24px', color: '#5C5247', fontSize: 15, lineHeight: 1.5 }}>
        Laat ons weten wat u zoekt en wij gaan voor u aan de slag.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          border: '1px solid #E8E2D6',
          borderRadius: 14,
          padding: '24px 22px',
          display: 'grid',
          gap: 18,
        }}
      >
        <div>
          <p style={labelStyle}>Naam</p>
          <p
            style={{
              margin: 0,
              padding: '12px 14px',
              borderRadius: 12,
              background: '#FAF7F0',
              border: '1px solid #E8E2D6',
              color: '#1A2744',
              fontSize: 14,
            }}
          >
            {name || '—'}
          </p>
        </div>

        <div>
          <p style={labelStyle}>E-mail</p>
          <p
            style={{
              margin: 0,
              padding: '12px 14px',
              borderRadius: 12,
              background: '#FAF7F0',
              border: '1px solid #E8E2D6',
              color: '#1A2744',
              fontSize: 14,
            }}
          >
            {email || '—'}
          </p>
        </div>

        <div>
          <label htmlFor="search-description" style={labelStyle}>
            Wat zoekt u?
          </label>
          <textarea
            id="search-description"
            required
            minLength={20}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="bijv. stuk land nabij zee, min 1 rai, met elektriciteit"
            rows={6}
            style={{ ...inputStyle, resize: 'vertical', minHeight: 140 }}
          />
          <p style={{ margin: '6px 0 0', fontSize: 12, color: '#5C5247' }}>
            Minimaal 20 tekens
          </p>
        </div>

        <div>
          <label htmlFor="search-region" style={labelStyle}>
            Regio <span style={{ fontWeight: 400, color: '#5C5247' }}>(optioneel)</span>
          </label>
          <select
            id="search-region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            style={inputStyle}
          >
            {REGIONS.map((r) => (
              <option key={r.label} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="search-budget" style={labelStyle}>
            Budget <span style={{ fontWeight: 400, color: '#5C5247' }}>(optioneel)</span>
          </label>
          <select
            id="search-budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            style={inputStyle}
          >
            {BUDGETS.map((b) => (
              <option key={b.label} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
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

        {success ? (
          <p
            style={{
              margin: 0,
              padding: '10px 12px',
              borderRadius: 8,
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              color: '#166534',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            ✓ Uw zoekopdracht is ingediend!
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting || success}
          style={{
            width: '100%',
            minHeight: 48,
            borderRadius: 12,
            border: 'none',
            background: submitting ? '#9a7d1e' : '#C8973A',
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
            cursor: submitting || success ? 'wait' : 'pointer',
          }}
        >
          {submitting ? 'Bezig…' : 'Zoekopdracht indienen'}
        </button>
      </form>
    </main>
  )
}
