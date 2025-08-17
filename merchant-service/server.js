const { sequelize, testConnection } = require('./config/database');
const express = require('express');
require('dotenv').config();
const {merchant , MenuItems} = require('./models/association');
// Import routes
const merchantRoutes = require('./routes/merchant-routes');
const menuRoutes = require('./routes/menu-routes');
const adminRoutes = require('./routes/admin-routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes - MOST SPECIFIC FIRST
app.use('/api/merchants/admin', adminRoutes);
app.use('/api/merchants/menu', menuRoutes);    
app.use('/api/merchants', merchantRoutes);       
                

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    service: 'Merchant Service',
    timestamp: new Date().toISOString(),
    endpoints: {
      merchants: '/api/merchants',
      menu: '/api/menu'
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('🚨 Server error:', err);
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Internal server error'
  });
});

app.listen(process.env.PORT, async () => {
  try {
    await testConnection();
    console.log('Database connected...');
    sequelize.sync({ alter: true });
    console.log('Database synced...');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
  
  console.log('\n===  MERCHANT SERVICE READY ===');
  console.log(`Merchant Service running on port ${process.env.PORT}`);
  console.log(`Available endpoints:`);
  console.log(`├── Health: GET http://localhost:${process.env.PORT}/health`);
  console.log(`├── Merchants: /api/merchants/*`);
  console.log(`└── Menu Items: /api/menu/*`);
  console.log('=================================\n');
});
