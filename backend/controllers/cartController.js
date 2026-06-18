// controllers/cartController.js
// Handles cart operations for authenticated users

const db = require('../config/db');

// ─── Get User Cart ────────────────────────────────────────────────────────────
// GET /api/cart  [Protected]
const getCart = async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT c.id, c.quantity, c.product_id,
              p.name, p.price, p.original_price, p.image_url, p.stock
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return res.status(200).json({ success: true, items, total: parseFloat(total.toFixed(2)) });
  } catch (error) {
    console.error('GetCart error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── Add Item to Cart ─────────────────────────────────────────────────────────
// POST /api/cart/add  [Protected]
const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    // Check product exists and has stock
    const [products] = await db.query('SELECT id, stock FROM products WHERE id = ? AND is_active = TRUE', [product_id]);
    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    if (products[0].stock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock.' });
    }

    // Insert or update cart item (upsert)
    await db.query(
      `INSERT INTO cart (user_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [req.user.id, product_id, quantity]
    );

    return res.status(200).json({ success: true, message: 'Item added to cart!' });
  } catch (error) {
    console.error('AddToCart error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── Update Cart Item Quantity ────────────────────────────────────────────────
// PUT /api/cart/update  [Protected]
const updateCartItem = async (req, res) => {
  try {
    const { cart_id, quantity } = req.body;

    if (!cart_id || !quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Valid cart ID and quantity required.' });
    }

    // Verify the cart item belongs to this user
    const [items] = await db.query('SELECT id FROM cart WHERE id = ? AND user_id = ?', [cart_id, req.user.id]);
    if (items.length === 0) {
      return res.status(404).json({ success: false, message: 'Cart item not found.' });
    }

    await db.query('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, cart_id, req.user.id]);

    return res.status(200).json({ success: true, message: 'Cart updated.' });
  } catch (error) {
    console.error('UpdateCartItem error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── Remove Item from Cart ────────────────────────────────────────────────────
// DELETE /api/cart/remove/:id  [Protected]
const removeFromCart = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Cart item not found.' });
    }

    return res.status(200).json({ success: true, message: 'Item removed from cart.' });
  } catch (error) {
    console.error('RemoveFromCart error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── Clear Entire Cart ────────────────────────────────────────────────────────
// DELETE /api/cart/clear  [Protected]
const clearCart = async (req, res) => {
  try {
    await db.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    return res.status(200).json({ success: true, message: 'Cart cleared.' });
  } catch (error) {
    console.error('ClearCart error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
