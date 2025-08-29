const { listen } = require('../../config/rabbitmq');
const eventListenService = require('../../services/event-listener-service');;

class OrderDeliveredEventListener {
  handleOrderDelivered() {
    const handlerMap = {
      'order.delivered': async (msg) => {
        const { orderId } = msg;
        await eventListenService.processOrderDelivered(orderId);
      }
    };
    listen(handlerMap);
  }
}

module.exports = OrderDeliveredEventListener;
