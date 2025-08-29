const { listen } = require('../../config/rabbitmq');
const eventListenService = require('../../services/event-listener-service');;

class OrderDeliveredEventListener {
  static getHandler() {
    return {
      'order.delivered': async (msg) => {
        const { orderId } = msg;
        await eventListenService.processOrderDelivered(orderId);
      }
    };
  }
}

module.exports = OrderDeliveredEventListener;
