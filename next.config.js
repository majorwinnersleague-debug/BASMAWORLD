/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Redirects ──────────────────────────────────────────────────────────────
  async redirects() {
    return [
      { source: '/mwl/hopes-chance', destination: '/hopes', permanent: true },
      // Page consolidation redirects
      { source: '/basma/academy', destination: '/academy', permanent: true },
      { source: '/basma/lessons', destination: '/academy', permanent: true },
      { source: '/basma/artist', destination: '/basma', permanent: true },
      { source: '/vegan-survivors', destination: '/mwl#vegan', permanent: true },
      { source: '/mwl/vegan-survivors', destination: '/mwl#vegan', permanent: true },
      { source: '/mwl/gaming', destination: '/mwl#gaming', permanent: true },
      { source: '/mwl/i-am-positive', destination: '/mwl#positive', permanent: true },
    ]
  },

  // ── Security Headers ───────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://us-assets.i.posthog.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://app.posthog.com https://us.i.posthog.com https://openrouter.ai",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },

  // ── Cost & Performance Optimizations ──────────────────────────────────────
  compress: true,
  poweredByHeader: false,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'basmaworld.com' },
      { protocol: 'https', hostname: '**.vercel.app' },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/webp'],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
}

module.exports = nextConfig
