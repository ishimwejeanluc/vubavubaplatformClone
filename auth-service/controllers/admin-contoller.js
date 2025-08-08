const adminService = require('../services/admin-service');

class AdminController {
  async getAllUsers(req, res) {
    try {
      const result = await adminService.getAllUsers();
      res.status(result.statusCode || 200).json(result.body);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUser(req, res) {
    try {
      const result = await adminService.getUser(req.params.id);
      res.status(result.statusCode || 200).json(result.body);
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const result = await adminService.updateUser(req.params.id, req.body);
      res.status(result.statusCode || 200).json(result.body);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deactivateUser(req, res) {
    try {
      const result = await adminService.deactivateUser(req.params.id);
      res.status(result.statusCode || 200).json(result.body);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async activateUser(req, res) {
    try {
      const result = await adminService.activateUser(req.params.id);
      res.status(result.statusCode || 200).json(result.body);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AdminController();
