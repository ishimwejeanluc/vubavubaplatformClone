const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const OrderItem = sequelize.define('OrderItem', {
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
  menu_item_id: {
    type: DataTypes.UUID,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Menu item ID cannot be empty'
      }
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'Quantity must be an integer'
      },
      min: {
        args: [1],
        msg: 'Quantity must be at least 1'
      },
      max: {
        args: [100],
        msg: 'Quantity cannot exceed 100'
      }
    }
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: 'Unit price must be a valid decimal number'
      },
      min: {
        args: [0],
        msg: 'Unit price must be greater than or equal to 0'
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
  }
}, {
  tableName: 'order_items',
  timestamps: false
});

module.exports = OrderItem;
