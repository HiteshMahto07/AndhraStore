import Link from 'next/link';
import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PickleType from '@/data/pickles.json';
import { SITE_URL } from '@/lib/seo';

const allProducts = [
  { name: 'Ginger Pickle', image: '/ginger-1.jpeg', price: 200, type: 'Ginger', cat: 'veg', weight: '250g', badge: '' },
  { name: 'Mango Pickle', image: '/mango-1.jpeg', price: 200, type: 'Mango', cat: 'veg', weight: '250g', badge: 'BEST SELLER' },
  { name: 'Garlic Pickle', image: '/garlic-1.jpeg', price: 200, type: 'Garlic', cat: 'veg', weight: '250g', badge: '' },
  { name: 'Red Chilli Pickle', image: '/redchilli-1.jpeg', price: 200, type: 'RedChilli', cat: 'veg', weight: '250g', badge: '' },
  { name: 'Gongura Pickle', image: '/gongura-1.jpeg', price: 200, type: 'Gongura', cat: 'veg', weight: '250g', badge: '' },
  { name: 'Tomato Pickle', image: '/tomato-1.jpeg', price: 200, type: 'Tomato', cat: 'veg', weight: '250g', badge: '' },
  { name: 'Lemon Pickle', image: '/lemon-1.jpeg', price: 200, type: 'Lemon', cat: 'veg', weight: '250g', badge: '' },
  { name: 'Curry Leaves Pickle', image: '/curry-1.jpeg', price: 200, type: 'Curry', cat: 'veg', weight: '250g', badge: '' },
  { name: 'Green Chilli Pickle', image: '/green-1.jpeg', price: 200, type: 'GreenChilli', cat: 'veg', weight: '250g', badge: '' },
  { name: 'Amla Pickle', image: '/amla-1.jpeg', price: 200, type: 'Amla', cat: 'veg', weight: '250g', badge: '' },
  { name: 'Chicken Pickle', image: '/chicken-1.jpeg', price: 300, type: 'Chicken', cat: 'non-veg', weight: '250g', badge: 'BEST SELLER' },
  { name: 'Meat Pickle', image: '/mutton-1.jpeg', price: 350, type: 'Meat', cat: 'non-veg', weight: '250g', badge: 'PREMIUM' },
  { name: 'Prawns Pickle', image: '/prawns-1.jpeg', price: 350, type: 'Prawns', cat: 'non-veg', weight: '250g', badge: '' },
  { name: 'Fish Pickle', image: '/fish-2.jpeg', price: 200, type: 'Fish', cat: 'non-veg', weight: '250g', badge: '' },
];

const categoryFilters = [
  { value: 'all', label: 'All' },
  { value: 'veg', label: 'Veg Pickles' },
  { value: 'non-veg', label: 'Non-Veg Pickles' },
];

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
];

const ratings = { Chicken: 4.8, Mango: 4.9, Meat: 4.7, Garlic: 4.6, Ginger: 4.5, RedChilli: 4.4, Prawns: 4.7, Fish: 4.3, Gongura: 4.5, Tomato: 4.4, Lemon: 4.3, Amla: 4.2, Curry: 4.3, GreenChilli: 4.4 };

const pageTitle = "Andhra Pickles Online — Shop 14 Authentic Pickles | Andhra Store";
const pageDesc = "Shop 14 authentic Andhra pickles online — Mango Avakaya, Gongura, Chicken, Prawns & more. Handcrafted in East Godavari with no preservatives. Ships pan-India.";

const shopSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: pageTitle,
  description: pageDesc,
  url: `${SITE_URL}/pickle`,
  provider: {
    "@type": "Organization",
    name: "Andhra Store",
    url: SITE_URL,
  },
};

