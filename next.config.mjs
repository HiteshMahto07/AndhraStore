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
      // /pickle → /pickles (collection page rename)
      {
        source: '/pickle',
        destination: '/pickles',
        permanent: true,
      },
      // /pickleinfo?type=X → /pickles/[slug] (14 product page redirects)
      { source: '/pickleinfo', has: [{ type: 'query', key: 'type', value: 'Chicken' }],    destination: '/pickles/andhra-chicken-pickle',     permanent: true },
      { source: '/pickleinfo', has: [{ type: 'query', key: 'type', value: 'Meat' }],       destination: '/pickles/andhra-meat-pickle',        permanent: true },
      { source: '/pickleinfo', has: [{ type: 'query', key: 'type', value: 'Prawns' }],     destination: '/pickles/andhra-prawns-pickle',      permanent: true },
      { source: '/pickleinfo', has: [{ type: 'query', key: 'type', value: 'Fish' }],       destination: '/pickles/andhra-fish-pickle',        permanent: true },
      { source: '/pickleinfo', has: [{ type: 'query', key: 'type', value: 'Mango' }],      destination: '/pickles/andhra-mango-pickle',       permanent: true },
      { source: '/pickleinfo', has: [{ type: 'query', key: 'type', value: 'Gongura' }],    destination: '/pickles/andhra-gongura-pickle',     permanent: true },
      { source: '/pickleinfo', has: [{ type: 'query', key: 'type', value: 'Garlic' }],     destination: '/pickles/andhra-garlic-pickle',      permanent: true },
      { source: '/pickleinfo', has: [{ type: 'query', key: 'type', value: 'Ginger' }],     destination: '/pickles/andhra-ginger-pickle',      permanent: true },
      { source: '/pickleinfo', has: [{ type: 'query', key: 'type', value: 'RedChilli' }],  destination: '/pickles/andhra-red-chilli-pickle',  permanent: true },
      { source: '/pickleinfo', has: [{ type: 'query', key: 'type', value: 'Lemon' }],      destination: '/pickles/andhra-lemon-pickle',       permanent: true },
      { source: '/pickleinfo', has: [{ type: 'query', key: 'type', value: 'Tomato' }],     destination: '/pickles/andhra-tomato-pickle',      permanent: true },
      { source: '/pickleinfo', has: [{ type: 'query', key: 'type', value: 'Amla' }],       destination: '/pickles/andhra-amla-pickle',        permanent: true },
      { source: '/pickleinfo', has: [{ type: 'query', key: 'type', value: 'Curry' }],      destination: '/pickles/andhra-curry-leaves-pickle',permanent: true },
      { source: '/pickleinfo', has: [{ type: 'query', key: 'type', value: 'GreenChilli' }],destination: '/pickles/andhra-green-chilli-pickle',permanent: true },
      // /pickles?type=veg → /pickles/veg, /pickles?type=non-veg → /pickles/non-veg
      { source: '/pickles', has: [{ type: 'query', key: 'type', value: 'veg' }],     destination: '/pickles/veg',     permanent: true },
      { source: '/pickles', has: [{ type: 'query', key: 'type', value: 'non-veg' }], destination: '/pickles/non-veg', permanent: true },
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
