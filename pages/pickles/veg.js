import Link from 'next/link';
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from 'next/head';
import PickleData from '@/data/pickles.json';
import { SITE_URL, PRODUCT_SEO_NAMES, PRODUCT_SHORT_DESCS, PRODUCT_RATINGS, PRODUCT_SPICE_LEVELS, TYPE_TO_SLUG } from '@/lib/seo';

// Derive from single source of truth
const vegProducts = PickleData
  .filter(p => p.category === 'veg')
  .sort((a, b) => a.sortOrder - b.sortOrder)
  .map(p => ({
    type:      p.type,
    name:      PRODUCT_SEO_NAMES[p.type] || p.name,
    shortDesc: PRODUCT_SHORT_DESCS[p.type] || p.shortDesc,
    image:     p.image[0]?.name,
    imageAlt:  p.image[0]?.alt || `${PRODUCT_SEO_NAMES[p.type]} — Andhra Store`,
    price:     p.amount,
    badge:     p.badge,
    spiceLevel: p.spiceLevel,
    localName: p.localName,
  }));

const sortOptions = [
  { value: 'featured',   label: 'Featured'           },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc',   label: 'Name: A to Z'       },
];

const SPICE_DOTS   = { 'extra-hot': 4, 'hot': 3, 'medium': 2, 'mild': 1 };
const SPICE_COLORS = { 'extra-hot': 'text-red-600', 'hot': 'text-orange-500', 'medium': 'text-yellow-600', 'mild': 'text-green-600' };

const pageTitle = "Veg Andhra Pickles Online — Mango Avakaya, Gongura & 10 More | Andhra Store";
const pageDesc  = "Shop 12 authentic Andhra vegetarian pickles — Mango Avakaya, Gongura, Tamarind, Karela & more. Handcrafted with no preservatives. 250g from ₹200. Ships pan-India.";

const pageSchema = {
  "@context": "https://schema.org",
  "@type":    "CollectionPage",
  name:        pageTitle,
  description: pageDesc,
  url:        `${SITE_URL}/pickles/veg`,
  provider:   { "@type": "Organization", name: "Andhra Store", url: SITE_URL },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type":    "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",       item: `${SITE_URL}/home`         },
    { "@type": "ListItem", position: 2, name: "Pickles",    item: `${SITE_URL}/pickles`      },
    { "@type": "ListItem", position: 3, name: "Veg Pickles",item: `${SITE_URL}/pickles/veg`  },
  ],
};

