/**
 * CartDrawer.jsx
 *
 * Slide-in cart panel. Reads all state from CartContext — no props needed.
 * Mounted once at the _app.js level so it persists across page navigations.
 *
 * Sections:
 *   1. Animated backdrop + drawer panel (same timing as original)
 *   2. Header — dynamic item count from context
 *   3. Body  — empty state OR scrollable item list
 *   4. Footer — total + WhatsApp checkout (items) or plain WhatsApp CTA (empty)
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { X, ShoppingBag } from 'lucide-react';
import { useCart, buildWhatsAppUrl } from '@/context/CartContext';
import { pushBeginCheckout } from '@/lib/analytics';
import { calcDelivery, DELIVERY_THRESHOLD, DELIVERY_NUDGE_AT } from '@/lib/checkout';

export default function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    cartCount,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();
  const router = useRouter();

  // `visible` drives CSS transitions — it lags slightly behind isCartOpen
  // so the closing animation plays before the component unmounts
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      // Double rAF gives the browser one frame to paint before animating in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const t = setTimeout(() => {
        document.body.style.overflow = '';
      }, 400);
      return () => clearTimeout(t);
    }
  }, [isCartOpen]);

  // Keep the DOM clean when fully hidden — avoids painting an off-screen drawer
  if (!isCartOpen && !visible) return null;

  const hasItems = cartItems.length > 0;

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[150] transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* ── Drawer panel ─────────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className={`fixed top-0 right-0 bottom-0 w-full max-w-[420px] bg-white z-[151] shadow-2xl flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ── 1. Header ───────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-olive-50 border border-olive-100 flex items-center justify-center">
              <ShoppingBag size={18} className="text-olive-600" />
            </div>
            <h2 className="text-lg font-heading font-bold text-gray-900">Your Cart</h2>
            {/* Live count — aria-live announces changes to screen readers */}
            <span
              aria-live="polite"
              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-olive-600 text-white text-[10px] font-bold"
            >
              {cartCount}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all"
            aria-label="Close cart"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── 2. Body ─────────────────────────────────────────────────────── */}
        {!hasItems ? (
          /* Empty state — original design preserved exactly */
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="w-20 h-20 rounded-2xl bg-cream flex items-center justify-center mb-5">
              <ShoppingBag size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-heading font-bold text-gray-800 mb-1">
              Your cart is empty
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6 max-w-[260px]">
              Looks like you haven&apos;t added any pickles yet. Browse our
              collection to get started!
            </p>
            <Link
              href="/pickles/veg"
              onClick={closeCart}
              className="inline-flex items-center gap-2 bg-brand-500 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-brand-600 transition-colors shadow-sm"
            >
              Continue Shopping
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        ) : (
          /* Items list — scrollable, leaves header + footer sticky */
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={() => removeFromCart(item.id)}
                  onQtyChange={(qty) => updateQuantity(item.id, qty)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── 3. Footer ───────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 border-t border-gray-100 bg-white px-6 py-4">
          {hasItems ? (
            <>
              {/* Free delivery progress nudge */}
              {cartTotal >= DELIVERY_NUDGE_AT && cartTotal < DELIVERY_THRESHOLD && (
                <div className="mb-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
                  <p className="text-xs font-semibold text-amber-700 mb-1.5">
                    Add ₹{DELIVERY_THRESHOLD - cartTotal} more for <span className="text-green-600">free delivery!</span>
                  </p>
                  <div className="w-full bg-amber-100 rounded-full h-1.5">
                    <div
                      className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, ((cartTotal - DELIVERY_NUDGE_AT) / (DELIVERY_THRESHOLD - DELIVERY_NUDGE_AT)) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
              {cartTotal >= DELIVERY_THRESHOLD && (
                <div className="mb-3 bg-green-50 border border-green-100 rounded-xl px-4 py-2 text-center">
                  <p className="text-xs font-semibold text-green-700">🎉 You&apos;ve unlocked free delivery!</p>
                </div>
              )}

              {/* Order total summary */}
              <div className="bg-gray-50 rounded-xl px-4 py-2.5 mb-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Subtotal</span>
                  <span className="text-sm font-semibold text-gray-900">₹{cartTotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Delivery</span>
                  {calcDelivery(cartTotal) === 0
                    ? <span className="text-sm font-semibold text-green-600">Free</span>
                    : <span className="text-sm font-semibold text-gray-900">₹{calcDelivery(cartTotal)}</span>
                  }
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-1.5">
                  <span className="text-sm font-bold text-gray-900">Total</span>
                  <span className="text-lg font-extrabold text-gray-900">₹{cartTotal + calcDelivery(cartTotal)}</span>
                </div>
              </div>

              {/* Primary CTA — Proceed to Checkout */}
              <button
                onClick={() => {
                  pushBeginCheckout(cartItems, cartTotal);
                  closeCart();
                  router.push('/checkout');
                }}
                className="w-full flex items-center justify-center gap-2 bg-brand-500 text-white py-3 rounded-xl text-sm font-semibold hover:bg-brand-600 transition-colors shadow-sm mb-2"
              >
                Proceed to Checkout
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              {/* Secondary CTA — WhatsApp checkout */}
              <a
                href={buildWhatsAppUrl(cartItems, cartTotal)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
              >
                <WhatsAppIcon />
                Order via WhatsApp
              </a>

              {/* Clear cart — subtle, below the primary CTA */}
              <button
                onClick={clearCart}
                className="w-full mt-2 py-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear cart
              </button>
            </>
          ) : (
            /* Empty-state footer: plain WhatsApp link (original design) */
            <a
              href="https://wa.me/918758302568"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
            >
              <WhatsAppIcon />
              Order via WhatsApp
            </a>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Cart Item Row ────────────────────────────────────────────────────────────

function CartItem({ item, onRemove, onQtyChange }) {
  return (
    <div className="flex gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
      {/* Product thumbnail */}
      <Image
        src={item.image}
        alt={item.name}
        width={64}
        height={64}
        className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-gray-100"
      />

      <div className="flex-1 min-w-0">
        {/* Name + remove button */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-sm font-semibold text-gray-800 leading-tight">
              {item.name}
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">{item.weightLabel}</p>
          </div>
          <button
            onClick={onRemove}
            className="flex-shrink-0 mt-0.5 p-0.5 text-gray-300 hover:text-red-400 transition-colors"
            aria-label={`Remove ${item.name} from cart`}
          >
            <X size={14} />
          </button>
        </div>

        {/* Line price + qty stepper */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold text-gray-900">
            ₹{item.unitPrice * item.qty}
          </span>

          {/* Qty stepper — mirrors the stepper on the product detail page */}
          <div className="inline-flex items-center rounded-lg border border-gray-200">
            <button
              onClick={() => onQtyChange(item.qty - 1)}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-medium text-base leading-none"
              aria-label={`Decrease quantity of ${item.name}`}
            >
              −
            </button>
            <span className="w-7 h-7 flex items-center justify-center font-bold text-gray-800 border-x border-gray-200 text-xs">
              {item.qty}
            </span>
            <button
              onClick={() => onQtyChange(item.qty + 1)}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-medium text-base leading-none"
              aria-label={`Increase quantity of ${item.name}`}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared WhatsApp SVG icon ─────────────────────────────────────────────────

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
