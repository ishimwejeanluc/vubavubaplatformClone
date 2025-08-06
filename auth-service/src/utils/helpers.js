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

  /**
   * Sanitize user data for response (remove sensitive fields)
   * @param {Object} user - User object
   * @returns {Object} - Sanitized user object
   */
  static sanitizeUser(user) {
    if (!user) return null;
    
    const sanitized = { ...user.toJSON ? user.toJSON() : user };
    delete sanitized.password;
    delete sanitized.password_reset_token;
    delete sanitized.password_reset_expires;
    return sanitized;
  }

  /**
   * Format error response
   * @param {string} message - Error message
   * @param {string} code - Error code
   * @param {Object} details - Additional error details
   * @returns {Object} - Formatted error response
   */
  static formatError(message, code = ERROR_CODES.INTERNAL_ERROR, details = null) {
    return {
      success: false,
      error: {
        message,
        code,
        details,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Format success response
   * @param {Object} data - Response data
   * @param {string} message - Success message
   * @returns {Object} - Formatted success response
   */
  static formatSuccess(data, message = 'Operation successful') {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} - Email validity
   */
  static isValidEmail(email) {
    return validator.isEmail(email);
  }

  /**
   * Validate phone number (basic validation for international format)
   * @param {string} phone - Phone to validate
   * @returns {boolean} - Phone validity
   */
  static isValidPhone(phone) {
    // Basic international phone validation (supports +XXX format)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} - Validation result with isValid and errors
   */
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

  
  /**   * Log authentication events
   * @param {string} event - Event type (e.g., login, logout)
   * @param {string} userId - User ID associated with the event
   * @param {Object} metadata - Additional metadata for the event
   */
/** */  static generateSecureToken(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  
}

module.exports = AuthHelpers;
