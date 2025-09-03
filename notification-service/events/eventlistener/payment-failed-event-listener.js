const EventListenerService = require('../../services/event-listener-service');

class PaymentFailedEventListener {
  static getHandler() {
    return {
      'payment.failed': async (msg) => {
        console.log('[Notification] payment.failed event received:', msg);
  await EventListenerService.handlePaymentFailed(msg);
      }
    };
  }
}

module.exports = PaymentFailedEventListener;
