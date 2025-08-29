const { publish } = require('../../config/rabbitmq');

class OrderAssignedEventPublisher {
  async publish({ assignmentId, riderId, orderId }) {
    await publish('order.assigned', { assignmentId, riderId, orderId });
  }
}

module.exports = OrderAssignedEventPublisher;
