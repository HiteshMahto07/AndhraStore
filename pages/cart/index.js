import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cartItems, updateQty, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal > 0 ? subtotal + shipping : 0;

  const initPayment = async (e) => {
    e.preventDefault();
    if (total <= 0) return;
    setLoading(true);

    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      });
      const order = await res.json();

      if (!order.id) {
        alert('Payment initialization failed. Please check your network.');
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Andhra Store',
        description: 'Authentic Pickles Checkout',
        image: '/images/Veg Pickle/Mango Pickle 1 (2).png',
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.verified) {
              clearCart();
              router.push('/success');
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error(err);
            alert('Something went wrong during verification.');
          }
        },
        prefill: {
          name: formData.name || 'Test User',
          email: formData.email || 'test@example.com',
          contact: formData.phone || '9999999999',
        },
        theme: {
          color: '#2D5A3D', // brand-500
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        alert('Payment Failed! Reason: ' + response.error.description);
      });
      paymentObject.open();
    } catch (err) {
      console.error(err);
      alert('Error initiating checkout. Please try again later.');
    }
    setLoading(false);
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Header />
      <div className="bg-gray-50 min-h-screen pt-8 pb-20">
        <div className="container-main max-w-5xl mx-auto">
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-8 tracking-wide">Secure Checkout</h1>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
              <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-sm text-gray-500 mb-6">Looks like you haven&apos;t added any authentic pickles to your cart yet.</p>
              <Link href="/home" className="btn-primary">Browse Products</Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Cart Items & Details */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Items List */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">Order Summary ({cartItems.length} items)</h3>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.type} className="flex gap-4 sm:gap-6 py-2 border-b border-gray-50 last:border-0">
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm sm:text-base font-bold text-gray-900">{item.name}</h4>
                              <p className="text-xs text-brand-600 font-medium mt-0.5">Andhra Authentic</p>
                            </div>
                            <p className="text-sm font-bold text-gray-900">₹{item.price}</p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="inline-flex items-center rounded-lg border border-gray-200">
                              <button onClick={() => updateQty(item.type, item.qty - 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">−</button>
                              <span className="w-8 h-8 flex items-center justify-center font-bold text-gray-800 border-x border-gray-200 text-sm bg-white">{item.qty}</span>
                              <button onClick={() => updateQty(item.type, item.qty + 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.type)} className="text-[11px] font-bold uppercase tracking-wider text-rose-500 hover:text-rose-600 transition-colors">
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">Shipping Details</h3>
                  <form onSubmit={initPayment} id="checkout-form" className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name</label>
                      <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none text-sm" placeholder="John Doe" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Phone Number</label>
                      <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none text-sm" placeholder="+91 9876543210" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Email Address</label>
                      <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none text-sm" placeholder="john@example.com" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Full Address</label>
                      <textarea required name="address" value={formData.address} onChange={handleInputChange} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none text-sm resize-none" placeholder="Door No, Street Name, City, State, Pincode" />
                    </div>
                  </form>
                </div>

              </div>

              {/* Right Column: Price Breakdown */}
              <div className="lg:col-span-5 relative">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 sticky top-24">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">Payment Breakdown</h3>
                  
                  <div className="space-y-3 text-sm text-gray-600 mb-6">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-gray-900">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping Estimate</span>
                      <span className="font-semibold text-gray-900 text-green-600">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (Inclusive)</span>
                      <span className="font-semibold text-gray-900">₹0</span>
                    </div>
                  </div>
                  
                  <div className="flex items-end justify-between pt-4 border-t border-gray-100 mb-6">
                    <div>
                      <span className="block text-sm text-gray-500">Total Amount</span>
                      <span className="text-[10px] text-gray-400">including all taxes</span>
                    </div>
                    <span className="text-3xl font-extrabold text-gray-900">₹{total}</span>
                  </div>

                  <button 
                    type="submit" 
                    form="checkout-form"
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-2 bg-[#2D5A3D] text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-[#1f3f2a] hover:shadow-lg hover:shadow-brand-500/20 active:scale-[0.98]'}`}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Pay Securely ₹{total}
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm1-13h-2v2h2v-2zm-2 4h-2v8h4v-8h-2z" fill="none"/><path d="M17.818 9.382l-5-6a.999.999 0 00-1.536 0l-5 6A.999.999 0 006.12 11H8v7a1 1 0 001 1h6a1 1 0 001-1v-7h1.88a.999.999 0 00.768-1.618zM14 17h-4v-7H8.553l3.447-4.136L15.447 10H14v7z"/></svg>
                      </>
                    )}
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                    256-bit Secure Encryption by Razorpay
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}