const { listen } = require('../../config/rabbitmq');
const eventListenService = require('../../services/event-listener-service');


class PaymentSuccessEventListener {
    static getHandler() {
        return {
            'payment.success': async (msg) => {
                console.log('[Listener] payment.success event received:', msg);
                const { orderId } = msg;
                await eventListenService.processPaymentSuccess(orderId);
            }
        };
    }
}
module.exports = PaymentSuccessEventListener;
