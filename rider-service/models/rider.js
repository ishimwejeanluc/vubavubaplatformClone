const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { VEHICLE_TYPE } = require('../utils/Enums/vehicle-type');

const Rider = sequelize.define('Rider', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  vehicle_type: {
    type: DataTypes.ENUM,
    values: Object.values(VEHICLE_TYPE),
    allowNull: false,
    validate: {
      notEmpty: true,
      isIn: [Object.values(VEHICLE_TYPE)]
    }
  },
 
  is_available: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },

  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'riders',
  timestamps: false
});

module.exports = Rider;
