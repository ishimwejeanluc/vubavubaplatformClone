
const { publish } = require('../config/rabbitmq');

class EventPublisher {
  async paymentSuccess({ paymentId, orderId, amount }) {
    await publish('payment.success', { paymentId, orderId, amount});
  }

  async paymentFailed({ paymentId, orderId, error }) {
    await publish('payment.failed', { paymentId, orderId, error });
  }
}

module.exports = EventPublisher;
