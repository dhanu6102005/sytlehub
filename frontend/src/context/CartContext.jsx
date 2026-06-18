// context/CartContext.jsx
// Global cart state — syncs with backend for authenticated users

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);

  // ─── Fetch Cart from Backend ──────────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setCartTotal(0);
      return;
    }
    try {
      setCartLoading(true);
      const { data } = await cartAPI.getCart();
      if (data.success) {
        setCartItems(data.items);
        setCartTotal(data.total);
      }
    } catch (error) {
      console.error('Fetch cart error:', error);
    } finally {
      setCartLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ─── Add to Cart ─────────────────────────────────────────────────────────
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart.');
      return false;
    }
    try {
      const { data } = await cartAPI.addToCart({ product_id: productId, quantity });
      if (data.success) {
        toast.success('Added to cart! 🛍️');
        await fetchCart();
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart.');
      return false;
    }
  };

  // ─── Update Quantity ──────────────────────────────────────────────────────
  const updateQuantity = async (cartId, quantity) => {
    try {
      const { data } = await cartAPI.updateItem({ cart_id: cartId, quantity });
      if (data.success) {
        await fetchCart();
      }
    } catch (error) {
      toast.error('Failed to update quantity.');
    }
  };

  // ─── Remove Item ──────────────────────────────────────────────────────────
  const removeFromCart = async (cartId) => {
    try {
      const { data } = await cartAPI.removeItem(cartId);
      if (data.success) {
        toast.success('Item removed from cart.');
        await fetchCart();
      }
    } catch (error) {
      toast.error('Failed to remove item.');
    }
  };

  // ─── Clear Cart ───────────────────────────────────────────────────────────
  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCartItems([]);
      setCartTotal(0);
    } catch (error) {
      console.error('Clear cart error:', error);
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, cartTotal, cartCount, cartLoading,
      fetchCart, addToCart, updateQuantity, removeFromCart, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