const itemListSchema = {
  "@context":    "https://schema.org",
  "@type":       "ItemList",
  name:          "Andhra Store — Vegetarian Pickle Collection",
  description:   "All 12 authentic handcrafted Andhra vegetarian pickles. No preservatives, cold-pressed oils, traditional recipes.",
  url:           `${SITE_URL}/pickles/veg`,
  numberOfItems: vegProducts.length,
  itemListElement: vegProducts.map((p, i) => ({
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

export default function VegPicklesPage() {
  const [sort, setSort] = useState('featured');

  const sorted = useMemo(() => {
    let items = [...vegProducts];
    switch (sort) {
      case 'price-asc':  items.sort((a, b) => a.price - b.price);                break;
      case 'price-desc': items.sort((a, b) => b.price - a.price);                break;
      case 'name-asc':   items.sort((a, b) => a.name.localeCompare(b.name));     break;
      default: break;
    }
    return items;
  }, [sort]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={`${SITE_URL}/pickles/veg`} />
        <meta property="og:title"       content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url"         content={`${SITE_URL}/pickles/veg`} />
        <meta property="og:image"       content={`${SITE_URL}/mango-1.jpeg`} />
        <meta property="og:image:alt"    content="Andhra veg pickles — mango avakaya, gongura, ginger, garlic and more by Andhra Store" />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:title"       content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image"       content={`${SITE_URL}/mango-1.jpeg`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema)       }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema)   }} />
      </Head>
      <Header />

      <section className="bg-white border-b border-gray-100" aria-label="Veg pickles page header">
        <div className="container-main py-8 md:py-10">
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex items-center gap-1.5 text-xs text-gray-400">
              <li><Link href="/home"    className="hover:text-brand-500 transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/pickles" className="hover:text-brand-500 transition-colors">Pickles</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-600 font-medium">Veg Pickles</li>
            </ol>
          </nav>
          <p className="text-[11px] font-bold text-brand-500 uppercase tracking-[0.2em] mb-1">Vegetarian Collection</p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl sm:text-4xl font-heading text-gray-900">Veg Andhra Pickles</h1>
              <p className="text-sm text-gray-500 mt-1.5 max-w-lg">12 authentic vegetarian varieties — Avakaya, Gongura, Tamarind, Karela & more. All handcrafted with no preservatives.</p>
            </div>
            <div className="relative">
              <label htmlFor="sort-veg" className="sr-only">Sort products</label>
              <select id="sort-veg" value={sort} onChange={e => setSort(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-9 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-200 cursor-pointer transition-all">
                {sortOptions.map(o => <option key={o.value} value={o.value}>{`Sort: ${o.label}`}</option>)}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Link href="/pickles"         className="text-xs text-gray-500 hover:text-brand-500 transition-colors">All Pickles</Link>
            <span className="text-xs text-gray-300" aria-hidden="true">|</span>
            <span className="text-xs font-semibold text-brand-600">Veg Pickles</span>
            <span className="text-xs text-gray-300" aria-hidden="true">|</span>
            <Link href="/pickles/non-veg" className="text-xs text-gray-500 hover:text-brand-500 transition-colors">Non-Veg Pickles</Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50/50 min-h-screen" aria-label="Veg pickles grid">
        <div className="container-main py-8 md:py-10">
          <p className="text-sm text-gray-500 mb-5">Showing <span className="font-semibold text-gray-700">{sorted.length}</span> vegetarian pickles</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {sorted.map((p, idx) => {
              const rating    = PRODUCT_RATINGS[p.type]?.rating || 4.5;
              const origPrice = Math.round(p.price * 1.2);
              const discount  = Math.round(((origPrice - p.price) / origPrice) * 100);
              const spiceDots = SPICE_DOTS[p.spiceLevel] || 2;
              const spiceColor= SPICE_COLORS[p.spiceLevel] || 'text-yellow-600';
              return (
                <div key={p.type}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl hover:border-gray-200 hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${idx * 60}ms` }}>
                  <Link href={`/pickles/${TYPE_TO_SLUG[p.type]}`}>
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      {p.badge && (
                        <span className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase shadow-sm ${
                          p.badge === 'BEST SELLER' ? 'bg-brand-500 text-white' :
                          p.badge === 'FAN FAVOURITE' ? 'bg-olive-600 text-white' :
                          'bg-olive-500 text-white'
                        }`}>{p.badge}</span>
                      )}
                      <Image src={p.image} alt={p.imageAlt}
                        width={400} height={400}
                        priority={idx < 8}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1" aria-label={`Rating: ${rating} stars`}>
                        <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="text-xs font-semibold text-gray-700">{rating}</span>
                      </div>
                      <div className={`flex items-center gap-0.5 ${spiceColor}`} aria-label={`Spice: ${PRODUCT_SPICE_LEVELS[p.type]?.label}`}>
                        {[1,2,3,4].map(d => (
                          <span key={d} className={`w-1.5 h-1.5 rounded-full ${d <= spiceDots ? 'bg-current' : 'bg-current opacity-20'}`} />
                        ))}
                      </div>
                    </div>
                    <Link href={`/pickles/${TYPE_TO_SLUG[p.type]}`}>
                      <h2 className="text-sm font-bold text-gray-800 hover:text-brand-600 transition-colors line-clamp-1 mb-0.5">{p.name}</h2>
                    </Link>
                    {p.localName && <p className="text-[9px] text-gray-400 italic mb-1.5">{p.localName}</p>}
                    <div className="flex items-baseline justify-between mt-1">
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
      </section>

      <Footer />
    </>
  );
}
