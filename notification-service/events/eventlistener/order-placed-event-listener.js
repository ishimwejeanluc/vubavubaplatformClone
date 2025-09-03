const EventListenerService = require('../../services/event-listener-service');

class OrderPlacedEventListener {
  static getHandler() {
    return {
      'order.placed': async (msg) => {
        console.log('[Notification] order.placed event received:', msg);
  await EventListenerService.handleOrderPlaced(msg);
      }
    };
  }
}

module.exports = OrderPlacedEventListener;
