const { sequelize, testConnection } = require('./config/database');
const express = require('express');
require('dotenv').config();
const authRoutes = require('./routes/auth-routes');
const adminRoutes = require('./routes/admin-routes');
const GlobalExceptionHandler = require('./exceptions/global-exception-handler');
const PORT = process.env.PORT ;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Mount routes
app.use(['/api/auth', '/api/users'], authRoutes);
app.use('/api/users/admin', adminRoutes);


// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Global exception handler (must be last middleware)
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
  console.log('\n=== AUTH SERVICE READY ===');
  console.log(`Auth Service running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log(`├── Health: GET http://localhost:${PORT}/health`);
  console.log('=================================\n');
});


 

