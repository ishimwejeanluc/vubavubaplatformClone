const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin-controller');
const menuController = require('../controllers/menu-controller');

// 👔 ADMIN ROUTES  (Menu)
router.get('/admin/allMenus', menuController.getAllMenus);
router.get('/admin/menubymerchant/:merchantId', menuController.getMerchantMenu); // GET /api/menu/admin/menubymerchant/:merchantId - Admin: Get merchant's menu items

// 👔 ADMIN ROUTES (Merchant)
router.get('/', adminController.getAllMerchants);                   // GET /api/merchants - Admin: Get all merchants
router.patch('/:id/deactivate', adminController.deactivateMerchant); // PATCH /api/merchants/:id/deactivate - Admin: Deactivate merchant
router.patch('/:id/activate', adminController.activateMerchant); // PATCH /api/merchants/:id/activate - Admin: Activate merchant

module.exports = router;
