const express = require('express');
const adminController = require('../controllers/admin-controller');
const router = express.Router();

// Admin routes for delivery management
router.post('/assign-delivery', adminController.assignDeliveryToRider);
router.get('/available-riders', adminController.getAvailableRiders);
router.get('/delivery-assignments', adminController.getAllDeliveryAssignments);
router.get('/delivery-assignments/order/:orderId', adminController.getDeliveryByOrderId);
router.patch('/delivery-assignments/:assignmentId/status', adminController.updateDeliveryStatus);

module.exports = router;

