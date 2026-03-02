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

      // 🔒 2. Global security headers
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

          // 🛡️ Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: isDev
              ? [
                  "default-src 'self' data: blob: https:;",
                  "img-src 'self' data: https:;",
                  "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: data: https:;",
                  "style-src 'self' 'unsafe-inline' https:;",
                  "font-src 'self' data: https:;",
                  // 👇 Added so local API calls work
                  "connect-src 'self' http://localhost:4000 http://127.0.0.1:4000 ws://localhost:4000 ws://127.0.0.1:4000 https://accounts.google.com https://*.google.com;",
                ].join(' ')
              : [
                  "default-src 'self' https: data: blob:;",
                  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: blob: data:;",
                  "style-src 'self' 'unsafe-inline' https:;",
                  "img-src 'self' https: data: blob:;",
                  "font-src 'self' https: data:;",
                  "connect-src 'self' https: wss:;",
                  "frame-src 'self' https:;",
                ].join(' '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
