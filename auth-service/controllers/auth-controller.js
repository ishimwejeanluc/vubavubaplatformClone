
const authService = require('../services/auth-service');
const { LoginRequestDto , RegisterRequestDto  } = require('../dtos');
const ApiResponse = require('../utils/api-response');


class AuthController {
  async register(req, res, next) {
    try {
      const registerDto = new RegisterRequestDto(req.body);
      const result = await authService.register(registerDto);

      res.status(result.statusCode || 201).json(new ApiResponse(
        true, 
        "User registered successfully", 
        result
      ));
    } catch (error) {
      next(error);
      console.error('Error occurred during registration:', error);
    }
  }

  async login(req, res, next) {
    try {
      const loginDto = new LoginRequestDto(req.body);
      const result = await authService.login(loginDto);
      res.status(result.statusCode || 200).json(new ApiResponse(
        true,
        "Login Successfully",
        result
      ));
    } catch (error) {
      next(error);
    }
  }

  logout(req, res) {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  }

  async forgotPassword(req, res, next) {
    try {
      const result = await userService.forgotPassword(req.body);
      res.status(result.statusCode || 200).json(result.body);
    } catch (error) {
      next(error);
    }
  }
  async resetPassword(req, res, next) {
    try {
      const result = await userService.resetPassword(req.body);
      res.status(result.statusCode || 200).json(result.body);
    } catch (error) {
      next(error);
    }
  }

}

module.exports = new AuthController();
