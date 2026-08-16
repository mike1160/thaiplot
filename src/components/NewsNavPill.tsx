'use client'

export default function NewsNavPill() {
  return (
    <a
      href="/news"
      aria-label="Thailand News"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: '#00c853',
        color: '#003d1a',
        borderRadius: 999,
        padding: '5px 11px',
        fontSize: 12,
        fontWeight: 700,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        letterSpacing: '0.02em',
        lineHeight: 1,
      }}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
        <path d="M18 14h-8M15 18h-5M10 6h8v4h-8z" />
      </svg>
      <span className="pill-label">Nieuws</span>
    </a>
  )
}
