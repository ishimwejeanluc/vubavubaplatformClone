const { publish } = require('../../config/rabbitmq');

class OrderDeliveredEventPublisher {
  async publish({ assignmentId, riderId, orderId }) {
    await publish('order.delivered', { assignmentId, riderId, orderId });
  }
}

module.exports = OrderDeliveredEventPublisher;
