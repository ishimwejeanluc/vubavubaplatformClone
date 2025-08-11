const express = require('express');
const adminController = require('../controllers/admin-contoller');

const router = express.Router();

// Admin user management routes
router.get('/getAll', adminController.getAllUsers);
router.get('/getUsers/:id', adminController.getUser);
router.put('/update/:id', adminController.updateUser);
router.patch('/deactivate/:id', adminController.deactivateUser);
router.patch('/activate/:id', adminController.activateUser);

module.exports = router;
