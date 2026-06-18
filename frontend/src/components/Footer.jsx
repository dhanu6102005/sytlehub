// components/Footer.jsx
// Full-featured footer with links, newsletter, and social icons

import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  const year = new Date().getFullYear();

  const links = {
    Shop: [
      { label: "Men's Fashion", to: '/products?category=men' },
      { label: "Women's Fashion", to: '/products?category=women' },
      { label: "Kids' Wear", to: '/products?category=kids' },
      { label: 'Accessories', to: '/products?category=accessories' },
      { label: 'Footwear', to: '/products?category=footwear' },
      { label: 'Sale', to: '/products?category=sale' },
    ],
    Account: [
      { label: 'My Dashboard', to: '/dashboard' },
      { label: 'My Orders', to: '/orders' },
      { label: 'Shopping Cart', to: '/cart' },
      { label: 'Login', to: '/login' },
      { label: 'Register', to: '/register' },
    ],
    Company: [
      { label: 'About Us', to: '/' },
      { label: 'Careers', to: '/' },
      { label: 'Press', to: '/' },
      { label: 'Privacy Policy', to: '/' },
      { label: 'Terms of Service', to: '/' },
    ],
  };

  const socials = [
    { icon: <FiInstagram size={18} />, href: '#', label: 'Instagram' },
    { icon: <FiTwitter size={18} />, href: '#', label: 'Twitter' },
    { icon: <FiFacebook size={18} />, href: '#', label: 'Facebook' },
    { icon: <FiYoutube size={18} />, href: '#', label: 'YouTube' },
  ];

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      marginTop: 'auto',
    }}>
      {/* Top Section */}
      <div className="container" style={{ padding: '64px 24px 40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '48px',
        }}>
          {/* Brand Column */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'var(--gradient-primary)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', fontWeight: '900', color: '#fff',
              }}>S</div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '700' }}>
                Style<span className="gradient-text">Hub</span>
              </span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7', marginBottom: '20px' }}>
              Your premium destination for modern fashion. Discover the latest trends, timeless classics, and everything in between.
            </p>

            {/* Contact */}
            {[
              { icon: <FiMail size={14} />, text: 'hello@stylehub.com' },
              { icon: <FiPhone size={14} />, text: '+91 98765 43210' },
              { icon: <FiMapPin size={14} />, text: 'Mumbai, Maharashtra, India' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px',
              }}>
                <span style={{ color: 'var(--accent-primary)' }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>

          {/* Link Columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 style={{
                fontSize: '13px', fontWeight: '700', textTransform: 'uppercase',
                letterSpacing: '1px', color: 'var(--accent-primary)', marginBottom: '20px',
              }}>{title}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {items.map(item => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      style={{
                        color: 'var(--text-muted)', fontSize: '14px',
                        transition: 'color 0.2s', textDecoration: 'none',
                      }}
                      onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                      onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h4 style={{
              fontSize: '13px', fontWeight: '700', textTransform: 'uppercase',
              letterSpacing: '1px', color: 'var(--accent-primary)', marginBottom: '16px',
            }}>Newsletter</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
              Subscribe to get exclusive deals and new arrivals first.
            </p>
            <form onSubmit={e => { e.preventDefault(); }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="email"
                placeholder="your@email.com"
                className="form-input"
                style={{ fontSize: '14px' }}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Subscribe
              </button>
            </form>

            {/* Socials */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: 'rgba(167,139,250,0.1)', border: '1px solid var(--border-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-secondary)', transition: 'all 0.2s', textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--accent-primary)';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(167,139,250,0.1)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid var(--border-color)', padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          © {year} StyleHub. All rights reserved. Made with ❤️ in India.
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          {['Visa', 'Mastercard', 'UPI', 'Razorpay'].map(p => (
            <span key={p} style={{
              fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)',
              background: 'rgba(255,255,255,0.05)', padding: '4px 10px',
              borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)',
            }}>{p}</span>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
