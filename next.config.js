/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Canonical server-side redirect: /mwl/hopes-chance → /hopes
      {
        source: '/mwl/hopes-chance',
        destination: '/hopes',
        permanent: true,
      },
    ]
  },
}
module.exports = nextConfig
