import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#1A2744] flex items-center justify-center px-6">
      <div className="text-center">
        <h1
          className="text-4xl font-bold mb-3"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Page not found
        </h1>
        <p className="text-[#5C5247] mb-6">The page you’re looking for doesn’t exist.</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-[12px] text-sm font-semibold text-white"
          style={{ background: '#C8973A' }}
        >
          Back to ThaiPlot
        </Link>
      </div>
    </main>
  )
}
