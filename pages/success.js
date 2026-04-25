import Link from 'next/link';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SuccessPage() {
  return (
    <>
      <Head>
        <title>Payment Successful | Andhra Store</title>
        <meta name="description" content="Your Andhra Store order was placed successfully. Our artisans are preparing your authentic Andhra pickles for delivery." />
      </Head>
      <Header />

      <div className="bg-gray-50 min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md mx-auto text-center">

          {/* Success icon */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            {/* Outer pulsing ring */}
            <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-40" />
            {/* Second ring */}
            <div
              className="absolute inset-0 rounded-full border-4 border-green-200"
              style={{ animation: 'scaleIn 0.5s ease-out 0.2s both' }}
            />
            {/* Icon container */}
            <div
              className="absolute inset-0 rounded-full bg-white shadow-lg shadow-green-100/60 flex items-center justify-center"
              style={{ animation: 'scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both' }}
            >
              <svg
                className="w-11 h-11 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                style={{ animation: 'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.35s both' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Text */}
          <div style={{ animation: 'fadeUp 0.5s ease-out 0.4s both' }}>
            <h1 className="text-3xl font-heading font-black text-gray-900 mb-3">Payment Successful!</h1>
            <p className="text-sm text-gray-500 mb-2 leading-relaxed px-4">
              Thank you for your order! We&apos;ve received your payment and our artisans are already preparing your authentic Andhra delicacies.
            </p>
            <p className="text-xs text-gray-400 mb-8">Order confirmation will be sent to your WhatsApp shortly.</p>
          </div>

          {/* Actions */}
          <div
            className="flex flex-col sm:flex-row justify-center items-center gap-3 px-4"
            style={{ animation: 'fadeUp 0.5s ease-out 0.55s both' }}
          >
            <Link
              href="/track"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/20 transition-all duration-200 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              Track My Order
            </Link>
            <Link
              href="/home"
              className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-bold text-sm hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 active:scale-95"
            >
              Continue Shopping
            </Link>
          </div>

          {/* WhatsApp nudge */}
          <p
            className="mt-8 text-xs text-gray-400"
            style={{ animation: 'fadeUp 0.5s ease-out 0.65s both' }}
          >
            Questions? Chat with us on{' '}
            <a href="https://wa.me/918758302568" target="_blank" rel="noreferrer" className="text-green-600 font-semibold hover:underline">
              WhatsApp
            </a>
          </p>
        </div>
      </div>

      <Footer />

      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
