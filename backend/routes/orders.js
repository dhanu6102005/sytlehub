// routes/orders.js
// Order routes — all protected (require JWT)

const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getOrderById } = require('../controllers/orderController');
const auth = require('../middleware/auth');

// All order routes are protected
router.use(auth);

router.post('/place', placeOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);

module.exports = router;
