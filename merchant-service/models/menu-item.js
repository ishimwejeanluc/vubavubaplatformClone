const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Merchant = require('./merchant');
const { v4: uuidv4 } = require('uuid');

const MenuItem = sequelize.define('MenuItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
    allowNull: false
  },
  merchant_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'merchants',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    validate: {
      notEmpty: {
        msg: 'Merchant ID cannot be empty'
      }
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Menu item name cannot be empty'
      },
      len: {
        args: [2, 100],
        msg: 'Menu item name must be between 2 and 100 characters'
      }
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: 'Price must be a valid decimal number'
      },
      min: {
        args: [0],
        msg: 'Price must be greater than or equal to 0'
      }
    }
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true
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
}, 
{
  tableName: 'menu_items',
  timestamps: true,
});


MenuItem.belongsTo(Merchant, {
  foreignKey: 'merchant_id',
  as: 'merchant'
});

module.exports = MenuItem;