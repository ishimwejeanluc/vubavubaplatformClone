const userService = require('../services/user-service');

class UserController {
  async getAllUsers(req, res) {
    try {
      const result = await userService.getAllUsers();
      res.status(result.statusCode || 200).json(result.body);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUser(req, res) {
    try {
      const result = await userService.getUser(req.params.id);
      res.status(result.statusCode || 200).json(result.body);
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const result = await userService.updateUser(req.params.id, req.body);
      res.status(result.statusCode || 200).json(result.body);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const result = await userService.deleteUser(req.params.id);
      res.status(result.statusCode || 200).json(result.body);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateUserRole(req, res) {
    try {
      const result = await userService.updateUserRole(req.params.id, req.body.role);
      res.status(result.statusCode || 200).json(result.body);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new UserController();
