const { publish } = require('../../config/rabbitmq');

class OrderReadyEventPublisher {
  async publish({ orderId, merchantId}) {
    await publish('order.ready', { orderId, merchantId });
  }
}

module.exports = OrderReadyEventPublisher;
