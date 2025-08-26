const express = require('express');
const router = express.Router();
const {paymentServiceProxy}  = require('../middleware/proxies/index');
const { authenticateToken, requireCustomer } = require('../middleware/auth');


// customer make payments
router.use('/', authenticateToken, requireCustomer, paymentServiceProxy);

module.exports = router;