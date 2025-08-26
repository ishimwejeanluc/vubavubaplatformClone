const { listen } = require('../../config/rabbitmq');
const orderService = require('../../services/order-service');
const orderService = new orderService();

class PaymentSuccessEventListener {
    constructor() {
        this.onPaymentSuccess = this.onPaymentSuccess.bind(this);
    }

    async onPaymentSuccess(handler) {
        await listen(['payment.success'], handler);
    }

    handlePaymentSuccess() {
        this.onPaymentSuccess(async (msg) => {
            const { orderId } = msg;
            await orderService.processPaymentSuccess(orderId);
        });
    }
}
module.exports = PaymentSuccessEventListener;
