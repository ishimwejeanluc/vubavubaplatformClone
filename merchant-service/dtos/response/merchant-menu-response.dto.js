const MenuItemResponseDto = require('./menu-item-response.dto');

class MerchantMenuResponseDto {
    constructor(merchantId, menuItems) {
        this.merchant_id = merchantId;
        this.total_items = menuItems.length;
        this.available_items = menuItems.filter(item => item.available).length;
        this.menu_items = menuItems.map(item => new MenuItemResponseDto(item));
    }
}

module.exports = MerchantMenuResponseDto;
