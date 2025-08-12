const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const MenuItem = require('./menu-item');
const { v4: uuidv4 } = require('uuid');

const Merchant = sequelize.define('Merchant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'User ID cannot be empty'
      },
      len: {
        args: [2, 100],
        msg: 'User ID must be between 2 and 100 characters'
      }
    }
  },
  business_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      name: 'business_name_unique',
      msg: 'Business name already exists'
    },
    
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Phone number cannot be empty'
      },
      len: {
        args: [10, 15],
        msg: 'Phone number must be between 10 and 15 digits'
      }
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
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
  tableName: 'merchants',
    timestamps: true,
});

Merchant.hasMany(MenuItem, {
  foreignKey: 'merchant_id',
  as: 'menuItems',
  onDelete: 'CASCADE'
});

module.exports = Merchant;
