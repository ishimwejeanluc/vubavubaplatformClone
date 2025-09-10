const Merchant = require("../models/merchant");
const MenuItem = require("../models/menu-item");
const { 
  MerchantResponseDto,
  CreateMenuItemResponseDto,
  ProfileResponseDto,
  MerchantMenuResponseDto,
  MenuItemResponseDto,
  UpdateMenuItemRequestDto
} = require("../dtos");

const { 
  ResourceAlreadyExistsException, 
  ResourceNotFoundException
} = require("../exceptions");

class MerchantService {
  // Create merchant (used by routes)
  async createMerchant(data) {
    // Check if user already has a merchant profile
    const existingMerchant = await Merchant.findOne({
      where: { user_id: data.user_id }
    });

    if (existingMerchant) {
      throw new ResourceAlreadyExistsException("Merchant with this ID already exists");
    }

    // Check if business name already exists
    const existingBusiness = await Merchant.findOne({
      where: { business_name: data.business_name }
    });

    if (existingBusiness) {
      throw new ResourceAlreadyExistsException('Business name already exists');
    }

    const merchant = await Merchant.create({
      ...data,
      is_active: true
    });

    return new MerchantResponseDto(merchant);
  }


    async updateMerchant(merchantId, data) {
    const merchant = await Merchant.findByPk(merchantId);
    if (!merchant) {
      throw new ResourceNotFoundException("Merchant not found");
    }

    // Check if business name already exists (excluding current merchant)
    if (data.business_name && data.business_name !== merchant.business_name) {
      const existingBusiness = await Merchant.findOne({
        where: { 
          business_name: data.business_name,
          id: { [require('sequelize').Op.ne]: merchantId }
        }
      });
      if (existingBusiness) {
        throw new ResourceAlreadyExistsException('Business name already exists');
      }
    }

    const updatedMerchant = await merchant.update(data);
    return new MerchantResponseDto(updatedMerchant);
  }

  // Get merchant profile by user_id (used by routes for getting merchant profile)
  async getMerchantProfile(userId) {
    const merchant = await Merchant.findOne({
      where: { user_id: userId }
    });
    
    if (!merchant) {
      throw new ResourceNotFoundException("Merchant profile not found");
    }
    
    return new ProfileResponseDto(merchant);
  }

  async createMenuItem(data) {
  
    const merchant = await Merchant.findByPk(data.merchant_id);
    if (!merchant) {
      throw new ResourceNotFoundException("Merchant not found");
    }
    
    if (!merchant.is_active) {
      throw new ResourceNotFoundException("Merchant is not active");
    }
    
    // Check if menu item with same name already exists for this merchant
    const existingMenuItem = await MenuItem.findOne({
      where: { 
        name: data.name,
        merchant_id: data.merchant_id
      }
    });
    
    if (existingMenuItem) {
      throw new ResourceAlreadyExistsException("Menu item with this name already exists for this merchant");
    }
    
    // Create the menu item
    const menuItem = await MenuItem.create({
      name: data.name,
      price: data.price,
      description: data.description,
      merchant_id: data.merchant_id,
      available: true
    });
    
    return new CreateMenuItemResponseDto(menuItem);
  }

  async getMerchantMenu(merchantId) {
    // Check if merchant exists
    const merchant = await Merchant.findByPk(merchantId);
    if (!merchant) {
      throw new ResourceNotFoundException("Merchant not found");
    }
    
    // Check if merchant is active
    if (!merchant.is_active) {
      throw new ResourceNotFoundException("Merchant is not active");
    }
    
    // Get all menu items for this merchant
    const menuItems = await MenuItem.findAll({
      where: { merchant_id: merchantId },
      order: [['createdAt', 'DESC']]
    });
    
    // If no menu items found, throw an error or return empty menu
    if (!menuItems || menuItems.length === 0) {
      throw new ResourceNotFoundException("No menu items found for this merchant");
    }
    
    return new MerchantMenuResponseDto(merchantId, menuItems);
  }

  async getMenuItemById(itemId) {
    // Find the menu item by ID
    const menuItem = await MenuItem.findByPk(itemId);
    if (!menuItem) {
      throw new ResourceNotFoundException("Menu item not found");
    }
    
    // Check if the merchant is active
    const merchant = await Merchant.findByPk(menuItem.merchant_id);
    if (!merchant) {
      throw new ResourceNotFoundException("Merchant not found");
    }
    
    if (!merchant.is_active) {
      throw new ResourceNotFoundException("Merchant is not active");
    }
    
    return new MenuItemResponseDto(menuItem);
  }

  async updateMenuItem(itemId, data) {
  
    
    // Find the menu item by ID
    const menuItem = await MenuItem.findByPk(itemId);
    if (!menuItem) {
      throw new ResourceNotFoundException("Menu item not found");
    }
    
    // Check if the merchant exists and is active
    const merchant = await Merchant.findByPk(menuItem.merchant_id);
    if (!merchant) {
      throw new ResourceNotFoundException("Merchant not found");
    }
    
    if (!merchant.is_active) {
      throw new ResourceNotFoundException("Merchant is not active");
    }
    
    // Update only the fields that are provided
    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.available !== undefined) updateData.available = data.available;
    if (data.image_url !== undefined) updateData.image_url = data.image_url;

    const updatedMenuItem = await menuItem.update(updateData);
    return new MenuItemResponseDto(updatedMenuItem);
  }

}

  

module.exports = new MerchantService();
