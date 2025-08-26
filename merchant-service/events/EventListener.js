
const { listen } = require('../config/rabbitmq');

class EventListener {
  async onOrderPlaced(handler) {
    await listen(['order.placed'], handler);
  }

  async onOrderCanceled(handler) {
    await listen(['order.canceled'], handler);
  }
}

module.exports = EventListener;
