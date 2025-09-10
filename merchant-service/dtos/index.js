// Request DTOs
const CreateMerchantRequestDto = require('./request/create-merchant-request.dto');
const UpdateMerchantRequestDto = require('./request/update-merchant-request.dto');
const CreateMenuItemRequestDto = require('./request/create- menuitem-request.dto');
const UpdateMenuItemRequestDto = require('./request/update-menuitem-request.dto');

// Response DTOs
const CreateMerchantResponseDto = require('./response/create-merchant-response.dto');
const MenuItemResponseDto = require('./response/menu-item-response.dto');
const ProfileResponseDto = require('./response/profile-response.dto');
const CreateMenuItemResponseDto = require('./response/create-menu-item-response.dto');
const MerchantMenuResponseDto = require('./response/merchant-menu-response.dto');

module.exports = {
  // Request DTOs
  CreateMerchantRequestDto,
  UpdateMerchantRequestDto,
  CreateMenuItemRequestDto,
  UpdateMenuItemRequestDto,
  
  // Response DTOs
  CreateMerchantResponseDto,
  MenuItemResponseDto,
  CreateMenuItemResponseDto,
  ProfileResponseDto,
  MerchantMenuResponseDto
};
