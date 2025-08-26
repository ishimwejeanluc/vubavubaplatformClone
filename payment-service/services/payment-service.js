

const EventListener = require('../events/EventListener');
const eventListener = new EventListener();

class PaymentService {
  async pay({ order_id, amount, transaction_id }) {
    if (!order_id || !amount || !transaction_id) {
      throw new Error('Missing required payment fields.');
    }
    return await Payment.create({
      order_id,
      method: PAYMENT_METHOD.MOBILE_MONEY,
      amount,
      transaction_id,
      status: PAYMENT_STATUS.PAID
    });
  }
}

function handleOrderWaitingPayment(payload) {
  return Payment.create({
    order_id: payload.orderId,
    amount: payload.amount,
    status: PAYMENT_STATUS.PENDING,
    method: null
  });
}

eventListener.onOrderWaitingPayment(handleOrderWaitingPayment);

module.exports = new PaymentService();
