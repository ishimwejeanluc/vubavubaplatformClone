class CreateMenuItemRequestDto {
    constructor(data) {
        this.name = data.name;
        this.price = data.price;
        this.description = data.description;
        this.merchant_id = data.merchant_id;
    }
}
module.exports = CreateMenuItemRequestDto;