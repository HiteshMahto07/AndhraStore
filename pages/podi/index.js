import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from 'next/head';
import PodiData from '@/data/podi.json';
import { SITE_URL } from '@/lib/seo';

const allPodi = PodiData.sort((a, b) => a.sortOrder - b.sortOrder);

const sortOptions = [
  { value: 'featured',   label: 'Featured'           },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc',   label: 'Name: A to Z'       },
];

const SPICE_DOTS   = { 'extra-hot': 4, 'hot': 3, 'medium': 2, 'mild': 1 };
const SPICE_COLORS = { 'extra-hot': 'text-red-600', 'hot': 'text-orange-500', 'medium': 'text-yellow-600', 'mild': 'text-green-600' };
const SPICE_LABELS = { 'extra-hot': 'Extra Hot', 'hot': 'Hot', 'medium': 'Medium', 'mild': 'Mild' };

const pageTitle = "Andhra Podi & Gun Powder Online — Kandi Podi, Idly Podi & 7 More | Andhra Store";
const pageDesc  = "Shop 9 authentic Andhra podi & gun powders — Kandi Podi, Idly Podi, Nuvvula Podi, Moringa Podi & more. Handcrafted with no additives. 100g from ₹150. Ships pan-India.";

const pageSchema = {
  "@context": "https://schema.org",
  "@type":    "CollectionPage",
  name:        pageTitle,
  description: pageDesc,
  url:        `${SITE_URL}/podi`,
  provider:   { "@type": "Organization", name: "Andhra Store", url: SITE_URL },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type":    "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",       item: `${SITE_URL}/home` },
    { "@type": "ListItem", position: 2, name: "Podi",       item: `${SITE_URL}/podi` },
  ],
};

const itemListSchema = {
  "@context":    "https://schema.org",
  "@type":       "ItemList",
  name:          "Andhra Store — Podi & Gun Powder Collection",
  description:   "All 9 authentic handcrafted Andhra podi and gun powders. No artificial additives.",
  url:           `${SITE_URL}/podi`,
  numberOfItems: allPodi.length,
  itemListElement: allPodi.map((p, i) => ({
    "@type":  "ListItem",
    position: i + 1,
    name:     p.name,
    url:      `${SITE_URL}/podi/${p.slug}`,
    item: {
      "@type": "Product",
      name:    p.name,
      url:     `${SITE_URL}/podi/${p.slug}`,
      image:   `${SITE_URL}${p.image[0]?.name}`,
      offers:  { "@type": "Offer", priceCurrency: "INR", price: p.amount, availability: "https://schema.org/InStock" },
    },
  })),
};

