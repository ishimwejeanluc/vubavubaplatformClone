const { publish } = require('../../config/rabbitmq');

class OrderDeliveredEventPublisher {
  async publish({ assignmentId, riderId, orderId }) {
    await publish('rider.delivered', { assignmentId, riderId, orderId });
  }
}

module.exports = OrderDeliveredEventPublisher;
