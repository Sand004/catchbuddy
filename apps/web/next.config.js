const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'localhost',
      'catchsmart.app',
    ],
  },
  // PWA config will be added later with next-pwa
}

module.exports = withNextIntl(nextConfig)
