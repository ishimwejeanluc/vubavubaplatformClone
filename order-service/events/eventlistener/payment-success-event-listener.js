const { listen } = require('../../config/rabbitmq');
const eventListenService = require('../../services/event-listener-service');


class PaymentSuccessEventListener {
    handlePaymentSuccess() {
     try{   const handlerMap = {
            'payment.success': async (msg) => {
                console.log('[Listener] payment.success event received:', msg);
                const { orderId } = msg;
                await eventListenService.processPaymentSuccess(orderId);
            }
        };
        listen(handlerMap);
    } catch(error){
        console.log(error)
        throw error;
    }
    }
}
module.exports = PaymentSuccessEventListener;
