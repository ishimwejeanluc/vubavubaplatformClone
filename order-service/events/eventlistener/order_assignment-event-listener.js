const eventListenService = require('../../services/event-listener-service');;

class OrderAssignmentEventListener {
  static getHandler() {
    return {
      'rider.assigned': async (msg) => {
        console.log('[Listener] rider.assigned event received:', msg);
        const { orderId } = msg;
        await eventListenService.processOrderAssigned(orderId);
      }
    };
  }
}

module.exports = OrderAssignmentEventListener;
