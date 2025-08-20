const Merchant = require('../models/merchant');
const MenuItem = require('../models/menu-item');
const { Op } = require('sequelize');

const menuService = {
  
  async createMenuItem(itemData) {
    try {
      // Verify merchant exists and is active
      const merchant = await Merchant.findByPk(itemData.merchant_id);
      
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
            message: 'Cannot add menu items to inactive merchant'
          }
        };
      }

      const menuItem = await MenuItem.create(itemData);

      return {
        statusCode: 201,
        body: {
          success: true,
          message: 'Menu item created successfully',
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

  async getMenuItemsByMerchant(merchantId) {
    try {
      const whereClause = { merchant_id: merchantId };

      const menuItems = await MenuItem.findAll({
        where: whereClause,
        include: [{
          model: Merchant,
          as: 'merchant',
          attributes: ['id', 'business_name', 'is_active']
        }],
        order: [['name', 'ASC']]
      });

      return {
        statusCode: 200,
        body: {
          success: true,
          data: {
            menuItems,
            total: menuItems.length
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

  async getMenuItem(itemId) {
    try {
      const menuItem = await MenuItem.findByPk(itemId, {
        include: [{
          model: Merchant,
          as: 'merchant',
          attributes: ['id', 'business_name', 'address', 'phone', 'is_active']
        }]
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

  async updateMenuItem(itemId, updateData) {
    try {
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

      await menuItem.update(updateData);

      return {
        statusCode: 200,
        body: {
          success: true,
          message: 'Menu item updated successfully',
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

  async deleteMenuItem(itemId) {
    try {
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

      await menuItem.destroy();

      return {
        statusCode: 200,
        body: {
          success: true,
          message: 'Menu item deleted successfully'
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

      const newAvailability = !menuItem.available;
      await menuItem.update({ available: newAvailability });

      return {
        statusCode: 200,
        body: {
          success: true,
          message: `Menu item ${newAvailability ? 'made available' : 'made unavailable'}`,
          data: {
            id: menuItem.id,
            name: menuItem.name,
            available: newAvailability
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

  // CUSTOMER BROWSING

  async browseAllMenus() {
    try {
      const whereClause = { available: true };

      const menuItems = await MenuItem.findAll({
        where: whereClause,
        include: [{
          model: Merchant,
          as: 'merchant',
          where: { is_active: true },
          attributes: ['id', 'business_name', 'address']
        }],
        order: [['name', 'ASC']]
      });

      return {
        statusCode: 200,
        body: {
          success: true,
          data: {
            menuItems,
            total: menuItems.length
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

  async browseMerchantMenu(merchantId, queryParams) {
    try {
      const { search, page = 1, limit = 20 } = queryParams;
      const offset = (page - 1) * limit;

      // Verify merchant exists and is active
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
            message: 'Merchant is currently inactive'
          }
        };
      }

      const whereClause = { 
        merchant_id: merchantId,
        available: true 
      };

      // Search by name or description
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { count, rows: menuItems } = await MenuItem.findAndCountAll({
        where: whereClause,
        include: [{
          model: Merchant,
          as: 'merchant',
          attributes: ['id', 'business_name', 'address', 'phone']
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['name', 'ASC']]
      });

      return {
        statusCode: 200,
        body: {
          success: true,
          data: {
            merchant: {
              id: merchant.id,
              business_name: merchant.business_name,
              address: merchant.address,
              phone: merchant.phone
            },
            menuItems,
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

  // ADMIN FEATURES

  async getAllMenus(queryParams) {
    try {
      const { page = 1, limit = 20, merchant_id, available, search } = queryParams;
      const offset = (page - 1) * limit;

      const whereClause = {};

      // Filter by merchant
      if (merchant_id) {
        whereClause.merchant_id = merchant_id;
      }

      // Filter by availability
      if (available !== undefined) {
        whereClause.available = available === 'true';
      }

      // Search by name
      if (search) {
        whereClause.name = {
          [Op.iLike]: `%${search}%`
        };
      }

      const { count, rows: menuItems } = await MenuItem.findAndCountAll({
        where: whereClause,
        include: [{
          model: Merchant,
          as: 'merchant',
          attributes: ['id', 'business_name', 'is_active']
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
            menuItems,
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
  }
};

module.exports = menuService;
