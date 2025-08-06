const express = require('express');
const authController = require('../controllers/auth-controller');

const router = express.Router();

// CRUD routes
router.post('/users/login', authController.login);
router.post('/users/register', authController.register);
router.get('/users/forgot-password', authController.forgotPassword);
router.put('/users/reset-password', authController.resetPassword);

module.exports = router;