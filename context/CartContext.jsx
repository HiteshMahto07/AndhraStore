/**
 * CartContext.jsx
 *
 * Central cart state management for Andhra Store.
 *
 * Architecture:
 *   - useReducer for predictable state transitions (easy to hook GTM events into each action)
 *   - useState(hydrated) gates localStorage writes so the initial SSR-empty state
 *     never overwrites a previously saved cart before the load effect has run
 *   - isCartOpen lives here so addToCart() can auto-open the drawer from any page
 *
 * Cart item shape:
 *   {
 *     id          : "Chicken-250"   — type + weight, unique per variant
 *     type        : "Chicken"
 *     name        : "Chicken Pickle"
 *     image       : "/chicken-1.jpeg"
 *     weight      : "250"           — "250" | "500" | "1"
 *     weightLabel : "250g"          — human-readable display label
 *     unitPrice   : 300             — price for this weight tier (NOT × qty)
 *     qty         : 1
 *   }
 */

import {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { pushAddToCart } from '@/lib/analytics';

// ─── Context ────────────────────────────────────────────────────────────────

const CartContext = createContext(null);

// ─── Reducer ────────────────────────────────────────────────────────────────

function cartReducer(state, action) {
  switch (action.type) {

    // Replace entire cart state — used only by the localStorage load on mount
    case 'LOAD_CART':
      return action.payload;

    case 'ADD_ITEM': {
      const { item } = action;
      const existing = state.find((i) => i.id === item.id);
      if (existing) {
        // Same product + weight already in cart → increment quantity
        return state.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
        );
      }
      return [...state, item];
    }

    case 'REMOVE_ITEM':
      return state.filter((i) => i.id !== action.id);

    case 'UPDATE_QTY': {
      const { id, qty } = action;
      // Dropping to 0 removes the item entirely
      if (qty < 1) return state.filter((i) => i.id !== id);
      return state.map((i) => (i.id === id ? { ...i, qty } : i));
    }

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function CartProvider({ children }) {
  const [cartItems, dispatch] = useReducer(cartReducer, []);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // `hydrated` gates localStorage writes.
  // Both effects run after the first render. Using useState (not useRef) means
  // the save effect sees hydrated=false in its first-render closure, so it
  // returns early and does NOT overwrite localStorage before the load completes.
  const [hydrated, setHydrated] = useState(false);

  // Effect 1: Load saved cart from localStorage — SSR-safe, runs only in browser
  useEffect(() => {
    try {
      const saved = localStorage.getItem('andhra-cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: 'LOAD_CART', payload: parsed });
        }
      }
    } catch (_) {
      // Corrupted localStorage — start with empty cart, no crash
    }
    setHydrated(true);
  }, []);

  // Effect 2: Persist cart to localStorage on every change.
  // Skips the initial render (hydrated=false) to avoid wiping saved data.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem('andhra-cart', JSON.stringify(cartItems));
    } catch (_) {}
  }, [cartItems, hydrated]);

  // ── Computed values (memoised — only recalculate when cartItems changes) ──

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.qty, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.unitPrice * item.qty, 0),
    [cartItems]
  );

  // ── Cart operations ────────────────────────────────────────────────────────

  // addToCart also opens the drawer so the user gets instant feedback.
  // pushAddToCart fires AFTER dispatch so it reflects what was actually added.
  // item.qty is the quantity being added in this action, not the cumulative cart qty.
  const addToCart = (item) => {
    dispatch({ type: 'ADD_ITEM', item });
    setIsCartOpen(true);
    pushAddToCart(item);
  };

  const removeFromCart = (id) => dispatch({ type: 'REMOVE_ITEM', id });

  const updateQuantity = (id, qty) =>
    dispatch({ type: 'UPDATE_QTY', id, qty });

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const openCart  = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // ── Context value ──────────────────────────────────────────────────────────

  const value = {
    // State
    cartItems,
    cartCount,
    cartTotal,
    isCartOpen,
    cartReady: hydrated, // true once localStorage has been read — checkout uses this to avoid premature empty-cart redirect
    // Operations
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside a <CartProvider>');
  }
  return context;
}

// ─── WhatsApp URL Builder ────────────────────────────────────────────────────

/**
 * Builds a pre-filled WhatsApp URL containing the full order summary.
 *
 * Future GTM integration: dispatch a 'begin_checkout' dataLayer event
 * from the CartDrawer before navigating to this URL.
 */
export function buildWhatsAppUrl(cartItems, cartTotal) {
  const phone = '918758302568';

  const itemLines = cartItems
    .map(
      (item) =>
        `• ${item.name} (${item.weightLabel}) × ${item.qty} — ₹${item.unitPrice * item.qty}`
    )
    .join('\n');

  const message = [
    'Hello! I\'d like to place an order from Andhra Store:',
    '',
    itemLines,
    '',
    `*Total: ₹${cartTotal}*`,
    '',
    'Please confirm availability and delivery details. Thank you!',
  ].join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
