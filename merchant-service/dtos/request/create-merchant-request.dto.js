class CreateMerchantRequestDto {
  constructor({ user_id, address, business_name, phone }) {

    this.user_id = user_id;
    this.business_name = business_name;
    this.address = address;
    this.phone = phone;

  }
}

module.exports = CreateMerchantRequestDto;
