class ProfileResponseDto {
    constructor(merchant) {
        this.id = merchant.id;
        this.user_id = merchant.user_id;
        this.business_name = merchant.business_name;
        this.address = merchant.address;
        this.phone = merchant.phone;
        this.logo_url = merchant.logo_url || null;
        this.description = merchant.description || null;
        this.rating = merchant.rating || 0;
        this.createdAt = merchant.createdAt;
        this.updatedAt = merchant.updatedAt;
    }
}

module.exports = ProfileResponseDto;
