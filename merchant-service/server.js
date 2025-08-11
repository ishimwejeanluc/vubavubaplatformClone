const { sequelize, testConnection } = require('./config/database');
const express = require('express');
require('dotenv').config();



const app = express();








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
