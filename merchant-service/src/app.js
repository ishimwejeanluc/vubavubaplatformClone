const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const NodeCache = require('node-cache');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Service-specific cache (THIS IS BETTER!)
const merchantCache = new NodeCache({ 
  stdTTL: 600, // 10 minutes
  checkperiod: 120 
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vubavuba_merchants')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Import routes and models
const Merchant = require('./models/Merchant');

// SMART CACHING INSIDE THE SERVICE
app.get('/merchants', async (req, res) => {
  try {
    const cacheKey = `merchants_${JSON.stringify(req.query)}`;
    
    // Check cache first
    const cachedData = merchantCache.get(cacheKey);
    if (cachedData) {
      console.log('Cache HIT - returning cached merchants');
      return res.json(cachedData);
    }
    
    // If not in cache, query database
    console.log('Cache MISS - querying database');
    const merchants = await Merchant.find(req.query)
      .select('-sensitiveField') // Remove sensitive data
      .lean(); // Faster query
    
    // Store in cache with smart TTL
    const ttl = merchants.length > 100 ? 1800 : 600; // Longer cache for large datasets
    merchantCache.set(cacheKey, merchants, ttl);
    
    res.json(merchants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SMART CACHE INVALIDATION
app.post('/merchants', async (req, res) => {
  try {
    const merchant = new Merchant(req.body);
    await merchant.save();
    
    // Clear related caches when data changes
    merchantCache.flushAll(); // Clear all merchant caches
    
    res.status(201).json(merchant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// BUSINESS-LOGIC AWARE CACHING
app.get('/merchants/:id/menu', async (req, res) => {
  try {
    const cacheKey = `merchant_${req.params.id}_menu`;
    
    const cachedMenu = merchantCache.get(cacheKey);
    if (cachedMenu) {
      return res.json(cachedMenu);
    }
    
    const merchant = await Merchant.findById(req.params.id).populate('menuItems');
    
    if (!merchant) {
      return res.status(404).json({ error: 'Merchant not found' });
    }
    
    // Smart caching based on business rules
    const isRestaurantOpen = merchant.isOpen;
    const cacheTime = isRestaurantOpen ? 300 : 3600; // 5min if open, 1hr if closed
    
    merchantCache.set(cacheKey, merchant.menuItems, cacheTime);
    res.json(merchant.menuItems);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Merchant Service running on port ${PORT}`);
});

module.exports = app;
