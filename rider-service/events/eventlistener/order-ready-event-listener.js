const { listen } = require('../../config/rabbitmq');
const riderService = require('../../services/rider-service');

class OrderReadyEventListener {
  handleOrderReady() {
    const handlerMap = {
      'order.ready': async (msg) => {
        const { orderId, merchantId } = msg;
        await riderService.processOrderReady(orderId, merchantId);
      }
    };
    listen(handlerMap);
  }
}


module.exports = OrderReadyEventListener;
