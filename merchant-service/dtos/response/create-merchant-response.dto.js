class CreateMerchantResponseDto {
  constructor(merchant) {
    this.id = merchant.id;
    this.name = merchant.name;
  }
}

module.exports = CreateMerchantResponseDto;
