const { sequelize, testConnection } = require('./config/database');
const express = require('express');
require('dotenv').config();
const paymentRoutes = require('./routes/payment-routes');
const OrderWaitingEventListener = require('./events/order-waiting-event-listener');
const orderWaitingListener = new OrderWaitingEventListener();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount payment routes
app.use('/api/payments', paymentRoutes);


orderWaitingListener.handleOrderWaitingPayment();
console.log('OrderWaitingEventListener started and listening for order.waiting events.');



// Error handler
app.use((err, req, res, next) => {
	console.error('Server error:', err);
	res.status(err.status || 500).json({
		success: false,
		message: err.message || 'Internal server error'
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
	console.log('\n=== PAYMENT SERVICE READY ===');
	console.log(`Payment Service running on port ${process.env.PORT}`);
	console.log('Available endpoints:');
	console.log(`├── Health: GET http://localhost:${process.env.PORT}/health`);
	console.log('├── Payments: /api/payments/*');
	console.log('=================================\n');
});
