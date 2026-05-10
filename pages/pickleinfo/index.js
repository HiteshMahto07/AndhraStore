import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ARView from '@/components/ARView';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PickleType from '@/data/pickles.json';
import { SITE_URL, PRODUCT_RATINGS, PRODUCT_SEO_NAMES, PRODUCT_SEO_DESCS, NON_VEG_TYPES } from '@/lib/seo';

/* ── Nutrient highlights per pickle type ── */
const nutrientMap = {
  Chicken: [
    { title: 'High Protein', desc: 'Supports muscle growth and repair.' },
    { title: 'Iron Rich', desc: 'Helps maintain healthy blood cells.' },
    { title: 'Vitamin B12', desc: 'Essential for nerve function and energy.' },
    { title: 'Omega 3', desc: 'Supports heart and brain health.' },
  ],
  Mango: [
    { title: 'Vitamin C', desc: 'Boosts immune system and skin health.' },
    { title: 'Antioxidants', desc: 'Fights free radicals and inflammation.' },
    { title: 'Dietary Fiber', desc: 'Aids digestion and gut health.' },
    { title: 'Vitamin A', desc: 'Essential for good vision and immunity.' },
  ],
  Ginger: [
    { title: 'Anti-Inflammatory', desc: 'Reduces inflammation and joint pain.' },
    { title: 'Digestive Aid', desc: 'Supports healthy digestion naturally.' },
    { title: 'Antioxidants', desc: 'Protects cells from oxidative stress.' },
    { title: 'Immunity Boost', desc: 'Strengthens the immune system.' },
  ],
  Garlic: [
    { title: 'Allicin', desc: 'Powerful antimicrobial compound.' },
    { title: 'Heart Health', desc: 'Helps manage blood pressure levels.' },
    { title: 'Antioxidants', desc: 'Supports cellular health and longevity.' },
    { title: 'Anti-Inflammatory', desc: 'Reduces chronic inflammation.' },
  ],
};
const defaultNutrients = [
  { title: 'Antioxidants', desc: 'Fights free radicals in the body.' },
  { title: 'Dietary Fiber', desc: 'Promotes healthy digestion.' },
  { title: 'Vitamin C', desc: 'Boosts immunity and skin health.' },
  { title: 'Minerals', desc: 'Essential for overall vitality.' },
];

/* ── Process steps ── */
const processSteps = [
  { icon: '🌱', label: 'Sourced' },
  { icon: '☀️', label: 'Sun-Dried' },
  { icon: '🫙', label: 'Spiced' },
  { icon: '⏳', label: 'Cured' },
  { icon: '📦', label: 'Packed' },
];

/* ── Dummy reviews ── */
const reviews = [
  { name: 'Priya S.', initial: 'P', color: 'bg-olive-600', stars: 5, time: '2 days ago', text: '"Absolutely love the aroma! Reminds me of my grandmother\'s cooking. The texture is perfect."', helpful: 12 },
  { name: 'Rahul M.', initial: 'R', color: 'bg-brand-500', stars: 5, time: '1 week ago', text: '"Genuine homemade taste. You can taste the difference compared to store-bought pickles. Highly recommended."', helpful: 8 },
  { name: 'Anita D.', initial: 'A', color: 'bg-yellow-600', stars: 4, time: '2 weeks ago', text: '"Packaging was great, and delivery was fast. The pickle is a bit spicy but worth it for the quality."', helpful: 5 },
];
const ratingBreakdown = [
  { stars: 5, pct: 80 },
  { stars: 4, pct: 15 },
  { stars: 3, pct: 2 },
  { stars: 2, pct: 2 },
  { stars: 1, pct: 1 },
];

