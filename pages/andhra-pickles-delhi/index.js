import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import SectionHeading from '@/components/SectionHeading';
import { SITE_URL } from '@/lib/seo';

const pageTitle = 'Andhra Pickles Delivery in Delhi NCR — Order Online | Andhra Store';
const pageDesc  = 'Order authentic Andhra pickles with delivery to Delhi NCR in 4-5 days. Mango Avakaya, Gongura Pachadi, Chicken Pickle and more. Handcrafted in Daman with no preservatives. Free shipping.';
const pageUrl   = `${SITE_URL}/andhra-pickles-delhi`;

const featuredProducts = [
  { name: 'Chicken Pickle', image: '/images/pickles/andhra-chicken-pickle-sealed.webp', price: 399, type: 'Chicken', badge: 'BEST SELLER' },
  { name: 'Mango Pickle', image: '/images/pickles/andhra-mango-pickle-sealed.webp', price: 299, type: 'Mango', badge: 'MOST LOVED' },
  { name: 'Gongura Pickle', image: '/images/pickles/andhra-gongura-pickle-sealed.webp', price: 200, type: 'Gongura' },
  { name: 'Ginger Pickle', image: '/images/pickles/andhra-ginger-pickle-sealed.webp', price: 299, type: 'Ginger' },
];

const cityAreas = ['South Delhi', 'Dwarka', 'Rohini', 'Noida', 'Gurgaon', 'Faridabad', 'Lajpat Nagar', 'Saket', 'Vasant Kunj', 'Janakpuri', 'Pitampura', 'Greater Noida', 'Ghaziabad'];

const faqs = [
  { q: 'How long does delivery to Delhi NCR take?', a: 'Delhi is about 1,400 km from our store in Nani Daman. Orders typically arrive in 4 to 5 business days via courier. We dispatch within 24 hours of confirmation.' },
  { q: 'Do you deliver to Noida, Gurgaon and Faridabad?', a: 'Yes — we deliver to all of Delhi NCR including Noida, Gurgaon, Faridabad, Ghaziabad and Greater Noida via courier.' },
  { q: 'What makes Andhra pickle different from North Indian pickles?', a: 'Andhra pickles use significantly more chilli, rely on groundnut or sesame oil rather than mustard oil, and the spice mix includes fenugreek and curry leaves. The heat level is higher and the flavour is more complex.' },
  { q: 'Is shipping free to Delhi NCR?', a: 'Yes. Free delivery on all orders to Delhi NCR with no minimum order value.' },
  { q: 'I want to send Andhra pickles as a gift to a South Indian colleague in Delhi. Is that possible?', a: 'Absolutely. Enter the recipient address at checkout and we will ship directly. The jar packaging is clean and gift-ready. WhatsApp us at 8758302568 for bulk gift orders.' },
];

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Andhra Store",
  description: 'Authentic Andhra pickles handcrafted in Nani Daman, delivered to Delhi NCR.',
  url: pageUrl,
  telephone: "+91-8758302568",
  email: "Andhrastore.india@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Maharaja Complex, Jetty Road, Near Night Street, Opposite Police Station",
    addressLocality: "Nani Daman",
    addressRegion: "Dadra and Nagar Haveli and Daman and Diu",
    postalCode: "396210",
    addressCountry: "IN",
  },
  areaServed: [
    { "@type": "City", name: 'Delhi' },
    { "@type": "City", name: 'Noida' },
    { "@type": "City", name: 'Gurgaon' },
    { "@type": "City", name: 'Faridabad' },
  ],
  openingHours: "Mo-Su 10:00-22:00",
  priceRange: "₹₹",
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", bestRating: "5", worstRating: "1", reviewCount: "500" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/home` },
    { "@type": "ListItem", position: 2, name: 'Andhra Pickles in Delhi NCR', item: pageUrl },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
};

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors" aria-expanded={open}>
        <span className="text-sm font-semibold text-gray-800 pr-4">{q}</span>
        <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-5 pb-4 pt-1 text-sm text-gray-600 leading-relaxed bg-gray-50">{a}</div>}
    </div>
  );
}

