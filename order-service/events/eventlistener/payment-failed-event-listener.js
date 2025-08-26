const { listen } = require('../../config/rabbitmq');
const orderService = require('../../services/order-service');
const orderService = new orderService();

class PaymentFailedEventListener {
    constructor() {
            this.onPaymentFailed = this.onPaymentFailed.bind(this);
        }
    
        async onPaymentFailed(handler) {
            await listen(['payment.failed'], handler);
        }

        handlePaymentFailed() {
            this.onPaymentFailed(async (msg) => {
                const { orderId } = msg;
                await orderService.processPaymentFailed(orderId);
            });
        }
}

module.exports = PaymentFailedEventListener;