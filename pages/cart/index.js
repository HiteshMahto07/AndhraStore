import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from 'next/head';
import { SITE_URL } from '@/lib/seo';

const pageTitle = "Your Cart | Andhra Store — Authentic Andhra Pickles";
const pageDesc = "Review your Andhra Store cart. Order authentic handcrafted Andhra pickles via WhatsApp for fast and secure delivery across India.";

export default function CartPage() {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={`${SITE_URL}/cart`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={`${SITE_URL}/cart`} />
        <meta property="og:image" content={`${SITE_URL}/pickle17.jpeg`} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={`${SITE_URL}/pickle17.jpeg`} />
      </Head>
      <Header />
      <section className="section-pad bg-white" aria-labelledby="cart-heading">
        <div className="container-main max-w-md mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-brand-50 flex items-center justify-center" aria-hidden="true">
            <svg className="w-8 h-8 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <h1 id="cart-heading" className="text-2xl font-heading text-gray-900 mb-2">Your Cart</h1>
          <p className="text-sm text-gray-500 mb-1">Cart feature coming soon!</p>
          <p className="text-xs text-gray-400 mb-6">In the meantime, you can place your order directly via WhatsApp. Our team will respond promptly and process your order with care.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/home" className="btn-primary w-full sm:w-auto">Continue Shopping</Link>
            <Link href="https://wa.me/918758302568" target="_blank" rel="noopener noreferrer" className="btn-green w-full sm:w-auto">
              Order via WhatsApp
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}