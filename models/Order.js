// server/models/Order.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Order = sequelize.define('Order', {
  seller_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Sellers', // Table name as string
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  delivery_partner_id: { // New field
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Deliveries', // Table name as string
      key: 'id'
    },
    onDelete: 'SET NULL', // Adjust as needed
    onUpdate: 'CASCADE'
  },
  razorpay_order_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'INR',
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
    allowNull: false
  },
  customer_first_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  customer_last_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  customer_email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  customer_phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isNumeric: true,
      len: [10, 15]
    }
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

export default Order;