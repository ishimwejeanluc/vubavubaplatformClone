const express = require('express');
const router = express.Router();
const { orderServiceProxy } = require('../middleware/proxies/index');
const { authenticateToken, requireCustomer, requireMerchant } = require('../middleware/auth');


// Customers can create, view, and cancel their own orders
router.use('/customer', authenticateToken, requireCustomer, orderServiceProxy);

// Merchant order routes (for /api/orders/merchant/*)  

router.use('/merchant', authenticateToken, requireMerchant, orderServiceProxy);

module.exports = router;