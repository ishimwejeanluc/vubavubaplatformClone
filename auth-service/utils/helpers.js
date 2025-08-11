const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
require('dotenv').config();



/**
 * Helper utilities for Auth Service
 */
class AuthHelpers {
 
  
  
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
  static sanitizeUser(userData) {
    if (!userData) return null;

    // Handle array of users
    if (Array.isArray(userData)) {
      return userData.map(user => {
        if (!user) return null;
        
        const sanitized = { ...user.toJSON ? user.toJSON() : user };
        
        // Remove sensitive fields
        delete sanitized.password;
        
        // Format timestamps
        if (sanitized.created_at) {
          sanitized.created_at = new Date(sanitized.created_at).toLocaleString('en-US');
        }
        
        if (sanitized.updated_at) {
          sanitized.updated_at = new Date(sanitized.updated_at).toLocaleString('en-US');
        }
        
        return sanitized;
      }).filter(user => user !== null); // Remove any null entries
    }

    // Handle single user
    const sanitized = { ...userData.toJSON ? userData.toJSON() : userData };

    // Remove sensitive fields
    delete sanitized.password;

    if (sanitized.created_at) {
      sanitized.created_at = new Date(sanitized.created_at).toLocaleString('en-US');
    }

    if (sanitized.updated_at) {
      sanitized.updated_at = new Date(sanitized.updated_at).toLocaleString('en-US');
    }

    return sanitized;
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


  static validatePassword(password) {
    const errors = [];
    
    if (!password) {
      errors.push('Password is required');
      return { isValid: false, errors };
    }

    if (password.length < PASSWORD_REQUIREMENTS.MIN_LENGTH) {
      errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters long`);
    }

    if (password.length > PASSWORD_REQUIREMENTS.MAX_LENGTH) {
      errors.push(`Password cannot be longer than ${PASSWORD_REQUIREMENTS.MAX_LENGTH} characters`);
    }

    if (PASSWORD_REQUIREMENTS.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (PASSWORD_REQUIREMENTS.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (PASSWORD_REQUIREMENTS.REQUIRE_NUMBERS && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (PASSWORD_REQUIREMENTS.REQUIRE_SPECIAL_CHARS && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
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
