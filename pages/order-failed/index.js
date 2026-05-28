/**
 * pages/order-failed/index.js
 *
 * Shown when Razorpay payment verification fails or the payment is declined.
 * Offers two recovery paths: retry checkout or fall back to WhatsApp ordering.
 *
 * GTM payment_failed event is fired on the checkout page before redirect, not here,
 * to avoid double-firing on page reload.
 */

import Head from 'next/head';
import Link from 'next/link';
import { XCircle, RefreshCw, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/seo';
import { WHATSAPP_PHONE } from '@/lib/checkout';

export default function OrderFailedPage() {
  return (
    <>
      <Head>
        <title>Payment Failed — Andhra Store</title>
        <meta name="description" content="Your payment could not be completed. Try again or place your order via WhatsApp." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${SITE_URL}/order-failed`} />
      </Head>

      <Header />

      <main className="min-h-screen bg-cream section-pad">
        <div className="container-main max-w-md mx-auto text-center">

          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle size={40} className="text-red-500" />
          </div>

          <h1 className="text-2xl font-heading font-extrabold text-gray-900 mb-3">
            Payment Failed
          </h1>

          <p className="text-gray-600 mb-2 leading-relaxed">
            We couldn&apos;t verify your payment. Your money has <strong>not been deducted</strong> — if it was, it will be refunded within 5–7 business days.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Please try again or place your order via WhatsApp — we&apos;re happy to help!
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center gap-2 bg-brand-500 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-brand-600 transition-colors shadow-sm"
            >
              <RefreshCw size={16} />
              Try Again
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
            >
              <MessageCircle size={16} />
              Order via WhatsApp
            </a>
          </div>

          {/* Help note */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 text-sm text-left shadow-sm">
            <p className="font-semibold text-gray-700 mb-2">Need help?</p>
            <ul className="space-y-1.5 text-gray-500">
              <li>
                Call us:{' '}
                <a href="tel:+918758302568" className="text-brand-500 hover:underline font-medium">
                  8758302568
                </a>
              </li>
              <li>
                Email:{' '}
                <a href="mailto:Andhrastore.india@gmail.com" className="text-brand-500 hover:underline font-medium">
                  Andhrastore.india@gmail.com
                </a>
              </li>
              <li className="text-xs pt-1">
                If money was deducted, share your Razorpay Payment ID when contacting us.
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
