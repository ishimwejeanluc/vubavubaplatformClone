
const OrderPlacedEventListener = require('./order-placed-event-listener');
const PaymentSuccessEventListener = require('./payment-success-event-listener');
const PaymentFailedEventListener = require('./payment-failed-event-listener');
const OrderReadyEventListener = require('./order-ready-event-listener');
const AssignmentCreatedEventListener = require('./assignment-created-event-listener');
const DeliveryDeliveredEventListener = require('./delivery-delivered-event-listener');
const OrderCanceledEventListener = require('./order-canceled-event-listener');
const { listen } = require('../../config/rabbitmq')

const initializeEventListeners = () => {
  const handlerMap = {
    ...OrderPlacedEventListener.getHandler(),
    ...PaymentSuccessEventListener.getHandler(),
    ...PaymentFailedEventListener.getHandler(),
    ...OrderReadyEventListener.getHandler(),
    ...AssignmentCreatedEventListener.getHandler(),
    ...DeliveryDeliveredEventListener.getHandler(),
    ...OrderCanceledEventListener.getHandler(),
  };
  listen(handlerMap);
  console.log('Notification Service event listeners initialized.');
};

module.exports = { initializeEventListeners };
