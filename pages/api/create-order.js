/**
 * POST /api/create-order
 *
 * Creates a Razorpay order with a server-side-calculated total.
 * The frontend NEVER sends an amount — we derive it from cartItems
 * using authoritative prices from pickles.json.
 *
 * Security:
 *   - Amount is calculated server-side (prevents price tampering)
 *   - cartItems are validated before any Razorpay call
 *   - Razorpay KEY_SECRET is never sent to the browser
 */

import { getRazorpayClient } from '@/lib/razorpay';
import { validateCartItems, calcServerTotals } from '@/lib/checkout';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cartItems } = req.body;

    // ── 1. Validate the cart payload ────────────────────────────────────────
    const validationError = validateCartItems(cartItems);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // ── 2. Recalculate total server-side (authoritative) ────────────────────
    let totals;
    try {
      totals = calcServerTotals(cartItems);
    } catch (calcError) {
      return res.status(400).json({ error: calcError.message });
    }

    const { subtotal, delivery, total } = totals;

    // ── 3. Create Razorpay order ────────────────────────────────────────────
    // Razorpay expects amount in paise (₹1 = 100 paise)
    const razorpay = getRazorpayClient();

    const order = await razorpay.orders.create({
      amount  : total * 100,
      currency: 'INR',
      receipt : `AS_${Date.now()}`,
      notes   : {
        source: 'andhrastore.com',
        items : cartItems
          .map((i) => `${i.name} (${i.weightLabel || i.weight}) ×${i.qty}`)
          .join(' | '),
      },
    });

    return res.status(200).json({
      orderId : order.id,
      amount  : order.amount,   // paise — passed directly to Razorpay SDK
      currency: order.currency,
      subtotal,
      delivery,
      total,
    });

  } catch (err) {
    console.error('[create-order]', err.message);
    return res.status(500).json({
      error: 'Unable to initiate payment. Please try again or order via WhatsApp.',
    });
  }
}
