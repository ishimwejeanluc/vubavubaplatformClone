const { listen } = require('../../config/rabbitmq');
const orderService = require('../../services/order-service');


class PaymentFailedEventListener {
    handlePaymentFailed() {
        const handlerMap = {
            'payment.failed': async (msg) => {
                const { orderId } = msg;
                await orderService.processPaymentFailed(orderId);
            }
        };
        listen(handlerMap);
    }
}

module.exports = PaymentFailedEventListener;