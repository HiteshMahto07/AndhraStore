#!/usr/bin/env python3
"""Generate all 6 city landing pages for Andhra Store."""
import os

BASE = '/home/sagar/andhra_store/AndhraStore/pages'

def r(s):
    return repr(s)

HEADER = """import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import SectionHeading from '@/components/SectionHeading';
import { SITE_URL } from '@/lib/seo';
"""

FOOTER_JS = """
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
"""

def build(c):
    slug = c['slug']
    city = c['city']
    fn   = c['fn_name']

    prods = '\n'.join(
        "  { name: " + r(p[0]) + ", image: '/images/pickles/andhra-" + p[1] + "-pickle-sealed.webp', price: " + str(p[2]) + ", type: " + r(p[3]) + (", badge: " + r(p[4]) if len(p) > 4 else "") + " },"
        for p in c['products']
    )

    faqs_arr = '\n'.join(
        "  { q: " + r(q) + ", a: " + r(a) + " },"
        for q, a in c['faqs']
    )

    area_served = '\n    '.join(
        '{ "@type": "City", name: ' + r(a) + ' },'
        for a in c['areaServed']
    )

    why_items = '\n'.join(
        "              { title: " + r(w[0]) + ", desc: " + r(w[1]) + " },"
        for w in c['why']
    )

    rev_items = '\n'.join(
        "              { name: " + r(rv[0]) + ", loc: " + r(rv[1]) + ", text: " + r(rv[2]) + " },"
        for rv in c['reviews']
    )

    areas_js = '[' + ', '.join(r(a) for a in c['areas']) + ']'

    out = HEADER + f"""
const pageTitle = {r(c['title'])};
const pageDesc  = {r(c['desc'])};
const pageUrl   = `${{SITE_URL}}/{slug}`;

const featuredProducts = [
{prods}
];

const cityAreas = {areas_js};

const faqs = [
{faqs_arr}
];

const localBusinessSchema = {{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Andhra Store",
  description: {r(f"Authentic Andhra pickles handcrafted in Nani Daman, delivered to {city}.")},
  url: pageUrl,
  telephone: "+91-8758302568",
  email: "Andhrastore.india@gmail.com",
  address: {{
    "@type": "PostalAddress",
    streetAddress: "Maharaja Complex, Jetty Road, Near Night Street, Opposite Police Station",
    addressLocality: "Nani Daman",
    addressRegion: "Dadra and Nagar Haveli and Daman and Diu",
    postalCode: "396210",
    addressCountry: "IN",
  }},
  areaServed: [
    {area_served}
  ],
  openingHours: "Mo-Su 10:00-22:00",
  priceRange: "₹₹",
  aggregateRating: {{ "@type": "AggregateRating", ratingValue: "4.9", bestRating: "5", worstRating: "1", reviewCount: "500" }},
}};

const breadcrumbSchema = {{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {{ "@type": "ListItem", position: 1, name: "Home", item: `${{SITE_URL}}/home` }},
    {{ "@type": "ListItem", position: 2, name: {r(f"Andhra Pickles in {city}")}, item: pageUrl }},
  ],
}};

const faqSchema = {{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({{ q, a }}) => ({{ "@type": "Question", name: q, acceptedAnswer: {{ "@type": "Answer", text: a }} }})),
}};
""" + FOOTER_JS + f"""
export default function {fn}() {{
  return (
    <>
      <Head>
        <title>{{pageTitle}}</title>
        <meta name="description" content={{pageDesc}} />
        <link rel="canonical" href={{pageUrl}} />
        <meta property="og:title" content={{pageTitle}} />
        <meta property="og:description" content={{pageDesc}} />
        <meta property="og:url" content={{pageUrl}} />
        <meta property="og:image" content={{`${{SITE_URL}}/images/pickles/andhra-mango-pickle-sealed.webp`}} />
        <meta property="og:image:alt" content={r(f"Andhra pickles delivered in {city} — authentic homemade mango avakaya and more")} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:title" content={{pageTitle}} />
        <meta name="twitter:description" content={{pageDesc}} />
        <meta name="twitter:image" content={{`${{SITE_URL}}/images/pickles/andhra-mango-pickle-sealed.webp`}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{{{ __html: JSON.stringify(localBusinessSchema) }}}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{{{ __html: JSON.stringify(breadcrumbSchema) }}}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{{{ __html: JSON.stringify(faqSchema) }}}} />
      </Head>
      <Header />

      <section className="bg-gradient-to-br from-olive-800 via-olive-700 to-olive-900 text-white" aria-label="{city} city page hero">
        <div className="container-main py-12 md:py-20">
          <p className="text-[11px] font-bold text-olive-200 uppercase tracking-[0.2em] mb-2">Delivery to {city}</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 max-w-2xl leading-tight">
            {c['h1a']}<br />{c['h1b']}
          </h1>
          <p className="text-olive-200 text-sm sm:text-base max-w-xl leading-relaxed mb-8">
            {c['hero']}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/pickles" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors shadow-md">Shop All Pickles</Link>
            <Link href="https://wa.me/918758302568" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors shadow-md">{{whatsappIcon}} Order via WhatsApp</Link>
          </div>
        </div>
      </section>

      <div className="bg-olive-700 py-3">
        <div className="container-main grid grid-cols-2 md:grid-cols-4 gap-3 text-white text-xs">
          <div><p className="font-semibold">Handmade</p><p className="text-white/60">Traditional recipes</p></div>
          <div><p className="font-semibold">No Preservatives</p><p className="text-white/60">Pure &amp; natural</p></div>
          <div><p className="font-semibold">{c['days']}</p><p className="text-white/60">{city} — {c['km']} km away</p></div>
          <div><p className="font-semibold">Free Shipping</p><p className="text-white/60">On all orders</p></div>
        </div>
      </div>

      <section className="section-pad bg-white" aria-labelledby="products-heading">
        <div className="container-main">
          <SectionHeading label={r(f"Top Picks for {city}")} title={r(f"Most Ordered Pickles in {city}")}
            description="Mango Avakaya, Gongura Pachadi and Chicken Pickle are the most ordered across all cities. Mix and match to find what works for you."
            actionHref="/pickles" id="products-heading" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {{featuredProducts.map((p) => <ProductCard key={{p.type}} {{...p}} />)}}
          </div>
        </div>
      </section>

      <section className="section-pad bg-cream" aria-labelledby="delivery-heading">
        <div className="container-main">
          <SectionHeading label="Delivery" title={r(f"{city} Delivery Info")} id="delivery-heading" />
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {{[
              {{ title: 'Delivery Time',   value: {r(c['days'])}, sub: {r(f"Daman to {city} — {c['km']} km")} }},
              {{ title: 'Shipping Charge', value: 'Free', sub: {r(f"On all orders to {city}")} }},
              {{ title: 'Dispatch',        value: 'Within 24 Hours', sub: 'Of order confirmation' }},
            ].map((d) => (
              <div key={{d.title}} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
                <p className="text-[11px] font-bold text-olive-600 uppercase tracking-wider mb-1">{{d.title}}</p>
                <p className="text-xl font-heading font-bold text-gray-900 mb-0.5">{{d.value}}</p>
                <p className="text-xs text-gray-400">{{d.sub}}</p>
              </div>
            ))}}
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-[11px] font-bold text-olive-600 uppercase tracking-wider mb-3">Areas We Deliver to in {city}</p>
            <div className="flex flex-wrap gap-2">
              {{cityAreas.map((area) => (
                <span key={{area}} className="px-3 py-1 bg-olive-50 border border-olive-100 text-olive-700 text-xs font-semibold rounded-full">{{area}}</span>
              ))}}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white" aria-labelledby="why-heading">
        <div className="container-main">
          <SectionHeading label="Why Choose Us" title={r(f"Why {city} Customers Order from Andhra Store")} id="why-heading" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {{[
{why_items}
            ].map((w) => (
              <div key={{w.title}} className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                <div className="w-8 h-1 bg-brand-500 rounded-full mb-3" />
                <h3 className="text-sm font-bold text-gray-900 mb-2">{{w.title}}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{{w.desc}}</p>
              </div>
            ))}}
          </div>
        </div>
      </section>

      <section className="section-pad bg-cream" aria-labelledby="reviews-heading">
        <div className="container-main">
          <SectionHeading label="Customer Reviews" title={r(f"What {city} Customers Say")} id="reviews-heading" />
          <div className="grid sm:grid-cols-3 gap-4">
            {{[
{rev_items}
            ].map((t) => (
              <div key={{t.name}} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex gap-0.5 mb-3">{{STARS}}</div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">&ldquo;{{t.text}}&rdquo;</p>
                <p className="text-sm font-semibold text-gray-800">{{t.name}}</p>
                <p className="text-[11px] text-gray-400">{{t.loc}}</p>
              </div>
            ))}}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white" aria-labelledby="faq-heading">
        <div className="container-main max-w-2xl">
          <SectionHeading label="FAQs" title="Frequently Asked Questions" id="faq-heading" />
          <div className="space-y-2">{{faqs.map((f) => <FAQItem key={{f.q}} q={{f.q}} a={{f.a}} />)}}</div>
        </div>
      </section>

      <section className="section-pad bg-olive-800 text-white" aria-label="Order CTA">
        <div className="container-main text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-3">Ready to Order?</h2>
          <p className="text-olive-200 text-sm max-w-md mx-auto mb-6">{c['cta']}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/pickles" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors shadow-md">Shop All Pickles</Link>
            <Link href="https://wa.me/918758302568" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors shadow-md">{{whatsappIcon}} Order via WhatsApp</Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}}
"""
    return out


