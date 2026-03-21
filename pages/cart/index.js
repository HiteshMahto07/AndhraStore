import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CartPage() {
  return (
    <>
      <Header />
      <section className="section-pad bg-white">
        <div className="container-main max-w-md mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-brand-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-heading text-gray-900 mb-2">Your Cart</h1>
          <p className="text-sm text-gray-500 mb-1">Cart feature coming soon!</p>
          <p className="text-xs text-gray-400 mb-6">Order directly via WhatsApp for now.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/home" className="btn-primary w-full sm:w-auto">Continue Shopping</Link>
            <Link href="https://wa.me/918758302568" target="_blank" className="btn-green w-full sm:w-auto">
              Order via WhatsApp
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}