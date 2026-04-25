import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer({ isOpen, onClose }) {
  const [visible, setVisible] = useState(false);
  const { cartItems, cartCount, updateQty, removeFromCart, clearCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const t = setTimeout(() => {
        document.body.style.overflow = '';
      }, 350);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Escape key closes drawer
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen && !visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/35 backdrop-blur-[2px] z-[150] transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-[420px] bg-white z-[151] shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Your shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-olive-50 border border-olive-100 flex items-center justify-center">
              <ShoppingBag size={18} className="text-olive-600" />
            </div>
            <h2 className="text-lg font-heading font-bold text-gray-900">Your Cart</h2>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-olive-600 text-white text-[10px] font-bold">
              {cartCount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-red-50"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-150 active:scale-95"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full px-6 py-12">
              <div className="w-20 h-20 rounded-2xl bg-cream flex items-center justify-center mb-5">
                <ShoppingBag size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-800 mb-1">Your cart is empty</h3>
              <p className="text-sm text-gray-500 text-center mb-6 max-w-[260px]">
                Looks like you haven&apos;t added any pickles yet. Browse our collection to get started!
              </p>
              <Link
                href="/pickle?type=veg"
                onClick={onClose}
                className="inline-flex items-center gap-2 bg-brand-500 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-brand-600 transition-colors shadow-sm"
              >
                Continue Shopping
                <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            /* Cart items */
            <div className="px-5 py-4 space-y-3">
              {cartItems.map((item, idx) => (
                <div
                  key={item.type}
                  className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100/70 rounded-xl p-3 transition-colors duration-200"
                  style={{ animation: `slideUp 0.3s ease-out ${idx * 60}ms both` }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                    <p className="text-brand-600 font-bold text-sm">₹{item.price * item.qty}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => updateQty(item.type, item.qty - 1)}
                      className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-brand-400 hover:text-brand-600 active:scale-90 transition-all duration-150"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="text-sm font-bold w-5 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.type, item.qty + 1)}
                      className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-brand-400 hover:text-brand-600 active:scale-90 transition-all duration-150"
                    >
                      <Plus size={11} />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.type)}
                      className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-red-400 hover:bg-red-50 hover:border-red-300 active:scale-90 transition-all duration-150 ml-1"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer — items in cart */}
        {cartItems.length > 0 && (
          <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-white space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
              <span className="font-bold text-gray-900">₹{total}</span>
            </div>
            {total < 500 && (
              <div className="relative">
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1.5">
                  <div
                    className="bg-brand-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((total / 500) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                  Add ₹{500 - total} more for free delivery! 🚚
                </p>
              </div>
            )}
            <Link
              href="/cart"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 bg-olive-700 hover:bg-olive-800 text-white py-3 rounded-xl text-sm font-bold tracking-wide shadow-sm transition-all duration-200 active:scale-[0.98]"
            >
              Proceed to Checkout
              <span className="font-extrabold">· ₹{total}</span>
            </Link>
            <p className="text-center text-xs text-gray-400">
              Or order via WhatsApp:{' '}
              <a href="https://wa.me/918758302568" className="text-green-600 font-semibold hover:underline" target="_blank" rel="noreferrer">
                Click Here
              </a>
            </p>
          </div>
        )}

        {/* Footer — empty cart */}
        {cartItems.length === 0 && (
          <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-white">
            <a
              href="https://wa.me/918758302568"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Order via WhatsApp
            </a>
          </div>
        )}

        <style jsx global>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </>
  );
}
