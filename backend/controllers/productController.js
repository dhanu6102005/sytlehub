// controllers/productController.js
// Handles all product & category related operations

const db = require('../config/db');

// ─── Get All Products (with search + category filter + pagination) ─────────────
// GET /api/products?search=&category=&page=&limit=&sort=
const getAllProducts = async (req, res) => {
  try {
    const { search = '', category = '', page = 1, limit = 12, sort = 'newest', featured } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereClause = 'WHERE p.is_active = TRUE';
    const params = [];

    if (search) {
      whereClause += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.tags LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (category) {
      whereClause += ' AND c.slug = ?';
      params.push(category);
    }

    if (featured === 'true') {
      whereClause += ' AND p.is_featured = TRUE';
    }

    let orderClause = 'ORDER BY p.created_at DESC';
    if (sort === 'price_asc') orderClause = 'ORDER BY p.price ASC';
    else if (sort === 'price_desc') orderClause = 'ORDER BY p.price DESC';
    else if (sort === 'rating') orderClause = 'ORDER BY p.rating DESC';
    else if (sort === 'popular') orderClause = 'ORDER BY p.reviews_count DESC';

    // Count total
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM products p LEFT JOIN categories c ON p.category_id = c.id ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Fetch products
    const [products] = await db.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ${whereClause}
       ${orderClause}
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    return res.status(200).json({
      success: true,
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('GetAllProducts error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── Get Single Product ───────────────────────────────────────────────────────
// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const [products] = await db.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ? AND p.is_active = TRUE`,
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Get related products from the same category
    const [related] = await db.query(
      `SELECT p.*, c.name as category_name FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.category_id = ? AND p.id != ? AND p.is_active = TRUE
       LIMIT 4`,
      [products[0].category_id, req.params.id]
    );

    return res.status(200).json({ success: true, product: products[0], related });
  } catch (error) {
    console.error('GetProductById error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── Get All Categories ───────────────────────────────────────────────────────
// GET /api/products/categories
const getCategories = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories ORDER BY name ASC');
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error('GetCategories error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getAllProducts, getProductById, getCategories };
