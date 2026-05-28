import Link from 'next/link';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const BASE_URL = "https://www.andhrastore.in";

const pageTitle = "About Andhra Store — Our Story & Heritage";
const pageDesc = "Learn how Andhra Store was born from a passion for authentic East Godavari pickles. Handcrafted with traditional Telugu recipes, no preservatives, and delivered pan-India.";

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: pageTitle,
  description: pageDesc,
  url: `${BASE_URL}/about`,
  publisher: {
    "@type": "Organization",
    name: "Andhra Store",
    url: BASE_URL,
  },
};

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={`${BASE_URL}/about`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={`${BASE_URL}/about`} />
        <meta property="og:image" content={`${BASE_URL}/pickle17.jpeg`} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={`${BASE_URL}/pickle17.jpeg`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
        />
      </Head>
      <Header />

      <section className="relative h-48 sm:h-56 overflow-hidden" aria-label="About us hero">
        <img
          src="/pickle17.jpeg"
          alt="Authentic Andhra pickles in traditional earthen jars"
          className="absolute inset-0 w-full h-full object-cover"
          width={1200}
          height={400}
        />
        <div className="absolute inset-0 bg-gray-900/60" />
        <div className="container-main relative z-10 h-full flex flex-col justify-end pb-6">
          <p className="text-[11px] font-bold tracking-[0.2em] text-brand-300 uppercase mb-1">About Us</p>
          <h1 className="text-3xl sm:text-4xl font-heading text-white">Our Story</h1>
        </div>
      </section>

      <section className="section-pad bg-white" aria-labelledby="story-heading">
        <div className="container-main space-y-12 md:space-y-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <img
                src="/pickle17.jpeg"
                alt="Our journey — traditional Andhra pickle making process in East Godavari"
                className="w-full h-56 sm:h-72 lg:h-[360px] object-cover"
                width={600}
                height={400}
              />
            </div>
            <div>
              <p className="badge-orange mb-2">How It Began</p>
              <h2 id="story-heading" className="text-2xl sm:text-3xl font-heading text-gray-900 mb-4">From East Godavari to Your Home</h2>
              <div className="space-y-3 text-sm text-gray-500 leading-relaxed">
                <p>My love for pickles led me to East Godavari, Andhra Pradesh, where non-vegetarian pickle is part of every daily meal. The region has a centuries-old tradition of pickling using native spices, cold-pressed sesame oil, and sun-drying techniques passed down through generations.</p>
                <p>I tasted the delicious non-veg pickle with rice, and the flavor became stuck in my taste buds. That&apos;s when the idea was born — to bring these authentic recipes to your dining table. We work directly with small-scale artisans from East Godavari who have been making these pickles for decades, ensuring each jar captures the true spirit of Andhra cuisine.</p>
                <p>Today, Andhra Store ships to every corner of India, carrying with it the warmth of a grandmother&apos;s kitchen and the pride of a centuries-old culinary heritage.</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <p className="badge-orange mb-2">Our Mission</p>
              <h2 className="text-2xl sm:text-3xl font-heading text-gray-900 mb-4">Authentic Recipes, Unmatched Quality</h2>
              <div className="space-y-3 text-sm text-gray-500 leading-relaxed">
                <p>We combine Telugu heritage with expertise in pickling to create flavors that transport you to the heart of Andhra Pradesh. Every ingredient is sourced locally — fresh chilies from Guntur, raw mangoes from Rajahmundry, and pure gingelly oil from traditional cold-press mills.</p>
                <p>Our pickles are crafted using time-honored recipes passed down through generations, with unwavering commitment to freshness and quality. We never use artificial preservatives, colors, or additives. The natural acidity from our traditional pickling process ensures a long shelf life without compromising taste or nutrition.</p>
                <p>Each batch is handmade in small quantities so we can maintain rigorous quality control and ensure that every jar you receive is as fresh as the day it was made.</p>
              </div>
            </div>
            <div className="order-1 lg:order-2 rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <img
                src="/chicken-1.jpeg"
                alt="Freshly prepared chicken pickle in traditional Andhra style with authentic spices"
                className="w-full h-56 sm:h-72 lg:h-[360px] object-cover"
                width={600}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-cream" aria-labelledby="values-heading">
        <div className="container-main">
          <div className="text-center mb-8">
            <p className="text-[11px] font-bold text-brand-500 uppercase tracking-[0.15em] mb-0.5">Our Promise</p>
            <h2 id="values-heading" className="text-2xl sm:text-3xl font-heading text-gray-900">Why Choose Andhra Store</h2>
            <p className="text-sm text-gray-500 max-w-xl mx-auto mt-2 leading-relaxed">We are committed to bringing you the most authentic and wholesome Andhra pickles, made with love and respect for tradition.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6m-6 0a1 1 0 00-1 1v1H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-1V4a1 1 0 00-1-1m-6 0h6" />
                  </svg>
                ),
                title: 'Handmade',
                desc: 'Every jar crafted with traditional recipes and love. No machines, no shortcuts — just pure handcrafted excellence.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.5 3-5 5-5 9a5 5 0 0010 0c0-4-3.5-6-5-9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v9" />
                  </svg>
                ),
                title: 'No Preservatives',
                desc: 'Only natural spices and cold-pressed oils. Zero artificial additives, colors, or flavor enhancers.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                ),
                title: 'Pan-India Delivery',
                desc: 'Fresh pickles, shipped safely everywhere. Tamper-proof packaging ensures your order arrives intact.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                ),
                title: 'Made in Andhra',
                desc: 'Authentic Telugu heritage in every bite. Sourced directly from East Godavari artisans.',
              },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-xl p-5 text-center border border-gray-100 hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-600 mx-auto">{v.icon}</div>
                <h3 className="font-heading text-sm text-gray-800 mt-2.5 mb-1">{v.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-500 py-10 md:py-12" aria-label="Shop call to action">
        <div className="container-main text-center">
          <h2 className="text-2xl sm:text-3xl font-heading text-white mb-2">Ready to taste tradition?</h2>
          <p className="text-white/70 text-sm max-w-sm mx-auto mb-5">Order now and experience authentic Andhra pickles delivered to your doorstep. Free delivery on orders above ₹500.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/home" className="inline-flex items-center gap-2 bg-white text-brand-700 px-6 py-3 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors shadow">
              Shop Now →
            </Link>
            <Link href="https://wa.me/918758302568" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors">
              WhatsApp
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}