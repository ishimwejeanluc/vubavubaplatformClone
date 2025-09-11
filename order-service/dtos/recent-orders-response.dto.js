class RecentOrdersResponseDto {
  constructor(orders) {
    this.orders = orders.map(order => ({
      id: order.id,
      status: order.status,
      totalPrice: parseFloat(order.total_price),
      paymentStatus: order.payment_status,
      createdAt: order.createdAt,
      itemsCount: order.orderItems ? order.orderItems.length : 0,
      firstItem: order.orderItems && order.orderItems.length > 0 ? {
        quantity: order.orderItems[0].quantity,
        unitPrice: parseFloat(order.orderItems[0].unit_price)
      } : null,
      lastStatusUpdate: order.orderHistory && order.orderHistory.length > 0 
        ? order.orderHistory[0].createdAt 
        : order.createdAt
    }));
  }
}

module.exports = RecentOrdersResponseDto;
