const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { PAYMENT_STATUS } = require('../utils/Enums/payment-status');
const {PAYMENT_METHOD} = require('../utils/Enums/payment-method');
const { v4: uuidv4 } = require('uuid');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false
    },
    order_id: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Order ID cannot be empty'
            }
        }
    },
    method: {
        type: DataTypes.ENUM,
        values: Object.values(PAYMENT_METHOD),
        allowNull: false,
        validate: {
            isIn: [Object.values(PAYMENT_METHOD)]
        }
    },
    status: {
        type: DataTypes.ENUM,
        values: Object.values(PAYMENT_STATUS),
        allowNull: false,
        validate: {
            isIn: [Object.values(PAYMENT_STATUS)]
        }
    },
    transaction_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: 'Transaction ID cannot be empty'
            }
        }
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: {
                msg: 'Amount must be a valid decimal number'
            }
        }
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
    tableName: 'payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
});


module.exports = Payment;