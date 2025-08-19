const express = require('express');
const router = express.Router();
const { riderServiceProxy } = require('../middleware/proxies/index');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Admin routes for delivery management (requires admin role)
router.use('/admin', authenticateToken, requireAdmin, riderServiceProxy);

// Rider routes (accessible by riders and admins)
router.use('/', authenticateToken, riderServiceProxy);

module.exports = router;