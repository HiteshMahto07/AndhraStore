/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://andhrastore.com',
  generateRobotsTxt: false, // robots.txt is managed manually in /public/robots.txt
  outDir: 'public',
  changefreq: 'weekly',
  priority: 0.7,

  // Pages to exclude from the sitemap
  exclude: [
    '/',                    // root redirect (→ /home) — not a content page
    '/checkout',
    '/order-success',
    '/order-success/*',
    '/order-failed',
    '/cart',
    '/api/*',
    '/pickle',              // legacy 301 redirect — not a content page
    '/pickleinfo',          // legacy 301 redirect — not a content page
    '/andhra-specials',     // 301 redirect → /snacks or /sweets — not a content page
    '/andhra-specials/*',   // legacy slug redirects
    '/_*',
  ],

  // Per-path overrides for priority and changefreq
  transform: async (config, path) => {
    // Homepage
    if (path === '/home') {
      return { loc: path, changefreq: 'weekly', priority: 1.0, lastmod: new Date().toISOString() };
    }
    // Main shop pages
    if (path === '/pickles') {
      return { loc: path, changefreq: 'weekly', priority: 0.9, lastmod: new Date().toISOString() };
    }
    // Category listing pages
    if (['/pickles/veg', '/pickles/non-veg', '/podi', '/snacks', '/sweets'].includes(path)) {
      return { loc: path, changefreq: 'weekly', priority: 0.85, lastmod: new Date().toISOString() };
    }
    // Individual product pages — pickles, podi, snacks, sweets
    if (
      (path.startsWith('/pickles/') && path !== '/pickles') ||
      (path.startsWith('/podi/')    && path !== '/podi')    ||
      (path.startsWith('/snacks/')  && path !== '/snacks')  ||
      (path.startsWith('/sweets/')  && path !== '/sweets')
    ) {
      return { loc: path, changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() };
    }
    // City landing pages
    if (path.startsWith('/andhra-pickles-')) {
      return { loc: path, changefreq: 'monthly', priority: 0.8, lastmod: new Date().toISOString() };
    }
    // Blog listing + individual posts
    if (path === '/blog') {
      return { loc: path, changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() };
    }
    if (path.startsWith('/blog/')) {
      return { loc: path, changefreq: 'monthly', priority: 0.75, lastmod: new Date().toISOString() };
    }
    // About & Contact
    if (path === '/about' || path === '/contact') {
      return { loc: path, changefreq: 'monthly', priority: 0.7, lastmod: new Date().toISOString() };
    }
    // Policy pages
    if (path === '/return-policy') {
      return { loc: path, changefreq: 'yearly', priority: 0.5, lastmod: new Date().toISOString() };
    }
    if (path === '/privacy-policy') {
      return { loc: path, changefreq: 'yearly', priority: 0.3, lastmod: new Date().toISOString() };
    }

    // Default
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
