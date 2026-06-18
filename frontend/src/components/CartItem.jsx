// components/CartItem.jsx
// Individual cart item row with quantity controls and remove

import React from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    if (newQty > item.stock) return;
    updateQuantity(item.id, newQty);
  };

  return (
    <div style={{
      display: 'flex', gap: '16px', padding: '20px',
      background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)', transition: 'border-color 0.2s',
    }}>
      {/* Product Image */}
      <Link to={`/products/${item.product_id}`} style={{ flexShrink: 0 }}>
        <img
          src={item.image_url || 'https://via.placeholder.com/100x120'}
          alt={item.name}
          style={{
            width: '90px', height: '110px', objectFit: 'cover',
            borderRadius: 'var(--radius-md)',
          }}
        />
      </Link>

      {/* Info */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Link
          to={`/products/${item.product_id}`}
          style={{
            fontWeight: '600', fontSize: '15px',
            color: 'var(--text-primary)', textDecoration: 'none',
            lineHeight: '1.3',
          }}
        >
          {item.name}
        </Link>

        <span className="price">₹{Number(item.price).toLocaleString('en-IN')}</span>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          {/* Quantity Controls */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'var(--bg-input)', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)', overflow: 'hidden',
          }}>
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={item.quantity <= 1}
              style={{
                width: '34px', height: '34px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', background: 'none', border: 'none',
                color: item.quantity <= 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => { if (item.quantity > 1) e.currentTarget.style.background = 'rgba(167,139,250,0.1)'; }}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <FiMinus size={14} />
            </button>
            <span style={{
              width: '36px', textAlign: 'center', fontSize: '14px',
              fontWeight: '600', color: 'var(--text-primary)',
            }}>
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={item.quantity >= item.stock}
              style={{
                width: '34px', height: '34px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', background: 'none', border: 'none',
                color: item.quantity >= item.stock ? 'var(--text-muted)' : 'var(--text-primary)',
                cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => { if (item.quantity < item.stock) e.currentTarget.style.background = 'rgba(167,139,250,0.1)'; }}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <FiPlus size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Item Subtotal */}
            <span style={{ fontWeight: '700', color: 'var(--accent-primary)', fontSize: '16px' }}>
              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
            </span>

            {/* Remove */}
            <button
              onClick={() => removeFromCart(item.id)}
              style={{
                background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)',
                borderRadius: 'var(--radius-md)', padding: '8px',
                color: 'var(--accent-red)', cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}
              aria-label="Remove item"
            >
              <FiTrash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
