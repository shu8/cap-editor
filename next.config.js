/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/feed', destination: '/api/alerts' },
      { source: '/feed/:id', destination: '/api/alerts/:id' },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

module.exports = nextConfig;
