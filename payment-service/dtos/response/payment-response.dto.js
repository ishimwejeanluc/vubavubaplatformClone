class PaymentResponseDto {
  constructor(payment) {
    this.id = payment.id;
    this.order_id = payment.order_id;
    this.amount = payment.amount;
    this.status = payment.status;
    this.method = payment.method;
    this.transaction_id = payment.transaction_id;
    this.created_at = payment.createdAt;
    this.updated_at = payment.updatedAt;
  }
}

module.exports = PaymentResponseDto;
