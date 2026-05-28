/**
 * lib/analytics.js
 *
 * Centralized GTM / GA4 / Meta Pixel dataLayer helpers.
 *
 * Usage:
 *   import { pushBeginCheckout } from '@/lib/analytics';
 *   pushBeginCheckout(cartItems, cartTotal);
 *
 * These functions are no-ops until GTM is configured in _document.js.
 * All events follow the GA4 Enhanced Ecommerce spec so they work with
 * both GA4 tags and Meta Pixel's 'Purchase' event inside GTM.
 *
 * Clearing ecommerce before each push prevents data from previous events
 * bleeding into new ones — this is a Google-recommended pattern.
 */

import { getAttributionPayload } from '@/lib/attribution';

// ─── Internal helpers ─────────────────────────────────────────────────────────

function gtmPush(payload) {
  if (typeof window === 'undefined') return; // SSR guard
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null }); // clear previous ecommerce data
  window.dataLayer.push(payload);
}

function toGTMItem(item) {
  return {
    item_id       : item.type,
    item_name     : item.name,
    item_category : 'Andhra Pickle',
    item_variant  : item.weightLabel,
    price         : item.unitPrice,
    quantity      : item.qty,
  };
}

// ─── Ecommerce events ─────────────────────────────────────────────────────────

/**
 * Fire when a product is added to the cart (from any entry point).
 * Called from CartContext.addToCart so it fires regardless of which UI triggered the add.
 * GTM trigger: Custom Event — add_to_cart
 * item.qty reflects the quantity being ADDED in this action, not the cumulative cart qty.
 */
export function pushAddToCart(item) {
  gtmPush({
    event: 'add_to_cart',
    ecommerce: {
      currency : 'INR',
      value    : item.unitPrice * item.qty,
      items    : [toGTMItem(item)],
    },
  });
}

/**
 * Fire when user clicks "Proceed to Checkout" in CartDrawer.
 * GTM trigger: Custom Event — begin_checkout
 */
export function pushBeginCheckout(cartItems, cartTotal) {
  gtmPush({
    event: 'begin_checkout',
    ecommerce: {
      currency : 'INR',
      value    : cartTotal,
      items    : cartItems.map(toGTMItem),
    },
  });
}

/**
 * Fire when user selects a payment method and clicks Pay.
 * GTM trigger: Custom Event — add_payment_info
 */
export function pushAddPaymentInfo(cartItems, cartTotal, paymentType) {
  gtmPush({
    event: 'add_payment_info',
    ecommerce: {
      currency     : 'INR',
      value        : cartTotal,
      payment_type : paymentType, // 'razorpay' | 'cod'
      items        : cartItems.map(toGTMItem),
    },
  });
}

/**
 * Fire on the order-success page after payment is verified.
 * GTM trigger: Custom Event — purchase
 * Powers: GA4 Purchase, Meta Pixel Purchase, Google Ads Conversion
 *
 * Attribution fields (utm_source, utm_medium, utm_campaign, gclid, fbclid,
 * first_touch_source, last_touch_source) are automatically spread from
 * the as_attr_ft / as_attr_lt cookies captured on the original landing URL.
 */
export function pushPurchase({ orderId, paymentId, cartItems, total, delivery }) {
  const attribution = getAttributionPayload();
  gtmPush({
    event: 'purchase',
    ecommerce: {
      transaction_id : orderId,
      affiliation    : 'Andhra Store',
      currency       : 'INR',
      value          : total,
      shipping       : delivery,
      items          : cartItems.map(toGTMItem),
    },
    payment_id : paymentId,
    ...attribution,
  });
}

/**
 * Fire when a verified payment redirect lands on order-failed.
 * Useful for tracking payment abandonment in GA4 funnels.
 */
export function pushPaymentFailed(reason) {
  gtmPush({
    event  : 'payment_failed',
    reason : reason || 'unknown',
  });
}
