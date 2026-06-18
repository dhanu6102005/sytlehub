// pages/AdminDashboard.jsx
// Admin Overview Dashboard with sales metrics and recent orders table

import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign, FiTrendingUp, FiArrowRight } from 'react-icons/fi';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getStats();
      if (res.data.success) {
        setData(res.data);
      }
    } catch (error) {
      toast.error('Failed to load admin statistics.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  if (loading) return <Loader fullPage text="Loading admin stats..." />;

  const stats = data?.stats || {};
  const recentOrders = data?.recentOrders || [];

  const cards = [
    { label: 'Total Revenue', val: `₹${stats.totalRevenue?.toLocaleString('en-IN')}`, icon: <FiDollarSign size={24} />, color: 'var(--accent-green)' },
    { label: 'Total Orders', val: stats.totalOrders, icon: <FiShoppingBag size={24} />, color: 'var(--accent-primary)' },
    { label: 'Products Active', val: stats.totalProducts, icon: <FiPackage size={24} />, color: 'var(--accent-pink)' },
    { label: 'Registered Customers', val: stats.totalUsers, icon: <FiUsers size={24} />, color: 'var(--accent-gold)' }
  ];

  return (
    <div className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '700', marginBottom: '8px' }}>
              Admin <span className="gradient-text">Console</span>
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>StyleHub performance dashboard</p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/admin/products" className="btn btn-ghost">Manage Products</Link>
            <Link to="/admin/orders" className="btn btn-primary">Manage Orders</Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {cards.map((card, i) => (
            <div key={i} className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</p>
                <h3 style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px' }}>{card.val}</h3>
              </div>
              <div style={{
                width: '56px', height: '56px', borderRadius: 'var(--radius-md)',
                background: `rgba(255,255,255,0.03)`, border: `1px solid var(--border-color)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: card.color
              }}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders Section */}
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiTrendingUp /> Recent Orders
            </h3>
            <Link to="/admin/orders" className="btn btn-ghost btn-sm">
              View All Orders <FiArrowRight />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No orders found.</p>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: '700' }}>#SH-{order.id}</td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{order.user_name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{order.user_email}</div>
                      </td>
                      <td>{new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</td>
                      <td style={{ fontWeight: '600' }}>₹{Number(order.total).toLocaleString('en-IN')}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <Link to={`/admin/orders?highlight=${order.id}`} className="btn btn-ghost btn-sm">
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
