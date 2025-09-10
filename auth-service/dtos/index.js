// Request DTOs
const RegisterRequestDto = require('./request/register-request.dto');
const LoginRequestDto = require('./request/login-request.dto');

// Response DTOs
const LoginResponseDto = require('./response/login-response.dto');
const  UserRegistrationResponseDto = require('./response/register-response.dto');

module.exports = {
  // Request DTOs
  RegisterRequestDto,
  LoginRequestDto,
  
  // Response DTOs
   UserRegistrationResponseDto,
  LoginResponseDto
};
