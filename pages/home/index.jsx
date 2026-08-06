import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import SectionHeading from '@/components/SectionHeading';
import { SITE_URL } from '@/lib/seo';
import { buildBreadcrumbSchema, buildFaqSchema } from '@/lib/schema';

const categories = [
  { name: 'Chicken', image: '/chicken-1.jpeg', type: 'Chicken' },
  { name: 'Mango', image: '/mango-1.jpeg', type: 'Mango' },
  { name: 'Prawns', image: '/prawns-1.jpeg', type: 'Prawns' },
  { name: 'Ginger', image: '/ginger-1.jpeg', type: 'Ginger' },
  { name: 'Garlic', image: '/garlic-1.jpeg', type: 'Garlic' },
  { name: 'Red Chilli', image: '/redchilli-1.jpeg', type: 'RedChilli' },
];

const bestSellers = [
  { name: 'Chicken Pickle', image: '/chicken-1.jpeg', price: 399, type: 'Chicken', badge: 'BEST SELLER' },
  { name: 'Meat Pickle', image: '/mutton-1.jpeg', price: 549, type: 'Meat', badge: 'PREMIUM' },
  { name: 'Prawns Pickle', image: '/prawns-1.jpeg', price: 499, type: 'Prawns' },
  { name: 'Fish Pickle', image: '/fish-2.jpeg', price: 399, type: 'Fish' },
];

const vegPickles = [
  { name: 'Ginger Pickle', image: '/ginger-1.jpeg', price: 299, type: 'Ginger' },
  { name: 'Mango Pickle', image: '/mango-1.jpeg', price: 299, type: 'Mango' },
  { name: 'Garlic Pickle', image: '/garlic-1.jpeg', price: 349, type: 'Garlic' },
  { name: 'Red Chilli', image: '/redchilli-1.jpeg', price: 299, type: 'RedChilli' },
  { name: 'Gongura Pickle', image: '/gongura-1.jpeg', price: 200, type: 'Gongura' },
  { name: 'Tomato Pickle', image: '/tomato-1.jpeg', price: 299, type: 'Tomato' },
  { name: 'Lemon Pickle', image: '/lemon-1.jpeg', price: 299, type: 'Lemon' },
  { name: 'Amla Pickle', image: '/amla-1.jpeg', price: 299, type: 'Amla' },
];

const pageTitle = "Andhra Pickles Online — Authentic & Homemade | Andhra Store";
const pageDesc = "Shop authentic Andhra pickles online — Mango Avakaya, Gongura, Chicken & 11 more. Handcrafted in East Godavari. No preservatives. Free delivery across India.";

// WEBSITE_SCHEMA is injected globally by _app.js (from lib/schema.js).
// No page-level WebSite schema needed here — duplicate blocks cause conflicts.

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Home", item: `${SITE_URL}/home` },
]);

// FAQ answers restate facts already published elsewhere in the codebase
// (ORGANIZATION_SCHEMA, MERCHANT_RETURN_POLICY_SCHEMA, lib/checkout.js constants)
// so visible content and structured data stay consistent.
const faqSchema = buildFaqSchema([
  {
    q: "What are Andhra pickles?",
    a: "Andhra pickles — called pachadi in Telugu — are traditional South Indian pickles made with regional spices, cold-pressed oils, and authentic family recipes from Andhra Pradesh, distinct from mass-produced, vinegar-based pickles.",
  },
  {
    q: "Do Andhra Store pickles contain preservatives?",
    a: "No. All Andhra Store pickles, podi, snacks and sweets are made without artificial preservatives, colors, or flavor enhancers — cold-pressed oil and traditional spicing are used as natural preservation methods.",
  },
  {
    q: "Is Cash on Delivery available, and what are the delivery charges?",
    a: "Yes. We ship pan-India in 2–4 business days. Delivery is free on orders above ₹999, with small charges below that threshold. Cash on Delivery is available with an additional ₹99 COD charge.",
  },
  {
    q: "What is the return policy for Andhra Store pickles?",
    a: "As food products, pickles are not returnable for a change of mind, but we offer a replacement or refund within 7 days of delivery for damaged, wrong, or missing items.",
  },
  {
    q: "Where is Andhra Store based?",
    a: "Andhra Store was founded in 2023 by a family from Rajahmundry, East Godavari, and now operates from Daman, shipping pickles, podi, snacks and sweets pan-India.",
  },
]);

