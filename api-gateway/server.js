require('dotenv').config();
const express = require('express');
const corsMiddleware = require('./middleware/cors');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const servicesRoutes = require('./routes/serviceRoutes');

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
app.use('/api/', servicesRoutes);



// 404 Handler
app.use(notFoundHandler);

// Error Handler
app.use(errorHandler);

// === START SERVER ===

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);

});

module.exports = app;
