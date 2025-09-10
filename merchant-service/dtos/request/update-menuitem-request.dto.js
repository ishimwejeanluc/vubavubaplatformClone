class UpdateMenuItemRequestDto {
    constructor(data) {
        this.name = data.name;
        this.price = data.price;
        this.description = data.description;
    }
}

module.exports = UpdateMenuItemRequestDto;
