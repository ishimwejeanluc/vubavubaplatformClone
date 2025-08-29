const { listen } = require('../../config/rabbitmq');
const eventListenService = require('../../services/event-listener-service');;

class OrderDeliveredEventListener {
  static getHandler() {
    return {
      'rider.delivered': async (msg) => {
        console.log('Order delivered event received:', msg);
        const { orderId } = msg;
        await eventListenService.processOrderDelivered(orderId);
      }
    };
  }
}

module.exports = OrderDeliveredEventListener;
