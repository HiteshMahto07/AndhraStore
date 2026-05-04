import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import SectionHeading from '@/components/SectionHeading';

const BASE_URL = "https://www.andhrastore.in";

const categories = [
  { name: 'Chicken', image: '/chicken-1.jpeg', type: 'Chicken' },
  { name: 'Mango', image: '/mango-1.jpeg', type: 'Mango' },
  { name: 'Prawns', image: '/prawns-1.jpeg', type: 'Prawns' },
  { name: 'Ginger', image: '/ginger-1.jpeg', type: 'Ginger' },
  { name: 'Garlic', image: '/garlic-1.jpeg', type: 'Garlic' },
  { name: 'Red Chilli', image: '/redchilli-1.jpeg', type: 'RedChilli' },
];

const bestSellers = [
  { name: 'Chicken Pickle', image: '/chicken-1.jpeg', price: 300, type: 'Chicken', badge: 'BEST SELLER' },
  { name: 'Meat Pickle', image: '/mutton-1.jpeg', price: 350, type: 'Meat', badge: 'PREMIUM' },
  { name: 'Prawns Pickle', image: '/prawns-1.jpeg', price: 350, type: 'Prawns' },
  { name: 'Fish Pickle', image: '/fish-2.jpeg', price: 200, type: 'Fish' },
];

const vegPickles = [
  { name: 'Ginger Pickle', image: '/ginger-1.jpeg', price: 200, type: 'Ginger' },
  { name: 'Mango Pickle', image: '/mango-1.jpeg', price: 200, type: 'Mango' },
  { name: 'Garlic Pickle', image: '/garlic-1.jpeg', price: 200, type: 'Garlic' },
  { name: 'Red Chilli', image: '/redchilli-1.jpeg', price: 200, type: 'RedChilli' },
  { name: 'Gongura Pickle', image: '/gongura-1.jpeg', price: 200, type: 'Gongura' },
  { name: 'Tomato Pickle', image: '/tomato-1.jpeg', price: 200, type: 'Tomato' },
  { name: 'Lemon Pickle', image: '/lemon-1.jpeg', price: 200, type: 'Lemon' },
  { name: 'Amla Pickle', image: '/amla-1.jpeg', price: 200, type: 'Amla' },
];

const pageTitle = "Andhra Store | Authentic Handcrafted Andhra Pickles";
const pageDesc = "Shop authentic Andhra-style pickles handcrafted with traditional recipes — chicken, mango, prawns, garlic & more. No preservatives. Pan-India delivery. Starting at ₹200.";

const homeSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Andhra Store",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/pickle?type={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function HomePage() {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={`${BASE_URL}/home`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={`${BASE_URL}/home`} />
        <meta property="og:image" content={`${BASE_URL}/chicken-1.jpeg`} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={`${BASE_URL}/chicken-1.jpeg`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
        />
      </Head>
      <Header />
      <HeroSection />

      <div className="bg-olive-700 py-3">
        <div className="container-main grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              icon: (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6m-6 0a1 1 0 00-1 1v1H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-1V4a1 1 0 00-1-1m-6 0h6" />
                </svg>
              ),
              text: 'Handmade',
              sub: 'Traditional recipes',
            },
            {
              icon: (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.5 3-5 5-5 9a5 5 0 0010 0c0-4-3.5-6-5-9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v9" />
                </svg>
              ),
              text: 'No Preservatives',
              sub: 'Pure & natural',
            },
            {
              icon: (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              ),
              text: 'Pan-India Delivery',
              sub: 'Free above ₹500',
            },
            {
              icon: (
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ),
              text: '4.9/5 Rating',
              sub: '500+ happy customers',
            },
          ].map((t) => (
            <div key={t.text} className="flex items-center gap-2.5 text-white">
              {t.icon}
              <div>
                <p className="text-xs font-semibold">{t.text}</p>
                <p className="text-[10px] text-white/60">{t.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="section-pad bg-white" aria-labelledby="categories-heading">
        <div className="container-main">
          <SectionHeading label="Categories" title="Shop by Pickle Type" id="categories-heading" />
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((c) => <CategoryCard key={c.type} {...c} />)}
          </div>
        </div>
      </section>

      <section className="section-pad bg-cream" aria-labelledby="bestsellers-heading">
        <div className="container-main">
          <SectionHeading
            label="Best Sellers"
            title="Our Most Popular Pickles"
            description="Loved by 500+ customers across India. Each jar is crafted with authentic Andhra spices and cold-pressed sesame oil for a taste that is both bold and memorable."
            actionHref="/pickle?type=non-veg"
            id="bestsellers-heading"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {bestSellers.map((p) => <ProductCard key={p.type} {...p} />)}
          </div>
        </div>
      </section>

      <section className="relative h-48 sm:h-56 overflow-hidden" aria-label="Freshly made pickles banner">
        <img
          src="/pickle17.jpeg"
          alt="Fresh authentic Andhra pickles made weekly with hand-pounded spices"
          className="absolute inset-0 w-full h-full object-cover"
          width={1200}
          height={400}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40 flex items-center">
          <div className="container-main">
            <h2 className="text-2xl sm:text-3xl font-heading text-white mb-1">Freshly Made, Weekly</h2>
            <p className="text-sm text-white/70 max-w-md mb-4">Every batch is prepared fresh using hand-pounded spices and cold-pressed oils — no shortcuts, no preservatives.</p>
            <Link href="https://wa.me/918758302568" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              Order via WhatsApp
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white" aria-labelledby="veg-pickles-heading">
        <div className="container-main">
          <SectionHeading
            label="Veg Pickles"
            title="Vegetarian Collection"
            description="Our vegetarian pickle collection celebrates the rich diversity of Andhra Pradesh. From the tartness of mango avakaya to the bold heat of red chilli, every jar carries generations of culinary wisdom."
            actionHref="/pickle?type=veg"
            id="veg-pickles-heading"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {vegPickles.map((p) => <ProductCard key={p.type} {...p} />)}
          </div>
        </div>
      </section>

      <section className="section-pad bg-cream" aria-labelledby="reviews-heading">
        <div className="container-main">
          <SectionHeading label="Reviews" title="What Our Customers Say" id="reviews-heading" />
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: 'Priya K.', loc: 'Hyderabad', text: 'The chicken pickle is absolutely divine! Tastes just like my grandmother\'s recipe. The spice balance is perfect and the quality is outstanding.' },
              { name: 'Rajesh M.', loc: 'Bangalore', text: 'Best mango pickle I\'ve ever had. The spice level is perfect and the quality is outstanding. I have been ordering for 6 months now and every batch is consistently excellent.' },
              { name: 'Sneha D.', loc: 'Mumbai', text: 'Ordered the combo pack — every single variant was delicious. Fresh and authentic! The packaging was very secure and the pickles arrived in perfect condition.' },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex gap-0.5 mb-3" aria-label="5 stars rating">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                  <p className="text-[11px] text-gray-400">{t.loc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}