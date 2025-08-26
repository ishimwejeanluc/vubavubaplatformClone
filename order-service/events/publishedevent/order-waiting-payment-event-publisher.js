const { publish } = require('../../config/rabbitmq');

class OrderWaitingPaymentEventPublisher {
  async publish({ orderId, amount }) {
    await publish('order.waiting', { orderId, amount });
  }
}

module.exports = OrderWaitingPaymentEventPublisher;
