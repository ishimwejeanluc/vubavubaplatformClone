const { listen } = require('../../config/rabbitmq');
const riderService = require('../../services/rider-service');

class OrderReadyEventListener {
  handleOrderReady() {
    const handlerMap = {
      'order.ready': async (msg) => {
        const { orderId } = msg;
        await riderService.processOrderReady(orderId);
      }
    };
    listen(handlerMap);
  }
}


module.exports = OrderReadyEventListener;
