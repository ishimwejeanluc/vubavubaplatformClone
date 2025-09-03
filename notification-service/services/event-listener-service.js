BeamsEventPublishService = require('./beams_event_publish_service');


class EventListenerService {
  static async handleOrderPlaced(payload) {
    await BeamsEventPublishService.publishToUser(payload.userId, {
      title: 'Order Placed',
      body: `Your order with ID ${payload.orderId} has been placed successfully.`,
    });
    console.log('[Notification] order.placed event listened:', payload);
  }
  static async handlePaymentSuccess(payload) {
    await BeamsEventPublishService.publishToUser(payload.userId, {
      title: 'Payment Successful',
      body: `Your payment for order ID ${payload.orderId} was successful.`,
    });
    console.log('[Notification] payment.success event listened:', payload);
  }
  static async handlePaymentFailed(payload) {
    await BeamsEventPublishService.publishToUser(payload.userId, {
      title: 'Payment Failed',
      body: `Your payment for order ID ${payload.orderId} has failed.`,
    });
    console.log('[Notification] payment.failed event listened:', payload);
  }
  static async handleOrderReady(payload) {
    await BeamsEventPublishService.publishToUser(payload.userId, {
      title: 'Order Ready',
      body: `Order  with ID ${payload.orderId} is ready for pickup.`,
    });
    console.log('[Notification] order.ready event listened:', payload);
  }
  static async handleAssignmentCreated(payload) {
    await BeamsEventPublishService.publishToUser(payload.userId, {
      title: 'Order Assigned',
      body: `A new order has been assigned ${payload.assignmentId}.`,
    });
    console.log('[Notification] assignment.created event listened:', payload);
  }
  
  static async handleDeliveryDelivered(payload) {
    await BeamsEventPublishService.publishToUser(payload.userId, {
      title: 'Delivery Delivered',
      body: `Your delivery for order ID ${payload.orderId} has been delivered.`,
    });
    console.log('[Notification] delivery.delivered event listened:', payload);
  }
  static async handleOrderCanceled(payload) {
    await BeamsEventPublishService.publishToUser(payload.userId, {
      title: 'Order Canceled',
      body: `Your order with ID ${payload.orderId} has been canceled.`,
    });
    console.log('[Notification] order.canceled event listened:', payload);
  }
}

module.exports = EventListenerService;
