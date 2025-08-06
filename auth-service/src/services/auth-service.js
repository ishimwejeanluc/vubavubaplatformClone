const { create } = require("../models/User");


class AuthService {
  async register(data) {
    const result = await User.create({
      email: data.email,
      password: await AuthHelpers.hashPassword(data.password),
      username: data.username,
      role: data.role,
      createdAt: new Date().Now(),
      updatedAt: new Date().Now()
    });
    if (!result) {
      throw new Error("User registration failed");
    }
    return {
      statusCode: 201,
      body: AuthHelpers.sanitizeUser(result)
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
    return {
      statusCode: 200,
      body: {
        message: "Login successful",
        token: token
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
