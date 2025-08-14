const express = require('express');
const { authServiceProxy } = require('../middleware/proxies/index');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Public Auth Routes (no authentication required)
router.use(['/register', '/login'], authServiceProxy);

// Protected Auth Routes (JWT required)
router.use(['/logout', '/profile'], authenticateToken, authServiceProxy);

// Admin Auth Routes (JWT + Admin role required)
router.use('/admin', authenticateToken, requireAdmin, authServiceProxy);



module.exports = router;
