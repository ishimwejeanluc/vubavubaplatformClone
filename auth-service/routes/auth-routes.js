const express = require('express');
const authController = require('../controllers/auth-controller');

const router = express.Router();

// CRUD routes
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/forgot-password', authController.forgotPassword);
router.put('/reset-password', authController.resetPassword);

module.exports = router;