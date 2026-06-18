// routes/products.js
// Product and category routes — all public

const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, getCategories } = require('../controllers/productController');

// GET /api/products/categories  — must be before /:id
router.get('/categories', getCategories);

// GET /api/products?search=&category=&page=&limit=&sort=&featured=
router.get('/', getAllProducts);

// GET /api/products/:id
router.get('/:id', getProductById);

module.exports = router;
