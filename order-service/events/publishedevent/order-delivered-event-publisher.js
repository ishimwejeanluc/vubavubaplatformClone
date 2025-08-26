const { publish } = require('../../config/rabbitmq');

class OrderDeliveredEventPublisher {
  async publish({ orderId, riderId, customerId, amount }) {
    await publish('order.delivered', { orderId, riderId, customerId, amount });
  }
}

module.exports = OrderDeliveredEventPublisher;
