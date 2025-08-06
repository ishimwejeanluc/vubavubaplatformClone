const { sequelize, testConnection } = require('./config/database');
const authRoutes = require('./routes/auth-routes');
const adminRoutes = require('./routes/admin-routes');
require('dotenv').config();
const express = require('express');

const app = express();


// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);


// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ success: false, message: err.message });
});




app.listen(process.env.PORT || 3000, async () => {
  try{
    await testConnection();
    console.log('Database connected...');
    sequelize.sync({alter: true});
  } catch (error) {
    console.error('Database connection failed:', error);
  }
  console.log(`Auth Service running on port ${process.env.PORT || 3000}`);
});
