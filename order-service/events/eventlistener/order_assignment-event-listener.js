const { listen } = ("../../config/rabbitmq");
const eventListenService = require('../../services/event-listener-service');;

class OrderAssignmentEventListener {
  static getHandler() {
    return {
      'order.assigned': async (msg) => {
        const { orderId } = msg;
        await eventListenService.processOrderAssigned(orderId);
      }
    };
  }
}

module.exports = OrderAssignmentEventListener;
