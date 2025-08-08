require('dotenv').config();
const express = require('express');
const corsMiddleware = require('./middleware/cors');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { authServiceProxy } = require('./middleware/proxy');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS
app.use(corsMiddleware);

// Parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// === ROUTES ===

// Use your existing proxy middleware
app.use('/api/users', authServiceProxy);
app.use('/api/*', servicesRoutes);



// 404 Handler
app.use(notFoundHandler);

// Error Handler
app.use(errorHandler);

// === START SERVER ===

app.listen(PORT, () => {
  console.log(`🌐 API Gateway running on port ${PORT}`);

});

module.exports = app;
