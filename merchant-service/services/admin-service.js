const Merchant = require('../models/merchant');
const MenuItem = require('../models/menu-item');




class AdminService {

  // 👔 ADMIN MERCHANT MANAGEMENT
  async getAllMerchants() {
    try {
      const merchants = await Merchant.findAll();
      return { statusCode: 200, body: merchants };
    } catch (error) {
      return { statusCode: 500, body: { message: error.message } };
    }
  }

  async deactivateMerchant(merchantId) {
    try {
      const merchant = await Merchant.findByPk(merchantId);
      if (!merchant) {
        return { statusCode: 404, body: { message: "Merchant not found" } };
      }
      await merchant.update({ is_active: false });
      return { statusCode: 200, body: { message: "Merchant deactivated successfully" } };
    } catch (error) {
      return { statusCode: 500, body: { message: error.message } };
    }
  }

  async activateMerchant(merchantId) {
    try {
      const merchant = await Merchant.findByPk(merchantId);
      if (!merchant) {
        return { statusCode: 404, body: { message: "Merchant not found" } };
      }
      await merchant.update({ is_active: true });
      return { statusCode: 200, body: { message: "Merchant activated successfully" } };
    } catch (error) {
      return { statusCode: 500, body: { message: error.message } };
    }
  }

  // 👔 ADMIN MENU MANAGEMENT
  async getAllMenus() {
    try {
      const menus = await MenuItem.findAll();
      return { statusCode: 200, body: menus };
    } catch (error) {
      return { statusCode: 500, body: { message: error.message } };
    }
  }

  async getMenuItemsByMerchant(merchantId) {
    try {
      const menuItems = await MenuItem.findAll({
        where: { merchantId }
      });
      return { statusCode: 200, body: menuItems };
    } catch (error) {
      return { statusCode: 500, body: { message: error.message } };
    }
  }

}