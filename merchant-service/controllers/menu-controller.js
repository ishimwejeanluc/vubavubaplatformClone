const menuService = require('../services/menu-service');

class MenuController  {
   
  // Browse all available menus (Customer)
  async browseMenus(req, res) {
    try {
     
      const result = await menuService.browseAllMenus();
      res.status(result.statusCode).json(result.body);
    } catch (error) {
      console.error(' Browse menus error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to browse menus',
        error: error.message 
      });
    }
  }

  // Browse menu by merchant (Customer)
  async browseMerchantMenu(req, res) {
    try {
      
      const result = await menuService.browseMerchantMenu(req.params.merchantId, req.query);
      res.status(result.statusCode).json(result.body);
    } catch (error) {
      console.error(' Browse merchant menu error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to browse merchant menu',
        error: error.message 
      });
    }
   }
}
  

module.exports = new MenuController();
