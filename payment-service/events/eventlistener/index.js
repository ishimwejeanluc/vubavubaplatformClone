const OrderWaitingEventListener = require('./order-waiting-event-listener');

const initializeEventListeners = () => {
  const orderWaitingListener = new OrderWaitingEventListener();
  orderWaitingListener.handleOrderWaitingPayment();

  // When you add more listeners, you can initialize them here

  console.log('Payment service event listeners initialized.');
};

module.exports = { initializeEventListeners };
