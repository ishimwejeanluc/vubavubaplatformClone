class UpdateMerchantRequestDto {
  constructor({  business_name, phone, address, }) {

    this.business_name = business_name;
    this.phone = phone;
    this.address = address;
    
  }
}

module.exports = UpdateMerchantRequestDto;
