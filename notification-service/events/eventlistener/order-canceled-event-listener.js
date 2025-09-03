const EventListenerService = require('../../services/event-listener-service');

class OrderCanceledEventListener {
  static getHandler() {
    return {
      'order.canceled': async (msg) => {
        console.log('[Notification] order.canceled event received:', msg);
  await EventListenerService.handleOrderCanceled(msg);
      }
    };
  }
}

module.exports = OrderCanceledEventListener;
