import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ message: 'Missing payment verification data' });
  }

  // Create HMAC SHA256 signature using the secret key
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  // Verify that the signatures match
  if (expectedSignature === razorpay_signature) {
    // Payment verified successfully
    // Here you would typically update your database order document to status: 'PAID'
    return res.status(200).json({ message: 'Payment verified successfully', verified: true });
  } else {
    return res.status(400).json({ message: 'Invalid payment signature', verified: false });
  }
}