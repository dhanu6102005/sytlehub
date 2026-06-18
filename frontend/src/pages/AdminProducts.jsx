// pages/AdminProducts.jsx
// Admin Product management panel with Create, Read, Update, and Delete operations

import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiX } from 'react-icons/fi';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category_id: '',
    image_url: '',
    stock: '',
    is_featured: false,
    is_active: true,
    tags: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [page, search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await adminAPI.getProducts({ search, page, limit: 10 });
      if (data.success) {
        setProducts(data.products || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      toast.error('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await adminAPI.getCategories();
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      original_price: '',
      category_id: categories[0]?.id || '',
      image_url: '',
      stock: '0',
      is_featured: false,
      is_active: true,
      tags: ''
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      original_price: product.original_price || '',
      category_id: product.category_id || '',
      image_url: product.image_url || '',
      stock: product.stock !== undefined ? String(product.stock) : '0',
      is_featured: !!product.is_featured,
      is_active: !!product.is_active,
      tags: product.tags || ''
    });
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error('Product Name and Price are required.');
      return;
    }

    try {
      setSaving(true);
      if (editingProduct) {
        // Update
        const { data } = await adminAPI.updateProduct(editingProduct.id, formData);
        if (data.success) {
          toast.success('Product updated successfully! 📦');
          setShowModal(false);
          fetchProducts();
        }
      } else {
        // Create
        const { data } = await adminAPI.createProduct(formData);
        if (data.success) {
          toast.success('Product created successfully! 📦');
          setShowModal(false);
          fetchProducts();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate/delete this product?')) return;
    try {
      const { data } = await adminAPI.deleteProduct(id);
      if (data.success) {
        toast.success('Product marked inactive.');
        fetchProducts();
      }
    } catch (error) {
      toast.error('Failed to delete product.');
    }
  };

  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '700', marginBottom: '8px' }}>
              Manage <span className="gradient-text">Products</span>
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Create, update, and view inventory items</p>
          </div>
          <button onClick={handleOpenAddModal} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <FiPlus /> Add Product
          </button>
        </div>

        {/* Filter bar */}
        <div className="card" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <FiSearch style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: 'var(--text-primary)', fontSize: '15px'
            }}
          />
        </div>

        {/* Products Table */}
        {loading ? (
          <Loader text="Loading products..." />
        ) : products.length === 0 ? (
          <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)' }}>No products found matching your search query.</p>
          </div>
        ) : (
          <div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>
                        <img
                          src={p.image_url || 'https://via.placeholder.com/40'}
                          alt={p.name}
                          style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                        />
                      </td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{p.name}</div>
                        {p.is_featured ? <span className="badge badge-pink" style={{ fontSize: '9px', padding: '2px 6px', marginTop: '4px' }}>Featured</span> : null}
                      </td>
                      <td>{p.category_name || '-'}</td>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>₹{Number(p.price).toLocaleString('en-IN')}</div>
                        {p.original_price ? (
                          <div style={{ fontSize: '12px', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                            ₹{Number(p.original_price).toLocaleString('en-IN')}
                          </div>
                        ) : null}
                      </td>
                      <td>
                        <span style={{ fontWeight: '500', color: p.stock <= 5 ? 'var(--accent-red)' : 'inherit' }}>
                          {p.stock}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${p.is_active ? 'badge-green' : 'badge-gray'}`}>
                          {p.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '8px' }}
                            title="Edit Product"
                          >
                            <FiEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '8px' }}
                            title="Deactivate Product"
                            disabled={!p.is_active}
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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

        {/* Create/Edit Modal overlay */}
        {showModal && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, backdropFilter: 'blur(4px)', padding: '24px'
          }}>
            <div className="card" style={{
              width: '100%', maxWidth: '650px', background: 'var(--bg-secondary)',
              maxHeight: '90vh', overflowY: 'auto', padding: '32px', position: 'relative'
            }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <FiX size={20} />
              </button>

              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>

              <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="form-input"
                    placeholder="Classic T-Shirt"
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Price (INR) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleFormChange}
                      className="form-input"
                      placeholder="999"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Original Price (Optional)</label>
                    <input
                      type="number"
                      name="original_price"
                      value={formData.original_price}
                      onChange={handleFormChange}
                      className="form-input"
                      placeholder="1499"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleFormChange}
                      className="form-select"
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock Units</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleFormChange}
                      className="form-input"
                      placeholder="50"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleFormChange}
                    className="form-input"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleFormChange}
                    className="form-input"
                    placeholder="shirt,cotton,casual"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="form-input"
                    style={{ minHeight: '80px', resize: 'vertical' }}
                    placeholder="Enter detailed description of the product"
                  />
                </div>

                <div style={{ display: 'flex', gap: '24px', margin: '8px 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleFormChange}
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                    Featured Product
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleFormChange}
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                    Active (Show in Store)
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
