const express = require('express');
const { sequelize, testConnection } = require('./config/database');
require('dotenv').config();
const { initializeEventListeners } = require('./events/eventlistener/index');

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

const PORT = process.env.PORT ;

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log('Database connected...');
    await sequelize.sync({ alter: true });
    console.log('Database synced...');
    console.log(`Rider service running on port ${PORT}`);
  } catch (error) {
    console.error('Database connection failed:', error);
  }
});