/* ── All products for "You Might Also Like" ── */
const allProducts = [
  { name: 'Mango Pickle', image: '/mango-1.jpeg', price: 200, type: 'Mango', rating: 4.9, badge: 'BEST SELLER' },
  { name: 'Chicken Pickle', image: '/chicken-1.jpeg', price: 300, type: 'Chicken', rating: 4.8, badge: 'BEST SELLER' },
  { name: 'Garlic Pickle', image: '/garlic-1.jpeg', price: 200, type: 'Garlic', rating: 4.6 },
  { name: 'Red Chilli Pickle', image: '/redchilli-1.jpeg', price: 200, type: 'RedChilli', rating: 4.4 },
  { name: 'Ginger Pickle', image: '/ginger-1.jpeg', price: 200, type: 'Ginger', rating: 4.5 },
  { name: 'Prawns Pickle', image: '/prawns-1.jpeg', price: 350, type: 'Prawns', rating: 4.7, badge: 'PREMIUM' },
  { name: 'Tomato Pickle', image: '/tomato-1.jpeg', price: 200, type: 'Tomato', rating: 4.4 },
  { name: 'Meat Pickle', image: '/mutton-1.jpeg', price: 350, type: 'Meat', rating: 4.7, badge: 'PREMIUM' },
];

export default function PickleDetail() {
  const router = useRouter();
  const { type } = router.query;
  const pickle = type ? PickleType.find((p) => p.type === type) : null;

  const [weight, setWeight] = useState('250');
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);
  const [activeImg, setActiveImg] = useState(0);
  const [showAR, setShowAR] = useState(false);

  useEffect(() => {
    if (pickle) {
      const map = { '250': pickle.amount, '500': pickle.amount * 2, '1': pickle.amount * 4 };
      setPrice(map[weight] * qty);
    }
  }, [weight, qty, pickle]);

  // Reset active image when pickle type changes
  useEffect(() => { setActiveImg(0); }, [type]);

  const nutrients = nutrientMap[type] || defaultNutrients;
  const recommended = allProducts.filter(p => p.type !== type).slice(0, 5);

  const seoName = PRODUCT_SEO_NAMES[type] || pickle?.name;
  const seoDesc = PRODUCT_SEO_DESCS[type] || pickle?.desc;
  const productRating = PRODUCT_RATINGS[type] || { rating: 4.5, count: 100 };

  const productSchema = pickle ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: seoName,
    description: seoDesc,
    image: pickle.image.map(img => `${SITE_URL}${img.name}`),
    sku: `AS-${type?.toUpperCase()}`,
    category: NON_VEG_TYPES.has(type) ? 'Non-Veg Andhra Pickle' : 'Veg Andhra Pickle',
    brand: { "@type": "Brand", name: "Andhra Store" },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: pickle.amount,
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/pickleinfo?type=${pickle.type}`,
      seller: {
        "@type": "Organization",
        name: "Andhra Store",
        url: SITE_URL,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(productRating.rating),
      reviewCount: String(productRating.count),
    },
  } : null;

  if (!pickle) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-live="polite">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" aria-hidden="true" />
            <span className="text-sm text-gray-400">Loading…</span>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const pageTitle = PRODUCT_SEO_NAMES[type]
    ? `${PRODUCT_SEO_NAMES[type]} | ₹${pickle.amount} | Andhra Store`
    : `${pickle.name} — Authentic Andhra Pickle | Andhra Store`;
  const pageDesc = PRODUCT_SEO_DESCS[type] || pickle.desc?.slice(0, 155) || `Buy authentic ${pickle.name} handcrafted with traditional Andhra recipes. No preservatives, pure spices, pan-India delivery.`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={`${SITE_URL}/pickleinfo?type=${pickle.type}`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={`${SITE_URL}/pickleinfo?type=${pickle.type}`} />
        <meta property="og:image" content={`${SITE_URL}${pickle.image[0]?.name}`} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={`${SITE_URL}${pickle.image[0]?.name}`} />
        {productSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
          />
        )}
      </Head>
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container-main py-2.5 flex items-center gap-2 text-[11px] text-gray-400">
          <Link href="/home" className="hover:text-gray-700 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/pickle?type=veg" className="hover:text-gray-700 transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">{pickle.name}</span>
        </div>
      </div>

      {/* ═══ MAIN PRODUCT SECTION ═══ */}
      <section className="section-pad bg-white">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div>
              <div className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-3">
                <img
                  src={pickle.image[activeImg]?.name}
                  alt={`${pickle.name} — authentic Andhra-style pickle handcrafted with traditional spices`}
                  className="w-full h-60 sm:h-80 lg:h-[420px] object-cover"
                  width={800}
                  height={600}
                />
              </div>
              {pickle.image.length > 1 && (
                <div className="flex gap-2">
                  {pickle.image.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImg === i ? 'border-brand-500 shadow-sm' : 'border-gray-200 opacity-60 hover:opacity-100'
                        }`}>
                      <img src={img.name} alt={`${pickle.name} view ${i + 1}`} className="w-full h-full object-cover" width={64} height={64} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-5">
              <div>
                {/* Category + Rating */}
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="badge-orange">Authentic Recipe</span>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-700">4.8</span>
                    <span className="text-xs text-gray-400">|</span>
                    <span className="text-xs text-gray-500">245 Reviews</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-heading text-gray-900">{pickle.name}</h1>
                  <button onClick={() => setShowAR(true)} title="AR Tech View" className="flex-shrink-0 group relative">
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 hover:border-cyan-400 hover:from-cyan-500/20 hover:to-blue-500/20 transition-all shadow-sm hover:shadow-cyan-500/20">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan-600 group-hover:text-cyan-500 transition-colors">
                        <path d="M2 7l1-4h18l1 4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 7h20v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="13" r="3"/><path d="M6 13h.01M18 13h.01" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-medium text-cyan-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">AR View</span>
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">₹{price}</span>
                <span className="text-sm text-gray-400 line-through">₹{Math.round(price * 1.2)}</span>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">20% OFF</span>
              </div>
              <p className="text-sm text-gray-500">{pickle.desc?.slice(0, 120)}...</p>

              {/* Delivery badges */}
              <div className="flex items-center gap-4 py-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <svg className="w-4 h-4 text-olive-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                  <span className="font-semibold">2-4 Days Delivery</span>
                </div>
                <div className="w-px h-4 bg-gray-200" />
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <svg className="w-4 h-4 text-olive-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span className="font-semibold">Quality Tested</span>
                </div>
              </div>

              {/* Available Sizes */}
              <div className="border border-gray-100 rounded-xl p-4">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">Available Sizes</p>
                <div className="flex gap-2 mb-4">
                  {[{ v: '250', l: '250g' }, { v: '500', l: '500g' }, { v: '1', l: '1 Kg' }].map((o) => (
                    <button key={o.v} onClick={() => setWeight(o.v)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${weight === o.v
                        ? 'border-olive-600 bg-olive-50 text-olive-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}>
                      {o.l}
                    </button>
                  ))}
                </div>

                {/* Qty + Add to Cart inline */}
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center rounded-lg border border-gray-200">
                    <button onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-base font-medium">−</button>
                    <span className="w-9 h-9 flex items-center justify-center font-bold text-gray-800 border-x border-gray-200 text-sm">{qty}</span>
                    <button onClick={() => setQty(qty + 1)}
                      className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-base font-medium">+</button>
                  </div>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-all active:scale-[0.98]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <Link href="https://wa.me/918758302568" target="_blank"
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-green-700 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp Order
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ NUTRIENT HIGHLIGHTS ═══ */}
      <section className="bg-white border-t border-gray-100">
        <div className="container-main py-8 md:py-10">
          <div className="bg-cream rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 text-olive-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
              <h2 className="text-lg font-heading font-bold text-gray-900 uppercase tracking-wide">Nutrient Highlights</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {nutrients.map((n, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-olive-600 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">{n.title}</h4>
                    <p className="text-xs text-gray-500">{n.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ DESCRIPTION + DETAILS ═══ */}
      <section className="bg-white">
        <div className="container-main pb-8 md:pb-10">
          <p className="text-sm text-gray-600 leading-relaxed mb-3">{pickle.desc}</p>
          {pickle.desc2 && <p className="text-sm text-gray-600 leading-relaxed mb-3">{pickle.desc2}</p>}

          {/* How to use tip */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-start gap-2.5 mb-6">
            <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <p className="text-xs text-amber-800"><strong>How to use:</strong> Best served with rice, rotis, or as a side dish with any meal. Store in a cool, dry place.</p>
          </div>

          {/* Accordion details */}
          <div className="space-y-2">
            {[
              { title: 'Ingredients', content: <div className="flex flex-wrap gap-1.5">{pickle.ingredients.map((i) => <span key={i.name} className="px-3 py-1 bg-gray-100 rounded-md text-xs text-gray-600 font-medium">{i.name}</span>)}</div> },
              { title: 'Health Benefits', content: <p className="text-sm text-gray-500 leading-relaxed">{pickle.benefits}</p> },
              { title: 'Storage', content: <p className="text-sm text-gray-500 leading-relaxed">{pickle.storage}</p> },
            ].map((card) => (
              <details key={card.title} className="border border-gray-100 rounded-xl group">
                <summary className="px-4 py-3.5 cursor-pointer text-sm font-semibold text-gray-700 flex items-center justify-between list-none hover:bg-gray-50 rounded-xl transition-colors">
                  {card.title}
                  <svg className="w-4 h-4 text-gray-300 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 border-t border-gray-50 pt-3">{card.content}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FARM TO JAR PROCESS ═══ */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="container-main py-8 md:py-10 text-center">
          <p className="text-[10px] font-bold text-olive-600 uppercase tracking-[0.2em] mb-1">Traditional Method</p>
          <h3 className="text-lg font-heading font-bold text-gray-900 uppercase tracking-wider mb-8">Farm to Jar Process</h3>
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
            {processSteps.map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-2xl">
                    {step.icon}
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{step.label}</span>
                </div>
                {i < processSteps.length - 1 && (
                  <svg className="w-4 h-4 text-gray-300 flex-shrink-0 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ YOU MIGHT ALSO LIKE ═══ */}
      <section className="bg-white border-t border-gray-100">
        <div className="container-main py-8 md:py-10">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-heading text-gray-900 italic">You Might Also Like</h2>
            <Link href="/pickle?type=veg" className="text-xs font-semibold text-olive-600 hover:text-olive-700 flex items-center gap-1 transition-colors">
              View All
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {recommended.map((p) => (
              <Link key={p.type} href={{ pathname: '/pickleinfo', query: { type: p.type } }}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  {p.badge && (
                    <span className={`absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                      p.badge === 'BEST SELLER' ? 'bg-brand-500 text-white' : 'bg-gray-900 text-white'
                    }`}>{p.badge}</span>
                  )}
                  <img src={p.image} alt={`${p.name} — authentic Andhra pickle`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" width={300} height={300} />
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-xs font-semibold text-gray-700">{p.rating}</span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-800 truncate">{p.name}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">250g</p>
                  <div className="flex items-baseline justify-between mt-1.5">
                    <span className="text-sm font-extrabold text-gray-900">₹{p.price}</span>
                    <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">20% OFF</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CUSTOMER REVIEWS ═══ */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="container-main py-8 md:py-10">
          <h2 className="text-xl sm:text-2xl font-heading text-gray-900 italic mb-6">Customer Reviews</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Rating summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-4xl font-extrabold text-gray-900">4.8</span>
                <div>
                  <div className="flex gap-0.5 mb-0.5">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className={`w-4 h-4 ${s <= 4 ? 'text-yellow-400' : 'text-yellow-200'}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">Based on 245 reviews</p>
                </div>
              </div>

              <div className="space-y-2 mt-5">
                {ratingBreakdown.map((r) => (
                  <div key={r.stars} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-4">{r.stars}★</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-olive-500 rounded-full" style={{ width: `${r.pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">{r.pct}%</span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                Write a Review
              </button>
            </div>

            {/* Reviews list */}
            <div className="lg:col-span-2 space-y-4">
              {reviews.map((r, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${r.color} text-white text-sm font-bold flex items-center justify-center`}>{r.initial}</div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800">{r.name}</h4>
                        <div className="flex items-center gap-1.5">
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <svg key={s} className={`w-3 h-3 ${s <= r.stars ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-400">{r.time}</span>
                        </div>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Verified Buyer
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{r.text}</p>
                  <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                    </svg>
                    Helpful ({r.helpful})
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      {showAR && <ARView pickle={pickle} onClose={() => setShowAR(false)} />}
    </>
  );
}