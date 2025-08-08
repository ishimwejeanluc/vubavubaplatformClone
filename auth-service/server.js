const { sequelize, testConnection } = require('./config/database');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth-routes');
const adminRoutes = require('./routes/admin-routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Mount routes
app.use('/api/users/auth', authRoutes);
app.use('/api/users/admin', adminRoutes);


// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ success: false, message: err.message });
});




app.listen(process.env.PORT, async () => {
  try{
    await testConnection();
    console.log('Database connected...');
    sequelize.sync({alter: true});
  } catch (error) {
    console.error('Database connection failed:', error);
  }
  console.log(`Auth Service running on port ${process.env.PORT}`);
});
