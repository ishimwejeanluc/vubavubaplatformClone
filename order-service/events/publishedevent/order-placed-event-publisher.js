const { publish } = require('../../config/rabbitmq');

class OrderPlacedEventPublisher {
  async publish({ orderId, orderMenu, amount }) {
    await publish('order.placed', { orderId, orderMenu, amount });
  }
}

module.exports = OrderPlacedEventPublisher;
