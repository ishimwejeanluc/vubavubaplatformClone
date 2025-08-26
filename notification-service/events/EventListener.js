
const { listen } = require('../config/rabbitmq');

class EventListener {
  async onOrderPlaced(handler) {
    await listen(['order.placed'], handler);
  }
  async onPaymentSuccess(handler) {
    await listen(['payment.success'], handler);
  }
  async onPaymentFailed(handler) {
    await listen(['payment.failed'], handler);
  }
  async onOrderReady(handler) {
    await listen(['order.ready'], handler);
  }
  async onAssignmentCreated(handler) {
    await listen(['assignment.created'], handler);
  }
  async onDeliveryAccepted(handler) {
    await listen(['delivery.accepted'], handler);
  }
  async onDeliveryDelivered(handler) {
    await listen(['delivery.delivered'], handler);
  }
  async onOrderCanceled(handler) {
    await listen(['order.canceled'], handler);
  }
}

module.exports = EventListener;
