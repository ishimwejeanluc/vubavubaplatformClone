const OrderReadyEventListener = require('./order-ready-event-listener');

const initializeEventListeners = () => {
  const orderReadyEventListener = new OrderReadyEventListener();
  orderReadyEventListener.handleOrderReady();

  console.log('Rider service event listeners initialized.');
};

module.exports = {
  initializeEventListeners,
};
