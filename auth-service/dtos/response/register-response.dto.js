class UserRegistrationResponseDto {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
  }
}

module.exports = UserRegistrationResponseDto;
