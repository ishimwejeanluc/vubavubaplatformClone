class CreateOrderRequestDto {
  constructor(data) {
    this.customer_id = data.customer_id;
    this.merchant_id = data.merchant_id;
    this.delivery_address = data.delivery_address;
    this.total_price = data.total_price;
    this.orderItems = data.orderItems || [];
    this.orderItems = this.orderItems.map(item => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        unit_price: item.unit_price
      }));
    }
  }


module.exports = CreateOrderRequestDto;
