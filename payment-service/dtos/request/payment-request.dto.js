class PaymentRequestDto {
  constructor({ order_id, amount, transaction_id }) {
    this.order_id = order_id;
    this.amount = amount;
    this.transaction_id = transaction_id;
  }
}

module.exports = PaymentRequestDto;
