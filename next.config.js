/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['images.weserv.nl'],
  },
};

module.exports = nextConfig;
