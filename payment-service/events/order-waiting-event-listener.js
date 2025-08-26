
const { listen } = require('../config/rabbitmq');
const paymentService = require('../services/payment-service');




class OrderWaitingEventListener {
  handleOrderWaitingPayment() {
    const handlerMap = {
      'order.waiting': async (msg) => {
      try {
        console.log(`[EVENT LISTENED] order.waiting for orderId: ${msg.orderId}`);
        await paymentService.handleOrderWaitingPayment(msg.orderId, msg.amount);
      } catch (eventError) {
        console.error(`[EVENT ERROR] Failed to process order.waiting event.`, eventError);
      }
    }
  };
  listen(handlerMap);
  }
}

module.exports = OrderWaitingEventListener;
