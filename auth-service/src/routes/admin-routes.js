const express = require('express');
const adminController = require('../controllers/admin-contoller');

const router = express.Router();

// Admin user management routes
router.get('/api/users/admin', adminController.getAllUsers);
router.get('/api/users/admin/:id', adminController.getUser);
router.put('/api/users/admin/:id', adminController.updateUser);
router.put('/api/users/admin/:id/deactivate', adminController.deactivateUser);
router.put('/api/users/admin/:id/activate', adminController.activateUser);

module.exports = router;
