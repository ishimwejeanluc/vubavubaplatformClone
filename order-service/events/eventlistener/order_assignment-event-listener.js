const { listen } = ("../../config/rabbitmq");
const eventListenService = require('../../services/event-listener-service');;

class OrderAssignmentEventListener {
  handleOrderAssigned() {
    const handlerMap = {
      'order.assigned': async (msg) => {
        const { orderId } = msg;
        await eventListenService.processOrderAssigned(orderId);
      }
    };
    listen(handlerMap);
  }
}

module.exports = OrderAssignmentEventListener;
