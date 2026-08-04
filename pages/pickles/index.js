import Link from 'next/link';
import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from 'next/head';
import PickleData from '@/data/pickles.json';
import {
  SITE_URL,
  PRODUCT_SEO_NAMES,
  PRODUCT_SHORT_DESCS,
  PRODUCT_RATINGS,
  PRODUCT_SPICE_LEVELS,
  TYPE_TO_SLUG,
} from '@/lib/seo';
import { pushViewItemList, pushSelectItem } from '@/lib/analytics';

// ─── Derive listing array from single source of truth ────────────────────────
const allProducts = PickleData.map(p => ({
  type:      p.type,
  name:      PRODUCT_SEO_NAMES[p.type] || p.name,
  shortDesc: PRODUCT_SHORT_DESCS[p.type] || p.shortDesc,
  image:     p.image[0]?.name,
  imageAlt:  p.image[0]?.alt || `${PRODUCT_SEO_NAMES[p.type]} — Andhra Store`,
  price:     p.amount,
  cat:       p.category,
  badge:     p.badge,
  spiceLevel: p.spiceLevel,
  sortOrder: p.sortOrder,
})).sort((a, b) => a.sortOrder - b.sortOrder);

const categoryFilters = [
  { value: 'all',     label: 'All Pickles'      },
  { value: 'veg',     label: 'Veg Pickles'      },
  { value: 'non-veg', label: 'Non-Veg Pickles'  },
];

const spiceFilters = [
  { value: 'all',       label: 'All Spice Levels' },
  { value: 'extra-hot', label: '🌶🌶🌶🌶 Extra Hot'  },
  { value: 'hot',       label: '🌶🌶🌶 Hot'          },
  { value: 'medium',    label: '🌶🌶 Medium'          },
  { value: 'mild',      label: '🌶 Mild'              },
];

const sortOptions = [
  { value: 'featured',   label: 'Featured'             },
  { value: 'price-asc',  label: 'Price: Low to High'   },
  { value: 'price-desc', label: 'Price: High to Low'   },
  { value: 'name-asc',   label: 'Name: A to Z'         },
  { value: 'spice-asc',  label: 'Spice: Mild to Hot'   },
  { value: 'spice-desc', label: 'Spice: Hot to Mild'   },
];

const SPICE_DOTS = { 'extra-hot': 4, 'hot': 3, 'medium': 2, 'mild': 1 };
const SPICE_COLORS = {
  'extra-hot': 'text-red-600',
  'hot':       'text-orange-500',
  'medium':    'text-yellow-600',
  'mild':      'text-green-600',
};

const pageTitle = "Andhra Pickles Online — Shop 16 Authentic Pickles | Andhra Store";
const pageDesc  = "Shop 16 authentic Andhra pickles online — Mango Avakaya, Gongura, Tamarind, Karela, Chicken & more. Handcrafted with no preservatives. 250g from ₹200. Ships pan-India.";

const shopSchema = {
  "@context": "https://schema.org",
  "@type":    "CollectionPage",
  name:        pageTitle,
  description: pageDesc,
  url:        `${SITE_URL}/pickles`,
  provider:   { "@type": "Organization", name: "Andhra Store", url: SITE_URL },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type":    "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",           item: `${SITE_URL}/home`    },
    { "@type": "ListItem", position: 2, name: "Andhra Pickles", item: `${SITE_URL}/pickles` },
  ],
};

const itemListSchema = {
  "@context":    "https://schema.org",
  "@type":       "ItemList",
  name:          "Andhra Store — Full Pickle Collection",
  description:   "All 16 authentic handcrafted Andhra pickles. Vegetarian and non-vegetarian varieties. No preservatives.",
  url:           `${SITE_URL}/pickles`,
  numberOfItems: allProducts.length,
  itemListElement: allProducts.map((p, i) => ({
    "@type":   "ListItem",
    position:  i + 1,
    name:      p.name,
    url:       `${SITE_URL}/pickles/${TYPE_TO_SLUG[p.type]}`,
    item: {
      "@type": "Product",
      name:    p.name,
      url:     `${SITE_URL}/pickles/${TYPE_TO_SLUG[p.type]}`,
      image:   `${SITE_URL}${p.image}`,
      offers:  {
        "@type":        "Offer",
        priceCurrency:  "INR",
        price:          p.price,
        availability:   "https://schema.org/InStock",
      },
      aggregateRating: {
        "@type":       "AggregateRating",
        ratingValue:   String(PRODUCT_RATINGS[p.type]?.rating || 4.5),
        bestRating:    "5",
        worstRating:   "1",
        reviewCount:   String(PRODUCT_RATINGS[p.type]?.count || 100),
      },
    },
  })),
};

