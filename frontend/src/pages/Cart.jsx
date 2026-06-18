// pages/Cart.jsx
// Shopping cart page with items list, totals, and checkout navigation

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiArrowRight, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import Loader from '../components/Loader';

const Cart = () => {
  const { cartItems, cartTotal, cartCount, cartLoading, clearCart } = useCart();
  const navigate = useNavigate();

  const shipping = cartTotal >= 999 ? 0 : 99;
  const grandTotal = cartTotal + shipping;

  if (cartLoading) return <Loader fullPage text="Loading cart..." />;

  return (
    <div className="section">
      <div className="container">
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '700', marginBottom: '8px' }}>
          Shopping <span className="gradient-text">Cart</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '36px' }}>
          {cartCount > 0 ? `${cartCount} item${cartCount > 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
        </p>

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <FiShoppingBag size={72} />
            <h3>Your cart is empty</h3>
            <p>Add some amazing fashion items to your cart!</p>
            <Link to="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start' }}>
            {/* Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={clearCart} className="btn btn-danger btn-sm">
                  <FiTrash2 size={14} /> Clear Cart
                </button>
              </div>
              {cartItems.map(item => <CartItem key={item.id} item={item} />)}
            </div>

            {/* Order Summary */}
            <div>
              <div className="card" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Order Summary</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Subtotal ({cartCount} items)</span>
                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                    <span style={{ color: shipping === 0 ? 'var(--accent-green)' : 'inherit' }}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'rgba(167,139,250,0.05)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
                      Add ₹{(999 - cartTotal).toFixed(0)} more for free shipping!
                    </p>
                  )}

                  <div className="divider" />

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '700' }}>
                    <span>Total</span>
                    <span className="gradient-text">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  id="cart-checkout-btn"
                  className="btn btn-primary btn-full"
                  onClick={() => navigate('/checkout')}
                  style={{ marginTop: '24px' }}
                >
                  Proceed to Checkout <FiArrowRight size={18} />
                </button>

                <Link
                  to="/products"
                  className="btn btn-ghost btn-full"
                  style={{ marginTop: '12px', textAlign: 'center' }}
                >
                  Continue Shopping
                </Link>

                {/* Trust Badges */}
                <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(52,211,153,0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(52,211,153,0.15)' }}>
                  <p style={{ fontSize: '12px', color: 'var(--accent-green)', textAlign: 'center' }}>
                    🔒 Secure 256-bit SSL Encrypted Checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
