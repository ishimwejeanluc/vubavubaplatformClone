const EventListenerService = require('../../services/event-listener-service');

class DeliveryDeliveredEventListener {
  static getHandler() {
    return {
      'rider.delivered': async (msg) => {
        console.log('[Notification] rider.delivered event received:', msg);
  await EventListenerService.handleDeliveryDelivered(msg);
      }
    };
  }
}

module.exports = DeliveryDeliveredEventListener;
