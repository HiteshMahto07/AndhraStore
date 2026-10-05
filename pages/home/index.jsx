import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { motion } from 'motion/react';
import { ArrowRight, HandHeart, Leaf, Truck, Star, Flame, Wheat, MapPin, PackageCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import PickleData from '@/data/pickles.json';
import { PRODUCT_REVIEWS } from '@/lib/reviews';
import { SITE_URL, PRODUCT_RATINGS } from '@/lib/seo';
import { buildBreadcrumbSchema, buildFaqSchema } from '@/lib/schema';

const byType = Object.fromEntries(PickleData.map((product) => [product.type, product]));
const toCard = (product) => ({
  type: product.type,
  name: product.name,
  image: product.image[0]?.name,
  imageAlt: product.image[0]?.alt,
  price: product.amount,
  badge: product.badge,
  rating: PRODUCT_RATINGS[product.type],
});

const categories = ['Chicken', 'Mango', 'Prawns', 'Ginger', 'Garlic', 'RedChilli'].map((type) => ({
  type,
  name: type === 'RedChilli' ? 'Red Chilli' : type,
  image: byType[type].image[2]?.name || byType[type].image[0]?.name,
  imageAlt: byType[type].image[2]?.alt || byType[type].image[0]?.alt,
}));
const bestSellers = ['Chicken', 'Meat', 'Prawns', 'Fish'].map((type) => toCard(byType[type]));
const vegPickles = ['Mango', 'Gongura', 'Garlic', 'Ginger'].map((type) => toCard(byType[type]));
const featuredReviews = [PRODUCT_REVIEWS.Mango[0], PRODUCT_REVIEWS.Chicken[0], PRODUCT_REVIEWS.Gongura[0]];

const pageTitle = 'Andhra Pickles Online - Authentic & Homemade | Andhra Store';
const pageDesc = 'Shop authentic Andhra pickles online - Mango Avakaya, Gongura, Chicken & 11 more. Handcrafted in East Godavari. No preservatives. Free delivery across India.';
const breadcrumbSchema = buildBreadcrumbSchema([{ name: 'Home', item: `${SITE_URL}/home` }]);
const faqSchema = buildFaqSchema([
  { q: 'What are Andhra pickles?', a: 'Andhra pickles, called pachadi in Telugu, are traditional South Indian pickles made with regional spices, cold-pressed oils, and authentic family recipes from Andhra Pradesh, distinct from mass-produced, vinegar-based pickles.' },
  { q: 'Do Andhra Store pickles contain preservatives?', a: 'No. All Andhra Store pickles, podi, snacks and sweets are made without artificial preservatives, colors, or flavor enhancers; cold-pressed oil and traditional spicing are used as natural preservation methods.' },
  { q: 'Is Cash on Delivery available, and what are the delivery charges?', a: 'Yes. We ship pan-India in 2-4 business days. Delivery is free on orders above ₹999, with small charges below that threshold. Cash on Delivery is available with an additional ₹99 COD charge.' },
  { q: 'What is the return policy for Andhra Store pickles?', a: 'As food products, pickles are not returnable for a change of mind, but we offer a replacement or refund within 7 days of delivery for damaged, wrong, or missing items.' },
  { q: 'Where is Andhra Store based?', a: 'Andhra Store was founded in 2023 by a family from Rajahmundry, East Godavari, and now operates from Daman, shipping pickles, podi, snacks and sweets pan-India.' },
]);

const ArrowLink = ({ href, children, light = false }) => (
  <Link href={href} className={`group inline-flex items-center gap-2 rounded-sm text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-4 ${light ? 'text-white hover:text-brand-200 focus-visible:ring-offset-olive-900' : 'text-olive-800 hover:text-brand-500'}`}>
    {children}<ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none" strokeWidth={2} aria-hidden="true" />
  </Link>
);

const RevealSection = ({ children, className = '', id, labelledby }) => (
  <motion.section id={id} aria-labelledby={labelledby} className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
    {children}
  </motion.section>
);

const SectionIntro = ({ eyebrow, title, copy, id, action, tone = 'light' }) => (
  <div className="mb-7 flex items-end justify-between gap-5 md:mb-9">
    <div className="max-w-2xl">
      {eyebrow && <p className={`mb-2 text-[10px] font-bold uppercase tracking-[0.22em] ${tone === 'dark' ? 'text-brand-300' : 'text-brand-600'}`}>{eyebrow}</p>}
      <h2 id={id} className={`text-3xl sm:text-4xl ${tone === 'dark' ? 'text-[#fff8ea]' : 'text-[#1b281f]'}`}>{title}</h2>
      {copy && <p className={`mt-3 max-w-xl text-sm leading-6 sm:text-base ${tone === 'dark' ? 'text-[#e4ddcf]' : 'text-gray-600'}`}>{copy}</p>}
    </div>
    {action && <div className="hidden shrink-0 sm:block">{action}</div>}
  </div>
);

const ReviewStars = ({ value }) => {
  const rating = Math.max(0, Math.min(5, Number(value)));

  return (
    <div className="flex items-center gap-1 text-amber-400" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className={`h-4 w-4 ${index < Math.round(rating) ? 'fill-current' : 'text-white/25'}`} strokeWidth={1.8} aria-hidden="true" />
      ))}
    </div>
  );
};

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
        <meta property="og:image" content={`${SITE_URL}/mango-1.jpeg`} />
        <meta property="og:image:alt" content="Andhra Store - authentic Andhra pickles, podi, snacks and sweets" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={`${SITE_URL}/mango-1.jpeg`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <Header />
      <main>
        <HeroSection />

        <section className="bg-olive-800 py-5 text-white" aria-label="Why customers choose Andhra Store">
          <div className="container-main grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-4 lg:gap-8">
            {[
              { icon: HandHeart, title: 'Handmade', copy: 'Traditional recipes' },
              { icon: Leaf, title: 'No Preservatives', copy: 'Pure and natural' },
              { icon: Truck, title: 'Pan-India Delivery', copy: 'Ships in 2-4 business days' },
              { icon: Star, title: 'Customer Rating', copy: 'Mango Avakaya: 4.9/5' },
            ].map(({ icon: Icon, title, copy }) => (
              <div key={title} className="flex items-center gap-3 border-white/10 lg:border-r lg:last:border-r-0">
                <Icon className={`h-5 w-5 shrink-0 text-brand-300 ${title === 'Customer Rating' ? 'fill-current' : ''}`} strokeWidth={1.6} aria-hidden="true" />
                <div><p className="text-xs font-bold sm:text-sm">{title}</p><p className="mt-0.5 text-[10px] text-white/60 sm:text-xs">{copy}</p></div>
              </div>
            ))}
          </div>
        </section>

        <RevealSection className="section-pad bg-[#fffdf9]" labelledby="categories-heading">
          <div className="container-main">
            <SectionIntro eyebrow="Find your favourite" title="Shop by Pickle Type" copy="Choose from our vegetarian and non-vegetarian Andhra pickles." id="categories-heading" />
            <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 scrollbar-hide sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 md:grid-cols-6 md:gap-5">
              {categories.map((category) => <div key={category.type} className="snap-start"><CategoryCard {...category} /></div>)}
            </div>
          </div>
        </RevealSection>

        <RevealSection id="best-sellers" className="section-pad bg-[#f5eee2] scroll-mt-24" labelledby="bestsellers-heading">
          <div className="container-main">
            <SectionIntro eyebrow="Best sellers" title="Our Most Popular Pickles" copy="Four bold Andhra favourites, made with traditional spices and cold-pressed oils." id="bestsellers-heading" action={<ArrowLink href="/pickles/non-veg">View All</ArrowLink>} />
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {bestSellers.map((product) => <ProductCard key={product.type} {...product} showCart listName="Homepage Best Sellers" />)}
            </div>
            <div className="mt-6 sm:hidden"><ArrowLink href="/pickles/non-veg">View All</ArrowLink></div>
          </div>
        </RevealSection>

        <RevealSection className="section-pad bg-white" labelledby="story-heading">
          <div className="container-main grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <div className="relative min-h-[350px] overflow-hidden rounded-[1.5rem_4rem_1.5rem_1.5rem] sm:min-h-[470px]">
              <Image src="/images/pickles/andhra-chicken-pickle-lifestyle.webp" alt="Andhra Store chicken pickle jar held in a garden" fill sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" />
            </div>
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-brand-600">Our story</p>
              <h2 id="story-heading" className="text-3xl text-[#1b281f] sm:text-4xl lg:text-5xl">From Andhra Kitchens<br />To Your Dining Table.</h2>
              <p className="mt-5 text-sm leading-7 text-gray-600 sm:text-base">Andhra Store began with a love for East Godavari&apos;s pickle tradition. We work with small-scale artisans who use regional spices, cold-pressed oils and recipes passed down through generations.</p>
              <div className="mt-6"><ArrowLink href="/about">Our Story</ArrowLink></div>
              <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-[#e8dfd0] pt-6 text-xs font-semibold text-gray-700">
                <span>Traditional recipes</span><span>Small-batch made</span><span>Regional ingredients</span><span>Delivered across India</span>
              </div>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="bg-[#fffaf1] py-10 md:py-16" labelledby="why-heading">
          <div className="container-main">
            <SectionIntro eyebrow="The Andhra Store way" title="Why Andhra Store" copy="No shortcuts. Just the details that make a jar taste like it belongs at an Andhra dining table." id="why-heading" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { n: '01', icon: Flame, title: 'Traditional Andhra Recipes', copy: "Recipes rooted in East Godavari's pickle-making tradition." },
                { n: '02', icon: PackageCheck, title: 'Small-Batch Preparation', copy: 'Handmade in small quantities for freshness and consistency.' },
                { n: '03', icon: Wheat, title: 'Quality Ingredients', copy: 'Guntur chillies, regional produce and cold-pressed oils.' },
                { n: '04', icon: MapPin, title: 'Pan-India Delivery', copy: 'Packed securely and shipped across India.' },
              ].map(({ n, icon: Icon, title, copy }) => (
                <article key={n} className="rounded-2xl border border-[#eadfce] bg-white p-5 sm:p-6">
                  <div className="flex items-center justify-between"><Icon className="h-5 w-5 text-brand-500" strokeWidth={1.6} aria-hidden="true" /><span className="font-heading text-2xl text-[#e1d6c6]">{n}</span></div>
                  <h3 className="mt-5 text-lg text-gray-900 sm:mt-8">{title}</h3><p className="mt-2 text-sm leading-6 text-gray-600">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </RevealSection>

        <section className="relative overflow-hidden bg-olive-900 text-white" aria-labelledby="flavour-heading">
          <div className="absolute inset-y-0 right-0 w-full opacity-30 lg:w-[58%] lg:opacity-75"><Image src="/images/pickles/andhra-red-chilli-pickle-serving.webp" alt="Andhra red chilli pickle served with a traditional meal" fill sizes="(max-width: 1023px) 100vw, 58vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-olive-900 via-olive-900/65 to-transparent" /></div>
          <div className="container-main relative flex min-h-[420px] items-center py-16">
            <div className="max-w-xl"><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-brand-300">A proper Andhra plate</p><h2 id="flavour-heading" className="text-4xl leading-tight sm:text-5xl">Spicy. Tangy.<br />Properly Andhra.</h2><p className="mt-4 max-w-md text-sm leading-6 text-white/70 sm:text-base">From fiery red chilli to tangy mango avakaya, there is a pickle for every kind of Andhra craving.</p><div className="mt-7"><ArrowLink href="#categories-heading" light>Find My Pickle</ArrowLink></div></div>
          </div>
        </section>

        <RevealSection className="bg-white py-10 md:py-14" labelledby="fresh-heading">
          <div className="container-main">
            <div className="grid overflow-hidden rounded-[2rem] bg-[#ead9c1] lg:grid-cols-[42fr_58fr]">
              <div className="relative min-h-[220px] sm:min-h-[270px] lg:min-h-[350px]"><Image src="/images/pickles/andhra-mango-pickle-ingredients.webp" alt="Ingredients used to prepare Andhra mango pickle" fill sizes="(max-width: 1023px) 100vw, 42vw" className="object-cover" /></div>
              <div className="flex items-center p-6 sm:p-8 lg:p-10"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-brand-700">Fresh batch</p><h2 id="fresh-heading" className="text-3xl text-[#1b281f] sm:text-4xl">Freshly Made.<br />Every Week.</h2><p className="mt-3 max-w-md text-sm leading-6 text-gray-700">Each batch is prepared in small quantities with traditional spices and cold-pressed oils.</p><Link href="/pickles" className="group mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-olive-800 px-6 text-sm font-bold text-white transition-colors hover:bg-olive-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2">Shop Fresh Batch <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" strokeWidth={2} aria-hidden="true" /></Link></div></div>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="bg-[#f7f0e5] py-10 md:py-16" labelledby="veg-heading">
          <div className="container-main">
            <SectionIntro eyebrow="Plant-based favourites" title="Vegetarian Collection" copy="Mango, gongura, garlic and ginger pickles made in the Andhra tradition." id="veg-heading" action={<ArrowLink href="/pickles/veg">Explore Vegetarian Pickles</ArrowLink>} />
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{vegPickles.map((product) => <ProductCard key={product.type} {...product} showCart listName="Homepage Vegetarian Collection" />)}</div>
            <div className="mt-6 sm:hidden"><ArrowLink href="/pickles/veg">Explore Vegetarian Pickles</ArrowLink></div>
          </div>
        </RevealSection>

        <RevealSection className="bg-olive-900 py-10 text-white md:py-16" labelledby="reviews-heading">
          <div className="container-main">
            <SectionIntro eyebrow="Customer notes" title="Loved Across India" copy="A few words customers have shared about their Andhra Store favourites." id="reviews-heading" tone="dark" />
            <div className="grid gap-4 md:grid-cols-3">
              {featuredReviews.map((review) => (
                <article key={`${review.author.name}-${review.datePublished}`} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.06] p-5 md:min-h-[260px] md:p-6">
                  <ReviewStars value={review.reviewRating.ratingValue} />
                  <p className="mt-5 flex-1 text-sm leading-7 text-white/75">&ldquo;{review.reviewBody}&rdquo;</p>
                  <div className="mt-5 border-t border-white/10 pt-4"><p className="text-sm font-bold">{review.author.name}</p><p className="mt-1 text-[10px] uppercase tracking-widest text-white/40">Customer review</p></div>
                </article>
              ))}
            </div>
          </div>
        </RevealSection>

        <RevealSection id="faq" className="scroll-mt-24 bg-white py-10 md:py-16" labelledby="faq-heading">
          <div className="container-main grid gap-7 lg:grid-cols-[35fr_65fr] lg:gap-16">
            <div><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-brand-600">FAQ</p><h2 id="faq-heading" className="text-3xl text-[#1b281f] sm:text-4xl">Before You Order</h2><p className="mt-4 max-w-sm text-sm leading-6 text-gray-600">Delivery, ingredients, returns and the details people most often ask us about.</p></div>
            <div className="space-y-2 sm:space-y-3">
              {faqSchema.mainEntity.map(({ name, acceptedAnswer }) => (
                <details key={name} className="group rounded-2xl border border-[#e8dfd0] bg-[#fffdf9] open:border-brand-200">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-gray-800"><span>{name}</span><span className="text-xl font-light text-brand-500 transition-transform group-open:rotate-45" aria-hidden="true">+</span></summary>
                  <div className="border-t border-[#eee7dc] px-5 pb-5 pt-4"><p className="text-sm leading-6 text-gray-600">{acceptedAnswer.text}{name === 'What is the return policy for Andhra Store pickles?' && <> <Link href="/return-policy" className="font-semibold text-brand-600 hover:underline">Read our full Return &amp; Refund Policy</Link>.</>}</p></div>
                </details>
              ))}
            </div>
          </div>
        </RevealSection>

        <section className="bg-[#f3e8d7] py-8 sm:py-12" aria-labelledby="final-cta-heading">
          <div className="container-main"><div className="grid overflow-hidden rounded-[2rem] bg-brand-500 text-white md:grid-cols-[56fr_44fr]">
            <div className="flex items-center p-7 sm:p-10 lg:p-14"><div><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/65">Bring home a jar</p><h2 id="final-cta-heading" className="text-3xl sm:text-4xl">Missing the Taste of Andhra?</h2><p className="mt-4 max-w-lg text-sm leading-6 text-white/80">Explore vegetarian and non-vegetarian pickles made for rice, dosa, idli, chapati and everyday meals.</p><Link href="/pickles" className="group mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-900 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-500">Shop All Pickles <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" strokeWidth={2} aria-hidden="true" /></Link></div></div>
            <div className="relative min-h-[280px] md:min-h-[390px]"><Image src="/images/pickles/andhra-prawns-pickle-serving.webp" alt="Andhra prawns pickle served with rice" fill sizes="(max-width: 767px) 100vw, 44vw" className="object-cover" /></div>
          </div></div>
        </section>
      </main>
      <Footer />
    </>
  );
}
