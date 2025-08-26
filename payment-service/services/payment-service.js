
Payment = require('../models/payments');
const {PAYMENT_STATUS} = require('../utils/Enums/payment-status');
const {PAYMENT_METHOD} = require('../utils/Enums/payment-method');


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

  handleOrderWaitingPayment(orderId, amount) {
    return Payment.create({
      order_id: orderId,
      amount: amount,
      status: PAYMENT_STATUS.PENDING,
    });
  }
}

module.exports = new PaymentService();
