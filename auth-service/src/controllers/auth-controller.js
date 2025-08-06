
const userService = require('../services/auth-service');
const { hashPassword } = require('../utils/helpers');

class AuthController {
  async register(req, res) {
    try {
      const { email, password, username, role } = req.body;
      const user = new User({
        email,
        password: hashPassword(password),
        username,
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
