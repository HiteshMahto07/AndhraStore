import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from 'next/head';
import PodiData from '@/data/podi.json';
import { SITE_URL } from '@/lib/seo';
import { buildProductSchema, buildBreadcrumbSchema, buildFaqSchema, buildSpeakableSchema } from '@/lib/schema';
import { PRODUCT_REVIEWS } from '@/lib/reviews';
import { pushViewItem } from '@/lib/analytics';

const SLUG_TO_PODI = Object.fromEntries(PodiData.map(p => [p.slug, p]));

const SPICE_COLORS = {
  'extra-hot': { bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-200'    },
  'hot':       { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  'medium':    { bg: 'bg-yellow-50',  text: 'text-yellow-700', border: 'border-yellow-200' },
  'mild':      { bg: 'bg-green-50',   text: 'text-green-700',  border: 'border-green-200'  },
};
const SPICE_LABELS = { 'extra-hot': 'Extra Hot', 'hot': 'Hot', 'medium': 'Medium', 'mild': 'Mild' };
const SPICE_DOTS   = { 'extra-hot': 4, 'hot': 3, 'medium': 2, 'mild': 1 };

export async function getStaticPaths() {
  const paths = PodiData.map(p => ({ params: { slug: p.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const podi = SLUG_TO_PODI[params.slug] || null;
  if (!podi) return { notFound: true };
  return { props: { podi } };
}

export default function PodiDetail({ podi }) {
  const [qty, setQty]         = useState(1);
  const [added, setAdded]     = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  // Fires once per product-page view, on mount only.
  useEffect(() => {
    pushViewItem({ type: podi.type, name: podi.name, category: 'Podi', unitPrice: podi.amount });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podi.type]);

  const spiceKey    = podi.spiceLevel || 'medium';
  const spiceColors = SPICE_COLORS[spiceKey] || SPICE_COLORS['medium'];
  const spiceDots   = SPICE_DOTS[spiceKey] || 2;
  const spiceLabel  = SPICE_LABELS[spiceKey] || 'Medium';

  const pageUrl   = `${SITE_URL}/podi/${podi.slug}`;
  const pageTitle = `${podi.name} — ${podi.localName} | ₹${podi.amount} | Andhra Store`;
  const pageDesc  = podi.metaDesc || podi.shortDesc;

  const origPrice = Math.round(podi.amount * 1.2);
  const discount  = Math.round(((origPrice - podi.amount) / origPrice) * 100);

  const productSchema = buildProductSchema({
    product:        podi,
    pageUrl,
    category:       "Food > Podi > Andhra Podi",
    additionalType: 'https://schema.org/FoodProduct',
    name:           podi.name,
    description:    podi.desc,
    rating:         { rating: 4.4, count: 58 },
    additionalProp: [
      { "@type": "PropertyValue", name: "Spice Level", value: spiceLabel },
    ],
    sku:            podi.sku,
    reviews:        PRODUCT_REVIEWS[podi.type] || [],
  });
  const speakableSchema = buildSpeakableSchema(podi.name, pageUrl);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home",    item: `${SITE_URL}/home` },
    { name: "Podi",    item: `${SITE_URL}/podi` },
    { name: podi.name, item: pageUrl            },
  ]);

  const faqSchema = buildFaqSchema([
    { q: `How long does ${podi.name} last?`,
      a: "Shelf life is 2–3 months in an airtight container in a cool, dry place. Always use a dry spoon — moisture shortens shelf life significantly." },
    { q: `How do you use ${podi.name}?`,
      a: `Mix 1–2 teaspoons of ${podi.name} with hot rice and a drizzle of ghee or sesame oil. Also excellent as a dry dip alongside idli or dosa. Adjust quantity to your spice preference.` },
    { q: `Does ${podi.name} contain preservatives?`,
      a: `No — ${podi.name} is made without any artificial preservatives, colors, or flavor enhancers. Roasting and drying are the natural preservation methods.` },
  ]);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(i => i.type === podi.type);
    if (existing) existing.qty += qty;
    else cart.push({ type: podi.type, name: podi.name, image: podi.image[0]?.name, price: podi.amount, qty, category: 'podi' });
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Cross-sell: show 3 other podi items
  const crossSells = PodiData.filter(p => p.type !== podi.type).slice(0, 3);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type"        content="product" />
        <meta property="og:title"       content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url"         content={pageUrl} />
        <meta property="og:image"       content={`${SITE_URL}${podi.image[0]?.name}`} />
        <meta property="og:image:alt"   content={podi.image[0]?.alt || podi.name} />
        <meta name="twitter:title"       content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image"       content={`${SITE_URL}${podi.image[0]?.name}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema)    }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema)        }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema)  }} />
      </Head>
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-main py-3">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-xs text-gray-400">
              <li><Link href="/home" className="hover:text-brand-500 transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/podi" className="hover:text-brand-500 transition-colors">Podi</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-600 font-medium">{podi.displayName}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Product section */}
      <section className="bg-white" aria-label={`${podi.name} product details`}>
        <div className="container-main py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">

            {/* Image gallery */}
            <div>
              <div className="relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 mb-3">
                <Image
                  src={podi.image[activeImg]?.name}
                  alt={podi.image[activeImg]?.alt || podi.name}
                  className="w-full h-64 sm:h-80 lg:h-[420px] object-cover"
                  width={800} height={800}
                  priority={activeImg === 0}
                />
                {podi.badge && (
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shadow ${
                    podi.badge === 'BEST SELLER' ? 'bg-brand-500 text-white' : 'bg-olive-500 text-white'
                  }`}>{podi.badge}</span>
                )}
              </div>
              {podi.image.length > 1 && (
                <div className="flex gap-2" role="list" aria-label="Product image thumbnails">
                  {podi.image.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)} role="listitem"
                      aria-label={`View image ${i + 1}`}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImg === i ? 'border-brand-500 shadow-sm' : 'border-gray-200 opacity-60 hover:opacity-100'
                      }`}>
                      <Image src={img.name} alt={img.alt || `${podi.name} view ${i + 1}`}
                        className="w-full h-full object-cover" width={64} height={64} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <p className="text-[11px] font-bold text-brand-500 uppercase tracking-[0.2em] mb-2">Andhra Podi</p>
              <h1 id="product-title" className="text-3xl sm:text-4xl font-heading text-gray-900 mb-1">{podi.name}</h1>
              {podi.localName && podi.localName !== podi.displayName && (
                <p className="text-sm text-gray-400 italic mb-3">{podi.localName}</p>
              )}

              {/* Spice badge */}
              <div className={`inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-lg border mb-4 ${spiceColors.bg} ${spiceColors.border}`}>
                <div className={`flex gap-0.5 ${spiceColors.text}`}>
                  {[1,2,3,4].map(d => (
                    <span key={d} className={`w-2 h-2 rounded-full ${d <= spiceDots ? 'bg-current' : 'bg-current opacity-20'}`} />
                  ))}
                </div>
                <span className={`text-xs font-semibold ${spiceColors.text}`}>{spiceLabel}</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-4xl font-extrabold text-gray-900">₹{podi.amount}</span>
                <span className="text-base text-gray-400 line-through">₹{origPrice}</span>
                <span className="text-sm font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg">{discount}% OFF</span>
              </div>

              {/* Short desc */}
              <p className="text-sm text-gray-600 mb-5 leading-relaxed product-speakable-desc">{podi.shortDesc}</p>

              {/* Attribute pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['100g / 200g', 'No Preservatives', 'No Artificial Color', '2–4 Day Delivery'].map(tag => (
                  <span key={tag} className="text-[11px] font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>

              {/* Qty + Add to cart */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors text-lg font-medium" aria-label="Decrease quantity">−</button>
                  <span className="px-4 py-3 text-sm font-semibold text-gray-800 min-w-[3rem] text-center">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors text-lg font-medium" aria-label="Increase quantity">+</button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${added ? 'bg-green-500 text-white' : 'bg-brand-500 text-white hover:bg-brand-600 active:scale-95'}`}
                >
                  {added ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
              </div>

              {/* Serve with */}
              {podi.servingWith?.length > 0 && (
                <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-2">Best Served With</p>
                  <div className="flex flex-wrap gap-1.5">
                    {podi.servingWith.map(item => (
                      <span key={item} className="text-xs text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">{item}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="bg-gray-50/50 border-t border-gray-100">
        <div className="container-main py-10">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-heading text-gray-900 mb-4">About {podi.name}</h2>
            {podi.desc?.split('\n\n').map((para, i) => (
              <p key={i} className="text-sm text-gray-600 leading-relaxed mb-4">{para}</p>
            ))}
            {podi.storage && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">Storage Instructions</p>
                <p className="text-sm text-blue-700">{podi.storage}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Ingredients */}
      {podi.ingredients?.length > 0 && (
        <section className="bg-white border-t border-gray-100">
          <div className="container-main py-10">
            <h2 className="text-xl font-heading text-gray-900 mb-4">Ingredients</h2>
            <div className="flex flex-wrap gap-2">
              {podi.ingredients.map(ing => (
                <span key={ing.name} className="text-sm text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg">{ing.name}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="bg-gray-50/50 border-t border-gray-100">
        <div className="container-main py-10">
          <h2 className="text-xl font-heading text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4 max-w-2xl">
            {faqSchema.mainEntity.map(({ name, acceptedAnswer }) => (
              <div key={name} className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">{name}</h3>
                <p className="text-sm text-gray-600">{acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* You may also like */}
      {crossSells.length > 0 && (
        <section className="bg-white border-t border-gray-100">
          <div className="container-main py-10">
            <h2 className="text-xl font-heading text-gray-900 mb-6">Other Podi Varieties</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {crossSells.map(p => {
                const sc = SPICE_COLORS[p.spiceLevel] || SPICE_COLORS['medium'];
                return (
                  <Link key={p.type} href={`/podi/${p.slug}`}
                    className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <Image src={p.image[0]?.name} alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        width={300} height={300} />
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs font-bold text-gray-800 group-hover:text-brand-600 transition-colors line-clamp-1">{p.name}</h3>
                      <p className="text-sm font-extrabold text-gray-900 mt-1">₹{p.amount}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
