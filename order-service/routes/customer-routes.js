const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer-controller');

// Customer Routes

// Create a new order (after payment is completed)
router.post('/createOrder',  customerController.createOrder);

// Get customer's own orders
router.get('/', customerController.getCustomerOrders);

// Get specific order by ID (customer can only view their own orders)
router.get('/:orderId',  customerController.getOrderById);

// Cancel order (customer can cancel their own orders)
router.put('/cancel/:orderId',  customerController.cancelOrder);

// Get order history (customer can view their own order history)
router.get('/history/:orderId',  customerController.getOrderHistory);

module.exports = router;
