const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const { ORDER_STATUS } = require('../utils/Enums/order-status');

const OrderHistory = sequelize.define('OrderHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
    allowNull: false
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    validate: {
      notEmpty: {
        msg: 'Order ID cannot be empty'
      }
    }
  },
  status: {
    type: DataTypes.ENUM,
    values: Object.values(ORDER_STATUS),
    allowNull: false,
    validate: {
      isIn: {
        args: [Object.values(ORDER_STATUS)],
        msg: 'Status must be one of: waiting payment, pending, ready, assigned, delivered, cancelled'
      }
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'order_history',
  timestamps: false
});

module.exports = OrderHistory;
