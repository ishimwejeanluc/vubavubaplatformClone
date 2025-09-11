const { publish } = require('../../config/rabbitmq');

class OrderReadyEventPublisher {
  async publish({ orderId, merchantId, userId }) {
    await publish('order.ready', { orderId, merchantId, userId });
  }
}

module.exports = OrderReadyEventPublisher;
