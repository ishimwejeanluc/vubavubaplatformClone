class RegisterRequestDto {
  constructor({ name, email, password, phone, role = 'CUSTOMER' }) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.role = role;
  }
}

module.exports = RegisterRequestDto;
