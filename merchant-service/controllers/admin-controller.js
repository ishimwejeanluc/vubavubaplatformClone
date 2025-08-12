const  adminService = require('../services/adminService')

class AdminController  {
 

    //Get all menus (Admin)
  async getAllMenus(req, res) {
    try {
      console.log('📋 Admin: Getting all menus...');
      const result = await adminService.getAllMenus();
      res.status(result.statusCode).json(result.body);
    } catch (error) {
      console.error('Get all menus error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch all menus',
        error: error.message 
      });
    }
  }

    async getMerchantMenu(req, res) {
    try {
     
      const result = await adminService.getMenuItemsByMerchant(req.params.merchantId);
      res.status(result.statusCode).json(result.body);
    } catch (error) {
      console.error(' Get merchant menu error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch menu items',
        error: error.message 
      });
    }
  }
 
   // MERCHANT MANAGEMENT

   async getAllMerchants(req, res) { 
    try {
      const result = await adminService.getAllMerchants();
      res.status(result.statusCode).json(result.body);
    } catch (error) {
      console.error('Get all merchants error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch all merchants',
        error: error.message 
      });
    }
   }
   async deactivateMerchant(req, res) {
    try {
      const result = await adminService.deactivateMerchant(req.params.id);
      res.status(result.statusCode).json(result.body);
    } catch (error) {
      console.error('Deactivate merchant error:', error);
      res.status(400).json({ 
        success: false, 
        message: 'Failed to deactivate merchant',
        error: error.message 
      });
    }
  }

    async activateMerchant(req, res) {
        try {
        const result = await adminService.activateMerchant(req.params.id);
        res.status(result.statusCode).json(result.body);
        } catch (error) {
        console.error('Activate merchant error:', error);
        res.status(400).json({ 
            success: false, 
            message: 'Failed to activate merchant',
            error: error.message 
        });
        }
    }
}
module.exports = new AdminController();
