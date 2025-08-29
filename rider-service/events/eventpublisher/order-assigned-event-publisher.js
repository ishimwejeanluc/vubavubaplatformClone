const { publish } = require('../../config/rabbitmq');

class OrderAssignedEventPublisher {
  async publish({ assignmentId, riderId, orderId }) {
    await publish('rider.assigned', { assignmentId, riderId, orderId });
  }
}

module.exports = OrderAssignedEventPublisher;
