
const paymentService = require('../services/payment-service');

class PaymentController {
  async pay(req, res, next) {
    try {
      const { order_id, amount, transaction_id } = req.body;
      const payment = await paymentService.pay({ order_id, amount, transaction_id });
      res.status(201).json({ success: true, payment });
    } catch (err) {
      if (err.message === 'Missing required payment fields.') {
        return res.status(400).json({ success: false, message: err.message });
      }
      next(err);
    }
  }
}

module.exports = new PaymentController();


