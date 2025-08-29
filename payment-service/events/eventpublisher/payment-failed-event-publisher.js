const { publish } = require('../../config/rabbitmq');

class PaymentFailedEventPublisher {
    async publishPaymentFailedEvent({ paymentId, orderId, error }) {
        await publish('payment.failed', { paymentId, orderId, error });
    }
}

module.exports = PaymentFailedEventPublisher;   