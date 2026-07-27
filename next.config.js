const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/', destination: '/en' },
      { source: '/legal/:path*', destination: '/en/legal/:path*' },
      { source: '/info/:path*', destination: '/en/info/:path*' },
      { source: '/list-property', destination: '/en/list-property' },
      { source: '/listings/:id', destination: '/en/listings/:id' },
      { source: '/listings', destination: '/en/listings' },
      { source: '/contact', destination: '/en/contact' },
      { source: '/hua-hin', destination: '/en/hua-hin' },
      { source: '/pranburi', destination: '/en/pranburi' },
      { source: '/black-mountain', destination: '/en/black-mountain' },
    ]
  },
  async redirects() {
    return [
      { source: '/en', destination: '/', permanent: true },
      { source: '/en/:path*', destination: '/:path*', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'index, follow' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

module.exports = withNextIntl(nextConfig)
