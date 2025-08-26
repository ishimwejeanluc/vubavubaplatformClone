
/**
 * Extract client IP address
 */
const getClientIP = (req) => {
  return req.ip || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null);
};

/**
 * Format response with consistent structure
 */
const formatResponse = (success, message, data = null, meta = null) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return response;
};

/**
 * Generate request ID for tracking
 */
const generateRequestId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Sanitize headers for forwarding
 */
const sanitizeHeaders = (headers) => {
  const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
  const sanitized = { ...headers };
  
  sensitiveHeaders.forEach(header => {
    if (sanitized[header]) {
      sanitized[header] = '[REDACTED]';
    }
  });
  
  return sanitized;
};

/**
 * Check if service is healthy
 */
const checkServiceHealth = async (serviceUrl) => {
  try {
    const response = await fetch(`${serviceUrl}/health`, {
      method: 'GET',
      timeout: 5000
    });
    
    return {
      healthy: response.ok,
      status: response.status,
      responseTime: response.headers.get('x-response-time') || 'unknown'
    };
  } catch (error) {
    return {
      healthy: false,
      status: 0,
      error: error.message
    };
  }
};

/**
 * Validate environment variables
 */
const validateEnvironment = () => {
  const required = [
    'JWT_SECRET',
    'AUTH_SERVICE_URL',
    'MERCHANT_SERVICE_URL',
    'ORDER_SERVICE_URL',
    'PAYMENT_SERVICE_URL',
    'RIDER_SERVICE_URL',
    'NOTIFICATION_SERVICE_URL',
    'PAYMENT_SERVICE_URL'
  ];

  const missing = required.filter(env => !process.env[env]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  return true;
};

/**
 * Log service interaction
 */
const logServiceInteraction = (service, method, path, statusCode, duration) => {
  console.log(`[${new Date().toISOString()}] ${service.toUpperCase()} - ${method} ${path} - ${statusCode} - ${duration}ms`);
};

module.exports = {
  isMobileRequest,
  getClientIP,
  formatResponse,
  generateRequestId,
  sanitizeHeaders,
  checkServiceHealth,
  validateEnvironment,
  logServiceInteraction
};
