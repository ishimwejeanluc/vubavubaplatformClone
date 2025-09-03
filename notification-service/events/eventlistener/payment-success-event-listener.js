const EventListenerService = require('../../services/event-listener-service');

class PaymentSuccessEventListener {
  static getHandler() {
    return {
      'payment.success': async (msg) => {
        console.log('[Notification] payment.success event received:', msg);
  await EventListenerService.handlePaymentSuccess(msg);
      }
    };
  }
}

module.exports = PaymentSuccessEventListener;
