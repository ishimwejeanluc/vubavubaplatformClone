const { Merchant, MenuItem } = require('../models/association');

const menuService = {
  
  async createMerchant(merchantData) {
    try {
      // Check if user already has a merchant profile
      const existingMerchant = await Merchant.findOne({
        where: { user_id: merchantData.user_id }
      });

      if (existingMerchant) {
        return {
          statusCode: 400,
          body: {
            success: false,
            message: 'User already has a merchant profile'
          }
        };
      }

      // Check if business name already exists
      const existingBusiness = await Merchant.findOne({
        where: { business_name: merchantData.business_name }
      });

      if (existingBusiness) {
        return {
          statusCode: 400,
          body: {
            success: false,
            message: 'Business name already exists'
          }
        };
      }

      const merchant = await Merchant.create({
        ...merchantData,
        is_active: true
      });

      return {
        statusCode: 201,
        body: {
          success: true,
          message: 'Merchant profile created successfully',
          data: merchant
        }
      };
    } catch (error) {
      console.error('Service error:', error);
      return {
        statusCode: 500,
        body: {
          success: false,
          message: 'Internal server error',
          error: error.message
        }
      };
    }
  },

  async getMerchantById(merchantId) {
    try {
      const merchant = await Merchant.findByPk(merchantId, {
        include: [{
          model: MenuItem,
          as: 'menuItems',
          attributes: ['id', 'name', 'price', 'available', 'image_url']
        }]
      });

      if (!merchant) {
        return {
          statusCode: 404,
          body: {
            success: false,
            message: 'Merchant not found'
          }
        };
      }

      return {
        statusCode: 200,
        body: {
          success: true,
          data: merchant
        }
      };
    } catch (error) {
      console.error('Service error:', error);
      return {
        statusCode: 500,
        body: {
          success: false,
          message: 'Internal server error',
          error: error.message
        }
      };
    }
  },

  async getMerchantByUserId(userId) {
    try {
      const merchant = await Merchant.findOne({
        where: { user_id: userId },
        include: [{
          model: MenuItem,
          as: 'menuItems',
          attributes: ['id', 'name', 'price', 'available', 'image_url']
        }]
      });

      if (!merchant) {
        return {
          statusCode: 404,
          body: {
            success: false,
            message: 'Merchant profile not found for this user'
          }
        };
      }

      return {
        statusCode: 200,
        body: {
          success: true,
          data: merchant
        }
      };
    } catch (error) {
      console.error('Service error:', error);
      return {
        statusCode: 500,
        body: {
          success: false,
          message: 'Internal server error',
          error: error.message
        }
      };
    }
  },

  async updateMerchant(merchantId, updateData) {
    try {
      const merchant = await Merchant.findByPk(merchantId);

      if (!merchant) {
        return {
          statusCode: 404,
          body: {
            success: false,
            message: 'Merchant not found'
          }
        };
      }

      // Check if business name already exists (if updating business_name)
      if (updateData.business_name && updateData.business_name !== merchant.business_name) {
        const existingBusiness = await Merchant.findOne({
          where: { 
            business_name: updateData.business_name,
            id: { [Op.ne]: merchantId }
          }
        });

        if (existingBusiness) {
          return {
            statusCode: 400,
            body: {
              success: false,
              message: 'Business name already exists'
            }
          };
        }
      }

      await merchant.update(updateData);

      return {
        statusCode: 200,
        body: {
          success: true,
          message: 'Merchant profile updated successfully',
          data: merchant
        }
      };
    } catch (error) {
      console.error('Service error:', error);
      return {
        statusCode: 500,
        body: {
          success: false,
          message: 'Internal server error',
          error: error.message
        }
      };
    }
  },

  // 👔 ADMIN FEATURES

  async getAllMerchants(queryParams) {
    try {
      const { page = 1, limit = 10, status, search } = queryParams;
      const offset = (page - 1) * limit;

      const whereClause = {};

      // Filter by status
      if (status) {
        whereClause.is_active = status === 'active';
      }

      // Search by business name
      if (search) {
        whereClause.business_name = {
          [Op.iLike]: `%${search}%`
        };
      }

      const { count, rows: merchants } = await Merchant.findAndCountAll({
        where: whereClause,
        include: [{
          model: MenuItem,
          as: 'menuItems',
          attributes: ['id', 'name', 'price', 'available']
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return {
        statusCode: 200,
        body: {
          success: true,
          data: {
            merchants,
            pagination: {
              total: count,
              page: parseInt(page),
              limit: parseInt(limit),
              totalPages: Math.ceil(count / limit)
            }
          }
        }
      };
    } catch (error) {
      console.error('Service error:', error);
      return {
        statusCode: 500,
        body: {
          success: false,
          message: 'Internal server error',
          error: error.message
        }
      };
    }
  },

  async toggleMerchantStatus(merchantId) {
    try {
      const merchant = await Merchant.findByPk(merchantId);

      if (!merchant) {
        return {
          statusCode: 404,
          body: {
            success: false,
            message: 'Merchant not found'
          }
        };
      }

      const newStatus = !merchant.is_active;
      await merchant.update({ is_active: newStatus });

      return {
        statusCode: 200,
        body: {
          success: true,
          message: `Merchant ${newStatus ? 'activated' : 'deactivated'} successfully`,
          data: { 
            id: merchant.id,
            business_name: merchant.business_name,
            is_active: newStatus 
          }
        }
      };
    } catch (error) {
      console.error('Service error:', error);
      return {
        statusCode: 500,
        body: {
          success: false,
          message: 'Internal server error',
          error: error.message
        }
      };
    }
  },

  async deleteMerchant(merchantId) {
    try {
      const merchant = await Merchant.findByPk(merchantId);

      if (!merchant) {
        return {
          statusCode: 404,
          body: {
            success: false,
            message: 'Merchant not found'
          }
        };
      }

      await merchant.destroy(); // Will cascade delete menu items

      return {
        statusCode: 200,
        body: {
          success: true,
          message: 'Merchant deleted successfully'
        }
      };
    } catch (error) {
      console.error('Service error:', error);
      return {
        statusCode: 500,
        body: {
          success: false,
          message: 'Internal server error',
          error: error.message
        }
      };
    }
  },

  async activateMerchant(merchantId) {
    try {
      const merchant = await Merchant.findByPk(merchantId);

      if (!merchant) {
        return {
          statusCode: 404,
          body: {
            success: false,
            message: 'Merchant not found'
          }
        };
      }

      if (merchant.is_active) {
        return {
          statusCode: 400,
          body: {
            success: false,
            message: 'Merchant is already active'
          }
        };
      }

      await merchant.update({ is_active: true });

      return {
        statusCode: 200,
        body: {
          success: true,
          message: 'Merchant activated successfully',
          data: {
            id: merchant.id,
            business_name: merchant.business_name,
            is_active: true
          }
        }
      };
    } catch (error) {
      console.error('Service error:', error);
      return {
        statusCode: 500,
        body: {
          success: false,
          message: 'Internal server error',
          error: error.message
        }
      };
    }
  },

  async deactivateMerchant(merchantId) {
    try {
      const merchant = await Merchant.findByPk(merchantId);

      if (!merchant) {
        return {
          statusCode: 404,
          body: {
            success: false,
            message: 'Merchant not found'
          }
        };
      }

      if (!merchant.is_active) {
        return {
          statusCode: 400,
          body: {
            success: false,
            message: 'Merchant is already inactive'
          }
        };
      }

      await merchant.update({ is_active: false });

      return {
        statusCode: 200,
        body: {
          success: true,
          message: 'Merchant deactivated successfully',
          data: {
            id: merchant.id,
            business_name: merchant.business_name,
            is_active: false
          }
        }
      };
    } catch (error) {
      console.error('Service error:', error);
      return {
        statusCode: 500,
        body: {
          success: false,
          message: 'Internal server error',
          error: error.message
        }
      };
    }
  },

  async getMenuItemById(itemId) {
    try {
      console.log(`[MENU SERVICE] Getting menu item by ID: ${itemId}`);

      const menuItem = await MenuItem.findByPk(itemId, {
        include: [
          {
            model: Merchant,
            as: 'merchant',
            attributes: ['id', 'business_name', 'is_active']
          }
        ]
      });

      if (!menuItem) {
        return {
          statusCode: 404,
          body: {
            success: false,
            message: 'Menu item not found'
          }
        };
      }

      return {
        statusCode: 200,
        body: {
          success: true,
          message: 'Menu item retrieved successfully',
          data: menuItem
        }
      };
    } catch (error) {
      console.error('Service error:', error);
      return {
        statusCode: 500,
        body: {
          success: false,
          message: 'Internal server error',
          error: error.message
        }
      };
    }
  },

  async toggleAvailability(itemId) {
    try {
      console.log(`🔄 [MENU SERVICE] Toggling availability for item: ${itemId}`);

      const menuItem = await MenuItem.findByPk(itemId);

      if (!menuItem) {
        return {
          statusCode: 404,
          body: {
            success: false,
            message: 'Menu item not found'
          }
        };
      }

      // Store the current state before toggling
      const previousAvailability = menuItem.available;
      
      // Toggle the availability
      const newAvailability = !menuItem.available;
      await menuItem.update({ available: newAvailability });

      // Refresh the menuItem to get updated data
      await menuItem.reload();

      return {
        statusCode: 200,
        body: {
          success: true,
          message: `Menu item ${newAvailability ? 'made available' : 'made unavailable'} successfully`,
          data: {
            id: menuItem.id,
            name: menuItem.name,
            available: menuItem.available, // This will now be the updated value
            previousState: previousAvailability,
            newState: newAvailability
          }
        }
      };
    } catch (error) {
      console.error('Service error:', error);
      return {
        statusCode: 500,
        body: {
          success: false,
          message: 'Internal server error',
          error: error.message
        }
      };
    }
  },

  
};

module.exports = menuService;
