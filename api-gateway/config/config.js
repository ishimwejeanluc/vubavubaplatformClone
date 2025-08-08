/**
 * Simple configuration for API Gateway
 */

// Auth Service Configuration
const authService = {
  url: process.env.AUTH_SERVICE_URL ,
  timeout: 30000
};

module.exports = {
  authService
};
