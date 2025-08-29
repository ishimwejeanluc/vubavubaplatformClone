const { listen } = require('../../config/rabbitmq');
const eventListenerService = require('../../services/event-listener-service');


class PaymentFailedEventListener {
    static getHandler() {
        return {
            'payment.failed': async (msg) => {
                const { orderId } = msg;
                await eventListenerService.processPaymentFailed(orderId);
            }
        };
    }
}

module.exports = PaymentFailedEventListener;