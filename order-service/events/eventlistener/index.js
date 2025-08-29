const PaymentSuccessEventListener = require('./payment-success-event-listener');
const PaymentFailedEventListener = require('./payment-failed-event-listener');


const initializeEventListeners = () => {
  const paymentSuccessListener = new PaymentSuccessEventListener();
  paymentSuccessListener.handlePaymentSuccess();

  const paymentFailedListener = new PaymentFailedEventListener();
  paymentFailedListener.handlePaymentFailed();

  console.log('Order service event listeners initialized.');
};

module.exports = { initializeEventListeners };
