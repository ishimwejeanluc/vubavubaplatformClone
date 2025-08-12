const merchantService = require('../services/merchant-service');

class MerchantController  {
  

  async createMerchant(req, res) {
    try {
    
      const result = await merchantService.createMerchant(req.body);
      res.status(result.statusCode).json(result.body);
    } catch (error) {
      console.error('Create merchant profile error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to create merchant profile',
        error: error.message 
      });
    }
  }

  
  async getMerchantProfile(req, res) {
    try {
      const result = await merchantService.getMerchantById(req.params.id);
      res.status(result.statusCode).json(result.body);
    } catch (error) {
      console.error(' Get merchant profile error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch merchant profile',
        error: error.message 
      });
    }
  }

  // Update merchant profile
  async updateMerchantProfile(req, res) {
    try {
      const result = await merchantService.updateMerchant(req.params.id, req.body);
      res.status(result.statusCode).json(result.body);
    } catch (error) {
      console.error('Update merchant profile error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update merchant profile',
        error: error.message 
      });
    }
  }
    
   // MENU MANAGEMENT

   async toggleAvailability(req, res) {
       try {
         const result = await menuService.toggleAvailability(req.params.id);
         res.status(result.statusCode).json(result.body);
       } catch (error) {
         console.error('Check availability error:', error);
         res.status(500).json({ 
           success: false, 
           message: 'Failed to check availability',
           error: error.message 
         });
       }
     }  

  async getMerchantMenu(req, res) {
    try {
     
      const result = await menuService.getMenuItemsByMerchant(req.params.merchantId);
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
    async deleteMenuItem(req, res) {
    try {
      console.log(`🗑️ Deleting menu item ${req.params.id}...`);
      const result = await menuService.deleteMenuItem(req.params.id);
      res.status(result.statusCode).json(result.body);
    } catch (error) {
      console.error('Delete menu item error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to delete menu item',
        error: error.message 
      });
    }
  }
};

module.exports = new MerchantController();