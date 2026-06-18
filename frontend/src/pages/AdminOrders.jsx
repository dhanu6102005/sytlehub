// pages/AdminOrders.jsx
// Admin Order management page to view all transactions, update statuses, and check item details

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { adminAPI } from '../services/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { FiChevronDown, FiChevronUp, FiMapPin, FiShoppingBag, FiTruck, FiFilter } from 'react-icons/fi';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Detail View State
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [detailsLoading, setDetailsLoading] = useState(false);

  const location = useLocation();

  // Read highlight query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const highlightId = params.get('highlight');
    if (highlightId) {
      handleExpandOrder(Number(highlightId));
    }
  }, [location]);

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await adminAPI.getOrders({ status: statusFilter, page, limit: 10 });
      if (data.success) {
        setOrders(data.orders || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleExpandOrder = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    setExpandedOrderId(orderId);

    // Fetch details if not already cached
    if (!orderDetails[orderId]) {
      try {
        setDetailsLoading(true);
        const { data } = await adminAPI.getOrderById(orderId);
        if (data.success) {
          setOrderDetails(prev => ({
            ...prev,
            [orderId]: {
              order: data.order,
              items: data.items
            }
          }));
        }
      } catch (error) {
        toast.error('Failed to load order details.');
      } finally {
        setDetailsLoading(false);
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await adminAPI.updateOrderStatus(orderId, newStatus);
      if (data.success) {
        toast.success(`Status updated to "${newStatus}"`);
        // Refresh local orders list
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        // Refresh expanded cache if present
        if (orderDetails[orderId]) {
          setOrderDetails(prev => ({
            ...prev,
            [orderId]: {
              ...prev[orderId],
              order: { ...prev[orderId].order, status: newStatus }
            }
          }));
        }
      }
    } catch (error) {
      toast.error('Failed to update status.');
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

  const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '700', marginBottom: '8px' }}>
              Manage <span className="gradient-text">Orders</span>
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Monitor client transactions and shipping status</p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="card" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary)' }}>
            <FiFilter /> Filter Status:
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setStatusFilter(''); setPage(1); }}
              className={`btn btn-sm ${statusFilter === '' ? 'btn-primary' : 'btn-ghost'}`}
            >
              All
            </button>
            {statusOptions.map(st => (
              <button
                key={st}
                onClick={() => { setStatusFilter(st); setPage(1); }}
                className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-ghost'}`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        {loading ? (
          <Loader text="Loading orders..." />
        ) : orders.length === 0 ? (
          <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)' }}>No orders found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map(order => {
              const isExpanded = expandedOrderId === order.id;
              const details = orderDetails[order.id];

              return (
                <div key={order.id} className="card" style={{ padding: '24px', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Order ID</span>
                        <span style={{ fontWeight: '700', fontSize: '15px' }}>#SH-{order.id}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Customer</span>
                        <span style={{ fontWeight: '600', fontSize: '14px' }}>{order.user_name}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block' }}>{order.user_email}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Total Amount</span>
                        <span style={{ fontWeight: '700', fontSize: '15px', color: 'var(--accent-primary)' }}>₹{Number(order.total).toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Status</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`badge ${getStatusBadgeClass(order.status)}`}
                          style={{
                            border: 'none',
                            outline: 'none',
                            cursor: 'pointer',
                            padding: '4px 12px',
                            fontWeight: '600',
                            borderRadius: 'var(--radius-full)'
                          }}
                        >
                          {statusOptions.map(st => (
                            <option key={st} value={st} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{st}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={() => handleExpandOrder(order.id)}
                      className="btn btn-ghost btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      {isExpanded ? (
                        <>Hide Details <FiChevronUp /></>
                      ) : (
                        <>View Details <FiChevronDown /></>
                      )}
                    </button>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                      {detailsLoading && !details ? (
                        <Loader text="Loading order details..." />
                      ) : details ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                          {/* Shipping Details */}
                          <div>
                            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)' }}>
                              <FiMapPin /> Shipping Details
                            </h4>
                            <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <p style={{ fontWeight: '600' }}>{details.order.shipping_name}</p>
                              <p style={{ color: 'var(--text-secondary)' }}>{details.order.shipping_address}</p>
                              <p style={{ color: 'var(--text-secondary)' }}>
                                {details.order.shipping_city}, {details.order.shipping_state} - {details.order.shipping_zip}
                              </p>
                              <p style={{ color: 'var(--text-secondary)' }}>Phone: {details.order.shipping_phone}</p>
                              {details.order.shipping_email && <p style={{ color: 'var(--text-secondary)' }}>Email: {details.order.shipping_email}</p>}
                            </div>

                            <h4 style={{ fontSize: '16px', fontWeight: '700', marginTop: '24px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)' }}>
                              <FiTruck /> Transaction Info
                            </h4>
                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                              Payment Method: <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{details.order.payment_method}</span>
                            </p>
                            {details.order.notes && (
                              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                                <strong>Notes:</strong> {details.order.notes}
                              </p>
                            )}
                          </div>

                          {/* Order Items */}
                          <div style={{ gridColumn: 'span 2' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)' }}>
                              <FiShoppingBag /> Items ordered
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              {details.items.map(item => (
                                <div key={item.id} style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '16px',
                                  padding: '16px',
                                  background: 'rgba(255, 255, 255, 0.02)',
                                  borderRadius: 'var(--radius-md)',
                                  border: '1px solid var(--border-color)'
                                }}>
                                  <img
                                    src={item.product_image}
                                    alt={item.product_name}
                                    style={{ width: '60px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                                  />
                                  <div style={{ flex: 1 }}>
                                    <h5 style={{ fontSize: '14px', fontWeight: '600' }}>{item.product_name}</h5>
                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                      ₹{Number(item.price).toLocaleString('en-IN')} x {item.quantity}
                                    </p>
                                  </div>
                                  <span style={{ fontWeight: '700', fontSize: '15px' }}>
                                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p style={{ color: 'var(--text-muted)' }}>Could not load details.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Simple Pagination */}
            {total > 10 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '32px', alignItems: 'center' }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-ghost btn-sm"
                >
                  Previous
                </button>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Page {page} of {Math.ceil(total / 10)}</span>
                <button
                  onClick={() => setPage(p => (p * 10 < total ? p + 1 : p))}
                  disabled={page * 10 >= total}
                  className="btn btn-ghost btn-sm"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
