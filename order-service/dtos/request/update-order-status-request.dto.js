class UpdateOrderStatusRequestDto {
  constructor({ merchantId, status }) {
    this.merchantId = merchantId;
    this.status = status;
  }
}

module.exports = UpdateOrderStatusRequestDto;
