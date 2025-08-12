const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu-controller');


router.get('/', menuController.browseMenus);                   
router.get('/browse/:merchantId', menuController.browseMerchantMenu);


module.exports = router;
