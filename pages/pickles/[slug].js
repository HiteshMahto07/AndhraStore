import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ARView from '@/components/ARView';
import Head from 'next/head';
import PickleData from '@/data/pickles.json';
import {
  SITE_URL,
  PRODUCT_RATINGS,
  PRODUCT_SEO_NAMES,
  PRODUCT_SEO_DESCS,
  PRODUCT_SHORT_DESCS,
  PRODUCT_LOCAL_NAMES,
  PRODUCT_SPICE_LEVELS,
  PRODUCT_ATTRIBUTES,
  PRODUCT_CROSS_SELLS,
  PRODUCT_SKUS,
  NON_VEG_TYPES,
  TYPE_TO_SLUG,
  SLUG_TO_TYPE,
} from '@/lib/seo';
import { useCart } from '@/context/CartContext';
import { buildProductSchema, buildBreadcrumbSchema, buildFaqSchema, buildSpeakableSchema } from '@/lib/schema';
import { PRODUCT_REVIEWS } from '@/lib/reviews';
import { pushViewItem } from '@/lib/analytics';

// ─── Nutrient highlights per product ─────────────────────────────────────────
const nutrientMap = {
  Chicken: [
    { title: 'High Protein',    desc: 'Supports muscle growth and repair.'      },
    { title: 'Iron Rich',       desc: 'Helps maintain healthy blood cells.'      },
    { title: 'Vitamin B12',     desc: 'Essential for nerve function and energy.' },
    { title: 'Omega-3',         desc: 'Supports heart and brain health.'         },
  ],
  Meat: [
    { title: 'High Protein',    desc: 'Premium source of complete amino acids.'  },
    { title: 'Iron & Zinc',     desc: 'Key minerals for immunity and energy.'    },
    { title: 'Vitamin B12',     desc: 'Essential for nerve and red cell health.' },
    { title: 'Creatine',        desc: 'Naturally occurring in mutton for energy.'},
  ],
  Prawns: [
    { title: 'Lean Protein',    desc: 'High protein, low fat seafood source.'    },
    { title: 'Omega-3',         desc: 'Supports heart function and brain health.'},
    { title: 'Selenium',        desc: 'Powerful antioxidant mineral.'            },
    { title: 'Iodine',          desc: 'Supports thyroid function.'               },
  ],
  Fish: [
    { title: 'Omega-3 DHA/EPA', desc: 'Supports heart health and brain function.'},
    { title: 'Vitamin D',       desc: 'Essential for bone health and immunity.'  },
    { title: 'Selenium',        desc: 'Antioxidant protection for cells.'        },
    { title: 'Vitamin B12',     desc: 'Nerve health and red blood cell support.' },
  ],
  Mango: [
    { title: 'Vitamin C',       desc: 'Boosts immune system and skin health.'    },
    { title: 'Antioxidants',    desc: 'Fights free radicals and inflammation.'   },
    { title: 'Dietary Fiber',   desc: 'Aids digestion and gut health.'           },
    { title: 'Vitamin A',       desc: 'Essential for good vision and immunity.'  },
  ],
  Gongura: [
    { title: 'High Iron',       desc: 'Beneficial for managing anaemia.'         },
    { title: 'Folic Acid',      desc: 'Essential for cell growth and DNA repair.'},
    { title: 'Calcium',         desc: 'Supports bone strength and density.'      },
    { title: 'Antioxidants',    desc: 'Neutralizes free radicals in the body.'   },
  ],
  Ginger: [
    { title: 'Anti-Inflammatory', desc: 'Reduces inflammation and joint pain.'   },
    { title: 'Digestive Aid',   desc: 'Supports healthy digestion naturally.'    },
    { title: 'Antioxidants',    desc: 'Protects cells from oxidative stress.'    },
    { title: 'Immunity Boost',  desc: 'Strengthens the immune system.'           },
  ],
  Garlic: [
    { title: 'Allicin',         desc: 'Powerful antimicrobial compound.'         },
    { title: 'Heart Health',    desc: 'Helps manage blood pressure levels.'      },
    { title: 'Antioxidants',    desc: 'Supports cellular health and longevity.'  },
    { title: 'Anti-Inflammatory', desc: 'Reduces chronic inflammation.'          },
  ],
  RedChilli: [
    { title: 'Capsaicin',       desc: 'Boosts metabolism and reduces inflammation.'},
    { title: 'Vitamin C',       desc: 'High dose from Guntur red chillies.'      },
    { title: 'Antioxidants',    desc: 'Fights free radicals in the body.'        },
    { title: 'Vitamin A',       desc: 'Supports vision and immune function.'     },
  ],
  Lemon: [
    { title: 'Vitamin C',       desc: 'High dose from whole lemon with rind.'    },
    { title: 'Flavonoids',      desc: 'Antioxidant compounds in lemon rind.'     },
    { title: 'Digestive Aid',   desc: 'Natural aid for digestion and cleansing.' },
    { title: 'Limonene',        desc: 'Bioactive compound with antimicrobial effects.'},
  ],
  Tomato: [
    { title: 'Lycopene',        desc: 'Powerful antioxidant for heart health.'   },
    { title: 'Vitamin C',       desc: 'Boosts immunity and skin health.'         },
    { title: 'Potassium',       desc: 'Supports heart and muscle function.'      },
    { title: 'Dietary Fiber',   desc: 'Promotes healthy digestion.'              },
  ],
  Amla: [
    { title: 'Vitamin C',       desc: '20x more than orange — immune booster.'   },
    { title: 'Antioxidants',    desc: 'Polyphenols for cellular protection.'     },
    { title: 'Tannins',         desc: 'Supports liver health and digestion.'     },
    { title: 'Anti-Aging',      desc: 'Gallic acid for cellular longevity.'      },
  ],
  Curry: [
    { title: 'Vitamins A–E',    desc: 'Full spectrum of fat-soluble vitamins.'   },
    { title: 'Alkaloids',       desc: 'Carbazole compounds with antibacterial properties.'},
    { title: 'Iron',            desc: 'Supports healthy blood cell production.'  },
    { title: 'Calcium',         desc: 'Supports bone density and strength.'      },
  ],
  GreenChilli: [
    { title: 'Capsaicin',       desc: 'Fresh capsaicin for metabolism support.'  },
    { title: 'Vitamin C',       desc: 'Higher in fresh chillies than dried.'     },
    { title: 'Vitamin K',       desc: 'Supports bone health and blood clotting.' },
    { title: 'Antioxidants',    desc: 'Fights free radicals in the body.'        },
  ],
};

