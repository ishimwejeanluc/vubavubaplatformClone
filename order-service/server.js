const { sequelize, testConnection } = require('./config/database');
const express = require('express');
require('dotenv').config();
const {order , MenuItems} = require('./models/association');
const customerRoutes = require('./routes/customer-routes');
const merchantRoutes = require('./routes/merchant-routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes - MOST SPECIFIC FIRST
app.use('/api/orders/customer', customerRoutes);
app.use('/api/orders/merchant', merchantRoutes);


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

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Internal server error'
  });
});

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
