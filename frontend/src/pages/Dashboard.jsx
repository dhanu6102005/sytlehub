// pages/Dashboard.jsx
// User Profile Dashboard to view and edit details

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiEdit2, FiSave, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await authAPI.getMe();
      if (data.success) {
        setProfile(data.user);
        setFormData({
          name: data.user.name || '',
          phone: data.user.phone || '',
          address: data.user.address || ''
        });
      }
    } catch (error) {
      toast.error('Failed to fetch profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const { data } = await authAPI.updateProfile(formData);
      if (data.success) {
        toast.success('Profile updated successfully! ✨');
        setIsEditing(false);
        updateUser({ name: formData.name }); // Sync auth context state
        await fetchProfile();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader fullPage text="Loading dashboard..." />;

  return (
    <div className="section">
      <div className="container">
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '700', marginBottom: '8px' }}>
          User <span className="gradient-text">Dashboard</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '36px' }}>
          Manage your account profile and activities
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start' }}>
          {/* Profile Details Card */}
          <div className="card" style={{ padding: '32px', gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiUser /> Personal Information
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-ghost btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FiEdit2 size={14} /> Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-input"
                    style={{ minHeight: '100px', resize: 'vertical' }}
                    placeholder="Enter delivery address"
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    <FiSave /> {submitting ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: profile?.name || '',
                        phone: profile?.phone || '',
                        address: profile?.address || ''
                      });
                    }}
                    className="btn btn-ghost"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(167,139,250,0.1)', display: 'flex', alignItems: 'center', justify: 'center', color: 'var(--accent-primary)', flexShrink: 0 }}>
                    <FiUser size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Full Name</span>
                    <h4 style={{ fontSize: '16px', fontWeight: '600' }}>{profile?.name}</h4>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(167,139,250,0.1)', display: 'flex', alignItems: 'center', justify: 'center', color: 'var(--accent-primary)', flexShrink: 0 }}>
                    <FiMail size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Email Address</span>
                    <h4 style={{ fontSize: '16px', fontWeight: '600' }}>{profile?.email}</h4>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(167,139,250,0.1)', display: 'flex', alignItems: 'center', justify: 'center', color: 'var(--accent-primary)', flexShrink: 0 }}>
                    <FiPhone size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Phone Number</span>
                    <h4 style={{ fontSize: '16px', fontWeight: '600' }}>{profile?.phone || 'Not provided'}</h4>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(167,139,250,0.1)', display: 'flex', alignItems: 'center', justify: 'center', color: 'var(--accent-primary)', flexShrink: 0 }}>
                    <FiMapPin size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Default Shipping Address</span>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', lineHeight: '1.4' }}>{profile?.address || 'Not provided'}</h4>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Joined info */}
            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <FiCalendar size={36} style={{ color: 'var(--accent-primary)', marginBottom: '12px' }} />
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Member Since</p>
              <h4 style={{ fontSize: '18px', fontWeight: '700', marginTop: '4px' }}>
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }) : '-'}
              </h4>
            </div>

            {/* Quick links */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link to="/orders" className="btn btn-ghost btn-full" style={{ justifyContent: 'space-between' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}><FiShoppingBag /> View My Orders</span>
                  <FiArrowRight />
                </Link>
                <Link to="/cart" className="btn btn-ghost btn-full" style={{ justifyContent: 'space-between' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}><FiShoppingBag /> Open Shopping Cart</span>
                  <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
