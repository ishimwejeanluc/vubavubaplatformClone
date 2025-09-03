
const express = require('express');
require('dotenv').config();
const { initializeEventListeners } = require('./events/eventlistener/index');
const PORT = process.env.PORT ;

const app = express();

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
	res.status(200).json({
		status: 'ok',
		service: 'Notification Service',
		timestamp: new Date().toISOString(),
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

initializeEventListeners();


app.listen(PORT, () => {
	console.log(`\n=== NOTIFICATION SERVICE READY ===`);
	console.log(`Notification Service running on port ${PORT}`);
	console.log('Available endpoints:');
	console.log(`├── Health: GET http://localhost:${PORT}/health`);
	console.log('=================================\n');
});
