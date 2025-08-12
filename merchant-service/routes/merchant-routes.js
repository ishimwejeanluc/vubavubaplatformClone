const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchant-controller');

// 🏪 MERCHANT PROFILE MANAGEMENT
router.post('/', merchantController.createMerchant);                    // POST /api/merchants - Create merchant profile
router.get('/:user_id', merchantController.getMerchantProfile);             // GET /api/merchants/:id - Get merchant profile  
router.put('/:id', merchantController.updateMerchantProfile);          // PUT /api/merchants/:id - Update merchant profile

// 🛍️ MERCHANT MENU MANAGEMENT

router.post('/', menuController.createMenuItem);                       // POST /api/menu - Create menu item
router.get('/getAllmenus/:merchantId', menuController.getMerchantMenu);   // GET /api/menu/merchant/:merchantId - Get merchant's menu items
router.get('/:menuId', menuController.getMenuItem);                        // GET /api/menu/:menuId - Get single menu item
router.put('/:menuId', menuController.updateMenuItem);                     // PUT /api/menu/:menuId - Update menu item
router.delete('/:menuId', menuController.deleteMenuItem);                  // DELETE /api/menu/:menuId - Delete menu item
router.patch('/:menuId/toggle-availability', menuController.toggleAvailability) // PATCH /api/menu/:menuId/toggle-availability - Toggle menu item availability


module.exports = router;
