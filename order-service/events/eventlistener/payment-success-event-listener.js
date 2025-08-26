const { listen } = require('../../config/rabbitmq');
const orderService = require('../../services/order-service');


class PaymentSuccessEventListener {
    handlePaymentSuccess() {
        const handlerMap = {
            'payment.success': async (msg) => {
                const { orderId } = msg;
                await orderService.processPaymentSuccess(orderId);
            }
        };
        listen(handlerMap);
    }
}
module.exports = PaymentSuccessEventListener;
