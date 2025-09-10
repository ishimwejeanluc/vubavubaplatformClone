class LoginResponseDto {
  constructor(token, beamsToken) {
    this.token = token;
    this.beamsToken = beamsToken;
  }
}

module.exports = LoginResponseDto;
