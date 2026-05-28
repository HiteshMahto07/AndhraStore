import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import SectionHeading from '@/components/SectionHeading';
import { SITE_URL } from '@/lib/seo';

const pageTitle = "Buy Andhra Pickles in Mumbai — Home Delivery | Andhra Store";
const pageDesc = "Order authentic Andhra pickles with delivery to Mumbai. Mango Avakaya, Gongura Pachadi, Chicken Pickle & 11 more. Handcrafted in Daman. No preservatives. Free shipping.";
const pageUrl = `${SITE_URL}/andhra-pickles-mumbai`;

const featuredProducts = [
  { name: 'Chicken Pickle', image: '/chicken-1.jpeg', price: 300, type: 'Chicken', badge: 'BEST SELLER' },
  { name: 'Mango Pickle',   image: '/mango-1.jpeg',   price: 200, type: 'Mango',   badge: 'MOST LOVED' },
  { name: 'Gongura Pickle', image: '/gongura-1.jpeg', price: 200, type: 'Gongura' },
  { name: 'Prawns Pickle',  image: '/prawns-1.jpeg',  price: 350, type: 'Prawns' },
];

const mumbaiAreas = [
  'Andheri', 'Bandra', 'Borivali', 'Dadar', 'Thane',
  'Navi Mumbai', 'Powai', 'Worli', 'Kurla', 'Mulund',
  'Malad', 'Vasai-Virar',
];

