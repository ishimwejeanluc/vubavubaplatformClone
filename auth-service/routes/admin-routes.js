const express = require('express');
const adminController = require('../controllers/admin-contoller');

const router = express.Router();

// Admin user management routes
router.get('/', adminController.getAllUsers);
router.get('/:id', adminController.getUser);
router.put('/:id', adminController.updateUser);
router.put('/:id/deactivate', adminController.deactivateUser);
router.put('/:id/activate', adminController.activateUser);

module.exports = router;