export default function HomePage() {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={`${SITE_URL}/home`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={`${SITE_URL}/home`} />
        <meta property="og:image"       content={`${SITE_URL}/mango-1.jpeg`} />
        <meta property="og:image:alt"   content="Andhra Store — authentic Andhra pickles, podi, snacks and sweets" />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:title"       content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image"       content={`${SITE_URL}/mango-1.jpeg`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema)        }} />
      </Head>
      <Header />
      <HeroSection />

      {/* Quick Answer + Definition — concise, extractable answers for AI search
          (Google AI Mode, ChatGPT, Gemini, Perplexity) placed right below the H1. */}
      <section className="bg-white py-8 sm:py-10" aria-labelledby="quick-answer-heading">
        <div className="container-main max-w-3xl">
          <h2 id="quick-answer-heading" className="text-lg sm:text-xl font-heading text-gray-900 mb-2">
            What Is Andhra Store?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Andhra Store is an online store delivering authentic, homemade Andhra pickles across India.
            Founded in 2023 by a family from Rajahmundry, East Godavari, we prepare traditional vegetarian
            and non-vegetarian pickles using family recipes, cold-pressed oils, and no artificial
            preservatives — the same taste Andhra households have relied on for generations.
          </p>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-3">
            <strong>Andhra pickles</strong> — called <em>pachadi</em> in Telugu — are traditional South
            Indian pickles made with regional spices, cold-pressed oils, and authentic family recipes from
            Andhra Pradesh, distinct from mass-produced, vinegar-based pickles.
          </p>
        </div>
      </section>

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
              sub: 'Hyderabad, Bangalore, Mumbai & more',
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

      {/* Why Choose Andhra Store — expands on the trust-bar icons above with
          real, extractable content: traits, audience, use cases, internal links. */}
      <section className="section-pad bg-cream" aria-labelledby="why-choose-heading">
        <div className="container-main max-w-3xl">
          <h2 id="why-choose-heading" className="text-xl sm:text-2xl md:text-3xl font-heading text-gray-900 mb-3">
            Why Choose Andhra Store for Authentic Andhra Pickles
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
            We make homemade Andhra pickles the traditional way — no shortcuts and no mass production.
            Every jar is made to order in small batches using recipes from East Godavari, Andhra Pradesh,
            and shipped pan-India in 2–4 days.
          </p>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600 list-disc list-inside mb-4">
            <li><strong>Traditional Andhra recipes</strong> passed down through generations</li>
            <li><strong>Homemade preparation</strong> in small batches, not factory-produced</li>
            <li><strong>Authentic East Godavari origin</strong> — the heart of Andhra pickle-making</li>
            <li><strong>Premium ingredients</strong> — cold-pressed oils, Guntur chillies, rock salt</li>
            <li><strong>No artificial preservatives</strong>, colors, or flavor enhancers</li>
            <li><strong>Pan-India delivery</strong> in 2–4 days, free on orders above ₹999</li>
          </ul>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
            Our pickles are made for Andhra food lovers, South Indian families, NRIs missing home-cooked
            flavors, spice lovers, and anyone who prefers homemade food over store-bought alternatives —
            as well as gift buyers looking for an authentic taste of Andhra Pradesh. They pair naturally
            with daily meals, rice, dosa, idli, and chapati, and travel well for festivals and long journeys.
          </p>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Explore our full range: <Link href="/pickles/veg" className="text-brand-600 font-semibold hover:underline">Veg Pickles</Link>,{' '}
            <Link href="/pickles/non-veg" className="text-brand-600 font-semibold hover:underline">Non-Veg Pickles</Link>,{' '}
            <Link href="/podi" className="text-brand-600 font-semibold hover:underline">Andhra Podi</Link>,{' '}
            <Link href="/snacks" className="text-brand-600 font-semibold hover:underline">Andhra Snacks</Link>, and{' '}
            <Link href="/sweets" className="text-brand-600 font-semibold hover:underline">traditional Andhra Sweets</Link> —
            or learn more <Link href="/about" className="text-brand-600 font-semibold hover:underline">about us</Link>,{' '}
            read our <Link href="#faq" className="text-brand-600 font-semibold hover:underline">frequently asked questions</Link>, or{' '}
            <Link href="/contact" className="text-brand-600 font-semibold hover:underline">get in touch</Link> with any questions.
          </p>
        </div>
      </section>

      <section className="section-pad bg-white" aria-labelledby="categories-heading">
        <div className="container-main">
          <SectionHeading
            label="Categories"
            title="Shop by Pickle Type"
            description="Browse Andhra pickles by type — from bold non-vegetarian classics like Chicken and Prawns pickle to tangy vegetarian favourites like Mango and Garlic pickle."
            id="categories-heading"
          />
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
            description="Our best-selling pickles are Chicken, Mutton, Prawns, and Fish — bold non-vegetarian Andhra pickles loved by 500+ customers across India, each made with authentic spices and cold-pressed oil."
            actionHref="/pickles/non-veg"
            id="bestsellers-heading"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {bestSellers.map((p) => <ProductCard key={p.type} {...p} />)}
          </div>
        </div>
      </section>

      <section className="relative h-48 sm:h-56 overflow-hidden" aria-label="Freshly made pickles banner">
        <Image
          src="/pickle17.jpeg"
          alt="Fresh authentic Andhra pickles made weekly with hand-pounded spices"
          fill
          className="object-cover"
          priority
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
            description="Our vegetarian Andhra pickles include Mango Avakaya, Gongura, Garlic, and Red Chilli pickle — made with cold-pressed oil and no preservatives, capturing the diverse flavors of Andhra Pradesh in every jar."
            actionHref="/pickles/veg"
            id="veg-pickles-heading"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {vegPickles.map((p) => <ProductCard key={p.type} {...p} />)}
          </div>
        </div>
      </section>

      <section className="section-pad bg-cream" aria-labelledby="reviews-heading">
        <div className="container-main">
          <SectionHeading
            label="Reviews"
            title="What Our Customers Say"
            description="Customers across India — from Hyderabad to Mumbai — rate our pickles 4.9/5 for authentic taste and freshly homemade quality."
            id="reviews-heading"
          />
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

      {/* FAQ — direct-answer Q&A for AI/answer-engine extraction, backed by
          FAQPage schema. Every answer restates a fact already published
          elsewhere in the codebase (org schema, return policy, checkout constants). */}
      <section id="faq" className="section-pad bg-white" aria-labelledby="faq-heading">
        <div className="container-main max-w-3xl">
          <SectionHeading label="FAQ" title="Frequently Asked Questions" id="faq-heading" />
          <div className="space-y-2">
            {faqSchema.mainEntity.map(({ name, acceptedAnswer }) => (
              <details key={name} className="border border-gray-100 rounded-xl group">
                <summary className="px-4 py-3.5 cursor-pointer text-sm font-semibold text-gray-700 flex items-center justify-between list-none hover:bg-gray-50 rounded-xl transition-colors">
                  {name}
                  <svg className="w-4 h-4 text-gray-300 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 border-t border-gray-50 pt-3">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {acceptedAnswer.text}
                    {name === "What is the return policy for Andhra Store pickles?" && (
                      <>
                        {' '}
                        <Link href="/return-policy" className="text-brand-600 font-semibold hover:underline">
                          Read our full Return &amp; Refund Policy
                        </Link>
                        .
                      </>
                    )}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}