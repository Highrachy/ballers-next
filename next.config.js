/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,

  images: {
    domains: ['images.weserv.nl'],
  },

  async headers() {
    return [
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
    ];
  },
};

module.exports = nextConfig;
