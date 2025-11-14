/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,

  images: {
    domains: ['images.weserv.nl'],
  },

  async headers() {
    const isDev = process.env.NODE_ENV === 'development';

    return [
      // 🔒 1. Prevent preview.ballers.ng from being indexed
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'preview.ballers.ng' }],
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet',
          },
        ],
      },

      // 🔒 2. Global security headers (apply to production only)
      {
        source: '/:path*',
        headers: [
          // Security headers required by SEO tools
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

          // 🛡️ Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: isDev
              ? // Development CSP: safe for Next.js + React refresh
                "default-src 'self' data: blob: https:; img-src 'self' data: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: data: https:; style-src 'self' 'unsafe-inline' https:; font-src 'self' data: https:;"
              : // Production strict CSP
                "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https:; script-src 'self' https:; font-src 'self' https:; connect-src 'self' https:; object-src 'none'; frame-ancestors 'self';",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
