import Link from 'next/link';
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from 'next/head';
import SweetsData from '@/data/sweets.json';
import { SITE_URL } from '@/lib/seo';
import { useCart } from '@/context/CartContext';

const allSweets = [...SweetsData].sort((a, b) => a.sortOrder - b.sortOrder);

const sortOptions = [
  { value: 'featured',   label: 'Featured'           },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc',   label: 'Name: A to Z'       },
];

const pageTitle = "Andhra Sweets Online — Ariselu, Kaja, Pootharekulu & More | Andhra Store";
const pageDesc  = "Shop authentic Andhra sweets — Ariselu, Madta Kaja, Pootharekulu, Sunundalu, Gulab Puvu, Bellam Gavalu & more. Traditional recipes, pure ingredients. Ships pan-India.";

const pageSchema = {
  "@context": "https://schema.org",
  "@type":    "CollectionPage",
  name:        pageTitle,
  description: pageDesc,
  url:        `${SITE_URL}/sweets`,
  provider:   { "@type": "Organization", name: "Andhra Store", url: SITE_URL },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type":    "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",   item: `${SITE_URL}/home`   },
    { "@type": "ListItem", position: 2, name: "Sweets", item: `${SITE_URL}/sweets` },
  ],
};

const itemListSchema = {
  "@context":    "https://schema.org",
  "@type":       "ItemList",
  name:          "Andhra Store — Traditional Sweets Collection",
  description:   "Authentic Andhra sweets: Ariselu, Madta Kaja, Pootharekulu, Sunundalu, Gulab Puvu & more.",
  url:           `${SITE_URL}/sweets`,
  numberOfItems: allSweets.length,
  itemListElement: allSweets.map((p, i) => ({
    "@type": "ListItem", position: i + 1, name: p.name,
    url: `${SITE_URL}/sweets/${p.slug}`,
    item: {
      "@type": "Product", name: p.name, url: `${SITE_URL}/sweets/${p.slug}`,
      image: `${SITE_URL}${p.image[0]?.name}`,
      offers: { "@type": "Offer", priceCurrency: "INR", price: p.amount, availability: "https://schema.org/InStock" },
    },
  })),
};

export default function SweetsPage() {
  const { addToCart } = useCart();
  const [sort, setSort]           = useState('featured');
  const [addedType, setAddedType] = useState(null);

  const sorted = useMemo(() => {
    let items = [...allSweets];
    switch (sort) {
      case 'price-asc':  items.sort((a, b) => a.amount - b.amount);           break;
      case 'price-desc': items.sort((a, b) => b.amount - a.amount);           break;
      case 'name-asc':   items.sort((a, b) => a.name.localeCompare(b.name));  break;
      default: break;
    }
    return items;
  }, [sort]);

  const handleAdd = (p) => {
    addToCart({ id: p.type, type: p.type, name: p.name, image: p.image[0]?.name, unitPrice: p.amount, price: p.amount, qty: 1 });
    setAddedType(p.type);
    setTimeout(() => setAddedType(null), 1800);
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={`${SITE_URL}/sweets`} />
        <meta property="og:title"       content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url"         content={`${SITE_URL}/sweets`} />
        <meta property="og:image"       content={`${SITE_URL}/images/sweets/ariselu-hero.jpg`} />
        <meta property="og:image:alt"    content="Andhra sweets — ariselu, pootharekulu, kaja and more traditional sweets by Andhra Store" />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:title"       content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image"       content={`${SITE_URL}/images/sweets/ariselu-hero.jpg`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema)       }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema)   }} />
      </Head>
      <Header />

      {/* Page header */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-main py-8 md:py-10">
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex items-center gap-1.5 text-xs text-gray-400">
              <li><Link href="/home" className="hover:text-brand-500 transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-600 font-medium">Andhra Sweets</li>
            </ol>
          </nav>
          <p className="text-[11px] font-bold text-brand-500 uppercase tracking-[0.2em] mb-1">Traditional Andhra Sweets</p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl sm:text-4xl font-heading text-gray-900">Andhra Sweets</h1>
              <p className="text-sm text-gray-500 mt-1.5 max-w-xl">
                {allSweets.length} authentic varieties — Ariselu, Kaja, Pootharekulu, Sunundalu & more. Made with jaggery, ghee & traditional recipes.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{sorted.length} products</span>
              <div className="relative">
                <label htmlFor="sort-sweets" className="sr-only">Sort products</label>
                <select id="sort-sweets" value={sort} onChange={e => setSort(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-9 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-200 cursor-pointer transition-all">
                  {sortOptions.map(o => <option key={o.value} value={o.value}>Sort: {o.label}</option>)}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="bg-gray-50/50 min-h-screen">
        <div className="container-main py-8 md:py-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {sorted.map((p, idx) => {
              const origPrice = Math.round(p.amount * 1.2);
              const discount  = Math.round(((origPrice - p.amount) / origPrice) * 100);
              const isAdded   = addedType === p.type;
              return (
                <div key={p.type}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-lg hover:border-gray-200 hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
                  <Link href={`/sweets/${p.slug}`} className="relative block overflow-hidden bg-gray-50 aspect-square">
                    {p.badge && (
                      <span className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase shadow-sm ${
                        p.badge === 'BEST SELLER'   ? 'bg-brand-500 text-white'  :
                        p.badge === 'FAN FAVOURITE' ? 'bg-olive-600 text-white'  :
                        'bg-olive-500 text-white'
                      }`}>{p.badge}</span>
                    )}
                    <Image src={p.image[0]?.name} alt={p.image[0]?.alt || p.name}
                      width={400} height={400}
                      priority={idx < 4}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                  <div className="p-4 flex flex-col flex-1">
                    <Link href={`/sweets/${p.slug}`}>
                      <h2 className="text-sm font-bold text-gray-900 hover:text-brand-600 transition-colors line-clamp-1 mb-0.5">{p.name}</h2>
                    </Link>
                    {p.localName && p.localName !== p.displayName && (
                      <p className="text-[10px] text-gray-400 italic mb-1 line-clamp-1">{p.localName}</p>
                    )}
                    <p className="text-[11px] text-gray-500 line-clamp-2 mb-3 hidden sm:block leading-relaxed flex-1">{p.shortDesc}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-extrabold text-gray-900">₹{p.amount}</span>
                        <span className="text-xs text-gray-400 line-through">₹{origPrice}</span>
                      </div>
                      <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">{discount}% OFF</span>
                    </div>
                    <button onClick={() => handleAdd(p)}
                      className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                        isAdded ? 'bg-green-500 text-white' : 'bg-brand-500 text-white hover:bg-brand-600 active:scale-95'
                      }`}>
                      {isAdded ? '✓ Added' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Heritage info */}
          <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-heading text-gray-900 mb-3">The Heritage of Andhra Sweets</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Andhra Pradesh has one of India&apos;s richest sweet-making traditions — from the GI-tagged <Link href="/sweets/pootharekulu" className="text-brand-600 hover:underline">Pootharekulu of Atreyapuram</Link> and <Link href="/sweets/madta-kaja" className="text-brand-600 hover:underline">Kakinada Kaja</Link>, to festival essentials like <Link href="/sweets/ariselu" className="text-brand-600 hover:underline">Ariselu</Link> and <Link href="/sweets/sunundalu" className="text-brand-600 hover:underline">Sunundalu</Link>.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Our sweets are made with unrefined jaggery, pure cow ghee, and traditional methods — no refined sugar, no glucose syrup, no artificial colors. The same ingredients and methods used for centuries in East Godavari home kitchens.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
