/**
 * POST /api/cod-order
 *
 * Saves a Cash-on-Delivery order to the orders DB and emails the store an
 * alert. Called fire-and-forget by the checkout page while it opens WhatsApp,
 * so it must never block or break the customer's flow. The WhatsApp message
 * still carries the full order.
 *
 * Body: { orderId: "COD-<13 digits>-<4 chars>", cartItems, customer }
 * Totals are recalculated server-side; the browser's prices are ignored.
 */

import { validateCartItems, calcServerTotals, COD_CHARGE } from '@/lib/checkout';
import { insertOrder, buildOrderRow, cleanCustomer, attributionFromCookies, isOrdersDbConfigured } from '@/lib/orders';
import { sendOrderAlert, isOrderAlertConfigured } from '@/lib/orderAlert';

const COD_ID = /^COD-\d{13}-[A-Z0-9]{4}$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { orderId, cartItems, customer: rawCustomer } = req.body || {};

  if (typeof orderId !== 'string' || !COD_ID.test(orderId)) return res.status(400).json({ error: 'Invalid order id' });
  const cartError = validateCartItems(cartItems);
  if (cartError) return res.status(400).json({ error: cartError });
  const { customer, error } = cleanCustomer(rawCustomer);
  if (error) return res.status(400).json({ error });

  if (!isOrdersDbConfigured() && !isOrderAlertConfigured()) return res.status(202).json({ saved: false });

  let row;
  try {
    row = buildOrderRow({
      id           : orderId,
      paymentMethod: 'cod',
      paymentStatus: 'cod',
      customer,
      totals       : calcServerTotals(cartItems),
      codCharge    : COD_CHARGE,
      attribution  : attributionFromCookies(req.cookies),
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  // Save first. Only alert for a newly created order, so a retried request
  // doesn't send a second email. Without a DB, the alert alone still goes out.
  let saved = false;
  let isNew = true;
  if (isOrdersDbConfigured()) {
    try {
      isNew = await insertOrder(row);
      saved = true;
    } catch (err) {
      console.error('[cod-order] save failed', orderId, err.message);
    }
  }
  if (isNew) await sendOrderAlert({ ...row, created_at: new Date().toISOString() });

  return res.status(saved ? 200 : 500).json({ saved });
}
