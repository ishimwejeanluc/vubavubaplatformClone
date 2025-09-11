class OrderHistoryDto {
  constructor(orders) {
    // Categorize order history by order_id - categorization done in DTO
    orders.forEach(order => {
      this[order.id] = {
        order_id: order.id,
        total_price: parseFloat(order.total_price).toFixed(2),
        delivery_address: order.delivery_address,
        payment_status: order.payment_status,
        history: (order.orderHistory || []).map(item => ({
          id: item.id,
          status: item.status,
          createdAt: item.createdAt
        }))
      };
    });
  }
}

module.exports = OrderHistoryDto;
