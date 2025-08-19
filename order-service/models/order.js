const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const { ORDER_STATUS } = require('../utils/Enums/order-status');
const { PAYMENT_STATUS } = require('../utils/Enums/payment-status');


const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
    allowNull: false
  },
  customer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Customer ID cannot be empty'
      }
    }
  },
  merchant_id: {
    type: DataTypes.UUID,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Merchant ID cannot be empty'
      }
    }
  },
  status: {
    type: DataTypes.ENUM,
    values: Object.values(ORDER_STATUS),
    defaultValue: ORDER_STATUS.PENDING,
    allowNull: false,
    validate: {
      isIn: {
        args: [Object.values(ORDER_STATUS)],
        msg: 'Status must be one of: pending, confirmed, preparing, ready, delivered, cancelled'
      }
    }
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: 'Total price must be a valid decimal number'
      },
      min: {
        args: [0],
        msg: 'Total price must be greater than or equal to 0'
      }
    }
  },
  payment_status: {
    type: DataTypes.ENUM,
    values: Object.values(PAYMENT_STATUS),
    defaultValue: PAYMENT_STATUS.PENDING,
    allowNull: false,
    validate: {
      isIn: {
        args: [Object.values(PAYMENT_STATUS)],
        msg: 'Payment status must be one of: pending, paid, failed, refunded'
      }
    }
  },
  delivery_address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Delivery address cannot be empty'
      },
      len: {
        args: [10, 500],
        msg: 'Delivery address must be between 10 and 500 characters'
      }
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true,
});

module.exports = Order;
