const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchant-controller');

//  MERCHANT PROFILE MANAGEMENT
router.post('/', merchantController.createMerchant);                    // POST /api/merchants - Create merchant profile
router.get('/:user_id', merchantController.getMerchantProfile);             // GET /api/merchants/:id - Get merchant profile  
router.put('/:merchantId', merchantController.updateMerchantProfile);          // PUT /api/merchants/:id - Update merchant profile

// MERCHANT MENU MANAGEMENT

router.post('/createMerchantMenu', merchantController.createMenuItem);                       // POST /api/menu - Create menu item
router.get('/getAllMerchantMenus/:merchantId', merchantController.getMerchantMenu);   // GET /api/menu/merchant/:merchantId - Get merchant's menu items
router.get('/getMenuItem/:menuId', merchantController.getMenuItem);                        // GET /api/menu/:menuId - Get single menu item
router.put('/updateMenuItem/:menuId', merchantController.updateMenuItem);                     // PUT /api/menu/:menuId - Update menu item
router.delete('/:menuId', merchantController.deleteMenuItem);                  // DELETE /api/menu/:menuId - Delete menu item
router.patch('/:menuId/toggle-availability', merchantController.toggleAvailability) // PATCH /api/menu/:menuId/toggle-availability - Toggle menu item availability


module.exports = router;
