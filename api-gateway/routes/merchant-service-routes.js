const express = require('express');
const router = express.Router();
const { merchantServiceProxy } = require('../middleware/proxies/index');
const { authenticateToken, requireCustomer,requireAdmin , requireMerchant} = require('../middleware/auth');

//admin Merchant Routes (JWT + Admin role required)
router.use('/admin', authenticateToken, requireAdmin, merchantServiceProxy);

// Merchant Routes (JWT + Merchant role required)  
router.use('', authenticateToken, requireMerchant, merchantServiceProxy);

// Public Menu Browsing Routes (JWT + Customer role required)
router.use(['/','/browse/:merchantId'], authenticateToken, requireCustomer, merchantServiceProxy);

module.exports = router;