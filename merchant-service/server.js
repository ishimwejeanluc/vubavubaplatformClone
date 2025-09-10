const { sequelize, testConnection } = require('./config/database');
const express = require('express');
require('dotenv').config();
const {merchant , MenuItems} = require('./models/association');
const GlobalExceptionHandler = require('./exceptions/global-exception-handler');  
const ApiResponse = require('./utils/api-response');
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
  res.status(200).json(new ApiResponse(
    true, 
    'Merchant service is healthy', 
    {
      service: 'Merchant Service',
      timestamp: new Date().toISOString(),
      endpoints: {
        merchants: '/api/merchants'
      }
    }
  ));
});

// Global Exception Handler
app.use(GlobalExceptionHandler.handle);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Merchant service running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log(`├── Health: GET http://localhost:${PORT}/health`);
  console.log('├── Merchants: /api/merchants/*');
  console.log('└── Menu Items: /api/menu/*');
  console.log('=================================\n');
});
