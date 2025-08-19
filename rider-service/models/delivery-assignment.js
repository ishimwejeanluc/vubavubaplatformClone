const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { DELIVERY_STATUS } = require('../utils/Enums/delivery-status');

const DeliveryAssignment = sequelize.define('DeliveryAssignment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  rider_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'riders',
      key: 'id'
    },
    validate: {
      notEmpty: true
    }
  },
  assigned_by: {
    type: DataTypes.UUID,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },

  delivery_status: {
    type: DataTypes.ENUM,
    values: Object.values(DELIVERY_STATUS),
    allowNull: false,
    defaultValue: DELIVERY_STATUS.ASSIGNED,
    validate: {
      isIn: [Object.values(DELIVERY_STATUS)]
    }
  },
 
  
  assigned_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  accepted_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  delivered_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
}, {
  tableName: 'delivery_assignments',
  timestamps: false
});

module.exports = DeliveryAssignment;
