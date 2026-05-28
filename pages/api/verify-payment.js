/**
 * POST /api/verify-payment
 *
 * Verifies Razorpay payment authenticity using HMAC-SHA256 signature.
 * This is the ONLY place payment success is determined.
 * Never trust the Razorpay handler callback on the frontend alone.
 *
 * Razorpay signature algorithm:
 *   HMAC-SHA256( razorpay_order_id + "|" + razorpay_payment_id, KEY_SECRET )
 *   Must equal razorpay_signature from the payment handler.
 *
 * Security:
 *   - KEY_SECRET never leaves this file
 *   - All three payment fields are required before any DB/email actions
 *   - Signature mismatch is logged for fraud monitoring
 *
 * Future extensions (add after DB is set up):
 *   - Write order record to database
 *   - Send email confirmation via Resend
 *   - Trigger WhatsApp Business notification
 */

import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    // ── 1. Require all three Razorpay fields ────────────────────────────────
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error  : 'Incomplete payment details. Please contact support.',
      });
    }

    // ── 2. HMAC-SHA256 verification ─────────────────────────────────────────
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      // Log for fraud monitoring — never expose details to the client
      console.error('[verify-payment] Signature mismatch', {
        orderId   : razorpay_order_id,
        paymentId : razorpay_payment_id,
        timestamp : new Date().toISOString(),
      });
      return res.status(400).json({
        success: false,
        error  : 'Payment verification failed. If money was deducted, contact support with your payment ID.',
      });
    }

    // ── 3. Payment is genuine ───────────────────────────────────────────────
    // TODO (when DB added): persist order record, send email via Resend
    // const order = await db.orders.create({ orderId, paymentId, ...customerDetails });
    // await sendConfirmationEmail(customerDetails.email, order);

    return res.status(200).json({
      success  : true,
      orderId  : razorpay_order_id,
      paymentId: razorpay_payment_id,
    });

  } catch (err) {
    console.error('[verify-payment]', err.message);
    return res.status(500).json({
      success: false,
      error  : 'Verification error. Please contact support with your Razorpay payment ID.',
    });
  }
}
