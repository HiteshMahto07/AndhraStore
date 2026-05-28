/**
 * pages/order-success/[orderId].js
 *
 * Renders after a successful payment (Razorpay or COD).
 * Reads order data from sessionStorage key 'as_order' written by the checkout page.
 * sessionStorage is cleared after reading — prevents data leaking to a page refresh.
 *
 * GTM purchase event is fired on the checkout page before redirect, NOT here,
 * to avoid double-firing on refresh. This page is display-only.
 */

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { CheckCircle2, Package, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/seo';
import { WHATSAPP_PHONE } from '@/lib/checkout';

export default function OrderSuccessPage() {
  const [order, setOrder] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('as_order');
      if (raw) {
        setOrder(JSON.parse(raw));
        sessionStorage.removeItem('as_order'); // clear immediately after reading
      }
    } catch {
      // corrupted sessionStorage — show generic success
    }
    setReady(true);
  }, []);

  const isCOD      = order?.payMethod === 'cod';
  const displayId  = order?.orderId ?? '—';
  const payId      = order?.paymentId ?? null;

  return (
    <>
      <Head>
        <title>Order Confirmed — Andhra Store</title>
        <meta name="description" content="Your Andhra Store order has been confirmed. Thank you for your purchase!" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${SITE_URL}/order-success`} />
      </Head>

      <Header />

      <main className="min-h-screen bg-cream section-pad">
        <div className="container-main max-w-lg mx-auto text-center">

          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>

          <h1 className="text-2xl font-heading font-extrabold text-gray-900 mb-2">
            {isCOD ? 'COD Order Confirmed!' : 'Payment Successful!'}
          </h1>

          <p className="text-gray-600 mb-8 leading-relaxed">
            {isCOD
              ? 'Your Cash on Delivery order has been placed. A WhatsApp message has been sent to us with your details. We\'ll confirm delivery soon!'
              : `Thank you${order?.name ? ', ' + order.name.split(' ')[0] : ''}! Your payment was verified and your order is being prepared.`}
          </p>

          {/* Order meta */}
          {ready && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 text-left">
              <h2 className="text-sm font-heading font-bold text-gray-500 uppercase tracking-wide mb-4">Order Details</h2>

              <dl className="space-y-3 text-sm">
                <Row label="Order ID" value={displayId} mono />
                {payId && payId !== 'cod' && <Row label="Payment ID" value={payId} mono />}
                {order?.name && <Row label="Name" value={order.name} />}

                {order?.cartItems?.length > 0 && (
                  <div className="pt-3 border-t border-gray-100">
                    <dt className="text-gray-500 mb-2">Items Ordered</dt>
                    <dd>
                      <ul className="space-y-1.5">
                        {order.cartItems.map((item) => (
                          <li key={item.id} className="flex justify-between text-gray-800">
                            <span>{item.name} ({item.weightLabel}) × {item.qty}</span>
                            <span className="font-semibold">₹{item.unitPrice * item.qty}</span>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}

                {order?.total != null && (
                  <div className="pt-3 border-t border-gray-100 space-y-1.5">
                    {order.delivery > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>Delivery</span>
                        <span>₹{order.delivery}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-extrabold text-gray-900 text-base">
                      <span>Total Paid</span>
                      <span>₹{order.total}</span>
                    </div>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
            >
              <MessageCircle size={16} />
              Track via WhatsApp
            </a>
            <Link
              href="/pickles"
              className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl text-sm font-semibold hover:border-brand-400 hover:text-brand-600 transition-colors"
            >
              <Package size={16} />
              Shop More Pickles
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-8 leading-relaxed">
            Questions? Call us at{' '}
            <a href="tel:+918758302568" className="text-brand-500 hover:underline">8758302568</a>
            {' '}or email{' '}
            <a href="mailto:Andhrastore.india@gmail.com" className="text-brand-500 hover:underline">
              Andhrastore.india@gmail.com
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}

function Row({ label, value, mono }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-gray-500 flex-shrink-0">{label}</dt>
      <dd className={`text-gray-800 font-medium text-right break-all ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </dd>
    </div>
  );
}
