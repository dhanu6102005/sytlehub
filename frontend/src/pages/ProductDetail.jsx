// pages/ProductDetail.jsx
// Single product detail page with gallery, description, add to cart

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiArrowLeft, FiStar, FiTruck, FiRefreshCw, FiShield, FiHeart } from 'react-icons/fi';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await productAPI.getById(id);
        setProduct(data.product);
        setRelated(data.related || []);
      } catch {
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const handleAddToCart = async () => {
    setAdding(true);
    await addToCart(product.id, quantity);
    setAdding(false);
  };

  if (loading) return <Loader fullPage text="Loading product..." />;
  if (!product) return null;

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  return (
    <div>
      <div className="container" style={{ padding: '40px 24px' }}>
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: '32px' }}>
          <FiArrowLeft size={16} /> Back
        </button>

        {/* Main Product Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '56px', alignItems: 'start' }}>
          {/* Image */}
          <div style={{ position: 'relative' }}>
            {discount && (
              <div style={{
                position: 'absolute', top: '20px', left: '20px', zIndex: 2,
                background: 'var(--accent-pink)', color: '#fff',
                padding: '6px 14px', borderRadius: 'var(--radius-full)',
                fontSize: '14px', fontWeight: '700',
              }}>
                -{discount}% OFF
              </div>
            )}
            <div style={{
              borderRadius: 'var(--radius-xl)', overflow: 'hidden',
              background: 'var(--bg-secondary)', aspectRatio: '3/4',
              border: '1px solid var(--border-color)',
            }}>
              <img
                src={product.image_url || 'https://via.placeholder.com/600x800'}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {product.category_name && (
              <Link
                to={`/products?category=${product.category_slug}`}
                style={{ color: 'var(--accent-primary)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}
              >
                {product.category_name}
              </Link>
            )}

            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 3vw, 38px)', lineHeight: '1.2' }}>
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} size={16} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  {product.rating} ({product.reviews_count} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ fontSize: '36px', fontWeight: '800', color: 'var(--accent-primary)' }}>
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              {product.original_price && (
                <>
                  <span className="price-original" style={{ fontSize: '20px' }}>
                    ₹{Number(product.original_price).toLocaleString('en-IN')}
                  </span>
                  <span className="badge badge-green">{discount}% off</span>
                </>
              )}
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '15px' }}>
              {product.description}
            </p>

            <div className="divider" />

            {/* Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: product.stock > 0 ? 'var(--accent-green)' : 'var(--accent-red)',
              }} />
              <span style={{ fontSize: '14px', color: product.stock > 0 ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: '600' }}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity + Add to Cart */}
            {product.stock > 0 && (
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Quantity Selector */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)',
                  overflow: 'hidden', background: 'var(--bg-input)',
                }}>
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    style={{ width: '44px', height: '48px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '18px' }}
                  >−</button>
                  <span style={{ width: '48px', textAlign: 'center', fontWeight: '600', fontSize: '16px' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    style={{ width: '44px', height: '48px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '18px' }}
                  >+</button>
                </div>

                <button
                  id={`product-detail-add-cart-${product.id}`}
                  className="btn btn-primary"
                  onClick={handleAddToCart}
                  disabled={adding}
                  style={{ flex: 1, minWidth: '180px' }}
                >
                  {adding ? (
                    <><span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Adding...</>
                  ) : (
                    <><FiShoppingCart size={18} /> Add to Cart</>
                  )}
                </button>

                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  style={{
                    width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
                    background: wishlisted ? 'rgba(244,114,182,0.15)' : 'var(--bg-input)',
                    border: `1px solid ${wishlisted ? 'var(--accent-pink)' : 'var(--border-color)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: wishlisted ? 'var(--accent-pink)' : 'var(--text-secondary)',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <FiHeart size={18} fill={wishlisted ? 'var(--accent-pink)' : 'none'} />
                </button>
              </div>
            )}

            {/* Features */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '8px' }}>
              {[
                { icon: <FiTruck size={18} />, text: 'Free Shipping' },
                { icon: <FiRefreshCw size={18} />, text: '30-Day Returns' },
                { icon: <FiShield size={18} />, text: 'Secure Pay' },
              ].map(f => (
                <div key={f.text} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                  padding: '14px 8px', borderRadius: 'var(--radius-md)',
                  background: 'rgba(167,139,250,0.05)', border: '1px solid var(--border-color)',
                  fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center',
                }}>
                  <span style={{ color: 'var(--accent-primary)' }}>{f.icon}</span>
                  {f.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section style={{ marginTop: '80px' }}>
            <h2 style={{ fontSize: '28px', marginBottom: '32px' }}>
              You might also <span className="gradient-text">like</span>
            </h2>
            <div className="grid-products">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
