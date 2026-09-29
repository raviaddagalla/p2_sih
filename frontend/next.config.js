/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // For cytoscape re-renders
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
