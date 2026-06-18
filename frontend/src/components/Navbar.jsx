// components/Navbar.jsx
// Responsive premium navigation bar with search, cart badge, user menu

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiShoppingCart, FiUser, FiMenu, FiX, FiSearch,
  FiLogOut, FiPackage, FiGrid, FiHome, FiShield
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  // Navbar shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: <FiHome size={15} /> },
    { to: '/products', label: 'Shop', icon: null },
    { to: '/products?category=men', label: 'Men', icon: null },
    { to: '/products?category=women', label: 'Women', icon: null },
    { to: '/products?category=sale', label: 'Sale 🔥', icon: null },
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 'var(--navbar-height)',
        background: scrolled ? 'rgba(13,13,26,0.95)' : 'rgba(13,13,26,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(167,139,250,0.2)' : 'transparent'}`,
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
      }}>
        <div className="container" style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', height: '100%',
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'var(--gradient-primary)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', fontWeight: '900', color: '#fff',
            }}>S</div>
            <span style={{
              fontFamily: 'var(--font-heading)', fontSize: '22px',
              fontWeight: '700', color: 'var(--text-primary)',
            }}>
              Style<span className="gradient-text">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}
               className="nav-links-desktop">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  fontSize: '14px', fontWeight: '500',
                  color: location.pathname === link.to ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  transition: 'color 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.target.style.color = location.pathname === link.to ? 'var(--accent-primary)' : 'var(--text-secondary)'}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Search */}
            <button
              id="navbar-search-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              style={{
                background: 'none', border: 'none',
                color: 'var(--text-secondary)', padding: '8px',
                borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                transition: 'color 0.2s',
              }}
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>

            {/* Cart */}
            <Link
              id="navbar-cart-btn"
              to="/cart"
              style={{ position: 'relative', padding: '8px', color: 'var(--text-secondary)' }}
            >
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '2px', right: '2px',
                  background: 'var(--accent-pink)', color: '#fff',
                  borderRadius: '50%', width: '18px', height: '18px',
                  fontSize: '11px', fontWeight: '700',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'pulse 2s ease infinite',
                }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }} ref={userMenuRef}>
                <button
                  id="navbar-user-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'rgba(167,139,250,0.1)', border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-full)', padding: '7px 14px',
                    color: 'var(--text-primary)', cursor: 'pointer', fontSize: '14px',
                  }}
                >
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: 'var(--gradient-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: '700', color: '#fff',
                  }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)', padding: '8px',
                    minWidth: '200px', boxShadow: 'var(--shadow-lg)',
                    animation: 'fadeIn 0.2s ease',
                  }}>
                    {[
                      { to: '/dashboard', icon: <FiUser size={15} />, label: 'My Profile' },
                      { to: '/orders', icon: <FiPackage size={15} />, label: 'My Orders' },
                      ...(isAdmin ? [{ to: '/admin', icon: <FiShield size={15} />, label: 'Admin Panel' }] : []),
                    ].map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px 14px', borderRadius: 'var(--radius-md)',
                          color: 'var(--text-secondary)', fontSize: '14px',
                          transition: 'all 0.2s', textDecoration: 'none',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(167,139,250,0.1)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >
                        {item.icon} {item.label}
                      </Link>
                    ))}
                    <div className="divider" style={{ margin: '6px 0' }} />
                    <button
                      id="navbar-logout-btn"
                      onClick={handleLogout}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 14px', borderRadius: 'var(--radius-md)',
                        color: 'var(--accent-red)', fontSize: '14px',
                        background: 'none', border: 'none', width: '100%',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <FiLogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              id="navbar-mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: 'none', border: 'none', color: 'var(--text-primary)',
                padding: '8px', cursor: 'pointer', display: 'none',
              }}
              className="mobile-menu-btn"
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div style={{
            padding: '12px 24px', borderTop: '1px solid var(--border-color)',
            animation: 'fadeIn 0.2s ease',
          }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', maxWidth: '600px', margin: '0 auto' }}>
              <input
                id="navbar-search-input"
                ref={searchRef}
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands, categories..."
                className="form-input"
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                <FiSearch size={16} /> Search
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 'var(--navbar-height)', left: 0, right: 0, bottom: 0,
          background: 'var(--bg-primary)', zIndex: 999, padding: '24px',
          overflowY: 'auto', animation: 'slideInLeft 0.3s ease',
        }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                display: 'block', padding: '16px 0',
                fontSize: '18px', fontWeight: '600',
                color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)',
              }}
            >
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
              <Link to="/login" className="btn btn-ghost btn-full">Login</Link>
              <Link to="/register" className="btn btn-primary btn-full">Sign Up</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
