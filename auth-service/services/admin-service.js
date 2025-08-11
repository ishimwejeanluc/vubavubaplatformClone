const  User  = require('../models/User'); 
const AuthHelpers = require('../utils/helpers');


class AdminService {
  async getAllUsers() {
    try {
      const users = await User.findAll(
        
      );
      const sanitizedUsers = AuthHelpers.sanitizeUser(users);
      return { statusCode: 200, body: sanitizedUsers };
    } catch (error) {
      return { statusCode: 500, body: { message: error.message } };
    }
  }

  async getUser(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return { statusCode: 404, body: { message: "User not found" } };
      }
      return { statusCode: 200, body: user };
    } catch (error) {
      return { statusCode: 500, body: { message: error.message } };
    }
  }

  async updateUser(userId, data) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return { statusCode: 404, body: { message: "User not found" } };
      }
      await user.update(data);
      return { statusCode: 200, body: user };
    } catch (error) {
      return { statusCode: 400, body: { message: error.message } };
    }
  }

  async deactivateUser(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return { statusCode: 404, body: { message: "User not found" } };
      }
      await user.update({ is_active: false });
      return { statusCode: 200, body: { message: "User deactivated successfully" } };
    } catch (error) {
      return { statusCode: 500, body: { message: error.message } };
    }
  }

  async activateUser(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return { statusCode: 404, body: { message: "User not found" } };
        }
        await user.update({ is_active: true });
        return { statusCode: 200, body: { message: "User activated successfully" } };
      } catch (error) {
        return { statusCode: 500, body: { message: error.message } };
      }
  }
}

module.exports = new AdminService();