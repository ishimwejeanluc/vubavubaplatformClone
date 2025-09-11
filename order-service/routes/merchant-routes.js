const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchant-controller');

// Get merchant order statistics (dashboard analytics)
router.get('/statistics', merchantController.getOrderStatistics);

// Get specific order by ID (merchant can only view their own orders)
router.get('/:orderId', merchantController.getOrderById);

// Update order status (merchant can update status of their orders)
router.put('/status/:orderId', merchantController.updateOrderStatus);

// Cancel order (merchant can cancel orders assigned to them)
router.put('/cancel/:orderId', merchantController.cancelOrder);

// Get order history (merchant can view order history for their orders)
router.get('/history/:orderId', merchantController.getOrderHistory);

module.exports = router;
