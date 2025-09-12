BeamsEventPublishService = require('./beams_event_publish_service');


class EventListenerService {
  static async handleOrderPlaced(payload) {
    
    console.log('[Notification] order.placed event listened:', payload);
  }
  static async handlePaymentSuccess(payload) {
    
    console.log('[Notification] payment.success event listened:', payload);
  }
  static async handlePaymentFailed(payload) {
    
    console.log('[Notification] payment.failed event listened:', payload);
  }

  static async handleAssignmentCreated(payload) {
    
    console.log('[Notification] assignment.created event listened:', payload);
  }
  
  static async handleDeliveryDelivered(payload) {
   
    console.log('[Notification] delivery.delivered event listened:', payload);
  }
  static async handleOrderCanceled(payload) {
    
    console.log('[Notification] order.canceled event listened:', payload);
  }
    static async handleOrderReady(payload) {
    await BeamsEventPublishService.publishToUser(payload.userId, {
      title: 'Order Ready',
      body: `Order  with ID ${payload.orderId} is ready for pickup.`,
    });
    console.log('[Notification] order.ready event listened:', payload);
  }
}

module.exports = EventListenerService;
