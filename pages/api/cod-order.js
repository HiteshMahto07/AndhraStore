/**
 * POST /api/cod-order
 *
 * Saves a Cash-on-Delivery order to the orders DB. Called fire-and-forget by
 * the checkout page while it opens WhatsApp, so it must never block or break
 * the customer's flow. The WhatsApp message still carries the full order.
 *
 * Body: { orderId: "COD-<13 digits>-<4 chars>", cartItems, customer }
 * Totals are recalculated server-side; the browser's prices are ignored.
 */

import { validateCartItems, calcServerTotals, COD_CHARGE } from '@/lib/checkout';
import { insertOrder, cleanCustomer, attributionFromCookies, isOrdersDbConfigured } from '@/lib/orders';

const COD_ID = /^COD-\d{13}-[A-Z0-9]{4}$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { orderId, cartItems, customer: rawCustomer } = req.body || {};

  if (typeof orderId !== 'string' || !COD_ID.test(orderId)) return res.status(400).json({ error: 'Invalid order id' });
  const cartError = validateCartItems(cartItems);
  if (cartError) return res.status(400).json({ error: cartError });
  const { customer, error } = cleanCustomer(rawCustomer);
  if (error) return res.status(400).json({ error });

  if (!isOrdersDbConfigured()) return res.status(202).json({ saved: false });

  try {
    const totals = calcServerTotals(cartItems);
    await insertOrder({
      id           : orderId,
      paymentMethod: 'cod',
      paymentStatus: 'cod',
      customer,
      totals,
      codCharge    : COD_CHARGE,
      attribution  : attributionFromCookies(req.cookies),
    });
    return res.status(200).json({ saved: true });
  } catch (err) {
    console.error('[cod-order] save failed', orderId, err.message);
    return res.status(500).json({ saved: false });
  }
}
