/**
 * lib/checkout.js
 *
 * Single source of truth for all checkout calculations.
 * Imported by both client pages (delivery display) and API routes (server totals).
 *
 * IMPORTANT: calcServerTotals() re-derives prices from pickles.json.
 * Never trust the unitPrice sent from the browser — always recalculate server-side.
 */

import pickles from '@/data/pickles.json';

// ─── Constants ────────────────────────────────────────────────────────────────

export const DELIVERY_THRESHOLD      = 999; // free delivery at or above this subtotal
export const DELIVERY_NUDGE_AT       = 500; // show "add more" progress nudge above this
export const DELIVERY_CHARGE_LOW     = 100; // charge when subtotal < DELIVERY_NUDGE_AT
export const DELIVERY_CHARGE_NUDGE   = 60;  // charge when subtotal >= DELIVERY_NUDGE_AT but < DELIVERY_THRESHOLD
export const WHATSAPP_PHONE          = '918758302568';

// ─── Price maps ───────────────────────────────────────────────────────────────

// Derived from pickles.json — single source of truth for base prices (250g)
const BASE_PRICES = Object.fromEntries(pickles.map((p) => [p.type, p.amount]));

// Weight multipliers: 500g = 2× base, 1kg = 4× base (matches [slug].js logic)
const WEIGHT_MULTIPLIERS = { '250': 1, '500': 2, '1': 4 };

// ─── Client-side calculations (trusts frontend cart) ─────────────────────────

export function calcDelivery(subtotal) {
  if (subtotal >= DELIVERY_THRESHOLD) return 0;
  if (subtotal >= DELIVERY_NUDGE_AT)  return DELIVERY_CHARGE_NUDGE;
  return DELIVERY_CHARGE_LOW;
}

export function calcTotals(cartItems) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.qty,
    0
  );
  const delivery = calcDelivery(subtotal);
  return { subtotal, delivery, total: subtotal + delivery };
}

// ─── Server-side calculations (authoritative — never trusts frontend) ─────────

/**
 * Re-derives every line-item price from the server-side price map.
 * Used in /api/create-order to prevent price manipulation.
 * Throws on unknown product types or weights so the API returns 400 cleanly.
 */
export function calcServerTotals(cartItems) {
  let subtotal = 0;

  for (const item of cartItems) {
    const base = BASE_PRICES[item.type];
    const multiplier = WEIGHT_MULTIPLIERS[item.weight];

    if (!base) throw new Error(`Unknown product type: "${item.type}"`);
    if (!multiplier) throw new Error(`Invalid weight variant: "${item.weight}"`);
    if (!Number.isInteger(item.qty) || item.qty < 1 || item.qty > 99) {
      throw new Error(`Invalid quantity for ${item.type}: ${item.qty}`);
    }

    subtotal += base * multiplier * item.qty;
  }

  const delivery = calcDelivery(subtotal);
  return { subtotal, delivery, total: subtotal + delivery };
}

// ─── Cart validation ──────────────────────────────────────────────────────────

/**
 * Validates the cartItems payload received by API routes.
 * Returns an error string on failure, null on success.
 */
export function validateCartItems(cartItems) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return 'Cart is empty';
  }
  for (const item of cartItems) {
    if (!item || typeof item !== 'object') return 'Malformed cart item';
    if (!item.type || !item.weight || !item.qty) return 'Cart item missing required fields';
    if (!BASE_PRICES[item.type])            return `Unknown product: ${item.type}`;
    if (!WEIGHT_MULTIPLIERS[item.weight])   return `Invalid weight: ${item.weight}`;
    if (!Number.isInteger(item.qty) || item.qty < 1 || item.qty > 99) {
      return `Invalid quantity: ${item.qty}`;
    }
  }
  return null;
}

// ─── WhatsApp URL builders ────────────────────────────────────────────────────

/**
 * Builds a WhatsApp order URL for the regular cart checkout.
 * Exported here so it can be used in CartDrawer and CartContext.
 */
export function buildCartWhatsAppUrl(cartItems, cartTotal) {
  const itemLines = cartItems
    .map((i) => `• ${i.name} (${i.weightLabel}) × ${i.qty} — ₹${i.unitPrice * i.qty}`)
    .join('\n');

  const message = [
    "Hello! I'd like to place an order from Andhra Store:",
    '',
    itemLines,
    '',
    `*Total: ₹${cartTotal}*`,
    '',
    'Please confirm availability and delivery details. Thank you!',
  ].join('\n');

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds a COD (Cash on Delivery) WhatsApp URL that includes the delivery address.
 * Used on the checkout page when the user selects COD.
 */
export function buildCODWhatsAppUrl(cartItems, form, totals) {
  const itemLines = cartItems
    .map((i) => `• ${i.name} (${i.weightLabel}) × ${i.qty} — ₹${i.unitPrice * i.qty}`)
    .join('\n');

  const addressParts = [
    form.address1,
    form.address2,
    `${form.city}, ${form.state} - ${form.pincode}`,
  ].filter(Boolean);

  const message = [
    "Hello! I'd like to place a *Cash on Delivery* order:",
    '',
    itemLines,
    '',
    `*Total: ₹${totals.total}*`,
    totals.delivery > 0
      ? `(Includes ₹${totals.delivery} delivery charge)`
      : '(Free Delivery)',
    '',
    '*Delivery Address:*',
    form.name,
    `+91 ${form.phone}`,
    ...addressParts,
    '',
    'Please confirm and share the expected delivery timeline. Thank you!',
  ].join('\n');

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
