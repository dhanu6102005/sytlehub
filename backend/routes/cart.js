// routes/cart.js
// Cart routes — all protected (require JWT)

const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const auth = require('../middleware/auth');

// All cart routes are protected
router.use(auth);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove/:id', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;
