// pages/Checkout.jsx
// Checkout page to enter shipping info and place orders

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiCreditCard } from 'react-icons/fi';
import Loader from '../components/Loader';

const Checkout = () => {
  const { cartItems, cartTotal, cartCount, clearCart, cartLoading } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    shipping_name: '',
    shipping_email: '',
    shipping_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_zip: '',
    payment_method: 'COD',
    notes: ''
  });

  const [loading, setLoading] = useState(false);

  const shipping = cartTotal >= 999 ? 0 : 99;
  const grandTotal = cartTotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    try {
      setLoading(true);
      const { data } = await orderAPI.placeOrder(formData);
      if (data.success) {
        toast.success(data.message || 'Order placed successfully! 🎉');
        await clearCart();
        navigate('/orders');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) return <Loader fullPage text="Loading checkout details..." />;

  if (cartItems.length === 0) {
    return (
      <div className="section">
        <div className="container empty-state">
          <h3>Your cart is empty</h3>
          <p>Please add some items to your cart before checking out.</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <div style={{ marginBottom: '24px' }}>
          <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', fontWeight: '600' }}>
            <FiArrowLeft /> Back to Cart
          </Link>
        </div>

        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '700', marginBottom: '32px' }}>
          Checkout <span className="gradient-text">Details</span>
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start' }}>
          {/* Shipping Form */}
          <div className="card" style={{ padding: '28px', gridColumn: 'span 2' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Shipping Information</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="shipping_name"
                    value={formData.shipping_name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="shipping_email"
                    value={formData.shipping_email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="shipping_phone"
                    value={formData.shipping_phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="9876543210"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">PIN Code *</label>
                  <input
                    type="text"
                    name="shipping_zip"
                    value={formData.shipping_zip}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="400001"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Street Address *</label>
                <textarea
                  name="shipping_address"
                  value={formData.shipping_address}
                  onChange={handleChange}
                  className="form-input"
                  style={{ minHeight: '100px', resize: 'vertical' }}
                  placeholder="Flat/House No, Building, Street, Area"
                  required
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="shipping_city"
                    value={formData.shipping_city}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Mumbai"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input
                    type="text"
                    name="shipping_state"
                    value={formData.shipping_state}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Maharashtra"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{
                    flex: 1, padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)',
                    display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
                    background: formData.payment_method === 'COD' ? 'rgba(167,139,250,0.08)' : 'transparent',
                    borderColor: formData.payment_method === 'COD' ? 'var(--accent-primary)' : 'var(--border-color)'
                  }}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="COD"
                      checked={formData.payment_method === 'COD'}
                      onChange={handleChange}
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                    <div>
                      <div style={{ fontWeight: '600' }}>Cash On Delivery (COD)</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Pay cash at your doorstep</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Order Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="form-input"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  placeholder="Notes about your delivery, e.g. special instructions for delivery."
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full btn-lg"
                style={{ marginTop: '12px' }}
                disabled={loading}
              >
                {loading ? 'Processing Order...' : `Place Order (₹${grandTotal.toLocaleString('en-IN')})`}
              </button>
            </form>
          </div>

          {/* Order Summary & Cart items preview */}
          <div>
            <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Items Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '300px', overflowY: 'auto', paddingRight: '8px' }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img
                      src={item.image_url}
                      alt={item.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.name}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Qty: {item.quantity}</p>
                    </div>
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Order Total</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="divider" style={{ margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700' }}>
                  <span>Grand Total</span>
                  <span className="gradient-text">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
