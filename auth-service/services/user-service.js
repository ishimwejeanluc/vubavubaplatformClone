const User = require('../models/User');
const AuthHelpers = require('../utils/helpers');

class UserService {

  async updateProfile(userId, data) {
    const user = await User.findByPk(userId);
  }
}

module.exports = new UserService();