const whatsappIcon = (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const STARS = [1,2,3,4,5].map(s => (
  <svg key={s} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
));

export async function getStaticProps() { return { props: {} }; }

export default function DelhiPage() {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={`${SITE_URL}/images/pickles/andhra-mango-pickle-sealed.webp`} />
        <meta property="og:image:alt" content='Andhra pickles delivered in Delhi NCR — authentic homemade mango avakaya and more' />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={`${SITE_URL}/images/pickles/andhra-mango-pickle-sealed.webp`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>
      <Header />

      <section className="bg-gradient-to-br from-olive-800 via-olive-700 to-olive-900 text-white" aria-label="Delhi NCR city page hero">
        <div className="container-main py-12 md:py-20">
          <p className="text-[11px] font-bold text-olive-200 uppercase tracking-[0.2em] mb-2">Delivery to Delhi NCR</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 max-w-2xl leading-tight">
            Authentic Andhra Pickles<br />Delivered to Delhi NCR
          </h1>
          <p className="text-olive-200 text-sm sm:text-base max-w-xl leading-relaxed mb-8">
            Made in Nani Daman with real Andhra recipes — Guntur chillies, raw mangoes from East Godavari, cold-pressed oil. Delivered to Delhi, Noida, Gurgaon and Faridabad in 4 to 5 business days.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/pickles" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors shadow-md">Shop All Pickles</Link>
            <Link href="https://wa.me/918758302568" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors shadow-md">{whatsappIcon} Order via WhatsApp</Link>
          </div>
        </div>
      </section>

      <div className="bg-olive-700 py-3">
        <div className="container-main grid grid-cols-2 md:grid-cols-4 gap-3 text-white text-xs">
          <div><p className="font-semibold">Handmade</p><p className="text-white/60">Traditional recipes</p></div>
          <div><p className="font-semibold">No Preservatives</p><p className="text-white/60">Pure &amp; natural</p></div>
          <div><p className="font-semibold">4-5 Business Days</p><p className="text-white/60">Delhi NCR — 1400 km away</p></div>
          <div><p className="font-semibold">Free Shipping</p><p className="text-white/60">On all orders</p></div>
        </div>
      </div>

      <section className="section-pad bg-white" aria-labelledby="products-heading">
        <div className="container-main">
          <SectionHeading label='Top Picks for Delhi NCR' title='Most Ordered Pickles in Delhi NCR'
            description="Mango Avakaya, Gongura Pachadi and Chicken Pickle are the most ordered across all cities. Mix and match to find what works for you."
            actionHref="/pickles" id="products-heading" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {featuredProducts.map((p) => <ProductCard key={p.type} {...p} />)}
          </div>
        </div>
      </section>

      <section className="section-pad bg-cream" aria-labelledby="delivery-heading">
        <div className="container-main">
          <SectionHeading label="Delivery" title='Delhi NCR Delivery Info' id="delivery-heading" />
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { title: 'Delivery Time',   value: '4-5 Business Days', sub: 'Daman to Delhi NCR — 1400 km' },
              { title: 'Shipping Charge', value: 'Free', sub: 'On all orders to Delhi NCR' },
              { title: 'Dispatch',        value: 'Within 24 Hours', sub: 'Of order confirmation' },
            ].map((d) => (
              <div key={d.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
                <p className="text-[11px] font-bold text-olive-600 uppercase tracking-wider mb-1">{d.title}</p>
                <p className="text-xl font-heading font-bold text-gray-900 mb-0.5">{d.value}</p>
                <p className="text-xs text-gray-400">{d.sub}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-[11px] font-bold text-olive-600 uppercase tracking-wider mb-3">Areas We Deliver to in Delhi NCR</p>
            <div className="flex flex-wrap gap-2">
              {cityAreas.map((area) => (
                <span key={area} className="px-3 py-1 bg-olive-50 border border-olive-100 text-olive-700 text-xs font-semibold rounded-full">{area}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white" aria-labelledby="why-heading">
        <div className="container-main">
          <SectionHeading label="Why Choose Us" title='Why Delhi NCR Customers Order from Andhra Store' id="why-heading" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Real Andhra Taste in Delhi', desc: 'Andhra pickle bought in Delhi is usually a compromise — adjusted spice levels, different oil, generic packaging. We make the original version from East Godavari recipes.' },
              { title: 'No Preservatives', desc: 'Cold-pressed oil and natural spices do the preservation. No sodium benzoate, no added colour, nothing artificial.' },
              { title: 'Popular with South Indian Expats', desc: 'Delhi has a sizeable Telugu-speaking community in government, business and the tech sector. Many of our Delhi orders come from people who grew up eating proper avakaya and gongura.' },
              { title: 'Secure Long-Distance Packing', desc: '1,400 km is a long way. We double-wrap each jar in bubble wrap and use rigid boxes specifically for long-distance orders.' },
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

      <section className="section-pad bg-cream" aria-labelledby="reviews-heading">
        <div className="container-main">
          <SectionHeading label="Customer Reviews" title='What Delhi NCR Customers Say' id="reviews-heading" />
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: 'Padma V.', loc: 'South Delhi', text: 'I am from Guntur, posted in Delhi for work. Ordering from Andhra Store every month. The avakaya is the real thing — not some Gujarati or Punjabi version adjusted to be mild. Worth it completely.' },
              { name: 'Arun M.', loc: 'Noida', text: 'Tried the gongura pachadi for the first time — brilliant. I had eaten it at a friend place in Hyderabad but never knew where to order online. This is exactly what I was looking for. Fast delivery too.' },
              { name: 'Sneha T.', loc: 'Gurgaon', text: 'Ordered a combination — mango, chicken, and ginger pickle. All three arrived well packed, nothing leaked. Ginger pickle is very different from what I expected, in a good way. Will order again.' },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex gap-0.5 mb-3">{STARS}</div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">&ldquo;{t.text}&rdquo;</p>
                <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                <p className="text-[11px] text-gray-400">{t.loc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white" aria-labelledby="faq-heading">
        <div className="container-main max-w-2xl">
          <SectionHeading label="FAQs" title="Frequently Asked Questions" id="faq-heading" />
          <div className="space-y-2">{faqs.map((f) => <FAQItem key={f.q} q={f.q} a={f.a} />)}</div>
        </div>
      </section>

      <section className="section-pad bg-olive-800 text-white" aria-label="Order CTA">
        <div className="container-main text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-3">Ready to Order?</h2>
          <p className="text-olive-200 text-sm max-w-md mx-auto mb-6">Order today and get genuine Andhra pickles delivered anywhere in Delhi NCR.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/pickles" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors shadow-md">Shop All Pickles</Link>
            <Link href="https://wa.me/918758302568" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors shadow-md">{whatsappIcon} Order via WhatsApp</Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
