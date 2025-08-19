const express = require('express');
const riderController = require('../controllers/rider-controller');
const router = express.Router();

// Rider profile management
router.post('/', riderController.createRider);
router.get('/user/:userId', riderController.getRiderByUserId);
router.get('/:riderId', riderController.getRiderById);
router.patch('/user/:userId/profile', riderController.updateRiderProfile);

// Rider availability
router.patch('/user/:userId/availability', riderController.updateAvailability);

// Rider delivery management
router.get('/user/:userId/deliveries/history', riderController.getDeliveryHistory);
router.get('/user/:userId/deliveries/current', riderController.getCurrentDelivery);

module.exports = router;
