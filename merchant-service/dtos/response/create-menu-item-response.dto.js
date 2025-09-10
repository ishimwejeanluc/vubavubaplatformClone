class CreateMenuItemResponseDto {
    constructor(menuItem) {
        this.id = menuItem.id;
        this.merchant_id = menuItem.merchant_id;
        this.name = menuItem.name;
    }
}

module.exports = CreateMenuItemResponseDto;
