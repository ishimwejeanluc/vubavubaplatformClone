const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { USER_ROLES } = require('../utils/Enums/role');
const { v4: uuidv4 } = require('uuid');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Name cannot be empty'
      },
      len: {
        args: [2, 100],
        msg: 'Name must be between 2 and 100 characters'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      name: 'users_email_unique',
      msg: 'Email address already exists'
    },
    validate: {
      isEmail: {
        msg: 'Must be a valid email address'
      },
      notEmpty: {
        msg: 'Email cannot be empty'
      }
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      name: 'users_phone_unique',
      msg: 'Phone number already exists'
    },
    validate: {
      notEmpty: {
        msg: 'Phone number cannot be empty'
      },
      isNumeric: {
        msg: 'Phone number must contain only numbers'
      },
      len: {
        args: [10, 15],
        msg: 'Phone number must be between 10 and 15 digits'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Password cannot be empty'
      },
      len: {
        args: [8, 255],
        msg: 'Password must be at least 8 characters long'
      }
    }
  },
  role: {
    type: DataTypes.ENUM,
    values: Object.values(USER_ROLES),
    defaultValue: USER_ROLES.CUSTOMER,
    allowNull: false,
    validate: {
      isIn: {
        args: [Object.values(USER_ROLES)],
        msg: 'Role must be one of: customer, merchant, rider, admin'
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
  tableName: 'users',
    timestamps: true,
});





module.exports = User;
