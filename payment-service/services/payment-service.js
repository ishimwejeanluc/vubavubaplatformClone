
Payment = require('../models/payments');
const {PAYMENT_STATUS} = require('../utils/Enums/payment-status');
const {PAYMENT_METHOD} = require('../utils/Enums/payment-method');
const { PaymentSuccessEventPublisher } = require('../events/eventpublisher/index');

class PaymentService {
  async pay({ order_id, amount, transaction_id }) {
    if (!order_id || !amount || !transaction_id) {
      throw new Error('Missing required payment fields.');
    }
    const payment = await Payment.findOne({ where: { order_id, status: PAYMENT_STATUS.PENDING } });

    if (!payment) {
      throw new Error('No pending payment found for this order.');
    }

    // Update the payment record
    payment.status = PAYMENT_STATUS.PAID;
    payment.transaction_id = transaction_id;
    payment.method = PAYMENT_METHOD.MOBILE_MONEY;
    await payment.save();

    const paymentSuccessEventPublisher = new PaymentSuccessEventPublisher();
    await paymentSuccessEventPublisher.publishPaymentSuccessEvent({ paymentId: payment.id, orderId: order_id, amount });
    
    return payment;
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
