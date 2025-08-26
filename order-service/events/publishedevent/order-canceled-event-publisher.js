const { publish } = require('../../config/rabbitmq');

class OrderCanceledEventPublisher {
  async publish({ orderId, orderMenu, amount }) {
    await publish('order.canceled', { orderId, orderMenu, amount });
  }
}

module.exports = OrderCanceledEventPublisher;
