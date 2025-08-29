const { listen } = require('../../config/rabbitmq');
const eventListenerService = require('../../services/event-listener-service');


class PaymentFailedEventListener {
    handlePaymentFailed() {
        const handlerMap = {
            'payment.failed': async (msg) => {
                const { orderId } = msg;
                await eventListenerService.processPaymentFailed(orderId);
            }
        };
        listen(handlerMap);
    }
}

module.exports = PaymentFailedEventListener;