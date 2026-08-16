'use client'

export default function WaiairNavPill() {
  return (
    <>
      <style>{`
        @keyframes waiair-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(255,100,0,0.6); }
          70%  { box-shadow: 0 0 0 7px rgba(255,100,0,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,100,0,0); }
        }
        .waiair-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #000;
          color: #ff6400;
          border: 1.5px solid #ff6400;
          border-radius: 999px;
          padding: 4px 10px 4px 8px;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          letter-spacing: 0.02em;
          line-height: 1;
          animation: waiair-pulse 2.2s ease-in-out infinite;
          transition: background 0.15s, color 0.15s;
        }
        .waiair-pill-btn:hover {
          background: #ff6400;
          color: #000;
        }
        .waiair-new {
          background: #ff6400;
          color: #000;
          border-radius: 999px;
          padding: 2px 6px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition: background 0.15s, color 0.15s;
        }
        .waiair-pill-btn:hover .waiair-new {
          background: #000;
          color: #ff6400;
        }
        @media (max-width: 640px) {
          .pill-label { display: none; }
          .waiair-new { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .waiair-pill-btn { animation: none !important; }
        }
      `}</style>
      <a href="/waiair" className="waiair-pill-btn" aria-label="WaiAir vluchttracker — nieuw">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="pill-label">WaiAir</span>
        <span className="waiair-new">Nieuw</span>
      </a>
    </>
  )
}
