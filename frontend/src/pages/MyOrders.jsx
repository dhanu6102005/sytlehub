// pages/MyOrders.jsx
// Order history page where users can view their past orders, status, and details

import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { FiBox, FiCalendar, FiMapPin, FiTruck, FiChevronDown, FiChevronUp, FiShoppingBag } from 'react-icons/fi';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await orderAPI.getMyOrders();
      if (data.success) {
        setOrders(data.orders || []);
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

    // Fetch details if not already fetched
    if (!orderDetails[orderId]) {
      try {
        setDetailsLoading(true);
        const { data } = await orderAPI.getOrderById(orderId);
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

  if (loading) return <Loader fullPage text="Loading your orders..." />;

  return (
    <div className="section">
      <div className="container">
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '700', marginBottom: '8px' }}>
          My <span className="gradient-text">Orders</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '36px' }}>
          Track and view your order history
        </p>

        {orders.length === 0 ? (
          <div className="empty-state">
            <FiBox size={72} />
            <h3>No orders found</h3>
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map(order => {
              const isExpanded = expandedOrderId === order.id;
              const details = orderDetails[order.id];

              return (
                <div key={order.id} className="card" style={{ padding: '24px', overflow: 'hidden' }}>
                  {/* Order summary header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}>
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                      <div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Order ID</span>
                        <span style={{ fontWeight: '700', fontSize: '15px' }}>#SH-{order.id}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Placed On</span>
                        <span style={{ fontWeight: '500', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FiCalendar size={14} /> {new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Total Price</span>
                        <span style={{ fontWeight: '700', fontSize: '15px', color: 'var(--accent-primary)' }}>
                          ₹{Number(order.total).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Status</span>
                        <span className={`badge ${getStatusBadgeClass(order.status)}`} style={{ marginTop: '4px' }}>
                          {order.status}
                        </span>
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
                              <FiMapPin /> Delivery Address
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
                              <FiTruck /> Payment Info
                            </h4>
                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                              Method: <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{details.order.payment_method}</span>
                            </p>
                            {details.order.notes && (
                              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                                <strong>Note:</strong> {details.order.notes}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
