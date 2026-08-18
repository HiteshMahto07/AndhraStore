/**
 * pages/checkout/index.js
 *
 * Hybrid checkout: Razorpay (card/UPI/netbanking) + COD via WhatsApp.
 *
 * Flow:
 *   1. Validate form fields inline on submit attempt
 *   2a. Razorpay → POST /api/create-order → open SDK modal →
 *       handler() → POST /api/verify-payment → redirect to /order-success/[orderId]
 *   2b. COD → build WhatsApp URL → open in new tab → clear cart → redirect /order-success
 *
 * Security:
 *   - Amount is never sent to the server — derived from cartItems server-side
 *   - Razorpay SDK loaded dynamically on demand (not globally in _document.js)
 *   - Payment ID, Order ID, Signature verified server-side before success redirect
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { calcTotals, calcDelivery, buildCODWhatsAppUrl, DELIVERY_THRESHOLD, COD_CHARGE } from '@/lib/checkout';
import { pushAddShippingInfo, pushAddPaymentInfo, pushPurchase, pushOrderPlaced, pushPaymentFailed } from '@/lib/analytics';
import { SITE_URL } from '@/lib/seo';

// ─── Razorpay SDK dynamic loader ─────────────────────────────────────────────

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ─── Indian states ────────────────────────────────────────────────────────────

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman & Nicobar Islands','Chandigarh','Dadra & Nagar Haveli and Daman & Diu',
  'Delhi','Jammu & Kashmir','Ladakh','Lakshadweep','Puducherry',
];

// ─── Form validation ──────────────────────────────────────────────────────────

function validateForm(form) {
  const errors = {};
  if (!form.name.trim())                      errors.name     = 'Full name is required';
  if (!/^\d{10}$/.test(form.phone))           errors.phone    = 'Enter a valid 10-digit mobile number';
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                              errors.email    = 'Enter a valid email address';
  if (!form.address1.trim())                  errors.address1 = 'Address line 1 is required';
  if (!form.city.trim())                      errors.city     = 'City is required';
  if (!form.state)                            errors.state    = 'Please select a state';
  if (!/^\d{6}$/.test(form.pincode))          errors.pincode  = 'Enter a valid 6-digit pincode';
  return errors;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, cartReady, clearCart } = useCart();

  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    address1: '', address2: '',
    city: '', state: '', pincode: '',
  });
  const [errors, setErrors]           = useState({});
  const [paymentMethod, setMethod]    = useState('razorpay'); // 'razorpay' | 'cod'
  const [submitting, setSubmitting]   = useState(false);
  const [serverError, setServerError] = useState('');

  // Redirect to pickles once cart hydration is confirmed and cart is empty
  useEffect(() => {
    if (cartReady && cartItems.length === 0) {
      router.replace('/pickles');
    }
  }, [cartReady, cartItems.length, router]);

  const totals   = cartReady && cartItems.length > 0 ? calcTotals(cartItems, paymentMethod) : { subtotal: 0, delivery: 0, codCharge: 0, total: 0 };
  const isFree   = totals.subtotal >= DELIVERY_THRESHOLD;

  function handleField(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => { const c = { ...er }; delete c[name]; return c; });
  }

  // ── Razorpay payment ────────────────────────────────────────────────────────

  async function handleRazorpayPayment() {
    setSubmitting(true);
    setServerError('');

    // 1. Load the Razorpay SDK on demand
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setServerError('Unable to load payment gateway. Please check your internet connection.');
      setSubmitting(false);
      return;
    }

    // 2. Create order server-side (amount derived from cartItems, never from browser)
    let orderData;
    try {
      const res = await fetch('/api/create-order', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ cartItems }),
      });
      orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || 'Order creation failed');
    } catch (err) {
      setServerError(err.message || 'Unable to initiate payment. Please try again.');
      setSubmitting(false);
      return;
    }

    // 3. Fire GTM add_payment_info event
    pushAddPaymentInfo(cartItems, totals.total, 'razorpay');

    // 4. Open Razorpay checkout modal
    const options = {
      key         : process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount      : orderData.amount,           // paise, from server
      currency    : orderData.currency,
      name        : 'Andhra Store',
      description : 'Authentic Andhra Pickles',
      image       : '/pickle17.jpeg',
      order_id    : orderData.orderId,
      theme       : { color: '#F97316' },
      prefill: {
        name   : form.name,
        contact: `+91${form.phone}`,
        email  : form.email || undefined,
      },
      notes: {
        address: [form.address1, form.address2, `${form.city}, ${form.state} - ${form.pincode}`]
          .filter(Boolean).join(', '),
      },

      handler: async (response) => {
        // 5. Verify signature server-side — never trust the handler response alone
        try {
          const vRes = await fetch('/api/verify-payment', {
            method : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body   : JSON.stringify({
              razorpay_payment_id : response.razorpay_payment_id,
              razorpay_order_id   : response.razorpay_order_id,
              razorpay_signature  : response.razorpay_signature,
            }),
          });
          const vData = await vRes.json();

          if (!vRes.ok || !vData.success) {
            pushPaymentFailed('signature_mismatch');
            router.push('/order-failed');
            return;
          }

          // 6. Persist order data for the success page (sessionStorage — ephemeral)
          const orderMeta = {
            orderId   : vData.orderId,
            paymentId : vData.paymentId,
            cartItems,
            subtotal  : orderData.subtotal,
            delivery  : orderData.delivery,
            total     : orderData.total,
            name      : form.name,
            payMethod : 'razorpay',
          };
          sessionStorage.setItem('as_order', JSON.stringify(orderMeta));

          // 7. Fire GTM purchase event
          pushPurchase({
            orderId   : vData.orderId,
            paymentId : vData.paymentId,
            cartItems,
            total     : orderData.total,
            delivery  : orderData.delivery,
          });

          clearCart();
          router.push(`/order-success/${vData.orderId}`);
        } catch {
          pushPaymentFailed('verification_error');
          router.push('/order-failed');
        }
      },

      modal: {
        ondismiss: () => {
          setSubmitting(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => {
      pushPaymentFailed(response.error?.description || 'payment_failed');
      setSubmitting(false);
      setServerError('Payment failed. Please try again or use a different payment method.');
    });
    rzp.open();
  }

  // ── COD via WhatsApp ────────────────────────────────────────────────────────

  async function handleCOD() {
    setSubmitting(true);
    setServerError('');

    pushAddPaymentInfo(cartItems, totals.total, 'cod');

    const waUrl = buildCODWhatsAppUrl(cartItems, form, totals);

    // Persist lightweight order meta for the success page
    const orderMeta = {
      orderId   : `COD-${Date.now()}`,
      paymentId : null,
      cartItems,
      subtotal  : totals.subtotal,
      delivery  : totals.delivery,
      codCharge : totals.codCharge,
      total     : totals.total,
      name      : form.name,
      payMethod : 'cod',
    };
    sessionStorage.setItem('as_order', JSON.stringify(orderMeta));

    // NOT pushPurchase — this checkout flow has no server-side confirmation
    // step for COD orders (no webhook, no admin order-status change), so
    // there's nothing here that verifies the order the way Razorpay's
    // signature check does. Firing 'purchase' for an unconfirmed order
    // would count unconfirmed revenue as real conversions. See the
    // function's doc comment in lib/analytics.js for the full rationale.
    pushOrderPlaced({
      orderId     : orderMeta.orderId,
      cartItems,
      total       : totals.total,
      delivery    : totals.delivery,
      paymentType : 'cod',
    });

    clearCart();

    // Open WhatsApp in new tab, redirect to success
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    router.push(`/order-success/${orderMeta.orderId}`);
  }

  // ── Submit handler ──────────────────────────────────────────────────────────

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      document.getElementById(`field-${firstKey}`)?.focus();
      return;
    }

    // Fires once, right when the address is validated and the shipping
    // cost for this order is known — the earliest point "shipping info"
    // genuinely exists in this flow (there's no separate carrier/method
    // selection step to hook into instead).
    pushAddShippingInfo(cartItems, totals.total, totals.delivery);

    if (paymentMethod === 'razorpay') {
      await handleRazorpayPayment();
    } else {
      await handleCOD();
    }
  }

  // ── Render guards ───────────────────────────────────────────────────────────

  if (!cartReady || cartItems.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  // ── Main layout ─────────────────────────────────────────────────────────────

  return (
    <>
      <Head>
        <title>Checkout — Andhra Store</title>
        <meta name="description" content="Complete your Andhra Store order. Fast delivery of authentic Andhra pickles." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${SITE_URL}/checkout`} />
      </Head>

      <Header />

      <main className="min-h-screen bg-cream section-pad">
        <div className="container-main">

          {/* Back link */}
          <Link
            href="/pickles"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-500 transition-colors mb-6"
          >
            <ChevronLeft size={16} />
            Continue Shopping
          </Link>

          <h1 className="text-2xl font-heading font-extrabold text-gray-900 mb-8">Checkout</h1>

          {/* Two-column desktop layout */}
          <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">

            {/* ── LEFT: Address form ──────────────────────────────────────── */}
            <form onSubmit={handleSubmit} noValidate>

              {/* Section: Contact */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5 shadow-sm">
                <h2 className="text-base font-heading font-bold text-gray-900 mb-4">Contact Details</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    id="field-name"
                    label="Full Name *"
                    name="name"
                    value={form.name}
                    onChange={handleField}
                    error={errors.name}
                    placeholder="e.g. Ramesh Kumar"
                    autoComplete="name"
                  />
                  <Field
                    id="field-phone"
                    label="Mobile Number *"
                    name="phone"
                    value={form.phone}
                    onChange={handleField}
                    error={errors.phone}
                    placeholder="10-digit number"
                    inputMode="numeric"
                    maxLength={10}
                    autoComplete="tel-national"
                  />
                </div>

                <div className="mt-4">
                  <Field
                    id="field-email"
                    label="Email Address (optional)"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleField}
                    error={errors.email}
                    placeholder="For order confirmation"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Section: Delivery Address */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5 shadow-sm">
                <h2 className="text-base font-heading font-bold text-gray-900 mb-4">Delivery Address</h2>

                <div className="space-y-4">
                  <Field
                    id="field-address1"
                    label="Address Line 1 *"
                    name="address1"
                    value={form.address1}
                    onChange={handleField}
                    error={errors.address1}
                    placeholder="House / Flat No., Street"
                    autoComplete="address-line1"
                  />
                  <Field
                    id="field-address2"
                    label="Address Line 2"
                    name="address2"
                    value={form.address2}
                    onChange={handleField}
                    placeholder="Area, Landmark (optional)"
                    autoComplete="address-line2"
                  />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field
                      id="field-city"
                      label="City *"
                      name="city"
                      value={form.city}
                      onChange={handleField}
                      error={errors.city}
                      placeholder="City"
                      autoComplete="address-level2"
                    />
                    <Field
                      id="field-pincode"
                      label="Pincode *"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleField}
                      error={errors.pincode}
                      placeholder="6-digit pincode"
                      inputMode="numeric"
                      maxLength={6}
                      autoComplete="postal-code"
                    />
                  </div>

                  {/* State — native select for mobile keyboard UX */}
                  <div>
                    <label htmlFor="field-state" className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <select
                      id="field-state"
                      name="state"
                      value={form.state}
                      onChange={handleField}
                      autoComplete="address-level1"
                      className={`w-full px-4 py-2.5 text-sm bg-white rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/30 ${
                        errors.state
                          ? 'border-red-400 focus:border-red-400'
                          : 'border-gray-200 focus:border-brand-400'
                      }`}
                    >
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state}</p>}
                  </div>
                </div>
              </div>

              {/* Section: Payment Method */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5 shadow-sm">
                <h2 className="text-base font-heading font-bold text-gray-900 mb-4">Payment Method</h2>

                <div className="space-y-3">
                  <PaymentOption
                    id="pm-razorpay"
                    value="razorpay"
                    selected={paymentMethod === 'razorpay'}
                    onChange={() => setMethod('razorpay')}
                    label="Pay Online"
                    sub="Credit / Debit Card, UPI, Net Banking, Wallets"
                    icon={
                      <svg className="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                      </svg>
                    }
                  />
                  <PaymentOption
                    id="pm-cod"
                    value="cod"
                    selected={paymentMethod === 'cod'}
                    onChange={() => setMethod('cod')}
                    label="Cash on Delivery"
                    sub={`Confirm via WhatsApp — pay when your order arrives (+₹${COD_CHARGE} COD charge)`}
                    icon={
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                      </svg>
                    }
                  />
                </div>
              </div>

              {/* Server-level error */}
              {serverError && (
                <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 mb-5">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  {serverError}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-brand-500 text-white py-4 rounded-xl text-base font-bold hover:bg-brand-600 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {paymentMethod === 'razorpay' ? 'Opening Payment...' : 'Processing...'}
                  </>
                ) : (
                  paymentMethod === 'razorpay'
                    ? `Pay ₹${totals.total}`
                    : `Confirm COD Order via WhatsApp — ₹${totals.total}`
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-3">
                Secured by Razorpay · 256-bit SSL encryption
              </p>
            </form>

            {/* ── RIGHT: Order Summary ────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-base font-heading font-bold text-gray-900 mb-4">
                Order Summary ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
              </h2>

              {/* Item list */}
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 leading-tight truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.weightLabel} × {item.qty}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                      ₹{item.unitPrice * item.qty}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totals.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  {isFree ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    <span className="text-gray-800">₹{totals.delivery}</span>
                  )}
                </div>
                {!isFree && (
                  <p className="text-xs text-gray-400">
                    Add ₹{DELIVERY_THRESHOLD - totals.subtotal} more for free delivery
                  </p>
                )}
                {paymentMethod === 'cod' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">COD Charge</span>
                    <span className="text-gray-800">₹{totals.codCharge}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>₹{totals.total}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

// ─── Field component ──────────────────────────────────────────────────────────

function Field({ id, label, name, value, onChange, error, type = 'text', placeholder, inputMode, maxLength, autoComplete }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className={`w-full px-4 py-2.5 text-sm bg-white rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/30 ${
          error
            ? 'border-red-400 focus:border-red-400'
            : 'border-gray-200 focus:border-brand-400'
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── PaymentOption component ──────────────────────────────────────────────────

function PaymentOption({ id, value, selected, onChange, label, sub, icon }) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
        selected
          ? 'border-brand-400 bg-brand-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <input
        id={id}
        type="radio"
        name="payment-method"
        value={value}
        checked={selected}
        onChange={onChange}
        className="mt-0.5 accent-brand-500"
      />
      <div className="flex items-start gap-3 flex-1">
        <div className="mt-0.5 flex-shrink-0">{icon}</div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{label}</p>
          <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
        </div>
        {selected && (
          <CheckCircle2 size={16} className="ml-auto mt-0.5 text-brand-500 flex-shrink-0" />
        )}
      </div>
    </label>
  );
}