const processSteps = [
  { icon: '🌱', label: 'Sourced'   },
  { icon: '☀️', label: 'Sun-Dried' },
  { icon: '🫙', label: 'Spiced'    },
  { icon: '⏳', label: 'Cured'     },
  { icon: '📦', label: 'Packed'    },
];

const reviews = [
  { name: 'Priya S.',  initial: 'P', color: 'bg-olive-600',  stars: 5, time: '2 days ago',   text: '"Absolutely love the aroma! Reminds me of my grandmother\'s cooking. The texture is perfect."',           helpful: 12 },
  { name: 'Rahul M.',  initial: 'R', color: 'bg-brand-500',  stars: 5, time: '1 week ago',   text: '"Genuine homemade taste. You can taste the difference compared to store-bought pickles. Highly recommended."', helpful: 8  },
  { name: 'Anita D.',  initial: 'A', color: 'bg-yellow-600', stars: 4, time: '2 weeks ago',  text: '"Packaging was great, and delivery was fast. The pickle is a bit spicy but worth it for the quality."',  helpful: 5  },
];

const ratingBreakdown = [
  { stars: 5, pct: 80 },
  { stars: 4, pct: 15 },
  { stars: 3, pct:  2 },
  { stars: 2, pct:  2 },
  { stars: 1, pct:  1 },
];

// Build full product lookup from JSON for cross-sell cards
const ALL_PRODUCTS_MAP = Object.fromEntries(
  PickleData.map(p => [p.type, p])
);

