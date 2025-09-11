const { sequelize, testConnection } = require('./config/database');
const express = require('express');
require('dotenv').config();
const {order , MenuItems} = require('./models/association');
const customerRoutes = require('./routes/customer-routes');
const merchantRoutes = require('./routes/merchant-routes');
const { initializeEventListeners } = require('./events/eventlistener/index');
const GlobalExceptionHandler = require('./exceptions/global-exception-handler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Mount routes - MOST SPECIFIC FIRST
app.use('/api/orders/customer', customerRoutes);
app.use('/api/orders/merchant', merchantRoutes);

initializeEventListeners();



// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    service: 'Order Service',
    timestamp: new Date().toISOString(),
    endpoints: {
      orders: '/api/orders',
      
    }
  });
});

// Global exception handler - must be after routes
app.use(GlobalExceptionHandler.handle);

app.listen(process.env.PORT, async () => {
  try {
    await testConnection();
    console.log('Database connected...');
    await sequelize.sync({ alter: true });
    console.log('Database synced...');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
  console.log('\n=== ORDER SERVICE READY ===');
  console.log(`Order Service running on port ${process.env.PORT}`);
  console.log('Available endpoints:');
  console.log(`├── Health: GET http://localhost:${process.env.PORT}/health`);
  console.log('├── Orders: /api/orders/*');
  console.log('└── Menu Items: /api/menu/*');
  console.log('=================================\n');
});
