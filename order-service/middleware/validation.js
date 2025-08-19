const { body, param, query } = require('express-validator');
const { ORDER_STATUS } = require('../utils/Enums/order-status');

// Order ID validation
const orderIdValidation = [
  param('orderId')
    .isUUID()
    .withMessage('Order ID must be a valid UUID')
];

// Pagination validation
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

// Create order validation
const createOrderValidation = [
  body('merchant_id')
    .isUUID()
    .withMessage('Merchant ID must be a valid UUID'),
  body('delivery_address')
    .isLength({ min: 10, max: 500 })
    .withMessage('Delivery address must be between 10 and 500 characters'),
  body('total_price')
    .isNumeric()
    .withMessage('Total price must be a number')
    .custom((value) => {
      if (parseFloat(value) <= 0) {
        throw new Error('Total price must be greater than 0');
      }
      return true;
    }),
  body('orderItems')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('orderItems.*.menu_item_id')
    .isUUID()
    .withMessage('Menu item ID must be a valid UUID'),
  body('orderItems.*.quantity')
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1 and 100'),
  body('orderItems.*.unit_price')
    .isNumeric()
    .withMessage('Unit price must be a number')
    .custom((value) => {
      if (parseFloat(value) <= 0) {
        throw new Error('Unit price must be greater than 0');
      }
      return true;
    })
];

// Update order status validation
const updateOrderStatusValidation = [
  param('orderId')
    .isUUID()
    .withMessage('Order ID must be a valid UUID'),
  body('status')
    .isIn(Object.values(ORDER_STATUS))
    .withMessage(`Status must be one of: ${Object.values(ORDER_STATUS).join(', ')}`)
];

// Merchant orders validation
const merchantOrdersValidation = [
  ...paginationValidation,
  query('status')
    .optional()
    .isIn(Object.values(ORDER_STATUS))
    .withMessage(`Status must be one of: ${Object.values(ORDER_STATUS).join(', ')}`)
];

module.exports = {
  orderIdValidation,
  paginationValidation,
  createOrderValidation,
  updateOrderStatusValidation,
  merchantOrdersValidation
};
