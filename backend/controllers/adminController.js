// controllers/adminController.js
// Admin panel — full CRUD for products, orders management, and user management

const db = require('../config/db');
const bcrypt = require('bcryptjs');

// ═══════════════════════════════════════════════════════════
// DASHBOARD OVERVIEW
// ═══════════════════════════════════════════════════════════

// GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const [[{ totalUsers }]] = await db.query("SELECT COUNT(*) as totalUsers FROM users WHERE role = 'user'");
    const [[{ totalProducts }]] = await db.query('SELECT COUNT(*) as totalProducts FROM products WHERE is_active = TRUE');
    const [[{ totalOrders }]] = await db.query('SELECT COUNT(*) as totalOrders FROM orders');
    const [[{ totalRevenue }]] = await db.query("SELECT COALESCE(SUM(total), 0) as totalRevenue FROM orders WHERE status != 'cancelled'");
    const [[{ pendingOrders }]] = await db.query("SELECT COUNT(*) as pendingOrders FROM orders WHERE status = 'pending'");

    // Recent orders
    const [recentOrders] = await db.query(
      `SELECT o.id, o.total, o.status, o.created_at, u.name as user_name, u.email as user_email
       FROM orders o JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC LIMIT 5`
    );

    return res.status(200).json({
      success: true,
      stats: { totalUsers, totalProducts, totalOrders, totalRevenue: parseFloat(totalRevenue), pendingOrders },
      recentOrders,
    });
  } catch (error) {
    console.error('GetDashboardStats error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ═══════════════════════════════════════════════════════════
// PRODUCT MANAGEMENT
// ═══════════════════════════════════════════════════════════

// GET /api/admin/products
const adminGetProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = search ? [`%${search}%`, `%${search}%`] : [];
    const where = search ? 'WHERE p.name LIKE ? OR p.description LIKE ?' : '';

    const [[{ total }]] = await db.query(`SELECT COUNT(*) as total FROM products p ${where}`, params);
    const [products] = await db.query(
      `SELECT p.*, c.name as category_name FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ${where} ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    return res.status(200).json({ success: true, products, total, page: parseInt(page) });
  } catch (error) {
    console.error('AdminGetProducts error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/admin/products
const createProduct = async (req, res) => {
  try {
    const { name, description, price, original_price, category_id, image_url, stock, is_featured, tags } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Name and price are required.' });
    }

    const [result] = await db.query(
      `INSERT INTO products (name, description, price, original_price, category_id, image_url, stock, is_featured, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, price, original_price || null, category_id || null, image_url || null, stock || 0, is_featured || false, tags || null]
    );

    return res.status(201).json({ success: true, message: 'Product created!', productId: result.insertId });
  } catch (error) {
    console.error('CreateProduct error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/admin/products/:id
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, original_price, category_id, image_url, stock, is_featured, tags, is_active } = req.body;

    await db.query(
      `UPDATE products SET name=?, description=?, price=?, original_price=?, category_id=?,
       image_url=?, stock=?, is_featured=?, tags=?, is_active=? WHERE id=?`,
      [name, description, price, original_price, category_id, image_url, stock, is_featured, tags, is_active ?? true, req.params.id]
    );

    return res.status(200).json({ success: true, message: 'Product updated!' });
  } catch (error) {
    console.error('UpdateProduct error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// DELETE /api/admin/products/:id
const deleteProduct = async (req, res) => {
  try {
    // Soft delete — just mark inactive
    await db.query('UPDATE products SET is_active = FALSE WHERE id = ?', [req.params.id]);
    return res.status(200).json({ success: true, message: 'Product deleted.' });
  } catch (error) {
    console.error('DeleteProduct error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ═══════════════════════════════════════════════════════════
// ORDER MANAGEMENT
// ═══════════════════════════════════════════════════════════

// GET /api/admin/orders
const adminGetOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = status ? 'WHERE o.status = ?' : '';
    const params = status ? [status] : [];

    const [[{ total }]] = await db.query(`SELECT COUNT(*) as total FROM orders o ${where}`, params);
    const [orders] = await db.query(
      `SELECT o.*, u.name as user_name, u.email as user_email
       FROM orders o JOIN users u ON o.user_id = u.id
       ${where} ORDER BY o.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    return res.status(200).json({ success: true, orders, total, page: parseInt(page) });
  } catch (error) {
    console.error('AdminGetOrders error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/admin/orders/:id
const adminGetOrderById = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, u.name as user_name, u.email as user_email
       FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?`,
      [req.params.id]
    );
    if (orders.length === 0) return res.status(404).json({ success: false, message: 'Order not found.' });

    const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);

    return res.status(200).json({ success: true, order: orders[0], items });
  } catch (error) {
    console.error('AdminGetOrderById error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/admin/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status.' });
    }

    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);

    return res.status(200).json({ success: true, message: `Order status updated to "${status}".` });
  } catch (error) {
    console.error('UpdateOrderStatus error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ═══════════════════════════════════════════════════════════
// USER MANAGEMENT
// ═══════════════════════════════════════════════════════════

// GET /api/admin/users
const adminGetUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = search ? 'WHERE name LIKE ? OR email LIKE ?' : '';
    const params = search ? [`%${search}%`, `%${search}%`] : [];

    const [[{ total }]] = await db.query(`SELECT COUNT(*) as total FROM users ${where}`, params);
    const [users] = await db.query(
      `SELECT id, name, email, role, phone, created_at FROM users ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    return res.status(200).json({ success: true, users, total, page: parseInt(page) });
  } catch (error) {
    console.error('AdminGetUsers error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/admin/users/:id/role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role.' });
    }
    await db.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    return res.status(200).json({ success: true, message: 'User role updated.' });
  } catch (error) {
    console.error('UpdateUserRole error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/admin/categories
const adminGetCategories = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories ORDER BY name ASC');
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = {
  getDashboardStats,
  adminGetProducts, createProduct, updateProduct, deleteProduct,
  adminGetOrders, adminGetOrderById, updateOrderStatus,
  adminGetUsers, updateUserRole, adminGetCategories
};
