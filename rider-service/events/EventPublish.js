// EventPublish.js for Rider Service
// Publishes:
// - delivery.accepted: { assignmentId, riderId, orderId }
// - delivery.delivered: { assignmentId, riderId, orderId }

const {publish} = require('../config/rabbitmq');

class EventPublisher {  
  async deliveryAccepted({ assignmentId, riderId, orderId }) {
    await publish('delivery.accepted', { assignmentId, riderId, orderId });
  }

  async deliveryDelivered({ assignmentId, riderId, orderId }) {
    await this.publish('delivery.delivered', { assignmentId, riderId, orderId });
  }
}

module.exports = EventPublisher;
