const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment-controller');

// Pay endpoint
router.post('/pay', paymentController.pay);

module.exports = router;
