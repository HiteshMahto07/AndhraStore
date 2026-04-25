import Razorpay from 'razorpay';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  // Initialize Razorpay SDK
  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: amount * 100, // Razorpay takes amount in the smallest currency unit (paise)
    currency: 'INR',
    receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    console.error('Error creating razorpay order:', err);
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
}
