/**
 * lib/razorpay.js  —  SERVER-SIDE ONLY
 *
 * Do NOT import this file in any page component or client-side code.
 * It uses the `razorpay` npm package which is a Node.js module.
 * Only import it from pages/api/ routes.
 *
 * The singleton pattern prevents re-instantiation on every API call
 * and avoids creating new connections on Next.js hot reloads in dev.
 */

import Razorpay from 'razorpay';

let _client = null;

export function getRazorpayClient() {
  if (_client) return _client;

  const keyId     = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      'Razorpay credentials missing. ' +
      'Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env.local file.'
    );
  }

  _client = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return _client;
}
