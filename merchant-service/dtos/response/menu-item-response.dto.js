class MenuItemResponseDto {
    constructor(menuItem) {
        this.id = menuItem.id;
        this.name = menuItem.name;
        this.description = menuItem.description;
        this.price = parseFloat(menuItem.price);
        this.available = menuItem.available;
        this.image_url = menuItem.image_url;
    }
}

module.exports = MenuItemResponseDto;
