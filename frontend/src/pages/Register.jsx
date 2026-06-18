// pages/Register.jsx
// User registration page

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (isAuthenticated) { navigate('/'); return null; }

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Full name is required';
    if (!formData.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email format';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await authAPI.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      if (data.success) {
        login(data.token, data.user);
        toast.success(`Welcome to StyleHub, ${data.user.name}! 🎉`);
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { id: 'reg-name', name: 'name', label: 'Full Name', type: 'text', icon: <FiUser size={16} />, placeholder: 'John Doe', autoComplete: 'name' },
    { id: 'reg-email', name: 'email', label: 'Email Address', type: 'email', icon: <FiMail size={16} />, placeholder: 'you@example.com', autoComplete: 'email' },
    { id: 'reg-phone', name: 'phone', label: 'Phone Number (Optional)', type: 'tel', icon: <FiPhone size={16} />, placeholder: '+91 98765 43210', autoComplete: 'tel' },
  ];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 70% 50%, rgba(244,114,182,0.06) 0%, transparent 60%), var(--bg-primary)',
      padding: '40px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '20px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '14px',
              background: 'var(--gradient-primary)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '900', color: '#fff',
            }}>S</div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '700' }}>
              Style<span className="gradient-text">Hub</span>
            </span>
          </Link>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Join StyleHub and start shopping</p>
        </div>

        <div className="card" style={{ padding: '36px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {fields.map(field => (
              <div key={field.name} className="form-group">
                <label className="form-label">{field.label}</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    {field.icon}
                  </span>
                  <input
                    id={field.id}
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="form-input"
                    style={{ paddingLeft: '42px' }}
                    autoComplete={field.autoComplete}
                  />
                </div>
                {errors[field.name] && <span className="form-error">{errors[field.name]}</span>}
              </div>
            ))}

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="form-input"
                  style={{ paddingLeft: '42px', paddingRight: '44px' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="reg-confirm-password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                />
              </div>
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
            </div>

            <button id="register-submit-btn" type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: '4px' }}>
              {loading ? (
                <><span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Creating account...</>
              ) : (
                <>Create Account <FiArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="divider" />
          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
