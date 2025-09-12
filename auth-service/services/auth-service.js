const  User  = require("../models/User");
const AuthHelpers = require("../utils/helpers");
const { UserRegistrationResponseDto, LoginResponseDto } = require("../dtos");
 
const { 
  UserAlreadyExistsException, 
  InvalidCredentialsException,
} = require("../exceptions");

class AuthService {
  async register(data) {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new UserAlreadyExistsException();
    }
    const hashedPassword = await AuthHelpers.hashPassword(data.password);


    const result = await User.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      role: data.role,
      isActive: true,
    });

    const registrationResponseDto = new UserRegistrationResponseDto(result);
    return registrationResponseDto;
  }

  async login(data) {
    const findUser = await User.findOne({ where: { email: data.email } });
    if (!findUser) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await AuthHelpers.comparePassword(data.password, findUser.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    const token = AuthHelpers.generateToken(findUser);
    const BeamsToken = AuthHelpers.generateBeamsToken(findUser.id);
    const loginreponsedto = new LoginResponseDto(token, BeamsToken);
    return loginreponsedto;
      }
  }



module.exports = new AuthService();
