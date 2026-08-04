/**
 * lib/analytics.js
 *
 * SINGLE SOURCE OF TRUTH for every dataLayer push on this site.
 * All GA4-recommended ecommerce events flow through this module only —
 * no other file should call window.dataLayer.push() for product/cart/
 * checkout events. (lib/gtm.js remains separate — it owns Consent Mode
 * and the generic SPA 'pageview' event, which are not ecommerce events.)
 *
 * Usage:
 *   import { pushAddToCart } from '@/lib/analytics';
 *   pushAddToCart(cartItem);
 *
 * Item shape expected by every function below (matches the cart item
 * shape in CartContext.jsx, extended with `category`):
 *   {
 *     id          : "Chicken-250"
 *     type        : "Chicken"        — used as item_id (stable per product)
 *     name        : "Chicken Pickle"
 *     category    : "Pickles" | "Podi" | "Snacks" | "Sweets"
 *     weightLabel : "250g"           — used as item_variant
 *     unitPrice   : 300
 *     qty         : 1
 *   }
 *
 * Clearing ecommerce before each push prevents data from a previous
 * event bleeding into the next one — Google-recommended pattern.
 */

import { getAttributionPayload } from '@/lib/attribution';

// ─── Brand constant ─────────────────────────────────────────────────────────
// Single-brand store — same value for every item, every event.
const BRAND_NAME = 'Andhra Store';

// ─── Internal helpers ─────────────────────────────────────────────────────────

function gtmPush(payload) {
  if (typeof window === 'undefined') return; // SSR guard
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null }); // clear previous ecommerce data
  window.dataLayer.push(payload);
}

/**
 * Maps a cart/product item to a GA4-recommended ecommerce item object.
 * `category` must be supplied by the caller (page-level context knows it
 * — this file has no way to infer it, and must never hardcode one value
 * for every product).
 */
function toGTMItem(item, index) {
  return {
    item_id       : item.type,
    item_name     : item.name,
    item_category : item.category || 'Uncategorized',
    item_brand    : BRAND_NAME,
    item_variant  : item.weightLabel,
    price         : item.unitPrice ?? item.price,
    quantity      : item.qty ?? 1,
    ...(index != null ? { index } : {}),
  };
}

// ─── Product tracking ─────────────────────────────────────────────────────────

/**
 * Fire on product detail page load.
 * GTM trigger: Custom Event — view_item
 */
export function pushViewItem(product) {
  gtmPush({
    event: 'view_item',
    ecommerce: {
      currency : 'INR',
      value    : product.unitPrice ?? product.price,
      items    : [toGTMItem(product)],
    },
  });
}

/**
 * Fire once when a category/collection listing page finishes rendering its grid.
 * @param {Array}  items    — full list of products shown
 * @param {string} listName — e.g. "Veg Pickles", "Andhra Sweets"
 * GTM trigger: Custom Event — view_item_list
 */
export function pushViewItemList(items, listName) {
  gtmPush({
    event: 'view_item_list',
    ecommerce: {
      item_list_name: listName,
      items: items.map((p, i) => toGTMItem(p, i)),
    },
  });
}

/**
 * Fire when the user clicks a product card to view its detail page.
 * Must fire BEFORE navigation (Link's onClick, not onNavigate).
 * GTM trigger: Custom Event — select_item
 */
export function pushSelectItem(product, listName) {
  gtmPush({
    event: 'select_item',
    ecommerce: {
      item_list_name: listName,
      items: [toGTMItem(product)],
    },
  });
}

// ─── Cart tracking ─────────────────────────────────────────────────────────────

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
 * Fire when a product is removed from the cart entirely.
 * Called from CartContext.removeFromCart with the item as it existed
 * immediately before removal.
 * GTM trigger: Custom Event — remove_from_cart
 */
export function pushRemoveFromCart(item) {
  gtmPush({
    event: 'remove_from_cart',
    ecommerce: {
      currency : 'INR',
      value    : item.unitPrice * item.qty,
      items    : [toGTMItem(item)],
    },
  });
}

/**
 * Fire once each time the cart drawer transitions from closed to open,
 * regardless of what triggered the open (header icon, auto-open on add).
 * Called from CartDrawer's own open-transition effect — the single place
 * that knows "the user is now looking at the cart" — so it can never fire
 * twice for one open, or be missed for any entry point.
 * GTM trigger: Custom Event — view_cart
 */
