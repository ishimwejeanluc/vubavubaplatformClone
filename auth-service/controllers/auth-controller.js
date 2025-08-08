
const userService = require('../services/auth-service');
const  AuthHelpers  = require('../utils/helpers');
const  User  = require('../models/User');

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password, phone, role } = req.body;
      let hashedPassword = await AuthHelpers.hashPassword(password);
      const user = new User({
        name,
        email,
        password: hashedPassword,
        phone,
        role
      });
      const result = await userService.register(user);
      res.status(result.statusCode || 201).json(result.body);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async login(req, res) {
    try {
      const result = await userService.login(req.body);
      res.status(result.statusCode || 200).json(result.body);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  logout(req, res) {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  }

  async forgotPassword(req, res) {
    try {
      const result = await userService.forgotPassword(req.body);
      res.status(result.statusCode || 200).json(result.body);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  async resetPassword(req, res) {
    try {
      const result = await userService.resetPassword(req.body);
      res.status(result.statusCode || 200).json(result.body);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

}

module.exports = new AuthController();
