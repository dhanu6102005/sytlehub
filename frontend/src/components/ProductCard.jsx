// components/ProductCard.jsx
// Reusable product card with image, rating, price, add-to-cart

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    await addToCart(product.id, 1);
    setAdding(false);
  };

  return (
    <div className="product-card card" style={{ overflow: 'hidden', position: 'relative' }}>
      {/* Wishlist Button */}
      <button
        className="wishlist-btn"
        onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
        aria-label="Wishlist"
        style={{
          position: 'absolute', top: '12px', right: '12px', zIndex: 2,
          background: 'rgba(13,13,26,0.7)', border: 'none', borderRadius: '50%',
          width: '36px', height: '36px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s',
          color: wishlisted ? '#f472b6' : 'var(--text-secondary)',
        }}
      >
        <FiHeart size={16} fill={wishlisted ? '#f472b6' : 'none'} />
      </button>

      {/* Discount Badge */}
      {discount && (
        <div style={{
          position: 'absolute', top: '12px', left: '12px', zIndex: 2,
          background: 'var(--accent-pink)', color: '#fff',
          padding: '3px 10px', borderRadius: 'var(--radius-full)',
          fontSize: '11px', fontWeight: '700',
        }}>
          -{discount}%
        </div>
      )}

      <Link to={`/products/${product.id}`} style={{ display: 'block' }}>
        {/* Product Image */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          paddingBottom: '110%', background: 'var(--bg-secondary)',
        }}>
          <img
            src={product.image_url || 'https://via.placeholder.com/400x440?text=StyleHub'}
            alt={product.name}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', transition: 'transform 0.5s ease',
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
        </div>

        {/* Product Info */}
        <div style={{ padding: '16px' }}>
          {product.category_name && (
            <span style={{
              fontSize: '11px', fontWeight: '600', textTransform: 'uppercase',
              letterSpacing: '0.8px', color: 'var(--accent-primary)',
            }}>
              {product.category_name}
            </span>
          )}

          <h3 style={{
            fontSize: '15px', fontWeight: '600', margin: '6px 0 8px',
            color: 'var(--text-primary)', lineHeight: '1.3',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    size={12}
                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                ({product.reviews_count})
              </span>
            </div>
          )}

          {/* Price Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span className="price">₹{Number(product.price).toLocaleString('en-IN')}</span>
              {product.original_price && (
                <span className="price-original">
                  ₹{Number(product.original_price).toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {/* Stock status */}
          {product.stock === 0 && (
            <p style={{ fontSize: '12px', color: 'var(--accent-red)', marginTop: '4px' }}>
              Out of Stock
            </p>
          )}
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div style={{ padding: '0 16px 16px' }}>
        <button
          id={`add-to-cart-${product.id}`}
          className="btn btn-primary btn-full btn-sm"
          onClick={handleAddToCart}
          disabled={adding || product.stock === 0}
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          {adding ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }} />
              Adding...
            </span>
          ) : (
            <>
              <FiShoppingCart size={15} />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
