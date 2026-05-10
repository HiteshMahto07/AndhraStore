import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from 'next/head';
import { SITE_URL } from '@/lib/seo';

const pageTitle = "Sweets Collection — Coming Soon | Andhra Store";
const pageDesc = "Andhra Store is bringing you authentic traditional Indian sweets made with premium ingredients and time-honored recipes. Stay tuned for our exclusive sweets collection.";

export default function SweetsPage() {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="robots" content="noindex, follow" />
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={`${SITE_URL}/sweets`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={`${SITE_URL}/sweets`} />
        <meta property="og:image" content={`${SITE_URL}/pickle17.jpeg`} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={`${SITE_URL}/pickle17.jpeg`} />
      </Head>
      <Header />
      <section className="section-pad bg-white" aria-labelledby="sweets-heading">
        <div className="container-main max-w-md mx-auto text-center">
          <span className="text-4xl" role="img" aria-label="Candy">🍬</span>
          <h1 id="sweets-heading" className="text-2xl font-heading text-gray-900 mt-3 mb-2">Sweets</h1>
          <p className="text-sm text-gray-500 mb-1">Our sweets collection is coming soon!</p>
          <p className="text-xs text-gray-400 mb-6">We are carefully curating a selection of traditional Andhra sweets — made with premium ingredients and time-honored recipes. Expect the same quality and authenticity that you love in our pickles.</p>
          <Link href="/home" className="btn-primary">Explore Pickles →</Link>
        </div>
      </section>
      <Footer />
    </>
  );
}