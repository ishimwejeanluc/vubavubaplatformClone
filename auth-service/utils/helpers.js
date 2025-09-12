const PushNotifications = require('@pusher/push-notifications-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
require('dotenv').config();

const beamsClient = new PushNotifications({
  instanceId: process.env.INSTANCE_ID,
  secretKey: process.env.BEAMS_SECRET_KEY,
});


class AuthHelpers {


  static generateBeamsToken(userId) {
    return beamsClient.generateToken(userId);
  }
 
  
  
  static async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  
  static async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  
  static generateToken(user, expiresIn = '7d') {
    const secret = process.env.JWT_SECRET;
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000)
    };
    return jwt.sign(payload, secret, { expiresIn });
  }


  
  static generateUUID() {
    return uuidv4();
  }

  
  static generateResetCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  
  static formatError(message, code = ERROR_CODES.INTERNAL_ERROR, details = null) {
    return {
      success: false,
      error: {
        message,
        code,
        details,
      }
    };
  }

  
  static formatSuccess(data, message = 'Operation successful') {
    return {
      success: true,
      message,
      data,
    };
  }

 
  static isValidEmail(email) {
    return validator.isEmail(email);
  }

  
  static isValidPhone(phone) {
    
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  }




  
  static hasRequiredRole(userRole, requiredRoles) {
    if (typeof requiredRoles === 'string') {
      return userRole === requiredRoles;
    }
    
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(userRole);
    }
    
    return false;
  }

  
  


  
}

module.exports = AuthHelpers;
