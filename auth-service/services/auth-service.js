const  User  = require("../models/User");
const AuthHelpers = require("../utils/helpers");

class AuthService {
  async register(data) {
    const result = await User.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: data.role,
      isActive: true,
    });
    if (!result) {
      throw new Error("User registration failed");
    }
   const sanitizedUser = AuthHelpers.sanitizeUser(result);
    return {
      statusCode: 201,
      body: AuthHelpers.formatSuccess(sanitizedUser)
    };
  }

  async login(data) {
    const findUser = await User.findOne({ where: { email: data.email } });
    if (!findUser) {
      throw new Error("User not found");
    }

    const isPasswordValid = await AuthHelpers.comparePassword(data.password, findUser.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = AuthHelpers.generateToken(findUser);
    const BeamsToken = AuthHelpers.generateBeamsToken(findUser.id);
    return {
      statusCode: 200,
      body: {
        message: "Login successful",
        token: token,
        beamsToken: BeamsToken
      }
    };
  }

  async forgotPassword(data) {
    // Forgot password logic
  }

  async resetPassword(data) {
    // Reset password logic
  }

  async refreshToken(data) {
    // Refresh token logic
  }
}

module.exports = new AuthService();