export default function PodiPage() {
  const [sort, setSort] = useState('featured');

  const sorted = useMemo(() => {
    let items = [...allPodi];
    switch (sort) {
      case 'price-asc':  items.sort((a, b) => a.amount - b.amount);              break;
      case 'price-desc': items.sort((a, b) => b.amount - a.amount);              break;
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
        <link rel="canonical" href={`${SITE_URL}/podi`} />
        <meta property="og:title"       content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url"         content={`${SITE_URL}/podi`} />
        <meta property="og:image"       content={`${SITE_URL}/images/podi/andhra-kandi-podi-hero.webp`} />
        <meta property="og:image:alt"    content="Andhra podi — kandi podi, idly podi, nuvvula podi and more by Andhra Store" />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:title"       content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image"       content={`${SITE_URL}/images/podi/andhra-kandi-podi-hero.webp`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema)       }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema)   }} />
      </Head>
      <Header />

      <section className="bg-white border-b border-gray-100" aria-label="Podi page header">
        <div className="container-main py-8 md:py-10">
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex items-center gap-1.5 text-xs text-gray-400">
              <li><Link href="/home" className="hover:text-brand-500 transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-600 font-medium">Podi</li>
            </ol>
          </nav>
          <p className="text-[11px] font-bold text-brand-500 uppercase tracking-[0.2em] mb-1">Gun Powder & Chutney Powders</p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl sm:text-4xl font-heading text-gray-900">Andhra Podi</h1>
              <p className="text-sm text-gray-500 mt-1.5 max-w-xl">9 authentic Telugu gun powders — Kandi Podi, Idly Podi, Moringa, Nuvvula & more. All handcrafted with no preservatives or artificial additives.</p>
            </div>
            <div className="relative">
              <label htmlFor="sort-podi" className="sr-only">Sort products</label>
              <select id="sort-podi" value={sort} onChange={e => setSort(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-9 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-200 cursor-pointer transition-all">
                {sortOptions.map(o => <option key={o.value} value={o.value}>{`Sort: ${o.label}`}</option>)}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50/50 min-h-screen" aria-label="Podi grid">
        <div className="container-main py-8 md:py-10">
          <p className="text-sm text-gray-500 mb-5">Showing <span className="font-semibold text-gray-700">{sorted.length}</span> podi varieties</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {sorted.map((p, idx) => {
              const origPrice = Math.round(p.amount * 1.2);
              const discount  = Math.round(((origPrice - p.amount) / origPrice) * 100);
              const spiceDots = SPICE_DOTS[p.spiceLevel] || 2;
              const spiceColor= SPICE_COLORS[p.spiceLevel] || 'text-yellow-600';
              return (
                <div key={p.type}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl hover:border-gray-200 hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${idx * 60}ms` }}>
                  <Link href={`/podi/${p.slug}`}>
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      {p.badge && (
                        <span className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase shadow-sm ${
                          p.badge === 'BEST SELLER' ? 'bg-brand-500 text-white' : 'bg-olive-500 text-white'
                        }`}>{p.badge}</span>
                      )}
                      <Image src={p.image[0]?.name} alt={p.image[0]?.alt || p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        width={400} height={400} priority={idx < 4} />
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 ${spiceColor}`}>
                        {SPICE_LABELS[p.spiceLevel]}
                      </span>
                      <div className={`flex items-center gap-0.5 ${spiceColor}`} aria-label={`Spice: ${SPICE_LABELS[p.spiceLevel]}`}>
                        {[1,2,3,4].map(d => (
                          <span key={d} className={`w-1.5 h-1.5 rounded-full ${d <= spiceDots ? 'bg-current' : 'bg-current opacity-20'}`} />
                        ))}
                      </div>
                    </div>
                    <Link href={`/podi/${p.slug}`}>
                      <h2 className="text-sm font-bold text-gray-800 hover:text-brand-600 transition-colors line-clamp-1 mb-0.5">{p.name}</h2>
                    </Link>
                    {p.localName && p.localName !== p.displayName && (
                      <p className="text-[9px] text-gray-400 italic mb-1.5">{p.localName}</p>
                    )}
                    <p className="text-[10px] text-gray-400 line-clamp-2 mb-2 hidden sm:block">{p.shortDesc}</p>
                    <div className="flex items-baseline justify-between mt-1">
                      <div>
                        <span className="text-lg font-extrabold text-gray-900">₹{p.amount}</span>
                        <span className="text-xs text-gray-400 line-through ml-1.5">₹{origPrice}</span>
                      </div>
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">{discount}% OFF</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Info section */}
          <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-heading text-gray-900 mb-3">What is Andhra Podi?</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Podi (పొడి in Telugu) means powder — and in the Andhra kitchen, it refers to dry chutney powders made from roasted lentils, dried chilies, spices, and seeds. These are coarse, dry condiments mixed with a drop of ghee or oil and eaten with rice, idli, or dosa. Every Andhra household keeps 2–3 varieties of podi at all times.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Unlike wet chutneys that spoil within hours, podi keeps for months and ships anywhere in India. Our range covers the essential Telugu podis — from the everyday <Link href="/podi/andhra-kandi-podi" className="text-brand-600 hover:underline">Kandi Podi</Link> to the health-focused <Link href="/podi/andhra-moringa-podi" className="text-brand-600 hover:underline">Moringa Podi</Link>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
