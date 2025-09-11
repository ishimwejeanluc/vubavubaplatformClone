class OrderResponseDto {
  constructor(order) {
    this.id = order.id;
    this.customer_id = order.customer_id;
    this.total_price = order.total_price;
    this.status = order.status;
    this.payment_status = order.payment_status;
  }
}

module.exports = OrderResponseDto;
