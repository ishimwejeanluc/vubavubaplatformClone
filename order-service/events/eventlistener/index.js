const PaymentSuccessEventListener = require('./payment-success-event-listener');
const PaymentFailedEventListener = require('./payment-failed-event-listener');
const OrderDeliveredEventListener = require('./order-delivered-event-listener');
const OrderAssignmentEventListener = require('./order_assignment-event-listener');
const { listen } = require('../../config/rabbitmq');

const initializeEventListeners = () => {
  // Combine all event handlers into a single handlerMap
  const handlerMap = {
    ...PaymentSuccessEventListener.getHandler(),
    ...PaymentFailedEventListener.getHandler(),
    ...OrderDeliveredEventListener.getHandler(),
    ...OrderAssignmentEventListener.getHandler(),
  };
  listen(handlerMap);
  console.log('Order service event listeners initialized.');
};

module.exports = { initializeEventListeners };
