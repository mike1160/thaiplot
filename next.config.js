const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/', destination: '/en' },
      { source: '/legal/:path*', destination: '/en/legal/:path*' },
      { source: '/list-property', destination: '/en/list-property' },
      { source: '/listings', destination: '/en/listings' },
      { source: '/contact', destination: '/en/contact' },
    ]
  },
  async redirects() {
    return [
      { source: '/en', destination: '/', permanent: true },
      { source: '/en/:path*', destination: '/:path*', permanent: true },
    ]
  },
}

module.exports = withNextIntl(nextConfig)
