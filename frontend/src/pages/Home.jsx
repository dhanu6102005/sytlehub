// pages/Home.jsx
// Landing page — Hero, featured products, categories, and promo banners

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiShoppingBag, FiTruck, FiRefreshCw, FiShield } from 'react-icons/fi';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, catRes] = await Promise.all([
          productAPI.getAll({ featured: 'true', limit: 8 }),
          productAPI.getCategories(),
        ]);
        setFeatured(featuredRes.data.products || []);
        setCategories(catRes.data.categories || []);
      } catch (err) {
        console.error('Home fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const features = [
    { icon: <FiTruck size={24} />, title: 'Free Shipping', desc: 'On orders above ₹999' },
    { icon: <FiRefreshCw size={24} />, title: 'Easy Returns', desc: '30-day hassle-free returns' },
    { icon: <FiShield size={24} />, title: 'Secure Payment', desc: '100% safe transactions' },
    { icon: <FiShoppingBag size={24} />, title: 'Premium Quality', desc: 'Curated fashion brands' },
  ];

  return (
    <div>
      {/* ─── Hero Section ─────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        background: 'radial-gradient(ellipse at 60% 50%, rgba(167,139,250,0.12) 0%, transparent 60%), var(--gradient-hero)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)',
          top: '-100px', right: '-100px', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244,114,182,0.06) 0%, transparent 70%)',
          bottom: '0', left: '5%', pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '100px 24px' }}>
          <div style={{ maxWidth: '680px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)',
              borderRadius: 'var(--radius-full)', padding: '6px 16px',
              fontSize: '13px', fontWeight: '600', color: 'var(--accent-primary)',
              marginBottom: '28px', animation: 'fadeIn 0.6s ease',
            }}>
              ✨ New Collection 2024 — Now Live
            </div>

            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(42px, 7vw, 88px)',
              fontWeight: '700', lineHeight: '1.05', marginBottom: '24px',
              animation: 'fadeIn 0.7s ease 0.1s both',
            }}>
              Dress to
              <br />
              <span className="gradient-text">Impress.</span>
            </h1>

            <p style={{
              fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--text-secondary)',
              lineHeight: '1.7', marginBottom: '40px', maxWidth: '520px',
              animation: 'fadeIn 0.7s ease 0.2s both',
            }}>
              Discover curated fashion for every occasion. From streetwear to formal elegance — StyleHub has it all.
            </p>

            <div style={{
              display: 'flex', gap: '16px', flexWrap: 'wrap',
              animation: 'fadeIn 0.7s ease 0.3s both',
            }}>
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop Now <FiArrowRight size={18} />
              </Link>
              <Link to="/products?featured=true" className="btn btn-secondary btn-lg">
                New Arrivals
              </Link>
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex', gap: '40px', marginTop: '56px',
              animation: 'fadeIn 0.7s ease 0.4s both', flexWrap: 'wrap',
            }}>
              {[
                { val: '10K+', label: 'Happy Customers' },
                { val: '500+', label: 'Fashion Items' },
                { val: '4.9★', label: 'Average Rating' },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>{stat.val}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Strip ───────────────────────────────── */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ padding: '32px 24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
          }}>
            {features.map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '16px',
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
                  background: 'rgba(167,139,250,0.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent-primary)', flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '15px' }}>{f.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Categories ───────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by <span className="gradient-text">Category</span></h2>
            <div className="section-divider" />
            <p>Find exactly what you're looking for</p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '20px',
          }}>
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  position: 'relative', borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden', aspectRatio: '3/4', cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                  }} />
                  <div style={{
                    position: 'absolute', bottom: '16px', left: '16px',
                    fontWeight: '700', fontSize: '16px', color: '#fff',
                  }}>
                    {cat.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Products ─────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)' }}>
                Featured <span className="gradient-text">Picks</span>
              </h2>
              <div className="section-divider" style={{ margin: '12px 0 0' }} />
            </div>
            <Link to="/products?featured=true" className="btn btn-ghost btn-sm">
              View All <FiArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <Loader text="Loading products..." />
          ) : (
            <div className="grid-products animate-fade">
              {featured.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Promo Banner ─────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{
            borderRadius: 'var(--radius-xl)',
            background: 'var(--gradient-primary)',
            padding: 'clamp(40px, 6vw, 80px) clamp(24px, 6vw, 80px)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '32px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', right: '-50px', top: '-50px',
              width: '300px', height: '300px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                Limited Time Offer
              </p>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 5vw, 52px)', color: '#fff', marginBottom: '12px' }}>
                Up to 50% Off Sale!
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                Shop our seasonal sale and save big on top brands.
              </p>
            </div>
            <Link
              to="/products?category=sale"
              className="btn"
              style={{
                background: '#fff', color: '#7c3aed',
                fontWeight: '700', fontSize: '16px', position: 'relative', zIndex: 1,
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
              }}
            >
              Shop the Sale <FiArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
