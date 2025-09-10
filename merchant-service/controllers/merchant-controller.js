const merchantService = require('../services/merchant-service');
const { CreateMerchantRequestDto, UpdateMerchantRequestDto, CreateMenuItemRequestDto, UpdateMenuItemRequestDto } = require('../dtos');
const ApiResponse = require('../utils/api-response');

class MerchantController {
  async createMerchant(req, res, next) {
    try {
      const createMerchantDto = new CreateMerchantRequestDto(req.body);
      const result = await merchantService.createMerchant(createMerchantDto);
      
      res.status(201).json(new ApiResponse(
        true,
        "Merchant created successfully",
        result
      ));
    } catch (error) {
      next(error);
    }
  }



  async getMerchantProfile(req, res, next) {
    try {
      const { user_id } = req.params;
      const result = await merchantService.getMerchantProfile(user_id);
      
      res.status(200).json(new ApiResponse(
        true,
        "Merchant profile retrieved successfully",
        result
      ));
    } catch (error) {
      next(error);
    }
  }

  async updateMerchantProfile(req, res, next) {
    try {
      const { merchantId } = req.params;
      const updateMerchantDto = new UpdateMerchantRequestDto(req.body);
      const result = await merchantService.updateMerchant(merchantId, updateMerchantDto);
      
      res.status(200).json(new ApiResponse(
        true,
        "Merchant profile updated successfully",
        result
      ));
    } catch (error) {
      next(error);
    }
  }

 
  async createMenuItem(req, res, next) {
    try {
      const createMenuItemDto = new CreateMenuItemRequestDto(req.body);
      const result = await merchantService.createMenuItem(createMenuItemDto);
      
      res.status(201).json(new ApiResponse(
        true,
        "Menu item created successfully",
        result
      ));
    } catch (error) {
      next(error);
    }
  }

  async getMerchantMenu(req, res, next) {
    try {
      const { merchantId } = req.params;
      const result = await merchantService.getMerchantMenu(merchantId);
      res.status(200).json(new ApiResponse(
        true,
        "Merchant menu retrieved successfully",
        result
      ));
    } catch (error) {
      next(error);
    }
  }

  async getMenuItem(req, res, next) {
    try {
      const { menuId } = req.params;
      const result = await merchantService.getMenuItemById(menuId);
      res.status(200).json(new ApiResponse(
        true,
        "Menu item retrieved successfully",
        result
      ));
    } catch (error) {
      next(error);
    }
  }

  async updateMenuItem(req, res, next) {
    try {
      const { menuId } = req.params;
      const updateMenuItemDto = new UpdateMenuItemRequestDto(req.body);
      const result = await merchantService.updateMenuItem(menuId, updateMenuItemDto);
      res.status(200).json(new ApiResponse(
        true,
        "Menu item updated successfully",
        result
      ));
    } catch (error) {
      next(error);
    }
  }

  
}

module.exports = new MerchantController();
