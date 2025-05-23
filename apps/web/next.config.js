const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})

const createNextIntlPlugin = require('next-intl/plugin')
const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: [
      'supabase.co',
      'your-supabase-project.supabase.co',
      'images.unsplash.com',
      'res.cloudinary.com'
    ],
  },
  env: {
    CUSTOM_KEY: 'my-value',
  },
}

module.exports = withNextIntl(withPWA(nextConfig))