export function pushViewCart(cartItems, cartTotal) {
  if (cartItems.length === 0) return; // nothing to report for an empty cart
  gtmPush({
    event: 'view_cart',
    ecommerce: {
      currency : 'INR',
      value    : cartTotal,
      items    : cartItems.map((p, i) => toGTMItem(p, i)),
    },
  });
}

// ─── Checkout tracking ──────────────────────────────────────────────────────────

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
      items    : cartItems.map((p, i) => toGTMItem(p, i)),
    },
  });
}

/**
 * Fire once the delivery address has been validated and the shipping
 * cost for the order is known — the earliest point in this flow where
 * "shipping info" genuinely exists. Called from checkout's submit
 * handler right after validateForm() passes, before payment begins.
 * GTM trigger: Custom Event — add_shipping_info
 */
export function pushAddShippingInfo(cartItems, cartTotal, shippingCost) {
  gtmPush({
    event: 'add_shipping_info',
    ecommerce: {
      currency      : 'INR',
      value         : cartTotal,
      shipping_tier : shippingCost === 0 ? 'Free Shipping' : 'Standard Delivery',
      items         : cartItems.map((p, i) => toGTMItem(p, i)),
    },
  });
}

/**
 * Fire when user selects a payment method and submits the checkout form.
 * For Razorpay this is the earliest point a real server-side order exists;
 * for COD it is the actual, final payment-method confirmation.
 * GTM trigger: Custom Event — add_payment_info
 */
export function pushAddPaymentInfo(cartItems, cartTotal, paymentType) {
  gtmPush({
    event: 'add_payment_info',
    ecommerce: {
      currency     : 'INR',
      value        : cartTotal,
      payment_type : paymentType, // 'razorpay' | 'cod'
      items        : cartItems.map((p, i) => toGTMItem(p, i)),
    },
  });
}

// ─── Purchase tracking ──────────────────────────────────────────────────────────

/**
 * Fire ONLY after a payment has been verified server-side.
 * Razorpay path only — /api/verify-payment has confirmed the signature
 * before this is ever called. Do not call this from anywhere that hasn't
 * received that server confirmation.
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
      affiliation    : BRAND_NAME,
      currency       : 'INR',
      value          : total,
      tax            : 0, // no separate tax line in this checkout flow
      shipping       : delivery,
      items          : cartItems.map((p, i) => toGTMItem(p, i)),
    },
    payment_id : paymentId,
    ...attribution,
  });
}

/**
 * Fire for Cash-on-Delivery orders at the moment the customer confirms
 * via WhatsApp. Deliberately NOT named 'purchase' — this architecture has
 * no server-side confirmation step for COD (no webhook, no admin
 * order-status flow), so the transaction is not verified the way a
 * Razorpay payment is. Naming it distinctly keeps GA4/Ads/Meta purchase
 * conversions limited to confirmed revenue only.
 *
 * See the audit note in the project's tracking report: treating this as
 * a real conversion (vs. a soft/assisted one) is a GTM/reporting decision
 * to make separately, not a website-code decision.
 * GTM trigger: Custom Event — order_placed_unconfirmed (not yet in GTM)
 */
export function pushOrderPlaced({ orderId, cartItems, total, delivery, paymentType }) {
  const attribution = getAttributionPayload();
  gtmPush({
    event: 'order_placed_unconfirmed',
    ecommerce: {
      transaction_id : orderId,
      affiliation    : BRAND_NAME,
      currency       : 'INR',
      value          : total,
      tax            : 0,
      shipping       : delivery,
      payment_type   : paymentType,
      items          : cartItems.map((p, i) => toGTMItem(p, i)),
    },
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

// ─── Lead tracking ──────────────────────────────────────────────────────────────

/**
 * Fire for any non-cart lead-generation interaction — contact form
 * submission, or a WhatsApp CTA click outside the cart/checkout funnel.
 * GTM trigger: Custom Event — generate_lead
 * @param {string} method — 'contact_form' | 'whatsapp_cta'
 */
export function pushGenerateLead(method) {
  gtmPush({
    event       : 'generate_lead',
    lead_method : method,
  });
}
