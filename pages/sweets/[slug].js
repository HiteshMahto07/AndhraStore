import Link from 'next/link';
import React, { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from 'next/head';
import SweetsData from '@/data/sweets.json';
import { SITE_URL } from '@/lib/seo';
import { useCart } from '@/context/CartContext';
import { buildProductSchema, buildBreadcrumbSchema, buildFaqSchema, buildSpeakableSchema } from '@/lib/schema';
import { PRODUCT_REVIEWS } from '@/lib/reviews';

const SLUG_MAP = Object.fromEntries(SweetsData.map(p => [p.slug, p]));

export async function getStaticPaths() {
  return { paths: SweetsData.map(p => ({ params: { slug: p.slug } })), fallback: false };
}
export async function getStaticProps({ params }) {
  const item = SLUG_MAP[params.slug] || null;
  if (!item) return { notFound: true };
  return { props: { item } };
}

const TRUST_BADGES = [
  { icon: '🚚', label: 'Free Delivery',      sub: 'Pan-India' },
  { icon: '🍯', label: 'Pure Ingredients',   sub: 'No Refined Sugar*' },
  { icon: '🏺', label: 'Handcrafted',         sub: 'Small Batch' },
  { icon: '↩️', label: '7-Day Returns',       sub: 'Easy Policy' },
];

export default function SweetDetail({ item }) {
  const { addToCart }   = useCart();
  const [qty, setQty]   = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImg, setActiveImg] = useState(0);

  const origPrice  = Math.round(item.amount * 1.2);
  const discount   = Math.round(((origPrice - item.amount) / origPrice) * 100);
  const totalPrice = item.amount * qty;

  const pageUrl   = `${SITE_URL}/sweets/${item.slug}`;
  const pageTitle = `${item.name} — ${item.localName} | Buy Online ₹${item.amount} | Andhra Store`;
  const pageDesc  = item.metaDesc || item.shortDesc;

  const productSchema = buildProductSchema({
    product:        item,
    pageUrl,
    category:       "Food > Sweets > Traditional Indian Sweets",
    additionalType: 'https://schema.org/FoodProduct',
    name:           item.name,
    description:    item.desc,
    rating:         { rating: 4.5, count: 61 },
    sku:            item.sku,
    reviews:        PRODUCT_REVIEWS[item.type] || [],
  });
  const speakableSchema = buildSpeakableSchema(item.name, pageUrl);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home",    item: `${SITE_URL}/home`   },
    { name: "Sweets",  item: `${SITE_URL}/sweets` },
    { name: item.name, item: pageUrl              },
  ]);

  const faqSchema = buildFaqSchema([
    { q: `How long does ${item.name} last?`,
      a: item.storage || "Store in airtight container at room temperature. Check product label for exact shelf life." },
    { q: `Does ${item.name} use refined sugar?`,
      a: "Most of our Andhra sweets use unrefined jaggery (bellam) as the primary sweetener rather than refined white sugar — preserving the molasses, minerals, and complex flavor of traditional recipes." },
    { q: `How is ${item.name} shipped without damage?`,
      a: "We pack all sweets with bubble wrap and rigid outer packaging to prevent breakage during transit. Pan-India delivery in 2–4 business days." },
  ]);

  const handleAddToCart = () => {
    addToCart({ id: item.type, type: item.type, name: item.name, image: item.image[0]?.name, unitPrice: item.amount, price: item.amount * qty, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const related = SweetsData.filter(p => p.type !== item.type).slice(0, 4);

  const tabs = [
    { id: 'description', label: 'About'        },
    { id: 'ingredients', label: 'Ingredients'  },
    { id: 'storage',     label: 'Storage'      },
    { id: 'faq',         label: 'FAQ'          },
  ];

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
        <meta property="og:image"       content={`${SITE_URL}${item.image[0]?.name}`} />
        <meta property="og:image:alt"   content={item.image[0]?.alt || item.name} />
        <meta property="product:price:amount"   content={String(item.amount)} />
        <meta property="product:price:currency" content="INR" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image"       content={`${SITE_URL}${item.image[0]?.name}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema)    }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema)        }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema)  }} />
      </Head>
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container-main py-2.5">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-[11px] text-gray-400 flex-wrap">
              <li><Link href="/home"   className="hover:text-gray-700 transition-colors">Home</Link></li>
              <li>/</li>
              <li><Link href="/sweets" className="hover:text-gray-700 transition-colors">Sweets</Link></li>
              <li>/</li>
              <li className="text-gray-700 font-medium truncate max-w-[200px]">{item.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ══ MAIN PRODUCT SECTION ══ */}
      <section className="section-pad bg-white" aria-labelledby="product-title">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">

            {/* Image gallery */}
            <div>
              <div className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 mb-3 relative group">
                <Image
                  src={item.image[activeImg]?.name}
                  alt={item.image[activeImg]?.alt || item.name}
                  width={800} height={600}
                  priority
                  className="w-full h-64 sm:h-96 lg:h-[460px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {item.badge && (
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shadow-md ${
                    item.badge === 'BEST SELLER'   ? 'bg-brand-500 text-white' :
                    item.badge === 'FAN FAVOURITE' ? 'bg-olive-600 text-white' :
                    'bg-olive-500 text-white'
                  }`}>{item.badge}</span>
                )}
                <span className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">IN STOCK</span>
              </div>
              {item.image.length > 1 && (
                <div className="flex gap-2">
                  {item.image.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-brand-500 shadow-sm' : 'border-gray-200 opacity-60 hover:opacity-100'}`}>
                      <Image src={img.name} alt={`${item.name} view ${i + 1}`} width={64} height={64} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product details panel */}
            <div className="space-y-5">

              {/* Category + badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/sweets" className="text-[11px] font-semibold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full hover:bg-pink-100 transition-colors">
                  🍬 Andhra Sweets
                </Link>
                {item.badge && (
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    item.badge === 'BEST SELLER'   ? 'bg-amber-100 text-amber-800' :
                    item.badge === 'FAN FAVOURITE' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-700'
                  }`}>{item.badge}</span>
                )}
              </div>

              {/* Title + rating */}
              <div>
                <h1 id="product-title" className="text-2xl sm:text-3xl font-heading text-gray-900 mb-1">{item.name}</h1>
                {item.localName && item.localName !== item.displayName && (
                  <p className="text-xs text-gray-400 italic mb-3">{item.localName}</p>
                )}
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className={`w-4 h-4 ${s <= 4 ? 'text-yellow-400' : s === 5 ? 'text-yellow-300' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">4.5</span>
                  <span className="text-xs text-gray-400">61 reviews</span>
                  <span className="text-[10px] text-green-600 font-medium ml-1">● Verified</span>
                </div>
              </div>

              {/* Price block */}
              <div className="bg-pink-50/40 rounded-xl p-4 border border-pink-100">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-3xl font-bold text-gray-900">₹{totalPrice}</span>
                  <span className="text-sm text-gray-400 line-through">₹{Math.round(origPrice * qty)}</span>
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-md">{discount}% OFF</span>
                </div>
                <p className="text-[11px] text-gray-500">Inclusive of all taxes · Free delivery</p>
              </div>

              {/* Short desc */}
              <p className="text-sm text-gray-600 leading-relaxed product-speakable-desc">{item.shortDesc}</p>

              {/* Quantity + CTA */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="px-4 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors font-medium text-lg leading-none" aria-label="Decrease">−</button>
                    <span className="px-5 py-2.5 text-sm font-semibold text-gray-800 min-w-[3rem] text-center border-x border-gray-200">{qty}</span>
                    <button onClick={() => setQty(q => q + 1)}
                      className="px-4 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors font-medium text-lg leading-none" aria-label="Increase">+</button>
                  </div>
                </div>
                <button onClick={handleAddToCart}
                  className={`w-full py-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 shadow-sm ${
                    added ? 'bg-green-500 text-white shadow-green-200' : 'bg-brand-500 text-white hover:bg-brand-600 active:scale-[0.99]'
                  }`}>
                  {added ? '✓ Added to Cart' : `Add to Cart — ₹${totalPrice}`}
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {TRUST_BADGES.map(b => (
                  <div key={b.label} className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                    <span className="text-base flex-shrink-0">{b.icon}</span>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-700">{b.label}</p>
                      <p className="text-[10px] text-gray-400">{b.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Meta info */}
              <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-500">
                <div className="flex gap-2"><span className="font-medium text-gray-600 w-24">SKU:</span><span>{item.sku}</span></div>
                {item.servingWith?.length > 0 && (
                  <div className="flex gap-2">
                    <span className="font-medium text-gray-600 w-24 flex-shrink-0">Best with:</span>
                    <span>{item.servingWith?.slice(0,3).join(' · ')}</span>
                  </div>
                )}
                <div className="flex gap-2 items-start">
                  <span className="font-medium text-gray-600 w-24 flex-shrink-0">Sweetener:</span>
                  <span>Jaggery (unrefined) — no refined sugar*</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TABBED CONTENT ══ */}
      <section className="bg-gray-50/50 border-t border-gray-100">
        <div className="container-main py-8">
          <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors -mb-px ${
                  activeTab === t.id ? 'border-brand-500 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="max-w-3xl">
            {activeTab === 'description' && (
              <div>
                {item.desc?.split('\n\n').map((para, i) => (
                  <p key={i} className="text-sm text-gray-600 leading-relaxed mb-4 last:mb-0">{para}</p>
                ))}
              </div>
            )}
            {activeTab === 'ingredients' && (
              <div>
                <h2 className="text-base font-semibold text-gray-800 mb-4">Ingredients</h2>
                {item.ingredients?.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.ingredients.map(ing => (
                      <span key={ing.name} className="text-sm text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg">{ing.name}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-4">Traditional ingredients — pure ghee, jaggery, and natural spices.</p>
                )}
                <p className="text-xs text-gray-400">*Where jaggery is used as sweetener, no refined sugar is added. Some products like Mysore Pak and Boondi Laddu use sugar syrup as per traditional recipe requirements.</p>
              </div>
            )}
            {activeTab === 'storage' && (
              <div>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Storage Instructions</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">{item.storage}</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { icon: '🏺', title: 'Airtight Container', desc: 'Transfer to an airtight container after opening to maintain freshness.' },
                    { icon: '🌡️', title: 'Cool & Dry',          desc: 'Keep away from direct sunlight, heat sources, and humidity.' },
                    { icon: '❄️', title: 'Refrigerate?',         desc: 'Most sweets keep better at room temperature. Refrigerate only in summer or as noted.' },
                    { icon: '📦', title: 'Travel-Friendly',      desc: 'Safe to carry — packaged securely for transit and gifting.' },
                  ].map(tip => (
                    <div key={tip.title} className="flex gap-3 bg-white rounded-xl border border-gray-100 p-3.5">
                      <span className="text-lg flex-shrink-0">{tip.icon}</span>
                      <div>
                        <p className="text-xs font-semibold text-gray-700">{tip.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{tip.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'faq' && (
              <div className="space-y-3">
                {faqSchema.mainEntity.map(({ name, acceptedAnswer }) => (
                  <div key={name} className="bg-white rounded-xl border border-gray-100 p-5">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">{name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══ RELATED SWEETS ══ */}
      {related.length > 0 && (
        <section className="bg-white border-t border-gray-100">
          <div className="container-main py-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading text-gray-900">More Andhra Sweets</h2>
              <Link href="/sweets" className="text-sm text-brand-600 hover:underline font-medium">View All →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(p => {
                const op = Math.round(p.amount * 1.2);
                return (
                  <Link key={p.type} href={`/sweets/${p.slug}`}
                    className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <Image src={p.image[0]?.name} alt={p.name}
                        width={300} height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs font-bold text-gray-800 group-hover:text-brand-600 transition-colors line-clamp-1 mb-1">{p.name}</h3>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-extrabold text-gray-900">₹{p.amount}</span>
                        <span className="text-[11px] text-gray-400 line-through">₹{op}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 px-4 py-3 flex gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="flex-1">
          <p className="text-xs text-gray-500 leading-tight">{item.name}</p>
          <p className="text-base font-bold text-gray-900">₹{totalPrice}</p>
        </div>
        <button onClick={handleAddToCart}
          className={`flex-shrink-0 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
            added ? 'bg-green-500 text-white' : 'bg-brand-500 text-white hover:bg-brand-600'
          }`}>
          {added ? '✓ Added' : 'Add to Cart'}
        </button>
      </div>
      <div className="h-16 md:hidden" aria-hidden="true" />

      <Footer />
    </>
  );
}