const faqs = [
  {
    q: 'Do you deliver Andhra pickles to Mumbai?',
    a: 'Yes, we deliver to all areas across Mumbai including Andheri, Bandra, Borivali, Dadar, Thane, and Navi Mumbai. Orders are dispatched within 24 hours from our store in Daman.',
  },
  {
    q: 'How long does delivery from Daman to Mumbai take?',
    a: 'Our store in Nani Daman is approximately 180 km from Mumbai. Most orders arrive in 1–3 business days via our courier partners.',
  },
  {
    q: 'What is the shipping charge for Mumbai delivery?',
    a: 'We offer free pan-India delivery on all orders. Mumbai customers pay no extra shipping charge.',
  },
  {
    q: 'Which Andhra pickles are most popular among Mumbai customers?',
    a: 'Our Andhra Chicken Pickle, Mango Avakaya, and Gongura Pachadi are the top sellers in Mumbai. The Mango Avakaya is especially popular with the Andhra community settled across the city.',
  },
  {
    q: 'Can I place a bulk order for delivery to Mumbai?',
    a: 'Yes, we welcome bulk orders for weddings, office gifting, and events. WhatsApp us at 8758302568 and we will arrange a custom bulk delivery to your Mumbai address.',
  },
];

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Andhra Store",
  description: "Authentic Andhra pickles handcrafted in Daman with home delivery to Mumbai.",
  url: pageUrl,
  telephone: "+91-8758302568",
  email: "Andhrastore.india@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Vikas Enclave, Shop No-06",
    addressLocality: "Nani Daman",
    addressRegion: "Daman and Diu",
    postalCode: "396210",
    addressCountry: "IN",
  },
  areaServed: { "@type": "City", name: "Mumbai" },
  openingHours: "Mo-Su 10:00-22:00",
  priceRange: "₹₹",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    worstRating: "1",
    reviewCount: "500",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/home` },
    { "@type": "ListItem", position: 2, name: "Andhra Pickles in Mumbai", item: pageUrl },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const trustBadges = [
  {
    text: 'Handmade',
    sub: 'Traditional recipes',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6m-6 0a1 1 0 00-1 1v1H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-1V4a1 1 0 00-1-1m-6 0h6" />
      </svg>
    ),
  },
  {
    text: 'No Preservatives',
    sub: 'Pure & natural',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.5 3-5 5-5 9a5 5 0 0010 0c0-4-3.5-6-5-9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v9" />
      </svg>
    ),
  },
  {
    text: 'Free Delivery',
    sub: 'Pan-India including Mumbai',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    text: '4.9/5 Rating',
    sub: '500+ happy customers',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
];

const whatsappIcon = (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-gray-800 pr-4">{q}</span>
        <svg
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4 pt-1 text-sm text-gray-600 leading-relaxed bg-gray-50">
          {a}
        </div>
      )}
    </div>
  );
}

export async function getStaticProps() {
  return { props: {} };
}

export default function MumbaiPage() {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image"        content={`${SITE_URL}/mango-1.jpeg`} />
        <meta property="og:image:alt"    content="Andhra pickles delivered in Mumbai — authentic homemade mango avakaya and more" />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={`${SITE_URL}/mango-1.jpeg`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <Header />

      <section className="bg-gradient-to-br from-olive-800 via-olive-700 to-olive-900 text-white" aria-label="Mumbai city page hero">
        <div className="container-main py-12 md:py-20">
          <p className="text-[11px] font-bold text-olive-200 uppercase tracking-[0.2em] mb-2">Delivery to Mumbai</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 max-w-2xl leading-tight">
            Authentic Andhra Pickles<br />Delivered to Mumbai
          </h1>
          <p className="text-olive-200 text-sm sm:text-base max-w-xl leading-relaxed mb-8">
            Handcrafted at our store in Nani Daman — just 180 km from Mumbai. Mango Avakaya, Gongura Pachadi, Chicken Pickle &amp; 11 more varieties. No preservatives. Free shipping.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/pickles" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors shadow-md">
              Shop All Pickles
            </Link>
            <Link href="https://wa.me/918758302568" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors shadow-md">
              {whatsappIcon}
              Order via WhatsApp
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-olive-700 py-3">
        <div className="container-main grid grid-cols-2 md:grid-cols-4 gap-3">
          {trustBadges.map((t) => (
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

      <section className="section-pad bg-white" aria-labelledby="mumbai-products-heading">
        <div className="container-main">
          <SectionHeading
            label="Top Picks for Mumbai"
            title="Most Ordered Pickles in Mumbai"
            description="From the tangy Mango Avakaya to the bold Chicken Pickle — these are the varieties Mumbai customers keep coming back for."
            actionHref="/pickle"
            id="mumbai-products-heading"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {featuredProducts.map((p) => <ProductCard key={p.type} {...p} />)}
          </div>
        </div>
      </section>

      <section className="section-pad bg-cream" aria-labelledby="delivery-heading">
        <div className="container-main">
          <SectionHeading
            label="Delivery"
            title="Mumbai Delivery Info"
            id="delivery-heading"
          />
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { title: 'Delivery Time', value: '1–3 Business Days', sub: 'From Daman to Mumbai' },
              { title: 'Shipping Charge', value: 'Free', sub: 'On all orders to Mumbai' },
              { title: 'Dispatch', value: 'Within 24 Hours', sub: 'Of order confirmation' },
            ].map((d) => (
              <div key={d.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
                <p className="text-[11px] font-bold text-olive-600 uppercase tracking-wider mb-1">{d.title}</p>
                <p className="text-xl font-heading font-bold text-gray-900 mb-0.5">{d.value}</p>
                <p className="text-xs text-gray-400">{d.sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-[11px] font-bold text-olive-600 uppercase tracking-wider mb-3">Areas We Deliver to in Mumbai</p>
            <div className="flex flex-wrap gap-2">
              {mumbaiAreas.map((area) => (
                <span key={area} className="px-3 py-1 bg-olive-50 border border-olive-100 text-olive-700 text-xs font-semibold rounded-full">
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white" aria-labelledby="why-heading">
        <div className="container-main">
          <SectionHeading
            label="Why Choose Us"
            title="Why Mumbai Customers Love Andhra Store"
            id="why-heading"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Closest to Mumbai', desc: 'Dispatched from Nani Daman — ~180 km away. Faster delivery, fresher pickles.' },
              { title: 'No Preservatives', desc: 'Every jar is made fresh with cold-pressed oil and traditional spices. Nothing artificial.' },
              { title: 'East Godavari Sourced', desc: 'Raw mangoes, gongura leaves, and spices sourced directly from East Godavari, Andhra Pradesh.' },
              { title: 'Handmade in Small Batches', desc: 'We never mass-produce. Every batch is made by hand using stone-ground spices.' },
            ].map((w) => (
              <div key={w.title} className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                <div className="w-8 h-1 bg-brand-500 rounded-full mb-3" />
                <h3 className="text-sm font-bold text-gray-900 mb-2">{w.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-cream" aria-labelledby="mumbai-reviews-heading">
        <div className="container-main">
          <SectionHeading label="Customer Reviews" title="What Mumbai Customers Say" id="mumbai-reviews-heading" />
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: 'Sneha D.', loc: 'Mumbai', text: 'Ordered the combo pack — every single variant was delicious. Fresh and authentic! The packaging was very secure and the pickles arrived in perfect condition.' },
              { name: 'Ramesh T.', loc: 'Andheri, Mumbai', text: 'Being from Andhra but settled in Mumbai for 12 years, I was craving real avakaya. Andhra Store delivered exactly what I remembered from home. Ordered again last week.' },
              { name: 'Kavya S.', loc: 'Bandra, Mumbai', text: 'The gongura pachadi is absolutely perfect — not too sour, just right. Shipping to Bandra was quick, got it in 2 days from placing the order. Will keep reordering!' },
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

      <section className="section-pad bg-white" aria-labelledby="faq-heading">
        <div className="container-main max-w-2xl">
          <SectionHeading label="FAQs" title="Frequently Asked Questions" id="faq-heading" />
          <div className="space-y-2">
            {faqs.map((f) => <FAQItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      <section className="section-pad bg-olive-800 text-white" aria-label="Order CTA">
        <div className="container-main text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-3">Ready to Order?</h2>
          <p className="text-olive-200 text-sm max-w-md mx-auto mb-6">
            Browse our full collection and get authentic Andhra pickles delivered to your Mumbai doorstep.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/pickles" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors shadow-md">
              Shop All Pickles
            </Link>
            <Link href="https://wa.me/918758302568" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors shadow-md">
              {whatsappIcon}
              Order via WhatsApp
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
