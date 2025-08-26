
const { listen } = require('../config/rabbitmq');

class EventListener {
   
  async onOrderWaitingPayment(handler) {
    await listen(['order.waiting'], handler);
  }
}

module.exports = EventListener;
