const express = require('express');
const { authServiceProxy } = require('../middleware/proxy');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Public Auth Routes (no authentication required)
router.use('/users/auth/register', authServiceProxy);
router.use('/users/auth/login', authServiceProxy);


// Protected Auth Routes (JWT required)
router.use('/users/auth/logout', authenticateToken, authServiceProxy);
router.use('/users/auth/profile', authenticateToken, authServiceProxy);

// Admin Routes (JWT + Admin role required)
router.use('/users/admin/*', authenticateToken, requireAdmin, authServiceProxy);



module.exports = router;
