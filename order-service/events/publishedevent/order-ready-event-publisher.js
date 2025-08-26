const { publish } = require('../../config/rabbitmq');

class OrderReadyEventPublisher {
  async publish({ orderId, merchantId, amount }) {
    await publish('order.ready', { orderId, merchantId, amount });
  }
}

module.exports = OrderReadyEventPublisher;