export default function ShopPage() {
  const [category,          setCategory]          = useState('all');
  const [spiceFilter,       setSpiceFilter]        = useState('all');
  const [sort,              setSort]               = useState('featured');
  const [showMobileFilter,  setShowMobileFilter]   = useState(false);

  // Fires once with the full, unfiltered list — represents what the page
  // showed on load, independent of any later client-side filter/sort.
  useEffect(() => {
    pushViewItemList(
      allProducts.map((p) => ({ type: p.type, name: p.name, category: 'Pickles', unitPrice: p.price })),
      'All Pickles'
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    let items = [...allProducts];
    if (category !== 'all')    items = items.filter(p => p.cat === category);
    if (spiceFilter !== 'all') items = items.filter(p => p.spiceLevel === spiceFilter);
    switch (sort) {
      case 'price-asc':  items.sort((a, b) => a.price - b.price);                                    break;
      case 'price-desc': items.sort((a, b) => b.price - a.price);                                    break;
      case 'name-asc':   items.sort((a, b) => a.name.localeCompare(b.name));                         break;
      case 'spice-asc':  items.sort((a, b) => (SPICE_DOTS[a.spiceLevel]||2) - (SPICE_DOTS[b.spiceLevel]||2)); break;
      case 'spice-desc': items.sort((a, b) => (SPICE_DOTS[b.spiceLevel]||2) - (SPICE_DOTS[a.spiceLevel]||2)); break;
      default: break;
    }
    return items;
  }, [category, spiceFilter, sort]);

  const FilterPanel = ({ mobile = false }) => (
    <div className={mobile ? '' : 'sticky top-20'}>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-5">
          <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
          <h3 className="text-sm font-bold text-gray-800">Filters</h3>
        </div>

        {/* Category filter */}
        <div className="mb-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Category</p>
          <div className="space-y-2">
            {categoryFilters.map(f => (
              <label key={f.value} className="flex items-center gap-3 cursor-pointer group"
                onClick={() => { setCategory(f.value); if (mobile) setShowMobileFilter(false); }}>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  category === f.value ? 'bg-olive-600 border-olive-600' : 'border-gray-300 group-hover:border-gray-400'
                }`}>
                  {category === f.value && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm transition-colors ${category === f.value ? 'text-olive-700 font-semibold' : 'text-gray-600 group-hover:text-gray-800'}`}>
                  {f.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Spice level filter */}
        <div className="mb-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Spice Level</p>
          <div className="space-y-2">
            {spiceFilters.map(f => (
              <label key={f.value} className="flex items-center gap-3 cursor-pointer group"
                onClick={() => { setSpiceFilter(f.value); if (mobile) setShowMobileFilter(false); }}>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  spiceFilter === f.value ? 'bg-olive-600 border-olive-600' : 'border-gray-300 group-hover:border-gray-400'
                }`}>
                  {spiceFilter === f.value && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs transition-colors ${spiceFilter === f.value ? 'text-olive-700 font-semibold' : 'text-gray-600 group-hover:text-gray-800'}`}>
                  {f.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price range */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Price Range</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">₹200</span>
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">₹350</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={`${SITE_URL}/pickles`} />
        <meta property="og:title"       content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url"         content={`${SITE_URL}/pickles`} />
        <meta property="og:image"       content={`${SITE_URL}/mango-1.jpeg`} />
        <meta property="og:image:alt"    content="Andhra Store pickles — handmade mango avakaya, gongura, chicken and more" />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:title"       content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image"       content={`${SITE_URL}/mango-1.jpeg`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(shopSchema)       }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema)   }} />
      </Head>
      <Header />

      {/* Page header */}
      <section className="bg-white border-b border-gray-100" aria-label="Shop page header">
        <div className="container-main py-8 md:py-10">
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex items-center gap-1.5 text-xs text-gray-400">
              <li><Link href="/home"    className="hover:text-brand-500 transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-600 font-medium">Andhra Pickles</li>
            </ol>
          </nav>
          <p className="text-[11px] font-bold text-brand-500 uppercase tracking-[0.2em] mb-1">Our Collection</p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl sm:text-4xl font-heading text-gray-900">Andhra Pickles Online</h1>
              <p className="text-sm text-gray-500 mt-1.5 max-w-xl">14 authentic varieties — Mango Avakaya, Gongura, Chicken, Prawns, and more. No preservatives. Ships pan-India.</p>
            </div>
            <div className="flex items-center gap-3">
              <button id="mobile-filter-toggle" onClick={() => setShowMobileFilter(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                aria-label="Open filters">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                Filters
              </button>
              <div className="relative">
                <label htmlFor="sort-select" className="sr-only">Sort products</label>
                <select id="sort-select" value={sort} onChange={e => setSort(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-9 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-200 cursor-pointer transition-all">
                  {sortOptions.map(o => <option key={o.value} value={o.value}>{`Sort: ${o.label}`}</option>)}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          {/* Category nav tabs */}
          <div className="flex gap-3 mt-5">
            <Link href="/pickles"         className="text-xs font-semibold text-brand-600 border-b-2 border-brand-500 pb-0.5">All Pickles</Link>
            <span className="text-xs text-gray-300" aria-hidden="true">|</span>
            <Link href="/pickles/veg"     className="text-xs text-gray-500 hover:text-brand-500 transition-colors">Veg Pickles</Link>
            <span className="text-xs text-gray-300" aria-hidden="true">|</span>
            <Link href="/pickles/non-veg" className="text-xs text-gray-500 hover:text-brand-500 transition-colors">Non-Veg Pickles</Link>
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="bg-gray-50/50 min-h-screen" aria-label="Products grid">
        <div className="container-main py-8 md:py-10">
          <div className="flex gap-8">
            <aside className="hidden lg:block w-[220px] flex-shrink-0" aria-label="Product filters">
              <FilterPanel />
            </aside>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500 mb-5">
                Showing <span className="font-semibold text-gray-700">{filtered.length}</span> products
                {category !== 'all' && <span> in <span className="font-semibold">{categoryFilters.find(f=>f.value===category)?.label}</span></span>}
                {spiceFilter !== 'all' && <span> · <span className="font-semibold">{PRODUCT_SPICE_LEVELS?.[spiceFilter]?.label || spiceFilter} spice</span></span>}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5">
                {filtered.map((p, idx) => {
                  const rating    = PRODUCT_RATINGS[p.type]?.rating || 4.5;
                  const origPrice = Math.round(p.price * 1.2);
                  const discount  = Math.round(((origPrice - p.price) / origPrice) * 100);
                  const spiceDots = SPICE_DOTS[p.spiceLevel] || 2;
                  const spiceColor= SPICE_COLORS[p.spiceLevel] || 'text-yellow-600';

                  return (
                    <div key={p.type}
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl hover:border-gray-200 hover:-translate-y-1 transition-all duration-300"
                      style={{ animationDelay: `${idx * 60}ms` }}>
                      <Link href={`/pickles/${TYPE_TO_SLUG[p.type]}`}
                        onClick={() => pushSelectItem({ type: p.type, name: p.name, category: 'Pickles', unitPrice: p.price }, 'All Pickles')}>
                        <div className="relative aspect-square overflow-hidden bg-gray-50">
                          {p.badge && (
                            <span className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase shadow-sm ${
                              p.badge === 'BEST SELLER'   ? 'bg-brand-500 text-white' :
                              p.badge === 'PREMIUM'       ? 'bg-gray-900 text-white'  :
                              p.badge === 'FAN FAVOURITE' ? 'bg-olive-600 text-white'  :
                              'bg-olive-500 text-white'
                            }`}>
                              {p.badge}
                            </span>
                          )}
                          <Image src={p.image} alt={p.imageAlt}
                            width={400} height={400}
                            priority={idx < 6}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                      </Link>

                      <div className="p-4">
                        {/* Rating + spice row */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1" aria-label={`Rating: ${rating} stars`}>
                            <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="text-xs font-semibold text-gray-700">{rating}</span>
                          </div>
                          {/* Spice dots */}
                          <div className={`flex items-center gap-0.5 ${spiceColor}`} aria-label={`Spice level: ${PRODUCT_SPICE_LEVELS[p.type]?.label}`}>
                            {[1,2,3,4].map(d => (
                              <span key={d} className={`w-1.5 h-1.5 rounded-full ${d <= spiceDots ? 'bg-current' : 'bg-current opacity-20'}`} />
                            ))}
                          </div>
                        </div>

                        <Link href={`/pickles/${TYPE_TO_SLUG[p.type]}`}
                          onClick={() => pushSelectItem({ type: p.type, name: p.name, category: 'Pickles', unitPrice: p.price }, 'All Pickles')}>
                          <h2 className="text-sm font-bold text-gray-800 hover:text-brand-600 transition-colors line-clamp-1 mb-1">
                            {p.name}
                          </h2>
                        </Link>

                        {/* Short desc */}
                        <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-2 mb-2.5 hidden sm:block">{p.shortDesc}</p>
                        <p className="text-[11px] text-gray-400 mb-2.5 sm:hidden">250g</p>

                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="text-lg font-extrabold text-gray-900">₹{p.price}</span>
                            <span className="text-xs text-gray-400 line-through ml-1.5">₹{origPrice}</span>
                          </div>
                          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">{discount}% OFF</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-4xl mb-3">🫙</p>
                  <p className="text-gray-500 font-medium">No pickles match those filters.</p>
                  <button onClick={() => { setCategory('all'); setSpiceFilter('all'); }}
                    className="mt-4 text-sm text-olive-600 font-semibold hover:underline">Clear filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile filter drawer */}
      {showMobileFilter && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[100]" onClick={() => setShowMobileFilter(false)} aria-hidden="true" />
          <div className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto"
            role="dialog" aria-modal="true" aria-label="Product filters">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-gray-900">Filters</h3>
              <button onClick={() => setShowMobileFilter(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500" aria-label="Close filters">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterPanel mobile />
          </div>
        </>
      )}

      <Footer />
    </>
  );
}
