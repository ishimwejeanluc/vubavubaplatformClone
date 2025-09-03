const express = require('express');
const { sequelize, testConnection } = require('./config/database');
require('dotenv').config();
const { initializeEventListeners } = require('./events/eventlistener/index');

const PORT = process.env.PORT ;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import models to ensure associations are loaded
require('./models/association');

// Import routes
const riderRoutes = require('./routes/rider-routes');
const adminRoutes = require('./routes/admin-routes');

// Use routes
app.use('/api/riders/admin', adminRoutes);
app.use('/api/riders', riderRoutes);

// Initialize event listeners
initializeEventListeners();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Rider service is running',
    timestamp: new Date().toISOString()
  });
});


app.listen(process.env.PORT , async () => {
  try {
    await testConnection();
    console.log('Database connected...');
    await sequelize.sync({ alter: true });
    console.log('Database synced...');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
  console.log('\n=== RIDER SERVICE READY ===');
  console.log(`Rider Service running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log(`├── Health: GET http://localhost:${PORT}/health`);
  console.log('├── Payments: /api/payments/*');
  console.log('=================================\n');
});