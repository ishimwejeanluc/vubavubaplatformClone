require('dotenv').config();
const express = require('express');
const corsMiddleware = require('./middleware/cors');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const authServiceRoutes = require('./routes/auth-service-routes');
const merchantServiceRoutes = require('./routes/merchant-service-routes'); 

const app = express();
const PORT = process.env.PORT;
app.disable('x-powered-by'); 

console.log('🚀 Starting API Gateway...');
console.log('Environment variables:');
console.log('- PORT:', PORT);
console.log('- AUTH_SERVICE_URL:', process.env.AUTH_SERVICE_URL);

// CORS
app.use(corsMiddleware);
console.log('CORS middleware loaded');

// Parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log('JSON parsing middleware loaded');

// Comprehensive request logging
app.use((req, res, next) => {
  console.log('\n===  INCOMING REQUEST ===');
  console.log('Time:', new Date().toISOString());
  console.log('Method:', req.method);
  console.log('Original URL:', req.originalUrl);
  console.log('Path:', req.path);
  console.log('Query:', req.query);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('IP:', req.ip);
  console.log('========================\n');
  
  // Log when response is sent
  const originalSend = res.send;
  res.send = function(data) {
    console.log('\n=== 📤 OUTGOING RESPONSE ===');
    console.log('Status Code:', res.statusCode);
    console.log('Response Data:', data);
    console.log('=========================\n');
    originalSend.call(this, data);
  };
  
  next();
});

// Use your existing proxy middleware
app.use(['/api/auth', '/api/users'], authServiceRoutes);
app.use(['/api/merchants', '/api/menu'], merchantServiceRoutes);


// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'API Gateway',
    timestamp: new Date().toISOString(),
    services: {
      auth: process.env.AUTH_SERVICE_URL,
      merchant: process.env.MERCHANT_SERVICE_URL
    },
    endpoints: {
      // Auth Service
      'POST /api/auth/register': 'User registration (public)',
      'POST /api/auth/login': 'User login (public)',
      'POST /api/auth/logout': 'User logout (JWT required)',
      'GET /api/users/profile': 'Get user profile (JWT required)',
      'GET /api/users/admin/*': 'Admin user management (Admin role required)',
      
      // Merchant Service - Admin Routes
      'GET /api/merchants/admin/*': 'Admin merchant management (Admin role required)',
      
      // Merchant Service - Merchant Routes
      'POST /api/merchants': 'Create merchant profile (Merchant role required)',
      'GET /api/merchants/:id': 'Get merchant profile (Merchant role required)',
      'PUT /api/merchants/:id': 'Update merchant profile (Merchant role required)',
      
      // Merchant Service - Public Routes
      'GET /api/menu': 'Browse all menus (Customer role required)',
      'GET /api/menu/browse/:merchantId': 'Browse merchant menu (Customer role required)',
    }
  });
});

// 404 Handler
app.use(notFoundHandler);

// Error Handler
app.use(errorHandler);

// === START SERVER ===

app.listen(PORT, () => {
  console.log('\n=== 🚪 API GATEWAY READY ===');
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`📋 Integrated Services:`);
  console.log(`├── Auth Service: ${process.env.AUTH_SERVICE_URL}`);
  console.log(`├── Merchant Service: ${process.env.MERCHANT_SERVICE_URL}`);
  console.log(`📋 Available Routes:`);
  console.log(`├── Health: GET http://localhost:${PORT}/health`);
  console.log(`├── Auth: /api/users/*`);
  console.log(`├── Merchants (Admin): /api/merchants/admin/*`);
  console.log(`├── Merchants: /api/merchants/*`);
  console.log(`└── Menus (Public): /api/menu/*`);
  console.log('===============================\n');
});

module.exports = app;