// Spice level colour classes
const SPICE_COLORS = {
  'extra-hot': { bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-200'    },
  'hot':       { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  'medium':    { bg: 'bg-yellow-50',  text: 'text-yellow-700', border: 'border-yellow-200' },
  'mild':      { bg: 'bg-green-50',   text: 'text-green-700',  border: 'border-green-200'  },
};

const SPICE_DOTS = { 'extra-hot': 4, 'hot': 3, 'medium': 2, 'mild': 1 };

export async function getStaticPaths() {
  const paths = Object.values(TYPE_TO_SLUG).map(slug => ({ params: { slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const type = SLUG_TO_TYPE[slug];
  const pickle = PickleData.find(p => p.type === type) || null;
  if (!pickle) return { notFound: true };
  return { props: { type, pickle } };
}

export default function PickleDetail({ type, pickle }) {
  const [weight, setWeight] = useState('250');
  const [qty,    setQty]    = useState(1);
  const [price,  setPrice]  = useState(pickle.amount);
  const [activeImg, setActiveImg] = useState(0);
  const [showAR, setShowAR] = useState(false);

  useEffect(() => {
    const map = { '250': pickle.amount, '500': pickle.amount * 2, '1': pickle.amount * 4 };
    setPrice(map[weight] * qty);
  }, [weight, qty, pickle]);

  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  // Fires once per product-page view, on mount only.
  useEffect(() => {
    pushViewItem({ type, name: pickle.name, category: 'Pickles', unitPrice: pickle.amount });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleAddToCart = () => {
    const unitPriceMap   = { '250': pickle.amount, '500': pickle.amount * 2, '1': pickle.amount * 4 };
    const weightLabelMap = { '250': '250g', '500': '500g', '1': '1 Kg' };
    addToCart({
      id:          `${type}-${weight}`,
      type,
      name:        pickle.name,
      category:    'Pickles',
      image:       pickle.image[0]?.name,
      weight,
      weightLabel: weightLabelMap[weight],
      unitPrice:   unitPriceMap[weight],
      qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const nutrients       = nutrientMap[type] || [];
  const seoName         = PRODUCT_SEO_NAMES[type]  || pickle.name;
  const localName       = PRODUCT_LOCAL_NAMES[type] || '';
  const shortDesc       = pickle.shortDesc || PRODUCT_SHORT_DESCS[type] || pickle.desc?.slice(0, 100);
  const spice           = PRODUCT_SPICE_LEVELS[type] || { label: 'Medium', num: 2 };
  const spiceKey        = pickle.spiceLevel || 'medium';
  const spiceColors     = SPICE_COLORS[spiceKey] || SPICE_COLORS['medium'];
  const spiceDots       = SPICE_DOTS[spiceKey] || 2;
  const attrs           = PRODUCT_ATTRIBUTES[type] || {};
  const crossSellTypes  = PRODUCT_CROSS_SELLS[type] || [];
  const crossSellItems  = crossSellTypes.map(t => ALL_PRODUCTS_MAP[t]).filter(Boolean);
  const productRating   = PRODUCT_RATINGS[type] || { rating: 4.5, count: 100 };
  const sku             = PRODUCT_SKUS[type] || `AS-${type.toUpperCase()}`;
  const slug            = TYPE_TO_SLUG[type];
  const pageUrl         = `${SITE_URL}/pickles/${slug}`;
  const pageTitle       = `${seoName} — ${localName} | ₹${pickle.amount} | Andhra Store`;
  const pageDesc        = pickle.metaDesc || PRODUCT_SEO_DESCS[type] || pickle.desc?.slice(0, 155);

  const productSchema = buildProductSchema({
    product:        pickle,
    pageUrl,
    category:       NON_VEG_TYPES.has(type) ? 'Andhra Non-Veg Pickle' : 'Andhra Veg Pickle',
    additionalType: 'https://schema.org/FoodProduct',
    name:           seoName,
    description:    PRODUCT_SEO_DESCS[type] || pickle.desc,
    rating:         productRating,
    additionalProp: [
      { "@type": "PropertyValue", name: "Spice Level",  value: spice.label     },
      { "@type": "PropertyValue", name: "Net Weight",   value: attrs.netWeight },
      { "@type": "PropertyValue", name: "Origin",       value: attrs.origin    },
      { "@type": "PropertyValue", name: "Oil Type",     value: attrs.oilType   },
    ],
    sku,
    reviews: PRODUCT_REVIEWS[type] || [],
  });
  const speakableSchema = buildSpeakableSchema(seoName, pageUrl);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: `${SITE_URL}/home` },
    { name: "Shop", item: `${SITE_URL}/pickles` },
    {
      name: NON_VEG_TYPES.has(type) ? "Non-Veg Pickles" : "Veg Pickles",
      item: NON_VEG_TYPES.has(type) ? `${SITE_URL}/pickles/non-veg` : `${SITE_URL}/pickles/veg`,
    },
    { name: seoName, item: pageUrl },
  ]);

  const faqData = [
    {
      q: `How long does ${seoName} last?`,
      a: `Unopened jars remain fresh up to ${attrs.shelfLife || '12 months'} from manufacture date. Once opened, consume within 3 months and refrigerate for maximum freshness.`,
    },
    {
      q: `Is ${seoName} spicy?`,
      a: `${seoName} is rated ${spice.label} on our spice scale. ${spice.label === 'Extra Hot' ? 'This pickle uses Guntur red chillies and is not recommended for low heat tolerance.' : spice.label === 'Hot' ? 'It has bold traditional Andhra heat balanced with the main ingredient flavour.' : 'It has a moderate Andhra-style heat that most palates can enjoy comfortably.'}`,
    },
    {
      q: `Does ${seoName} contain preservatives?`,
      a: `No — ${seoName} is made without any artificial preservatives, colors, or flavor enhancers. The cold-pressed oil and spice base act as natural preservatives.`,
    },
  ];

  const faqSchema = buildFaqSchema(faqData);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type":    "HowTo",
    name:       `How to Store and Serve ${seoName}`,
    description:`Best practices for storing and serving ${seoName} to maintain maximum freshness and authentic flavour.`,
    step: [
      { "@type": "HowToStep", name: "Store in a cool, dry place",    text: "Keep the sealed jar in a cool, dry spot away from direct sunlight and moisture. A pantry shelf or kitchen cabinet is ideal."                              },
      { "@type": "HowToStep", name: "Use a dry, clean spoon",        text: "Every time you serve the pickle, use a completely dry and clean spoon. Even a drop of water introduces bacteria and dramatically shortens shelf life."   },
      { "@type": "HowToStep", name: "Refrigerate after opening",     text: "Once the jar is opened, store it in the refrigerator. Consume within 3 months of opening for the best flavour and freshness."                            },
      { "@type": "HowToStep", name: "Serve as a condiment",          text: `Serve ${seoName} with steamed rice, curd rice, dal rice, roti, or puri. One to two teaspoons per serving is sufficient.`                                 },
    ],
  };

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
        <meta property="og:image"       content={`${SITE_URL}${pickle.image[0]?.name}`} />
        <meta property="og:image:alt"   content={pickle.image[0]?.alt || seoName} />
        <meta property="product:price:amount"   content={String(pickle.amount)} />
        <meta property="product:price:currency" content="INR" />
        <meta name="twitter:title"       content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image"       content={`${SITE_URL}${pickle.image[0]?.name}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema)    }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema)        }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema)      }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema)  }} />
      </Head>
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container-main py-2.5">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-[11px] text-gray-400 flex-wrap">
              <li><Link href="/home"    className="hover:text-gray-700 transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/pickles" className="hover:text-gray-700 transition-colors">Shop</Link></li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={NON_VEG_TYPES.has(type) ? "/pickles/non-veg" : "/pickles/veg"}
                  className="hover:text-gray-700 transition-colors">
                  {NON_VEG_TYPES.has(type) ? "Non-Veg Pickles" : "Veg Pickles"}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-700 font-medium truncate max-w-[200px]">{seoName}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ═══ MAIN PRODUCT SECTION ═══ */}
      <section className="section-pad bg-white" aria-labelledby="product-title">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

            {/* ── Images ── */}
            <div>
              <div className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-3">
                <Image
                  src={pickle.image[activeImg]?.name}
                  alt={pickle.image[activeImg]?.alt || `${seoName} — authentic Andhra-style pickle`}
                  className="w-full h-60 sm:h-80 lg:h-[420px] object-cover"
                  width={800}
                  height={600}
                  priority={activeImg === 0}
                />
              </div>
              {pickle.image.length > 1 && (
                <div className="flex gap-2" role="list" aria-label="Product image thumbnails">
                  {pickle.image.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)} role="listitem"
                      aria-label={`View image ${i + 1}`}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImg === i ? 'border-brand-500 shadow-sm' : 'border-gray-200 opacity-60 hover:opacity-100'
                      }`}>
                      <Image src={img.name} alt={img.alt || `${seoName} view ${i + 1}`}
                        className="w-full h-full object-cover" width={64} height={64} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Details ── */}
            <div className="space-y-5">
              {/* Badges row */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="badge-orange">Authentic Recipe</span>
                {pickle.badge && (
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${
                    pickle.badge === 'BEST SELLER' ? 'bg-brand-500 text-white' :
                    pickle.badge === 'PREMIUM'     ? 'bg-gray-900 text-white'  :
                    pickle.badge === 'FAN FAVOURITE' ? 'bg-olive-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {pickle.badge}
                  </span>
                )}
                {/* Spice level badge */}
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-[10px] font-bold ${spiceColors.bg} ${spiceColors.text} ${spiceColors.border}`}>
                  <span>🌶</span>
                  {spice.label}
                  <span className="flex gap-0.5 ml-0.5">
                    {[1,2,3,4].map(d => (
                      <span key={d} className={`w-1.5 h-1.5 rounded-full ${d <= spiceDots ? 'bg-current' : 'bg-current opacity-20'}`} />
                    ))}
                  </span>
                </span>
              </div>

              {/* Title */}
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 id="product-title" className="text-2xl sm:text-3xl font-heading text-gray-900">{seoName}</h1>
                  <button onClick={() => setShowAR(true)} title="AR Tech View"
                    className="flex-shrink-0 group relative">
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 hover:border-cyan-400 transition-all shadow-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan-600" aria-hidden="true">
                        <path d="M2 7l1-4h18l1 4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 7h20v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="13" r="3"/>
                        <path d="M6 13h.01M18 13h.01" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-medium text-cyan-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">AR View</span>
                  </button>
                </div>
                {localName && (
                  <p className="text-xs text-gray-400 font-medium italic mb-2">{localName}</p>
                )}
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-700">{productRating.rating}</span>
                  <span className="text-xs text-gray-400">|</span>
                  <span className="text-xs text-gray-500">{productRating.count} Reviews</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">₹{price}</span>
                <span className="text-sm text-gray-400 line-through">₹{Math.round(price * 1.2)}</span>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">20% OFF</span>
              </div>

              {/* Short description */}
              <p className="text-sm text-gray-600 leading-relaxed product-speakable-desc">{shortDesc}</p>

              {/* Product attribute pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '250g Base',         icon: '⚖️' },
                  { label: 'No Preservatives',  icon: '✅' },
                  { label: '2–4 Day Delivery',  icon: '🚚' },
                  { label: attrs.oilType || 'Cold-Pressed Oil', icon: '🫙' },
                ].map((a) => (
                  <span key={a.label} className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-md px-2 py-1">
                    <span aria-hidden="true">{a.icon}</span>{a.label}
                  </span>
                ))}
              </div>

              {/* Size + Qty + CTA */}
              <div className="border border-gray-100 rounded-xl p-4">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">Available Sizes</p>
                <div className="flex gap-2 mb-4">
                  {[{ v: '250', l: '250g' }, { v: '500', l: '500g' }, { v: '1', l: '1 Kg' }].map((o) => (
                    <button key={o.v} onClick={() => setWeight(o.v)}
                      aria-pressed={weight === o.v}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                        weight === o.v
                          ? 'border-olive-600 bg-olive-50 text-olive-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}>
                      {o.l}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center rounded-lg border border-gray-200" role="group" aria-label="Quantity">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity"
                      className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-base font-medium">−</button>
                    <span className="w-9 h-9 flex items-center justify-center font-bold text-gray-800 border-x border-gray-200 text-sm" aria-live="polite">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} aria-label="Increase quantity"
                      className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-base font-medium">+</button>
                  </div>
                  <button onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all active:scale-[0.98] ${
                      added ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}>
                    {added ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        Added to Cart!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <Link href="https://wa.me/918758302568" target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-green-700 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp Order
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ NUTRIENT HIGHLIGHTS ═══ */}
      {nutrients.length > 0 && (
        <section className="bg-white border-t border-gray-100" aria-labelledby="nutrient-heading">
          <div className="container-main py-8 md:py-10">
            <div className="bg-cream rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 text-olive-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
                <h2 id="nutrient-heading" className="text-lg font-heading font-bold text-gray-900 uppercase tracking-wide">Nutrient Highlights</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {nutrients.map((n, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-olive-600 text-white text-xs font-bold flex items-center justify-center" aria-hidden="true">{i + 1}</span>
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
      )}

      {/* ═══ DESCRIPTION + DETAILS ═══ */}
      <section className="bg-white" aria-labelledby="product-desc-heading">
        <div className="container-main pb-8 md:pb-10">
          <h2 id="product-desc-heading" className="sr-only">Product Description and Details</h2>
          {pickle.desc?.split('\n\n').map((para, i) => (
            <p key={i} className="text-sm text-gray-600 leading-relaxed mb-3">{para}</p>
          ))}

          {/* Serving suggestions */}
          {pickle.servingWith && pickle.servingWith.length > 0 && (
            <div className="bg-olive-50 border border-olive-100 rounded-xl px-4 py-3 mb-4">
              <p className="text-xs font-bold text-olive-800 mb-2">🍽️ Best Served With</p>
              <div className="flex flex-wrap gap-1.5">
                {pickle.servingWith.map((s) => (
                  <span key={s} className="text-xs text-olive-700 bg-white border border-olive-200 rounded-md px-2 py-0.5">{s}</span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-start gap-2.5 mb-6">
            <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <p className="text-xs text-amber-800"><strong>How to use:</strong> Best served with rice, rotis, or as a side dish. Use a clean, dry spoon every time. Store in a cool, dry place.</p>
          </div>

          <div className="space-y-2">
            {[
              {
                title: 'Ingredients',
                content: (
                  <div className="flex flex-wrap gap-1.5">
                    {pickle.ingredients.map((i) => (
                      <span key={i.name} className="px-3 py-1 bg-gray-100 rounded-md text-xs text-gray-600 font-medium">{i.name}</span>
                    ))}
                  </div>
                ),
              },
              {
                title: 'Health Benefits',
                content: <p className="text-sm text-gray-500 leading-relaxed">{pickle.benefits}</p>,
              },
              {
                title: 'Storage Instructions',
                content: <p className="text-sm text-gray-500 leading-relaxed">{pickle.storage}</p>,
              },
              {
                title: 'Product Specifications',
                content: (
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {[
                      ['SKU',           sku                               ],
                      ['Net Weight',    '250g / 500g / 1kg'               ],
                      ['Origin',        attrs.origin || 'East Godavari'   ],
                      ['Oil Type',      attrs.oilType || 'Cold-Pressed'   ],
                      ['Preservatives', 'None'                            ],
                      ['Shelf Life',    `${attrs.shelfLife || '12 months'} (unopened)`],
                      ['Diet Type',     pickle.category === 'veg' ? '🟢 Vegetarian' : '🔴 Non-Vegetarian'],
                      ['Spice Level',   spice.label                       ],
                    ].map(([k, v]) => (
                      <React.Fragment key={k}>
                        <dt className="text-gray-500 font-medium">{k}</dt>
                        <dd className="text-gray-700">{v}</dd>
                      </React.Fragment>
                    ))}
                  </dl>
                ),
              },
            ].map((card) => (
              <details key={card.title} className="border border-gray-100 rounded-xl group">
                <summary className="px-4 py-3.5 cursor-pointer text-sm font-semibold text-gray-700 flex items-center justify-between list-none hover:bg-gray-50 rounded-xl transition-colors">
                  {card.title}
                  <svg className="w-4 h-4 text-gray-300 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
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
      <section className="bg-gray-50 border-t border-gray-100" aria-labelledby="process-heading">
        <div className="container-main py-8 md:py-10 text-center">
          <p className="text-[10px] font-bold text-olive-600 uppercase tracking-[0.2em] mb-1">Traditional Method</p>
          <h3 id="process-heading" className="text-lg font-heading font-bold text-gray-900 uppercase tracking-wider mb-8">Farm to Jar Process</h3>
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
            {processSteps.map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-2xl" aria-hidden="true">
                    {step.icon}
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{step.label}</span>
                </div>
                {i < processSteps.length - 1 && (
                  <svg className="w-4 h-4 text-gray-300 flex-shrink-0 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="bg-white border-t border-gray-100" aria-labelledby="faq-heading">
        <div className="container-main py-8 md:py-10">
          <h2 id="faq-heading" className="text-xl sm:text-2xl font-heading text-gray-900 italic mb-6">Frequently Asked Questions</h2>
          <div className="max-w-2xl space-y-2">
            {faqData.map((faq, i) => (
              <details key={i} className="border border-gray-100 rounded-xl group">
                <summary className="px-4 py-3.5 cursor-pointer text-sm font-semibold text-gray-700 flex items-center justify-between list-none hover:bg-gray-50 rounded-xl transition-colors">
                  {faq.q}
                  <svg className="w-4 h-4 text-gray-300 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 border-t border-gray-50 pt-3">
                  <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ YOU MIGHT ALSO LIKE (cross-sell) ═══ */}
      {crossSellItems.length > 0 && (
        <section className="bg-white border-t border-gray-100" aria-labelledby="cross-sell-heading">
          <div className="container-main py-8 md:py-10">
            <div className="flex items-end justify-between mb-6">
              <h2 id="cross-sell-heading" className="text-xl sm:text-2xl font-heading text-gray-900 italic">You Might Also Like</h2>
              <Link href="/pickles" className="text-xs font-semibold text-olive-600 hover:text-olive-700 flex items-center gap-1 transition-colors">
                View All
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
              {crossSellItems.map((p) => {
                const pRating   = PRODUCT_RATINGS[p.type] || { rating: 4.5 };
                const origPrice = Math.round(p.amount * 1.2);
                return (
                  <Link key={p.type} href={`/pickles/${TYPE_TO_SLUG[p.type]}`}
                    className="bg-white rounded-xl border border-gray-100 overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      {p.badge && (
                        <span className={`absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                          p.badge === 'BEST SELLER' ? 'bg-brand-500 text-white' :
                          p.badge === 'PREMIUM' ? 'bg-gray-900 text-white' : 'bg-olive-600 text-white'
                        }`}>{p.badge}</span>
                      )}
                      <Image src={p.image[0]?.name} alt={p.image[0]?.alt || `Andhra ${p.displayName} — authentic Andhra pickle`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        width={300} height={300} />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="text-xs font-semibold text-gray-700">{pRating.rating}</span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-800 truncate">{PRODUCT_SEO_NAMES[p.type] || p.name}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">250g</p>
                      <div className="flex items-baseline justify-between mt-1.5">
                        <span className="text-sm font-extrabold text-gray-900">₹{p.amount}</span>
                        <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">20% OFF</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CUSTOMER REVIEWS ═══ */}
      <section className="bg-gray-50 border-t border-gray-100" aria-labelledby="reviews-heading">
        <div className="container-main py-8 md:py-10">
          <h2 id="reviews-heading" className="text-xl sm:text-2xl font-heading text-gray-900 italic mb-6">Customer Reviews</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-4xl font-extrabold text-gray-900">{productRating.rating}</span>
                <div>
                  <div className="flex gap-0.5 mb-0.5" aria-label={`${productRating.rating} out of 5 stars`}>
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className={`w-4 h-4 ${s <= Math.floor(productRating.rating) ? 'text-yellow-400' : 'text-yellow-200'}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">Based on {productRating.count} reviews</p>
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
            <div className="lg:col-span-2 space-y-4">
              {reviews.map((r, i) => (
                <article key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${r.color} text-white text-sm font-bold flex items-center justify-center`} aria-hidden="true">{r.initial}</div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800">{r.name}</h4>
                        <div className="flex items-center gap-1.5">
                          <div className="flex gap-0.5" aria-label={`${r.stars} stars`}>
                            {[1,2,3,4,5].map(s => (
                              <svg key={s} className={`w-3 h-3 ${s <= r.stars ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-400">{r.time}</span>
                        </div>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Verified Buyer
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
                </article>
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
