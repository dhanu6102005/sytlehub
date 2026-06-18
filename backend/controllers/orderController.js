// controllers/orderController.js
// Handles placing orders, fetching order history, and order details

const db = require('../config/db');

// ─── Place Order ──────────────────────────────────────────────────────────────
// POST /api/orders/place  [Protected]
const placeOrder = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const {
      shipping_name, shipping_email, shipping_phone,
      shipping_address, shipping_city, shipping_state, shipping_zip,
      payment_method = 'COD', notes
    } = req.body;

    // Validate required shipping fields
    if (!shipping_name || !shipping_address || !shipping_city) {
      return res.status(400).json({ success: false, message: 'Shipping details are required.' });
    }

    // Fetch user's cart items
    const [cartItems] = await connection.query(
      `SELECT c.quantity, p.id as product_id, p.name, p.image_url, p.price, p.stock
       FROM cart c JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );

    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Your cart is empty.' });
    }

    // Check stock availability and calculate total
    let total = 0;
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        await connection.rollback();
        return res.status(400).json({ success: false, message: `Insufficient stock for "${item.name}".` });
      }
      total += item.price * item.quantity;
    }

    // Create order record
    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, total, shipping_name, shipping_email, shipping_phone,
        shipping_address, shipping_city, shipping_state, shipping_zip, payment_method, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, total.toFixed(2), shipping_name, shipping_email, shipping_phone,
       shipping_address, shipping_city, shipping_state, shipping_zip, payment_method, notes]
    );

    const orderId = orderResult.insertId;

    // Insert order items + update stock
    for (const item of cartItems) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, price)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.name, item.image_url, item.quantity, item.price]
      );
      await connection.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
    }

    // Clear user's cart
    await connection.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully! 🎉',
      orderId,
      total: parseFloat(total.toFixed(2)),
    });
  } catch (error) {
    await connection.rollback();
    console.error('PlaceOrder error:', error);
    return res.status(500).json({ success: false, message: 'Server error while placing order.' });
  } finally {
    connection.release();
  }
};

// ─── Get My Orders ────────────────────────────────────────────────────────────
// GET /api/orders/my  [Protected]
const getMyOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, COUNT(oi.id) as item_count
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('GetMyOrders error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── Get Order Details ────────────────────────────────────────────────────────
// GET /api/orders/:id  [Protected]
const getOrderById = async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const [items] = await db.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [req.params.id]
    );

    return res.status(200).json({ success: true, order: orders[0], items });
  } catch (error) {
    console.error('GetOrderById error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById };
