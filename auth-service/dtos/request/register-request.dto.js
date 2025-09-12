class RegisterRequestDto {
  constructor({ name, email, phone, password, role}) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.role = role;
  }
}

module.exports = RegisterRequestDto;
