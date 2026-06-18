// routes/admin.js
// Admin-only routes — require JWT + admin role

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const {
  getDashboardStats,
  adminGetProducts, createProduct, updateProduct, deleteProduct,
  adminGetOrders, adminGetOrderById, updateOrderStatus,
  adminGetUsers, updateUserRole, adminGetCategories
} = require('../controllers/adminController');

// Apply both auth + adminAuth to all admin routes
router.use(auth, adminAuth);

// Dashboard
router.get('/stats', getDashboardStats);

// Product Management
router.get('/products', adminGetProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Categories
router.get('/categories', adminGetCategories);

// Order Management
router.get('/orders', adminGetOrders);
router.get('/orders/:id', adminGetOrderById);
router.put('/orders/:id/status', updateOrderStatus);

// User Management
router.get('/users', adminGetUsers);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