export default function ShopPage() {
  const router = useRouter();
  const { type } = router.query;

  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('featured');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    if (type === 'veg' || type === 'non-veg') setCategory(type);
  }, [type]);

  const filtered = useMemo(() => {
    let items = category === 'all' ? [...allProducts] : allProducts.filter(p => p.cat === category);
    switch (sort) {
      case 'price-asc': items.sort((a, b) => a.price - b.price); break;
      case 'price-desc': items.sort((a, b) => b.price - a.price); break;
      case 'name-asc': items.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }
    return items;
  }, [category, sort]);

  const FilterPanel = ({ mobile = false }) => (
    <div className={mobile ? '' : 'sticky top-20'}>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-5">
          <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
          <h3 className="text-sm font-bold text-gray-800">Filters</h3>
        </div>

        <div className="mb-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Category</p>
          <div className="space-y-2">
            {categoryFilters.map(f => (
              <label key={f.value}
                className="flex items-center gap-3 cursor-pointer group" onClick={() => {
                  setCategory(f.value);
                  if (mobile) setShowMobileFilter(false);
                }}>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  category === f.value
                    ? 'bg-olive-600 border-olive-600'
                    : 'border-gray-300 group-hover:border-gray-400'
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
        <link rel="canonical" href={`${SITE_URL}/pickle`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={`${SITE_URL}/pickle`} />
        <meta property="og:image" content={`${SITE_URL}/mango-1.jpeg`} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={`${SITE_URL}/mango-1.jpeg`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(shopSchema) }}
        />
      </Head>
      <Header />

      <section className="bg-white border-b border-gray-100" aria-label="Shop page header">
        <div className="container-main py-8 md:py-10">
          <p className="text-[11px] font-bold text-brand-500 uppercase tracking-[0.2em] mb-1">Our Collection</p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-heading text-gray-900">Andhra Pickles Online</h1>
            <div className="flex items-center gap-3">
              <button
                id="mobile-filter-toggle"
                onClick={() => setShowMobileFilter(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                aria-label="Open filters"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                Filters
              </button>
              <div className="relative">
                <label htmlFor="sort-select" className="sr-only">Sort products</label>
                <select
                  id="sort-select"
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-9 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-200 cursor-pointer transition-all"
                >
                  {sortOptions.map(o => <option key={o.value} value={o.value}>{`Sort by: ${o.label}`}</option>)}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50/50 min-h-screen" aria-label="Products grid">
        <div className="container-main py-8 md:py-10">
          <div className="flex gap-8">
            <aside className="hidden lg:block w-[220px] flex-shrink-0" aria-label="Product filters">
              <FilterPanel />
            </aside>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500 mb-5">Showing <span className="font-semibold text-gray-700">{filtered.length}</span> products</p>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5">
                {filtered.map((p, idx) => {
                  const rating = ratings[p.type] || 4.5;
                  const origPrice = Math.round(p.price * 1.2);
                  const discount = Math.round(((origPrice - p.price) / origPrice) * 100);

                  return (
                    <div key={p.type}
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl hover:border-gray-200 hover:-translate-y-1 transition-all duration-300"
                      style={{ animationDelay: `${idx * 60}ms` }}>
                      <Link href={{ pathname: '/pickleinfo', query: { type: p.type } }}>
                        <div className="relative aspect-square overflow-hidden bg-gray-50">
                          {p.badge && (
                            <span className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase shadow-sm ${
                              p.badge === 'BEST SELLER'
                                ? 'bg-brand-500 text-white'
                                : p.badge === 'PREMIUM'
                                ? 'bg-gray-900 text-white'
                                : 'bg-olive-500 text-white'
                            }`}>
                              {p.badge}
                            </span>
                          )}
                          <img
                            src={p.image}
                            alt={`Andhra ${p.name} — handmade in East Godavari, ${p.weight}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            width={400}
                            height={400}
                          />
                        </div>
                      </Link>

                      <div className="p-4">
                        <div className="flex items-center gap-1.5 mb-2" aria-label={`Rating: ${rating} stars`}>
                          <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span className="text-xs font-semibold text-gray-700">{rating}</span>
                        </div>

                        <Link href={{ pathname: '/pickleinfo', query: { type: p.type } }}>
                          <h2 className="text-sm font-bold text-gray-800 hover:text-brand-600 transition-colors line-clamp-2 mb-1">
                            {p.name}
                          </h2>
                        </Link>
                        <p className="text-[11px] text-gray-400 mb-2.5">{p.weight}</p>

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
            </div>
          </div>
        </div>
      </section>

      {showMobileFilter && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[100]" onClick={() => setShowMobileFilter(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto animate-fade-in" role="dialog" aria-modal="true" aria-label="Product filters">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-gray-900">Filters</h3>
              <button onClick={() => setShowMobileFilter(false)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500" aria-label="Close filters">
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