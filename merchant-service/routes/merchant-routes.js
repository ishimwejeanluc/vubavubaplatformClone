const express = require('express');
const router = express.Router();
const MerchantController = require('../controllers/merchant-controller');

//  MERCHANT PROFILE MANAGEMENT
router.post('/', MerchantController.createMerchant);                    // POST /api/merchants - Create merchant profile
router.get('/merchantId', MerchantController.getMerchantProfile);             // GET /api/merchants/:id - Get merchant profile  
router.put('/:merchantId', MerchantController.updateMerchantProfile);          // PUT /api/merchants/:id - Update merchant profile

// MERCHANT MENU MANAGEMENT

router.post('/createMerchantMenu', MerchantController.createMenuItem);                       // POST /api/menu - Create menu item
router.get('/getAllMerchantMenus/:merchantId', MerchantController.getMerchantMenu);   // GET /api/menu/merchant/:merchantId - Get merchant's menu items
router.get('/getMenuItem/:menuId', MerchantController.getMenuItem);                        // GET /api/menu/:menuId - Get single menu item
router.put('/updateMenuItem/:menuId', MerchantController.updateMenuItem);                     // PUT /api/menu/:menuId - Update menu item



module.exports = router;
