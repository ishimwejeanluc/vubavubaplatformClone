const { publish } = require('../../config/rabbitmq');

class PaymentSuccessEventPublisher {
    async publishPaymentSuccessEvent({ paymentId, orderId, amount }) {
     await publish('payment.success', { paymentId, orderId, amount });
    }
}

module.exports = PaymentSuccessEventPublisher;
