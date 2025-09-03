const EventListenerService = require('../../services/event-listener-service');

class OrderReadyEventListener {
  static getHandler() {
    return {
      'order.ready': async (msg) => {
        console.log('[Notification] order.ready event received:', msg);
  await EventListenerService.handleOrderReady(msg);
      }
    };
  }
}

module.exports = OrderReadyEventListener;