CITIES = [
  {
    'slug':'andhra-pickles-surat','fn_name':'SuratPage','city':'Surat',
    'title':'Andhra Pickles Delivery in Surat — Order Online | Andhra Store',
    'desc':'Get authentic Andhra pickles delivered to Surat in 1 day. Our store is in Nani Daman — just 80 km away. Mango Avakaya, Gongura, Chicken Pickle and more. No preservatives. Free shipping.',
    'h1a':'Andhra Pickles Delivered','h1b':'to Surat in 1 Day',
    'hero':'We are in Nani Daman — 80 km from Surat. That is the closest any authentic Andhra pickle brand gets. Orders placed before afternoon usually reach Surat the next business day.',
    'cta':'80 km from your door. Order today and it will be there tomorrow.',
    'km':80,'days':'1 Business Day',
    'areas':['Adajan','Athwa','Katargam','Varachha','Piplod','Vesu','Althan','Pal','Udhna','Sarthana','Rander','Bardoli','Navsari'],
    'products':[('Mango Pickle','mango',200,'Mango','MOST LOVED'),('Chicken Pickle','chicken',300,'Chicken','BEST SELLER'),('Gongura Pickle','gongura',200,'Gongura'),('Garlic Pickle','garlic',220,'Garlic')],
    'faqs':[
      ('How long does delivery from Daman to Surat take?','Our store is in Nani Daman, roughly 80 km from Surat. Most orders reach Surat the next business day. We dispatch within 24 hours of order confirmation.'),
      ('Do you deliver to all areas in Surat?','Yes — we deliver across Surat including Adajan, Varachha, Katargam, Vesu, Piplod, Pal and Udhna. Bardoli and Navsari are also covered.'),
      ('What is the delivery charge for Surat?','Free delivery on all orders. No minimum order, no extra charge for Surat.'),
      ('Is there a less spicy option for Surat customers?','Our Lemon Pickle and Mango Avakaya are on the medium side. For full Andhra spice, Gongura or Red Chilli Pickle are the ones.'),
      ('Can I place a bulk order for an event in Surat?','Yes. For weddings or corporate gifting, WhatsApp us at 8758302568. We can pack and dispatch in quantity with 24 to 48 hours notice.'),
    ],
    'why':[
      ('80 km Away','No other Andhra pickle brand ships from closer to Surat. Shorter distance means fresher product when it reaches you.'),
      ('No Preservatives','Cold-pressed oil, stone-ground spices, rock salt. No sodium benzoate, no artificial colour. The way it was always made.'),
      ('Gongura You Cannot Find Locally','Gongura sorrel leaf pickle is almost impossible to find in Gujarat. If you have had it before and missed it, this is where to order.'),
      ('Small Batch Made','We make in small batches every week. Not factory-produced. Each jar is packed and dispatched fresh.'),
    ],
    'reviews':[
      ('Priya R.','Adajan, Surat','Ordered mango and garlic pickle. Reached Surat the next day, which I was not expecting. The garlic pickle is very strong exactly how I like it. Have already reordered.'),
      ('Vijay N.','Varachha, Surat','We are from Andhra, living in Surat for 8 years. Finally found something that actually tastes like home. The gongura pachadi brought back a lot of memories. Good packaging too.'),
      ('Hemangi P.','Vesu, Surat','Tried the mango pickle on a friend recommendation. Honestly better than what I have bought from local shops here. The sourness is right and it is not overpowered by salt.'),
    ],
    'areaServed':['Surat','Navsari','Bardoli'],
  },
  {
    'slug':'andhra-pickles-pune','fn_name':'PunePage','city':'Pune',
    'title':'Andhra Pickles Delivery in Pune — Order Online | Andhra Store',
    'desc':'Order authentic Andhra pickles with delivery to Pune in 2 days. Mango Avakaya, Gongura Pachadi, Chicken Pickle and more. Made in Daman with no preservatives. Free shipping pan-India.',
    'h1a':'Authentic Andhra Pickles','h1b':'Delivered to Pune',
    'hero':'We make and ship from Nani Daman. Pune orders typically arrive in 2 business days. Mango Avakaya, Gongura, Chicken and 13 more varieties — all made without preservatives.',
    'cta':'Browse the full range and get authentic Andhra pickles delivered to your Pune address.',
    'km':330,'days':'2 Business Days',
    'areas':['Kothrud','Baner','Aundh','Wakad','Hinjewadi','Pimpri-Chinchwad','Hadapsar','Koregaon Park','Viman Nagar','Kharadi','Magarpatta','Sinhagad Road','Shivajinagar'],
    'products':[('Chicken Pickle','chicken',300,'Chicken','BEST SELLER'),('Mango Pickle','mango',200,'Mango','MOST LOVED'),('Gongura Pickle','gongura',200,'Gongura'),('Prawns Pickle','prawns',350,'Prawns')],
    'faqs':[
      ('How long does delivery to Pune take?','Pune is about 330 km from our store in Nani Daman. Orders typically arrive in 2 business days via courier. We dispatch within 24 hours of confirmation.'),
      ('Do you deliver to Pimpri-Chinchwad and Hinjewadi?','Yes — we deliver across Pune including Pimpri-Chinchwad, Hinjewadi, Baner, Wakad, Kothrud, Hadapsar and all other areas via courier.'),
      ('Is there a minimum order value for Pune delivery?','No minimum order. You can order a single jar and it ships free.'),
      ('Which pickle is most popular with Pune customers?','Chicken Pickle and Mango Avakaya are the most ordered in Pune. Gongura Pachadi gets regular reorders from customers who have moved from Andhra and Telangana.'),
      ('Can I get a sampler to try before ordering more?','We do not have a fixed sampler pack but you can order any combination of jars. Ordering two or three varieties to try first is what most new customers do.'),
    ],
    'why':[
      ('Made in Daman','Our kitchen is in Nani Daman, not a factory in some distant city. Small operation, freshly made every week.'),
      ('No Preservatives','Cold-pressed groundnut oil, Guntur red chillies, rock salt. Nothing else. Shelf life comes from the oil and salt, not from additives.'),
      ('Andhra Diaspora Favourite','A large number of our Pune customers are Andhra or Telangana families settled in the city. They know what real avakaya should taste like — and they keep coming back.'),
      ('Secure Packaging','Jars are bubble-wrapped individually and packed in sturdy boxes. We have had very few breakages in transit over hundreds of Pune orders.'),
    ],
    'reviews':[
      ('Suresh K.','Baner, Pune','I am from Vijayawada, living in Pune for 6 years. The avakaya from Andhra Store is the closest I have found to what my mother makes at home. Ordered twice already.'),
      ('Deepa M.','Kothrud, Pune','The chicken pickle is really good. Strong flavour, proper Andhra spice level. Arrived in 2 days and the jar was well packed. Will order more for gifting.'),
      ('Rohit S.','Hinjewadi, Pune','Tried gongura and mango pickle together. Both excellent. The gongura sourness is exactly right not too sharp, not mild. Difficult to find this quality in Pune shops.'),
    ],
    'areaServed':['Pune','Pimpri-Chinchwad','Lonavala'],
  },
  {
    'slug':'andhra-pickles-ahmedabad','fn_name':'AhmedabadPage','city':'Ahmedabad',
    'title':'Andhra Pickles Delivery in Ahmedabad — Order Online | Andhra Store',
    'desc':'Order authentic Andhra pickles with home delivery to Ahmedabad in 1-2 days. Mango Avakaya, Gongura, Chicken Pickle and more. Made fresh in Daman — only 350 km away. No preservatives.',
    'h1a':'Andhra Pickles Delivered','h1b':'to Ahmedabad',
    'hero':'We ship from Nani Daman, 350 km from Ahmedabad. Deliveries typically arrive in 1 to 2 business days. Authentic Andhra flavours that are genuinely hard to find in Gujarat.',
    'cta':'Order today. Delivered to Ahmedabad in 1 to 2 business days from Daman.',
    'km':350,'days':'1-2 Business Days',
    'areas':['Navrangpura','Satellite','Bopal','SG Highway','Prahlad Nagar','Vastrapur','Maninagar','Gota','Chandkheda','Naranpura','Bodakdev','Thaltej','Gandhinagar'],
    'products':[('Mango Pickle','mango',200,'Mango','MOST LOVED'),('Gongura Pickle','gongura',200,'Gongura','MUST TRY'),('Lemon Pickle','lemon',200,'Lemon'),('Chicken Pickle','chicken',300,'Chicken','BEST SELLER')],
    'faqs':[
      ('How long does delivery from Daman to Ahmedabad take?','Ahmedabad is about 350 km from our store in Nani Daman. Most orders arrive in 1 to 2 business days. We dispatch within 24 hours of confirmation.'),
      ('Do you deliver to Gandhinagar and areas near Ahmedabad?','Yes — we deliver to Gandhinagar and all areas within Ahmedabad including Satellite, Bopal, SG Highway, Navrangpura and Maninagar.'),
      ('Are Andhra pickles very spicy? I prefer mild pickle.','Lemon Pickle and Mango Avakaya are on the medium side and are the most accessible for people who prefer less heat. Our Gongura is also medium-hot, not extreme.'),
      ('What is the minimum order for free delivery to Ahmedabad?','No minimum. Free shipping on all orders to Ahmedabad, even a single jar.'),
      ('I want to send pickles as a gift to an Ahmedabad address. Is that possible?','Yes. Just enter the recipient address at checkout and we will ship directly to that Ahmedabad address. We can also add a note to the package.'),
    ],
    'why':[
      ('Genuine Andhra Taste','These are not Gujarat-style pickles or adjusted-for-local-taste versions. This is actual Andhra avakaya, gongura and karam exactly as made in East Godavari.'),
      ('350 km Away','We are one of the closest authentic Andhra food sources to Ahmedabad. Orders placed today typically arrive the day after tomorrow.'),
      ('No Preservatives','Cold-pressed oil, Guntur chillies, fenugreek, mustard — the original ingredients. No artificial preservatives or colour.'),
      ('Good for Gifting','A jar of Mango Avakaya or Gongura makes a genuinely useful gift for anyone from the South settled in Ahmedabad. We pack securely for courier.'),
    ],
    'reviews':[
      ('Ankit P.','Satellite, Ahmedabad','My wife is from Andhra and she has been missing good avakaya since we moved here 4 years ago. This is genuinely the best she has had outside Andhra. Very happy with the order.'),
      ('Kavitha R.','Bopal, Ahmedabad','Ordered gongura and lemon pickle. The gongura especially is excellent the sour-spicy balance is exactly right. Arrived well packed in 2 days. Will reorder.'),
      ('Manish D.','Navrangpura, Ahmedabad','Bought as a gift for a colleague from Andhra. He said it was very close to home taste. Good quality, secure packaging, delivered on time.'),
    ],
    'areaServed':['Ahmedabad','Gandhinagar','Anand'],
  },
  {
    'slug':'andhra-pickles-hyderabad','fn_name':'HyderabadPage','city':'Hyderabad',
    'title':'Andhra Pickles Delivery in Hyderabad — Order Online | Andhra Store',
    'desc':'Order authentic Andhra pickles with delivery to Hyderabad. Mango Avakaya, Gongura Pachadi, Chicken Pickle and more. Handcrafted in Daman with no preservatives. Free shipping. 3-4 day delivery.',
    'h1a':'Authentic Andhra Pickles','h1b':'Delivered to Hyderabad',
    'hero':'You know what real avakaya and gongura tastes like. So do we. Made in Nani Daman from the same East Godavari recipes. Orders delivered to Hyderabad in 3 to 4 business days.',
    'cta':'Order today and get authentic Andhra flavours delivered to your Hyderabad address in 3 to 4 days.',
    'km':1100,'days':'3-4 Business Days',
    'areas':['Banjara Hills','Jubilee Hills','Madhapur','Gachibowli','Kondapur','Kukatpally','Secunderabad','Ameerpet','Begumpet','Hitech City','Manikonda','Miyapur','LB Nagar'],
    'products':[('Gongura Pickle','gongura',200,'Gongura','ANDHRA CLASSIC'),('Mango Pickle','mango',200,'Mango','MOST LOVED'),('Chicken Pickle','chicken',300,'Chicken','BEST SELLER'),('Red Chilli Pickle','red-chilli',220,'RedChilli')],
    'faqs':[
      ('How long does delivery to Hyderabad take?','Hyderabad is about 1,100 km from our store in Nani Daman. Orders typically arrive in 3 to 4 business days via courier. We dispatch within 24 hours of confirmation.'),
      ('I am from Andhra — will this taste like home?','Our recipes are from East Godavari — avakaya made with raw mangoes, gongura with real sorrel leaves, spice mix ground in the traditional way. We hear this from Andhra customers most often.'),
      ('Do you use Guntur chillies specifically?','Yes. All our pickle spice blends use Guntur red chilli. We do not substitute with generic chilli powder. The heat and flavour profile is specifically Andhra.'),
      ('Do you deliver to Secunderabad and surrounding areas?','Yes — we deliver to Secunderabad, Kukatpally, Miyapur and all areas within the greater Hyderabad region via courier.'),
      ('Can I order Gongura and Avakaya together?','Yes — you can order any combination of pickles in one order. Both Gongura and Mango Avakaya are available as individual jars and frequently ordered together.'),
    ],
    'why':[
      ('East Godavari Recipes','Our founders are from Rajahmundry. The recipes for avakaya, gongura and kodi karam have not been modified for commercial scaling. Same proportions, same process.'),
      ('Guntur Chilli Only','We use actual Guntur red chillies in all our pickles. The heat is different. Anyone from Andhra will notice the difference immediately.'),
      ('No Preservatives','Traditionally, Andhra pickles are preserved by salt and oil alone. That is how we make them. No sodium benzoate, no citric acid, no added colour.'),
      ('Ships to All of Hyderabad','We deliver to all areas across Hyderabad and Secunderabad via our courier network. 3 to 4 days from Daman.'),
    ],
    'reviews':[
      ('Lakshmi T.','Banjara Hills, Hyderabad','I moved back to Hyderabad from Daman and have been ordering avakaya from Andhra Store ever since. It tastes exactly like the pickles we used to buy there. Really good quality.'),
      ('Ravi K.','Madhapur, Hyderabad','The gongura pachadi is excellent. The sourness level is correct not overpowered by chilli, proper balance. My mother in law from Kakinada approved it, which is the real test.'),
      ('Sravani P.','Kondapur, Hyderabad','Ordered chicken pickle and mango avakaya. Both arrived well packed in 4 days. The chicken pickle is properly cooked and spiced not the oily mess you get from random online sellers.'),
    ],
    'areaServed':['Hyderabad','Secunderabad','Cyberabad'],
  },
  {
    'slug':'andhra-pickles-bangalore','fn_name':'BangalorePage','city':'Bangalore',
    'title':'Andhra Pickles Delivery in Bangalore — Order Online | Andhra Store',
    'desc':'Order authentic Andhra pickles with delivery to Bangalore in 4-5 days. Mango Avakaya, Gongura Pachadi, Chicken Pickle and more. Made in Daman with no preservatives. Free shipping pan-India.',
    'h1a':'Authentic Andhra Pickles','h1b':'Delivered to Bangalore',
    'hero':'Made in Nani Daman with East Godavari recipes. Mango Avakaya, Gongura Pachadi, Chicken Pickle and 13 more varieties — delivered to Bangalore in 4 to 5 business days.',
    'cta':'Browse the full range and get authentic Andhra pickles delivered across Bangalore.',
    'km':1500,'days':'4-5 Business Days',
    'areas':['Koramangala','Indiranagar','Whitefield','Electronic City','HSR Layout','JP Nagar','Jayanagar','BTM Layout','Marathahalli','Bellandur','Sarjapur Road','Hebbal','Yelahanka'],
    'products':[('Chicken Pickle','chicken',300,'Chicken','BEST SELLER'),('Mango Pickle','mango',200,'Mango','MOST LOVED'),('Gongura Pickle','gongura',200,'Gongura'),('Prawns Pickle','prawns',350,'Prawns')],
    'faqs':[
      ('How long does delivery to Bangalore take?','Bangalore is about 1,500 km from our store in Nani Daman. Orders typically arrive in 4 to 5 business days via courier. We dispatch within 24 hours of confirmation.'),
      ('Do you deliver to Electronic City and Whitefield?','Yes — we deliver across Bangalore including Electronic City, Whitefield, Koramangala, Indiranagar, HSR Layout and all other areas via courier.'),
      ('Is the Andhra pickle different from Karnataka-style pickle?','Yes, quite different. Andhra pickles use more chilli, groundnut or mustard oil, and heavy fenugreek. Karnataka pickles tend to be milder and more coconut-forward.'),
      ('What is the shipping charge for Bangalore?','Free delivery on all orders. No minimum order value.'),
      ('Can I order multiple jars for my office in Whitefield?','Yes, you can order as many jars as you need. We will pack them securely and dispatch to your Whitefield address.'),
    ],
    'why':[
      ('Andhra Recipes Not Adjusted','Bangalore has a large South Indian food market but authentic Andhra pickle the way it is made in East Godavari is hard to find. We make the original version.'),
      ('No Preservatives','Cold-pressed oil, Guntur chillies, rock salt and spices. The preservation comes from the ingredients, not from added chemicals.'),
      ('Popular with Telugu Families','A large share of our Bangalore customers are Telugu-speaking families settled in the tech corridor. They know exactly what they are ordering and why.'),
      ('Secure Packing','Each jar is bubble-wrapped and boxed. We ship regularly to Bangalore and have refined the packing to handle the distance.'),
    ],
    'reviews':[
      ('Kiran B.','Koramangala, Bangalore','I have been ordering from Andhra Store for 8 months. The avakaya is consistently good same taste every time. That is rare for handmade products. Fast delivery too.'),
      ('Ananya R.','Indiranagar, Bangalore','The gongura pachadi is the reason I keep coming back. I have tried several brands online and none of them get the sourness right the way this one does. Worth every rupee.'),
      ('Shiva K.','Electronic City, Bangalore','Ordered chicken and prawns pickle. Both very good. The prawns pickle is properly made, not the thin oily version most sellers pass off. Arrived in 5 days, well packed.'),
    ],
    'areaServed':['Bangalore','Bengaluru','Mysuru'],
  },
  {
    'slug':'andhra-pickles-delhi','fn_name':'DelhiPage','city':'Delhi NCR',
    'title':'Andhra Pickles Delivery in Delhi NCR — Order Online | Andhra Store',
    'desc':'Order authentic Andhra pickles with delivery to Delhi NCR in 4-5 days. Mango Avakaya, Gongura Pachadi, Chicken Pickle and more. Handcrafted in Daman with no preservatives. Free shipping.',
    'h1a':'Authentic Andhra Pickles','h1b':'Delivered to Delhi NCR',
    'hero':'Made in Nani Daman with real Andhra recipes — Guntur chillies, raw mangoes from East Godavari, cold-pressed oil. Delivered to Delhi, Noida, Gurgaon and Faridabad in 4 to 5 business days.',
    'cta':'Order today and get genuine Andhra pickles delivered anywhere in Delhi NCR.',
    'km':1400,'days':'4-5 Business Days',
    'areas':['South Delhi','Dwarka','Rohini','Noida','Gurgaon','Faridabad','Lajpat Nagar','Saket','Vasant Kunj','Janakpuri','Pitampura','Greater Noida','Ghaziabad'],
    'products':[('Chicken Pickle','chicken',300,'Chicken','BEST SELLER'),('Mango Pickle','mango',200,'Mango','MOST LOVED'),('Gongura Pickle','gongura',200,'Gongura'),('Ginger Pickle','ginger',220,'Ginger')],
    'faqs':[
      ('How long does delivery to Delhi NCR take?','Delhi is about 1,400 km from our store in Nani Daman. Orders typically arrive in 4 to 5 business days via courier. We dispatch within 24 hours of confirmation.'),
      ('Do you deliver to Noida, Gurgaon and Faridabad?','Yes — we deliver to all of Delhi NCR including Noida, Gurgaon, Faridabad, Ghaziabad and Greater Noida via courier.'),
      ('What makes Andhra pickle different from North Indian pickles?','Andhra pickles use significantly more chilli, rely on groundnut or sesame oil rather than mustard oil, and the spice mix includes fenugreek and curry leaves. The heat level is higher and the flavour is more complex.'),
      ('Is shipping free to Delhi NCR?','Yes. Free delivery on all orders to Delhi NCR with no minimum order value.'),
      ('I want to send Andhra pickles as a gift to a South Indian colleague in Delhi. Is that possible?','Absolutely. Enter the recipient address at checkout and we will ship directly. The jar packaging is clean and gift-ready. WhatsApp us at 8758302568 for bulk gift orders.'),
    ],
    'why':[
      ('Real Andhra Taste in Delhi','Andhra pickle bought in Delhi is usually a compromise — adjusted spice levels, different oil, generic packaging. We make the original version from East Godavari recipes.'),
      ('No Preservatives','Cold-pressed oil and natural spices do the preservation. No sodium benzoate, no added colour, nothing artificial.'),
      ('Popular with South Indian Expats','Delhi has a sizeable Telugu-speaking community in government, business and the tech sector. Many of our Delhi orders come from people who grew up eating proper avakaya and gongura.'),
      ('Secure Long-Distance Packing','1,400 km is a long way. We double-wrap each jar in bubble wrap and use rigid boxes specifically for long-distance orders.'),
    ],
    'reviews':[
      ('Padma V.','South Delhi','I am from Guntur, posted in Delhi for work. Ordering from Andhra Store every month. The avakaya is the real thing — not some Gujarati or Punjabi version adjusted to be mild. Worth it completely.'),
      ('Arun M.','Noida','Tried the gongura pachadi for the first time — brilliant. I had eaten it at a friend place in Hyderabad but never knew where to order online. This is exactly what I was looking for. Fast delivery too.'),
      ('Sneha T.','Gurgaon','Ordered a combination — mango, chicken, and ginger pickle. All three arrived well packed, nothing leaked. Ginger pickle is very different from what I expected, in a good way. Will order again.'),
    ],
    'areaServed':['Delhi','Noida','Gurgaon','Faridabad'],
  },
]

for c in CITIES:
    dirname = c['slug'].replace('andhra-pickles-', '')
    path = f"{BASE}/andhra-pickles-{dirname}/index.js"
    content = build(c)
    with open(path, 'w') as f:
        f.write(content)
    print(f"  written: andhra-pickles-{dirname}/index.js  ({len(content):,} chars)")

print("\nAll 6 city pages written successfully.")
