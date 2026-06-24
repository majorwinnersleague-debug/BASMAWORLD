/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Redirects ──────────────────────────────────────────────────────────────
  async redirects() {
    return [
      // Old pages → enroll
      { source: '/academy', destination: '/enroll', permanent: true },
      { source: '/wins', destination: '/enroll', permanent: true },
      { source: '/blog', destination: '/enroll', permanent: true },
      { source: '/blog/:slug', destination: '/enroll', permanent: true },
      { source: '/start', destination: '/enroll', permanent: true },
      { source: '/register', destination: '/enroll', permanent: true },
      { source: '/signup', destination: '/enroll', permanent: true },
      { source: '/booking', destination: '/enroll', permanent: true },
      { source: '/schedule', destination: '/enroll', permanent: true },
      { source: '/gateway', destination: '/', permanent: true },
      { source: '/hopes', destination: '/', permanent: true },
      { source: '/navigator', destination: '/', permanent: true },
      { source: '/game', destination: '/', permanent: true },
      { source: '/game/:path*', destination: '/', permanent: true },
      { source: '/mwl', destination: '/', permanent: true },
      { source: '/mwl/:path*', destination: '/', permanent: true },
      { source: '/mwm', destination: '/', permanent: true },
      { source: '/family', destination: '/', permanent: true },
      { source: '/basma/academy', destination: '/basma', permanent: true },
      { source: '/basma/lessons', destination: '/basma', permanent: true },
      { source: '/basma/artist', destination: '/basma', permanent: true },
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
              "script-src 'self' 'unsafe-inline' https://us-assets.i.posthog.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://app.posthog.com https://us.i.posthog.com https://openrouter.ai https://buy.stripe.com https://amiable-finch-612.convex.cloud https://formsubmit.co https://www.google-analytics.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self' https://buy.stripe.com https://formsubmit.co",
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
