import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('andhra_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCartItems(parsed);
        setCartCount(parsed.reduce((sum, item) => sum + item.qty, 0));
      }
    } catch (e) {}
  }, []);

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('andhra_cart', JSON.stringify(cartItems));
    setCartCount(cartItems.reduce((sum, item) => sum + item.qty, 0));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.type === product.type);
      if (existing) {
        return prev.map((i) =>
          i.type === product.type ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (type) => {
    setCartItems((prev) => prev.filter((i) => i.type !== type));
  };

  const updateQty = (type, qty) => {
    if (qty <= 0) {
      removeFromCart(type);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.type === type ? { ...i, qty } : i))
    );
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
