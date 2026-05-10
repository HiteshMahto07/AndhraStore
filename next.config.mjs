/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  async redirects() {
    return [
      // www → non-www permanent redirect (301)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.andhrastore.com' }],
        destination: 'https://andhrastore.com/:path*',
        permanent: true,
      },
      // Root → /home permanent redirect (301)
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/(.*)\\.(jpg|jpeg|png|gif|svg|ico|webp|woff|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
