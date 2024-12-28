// server/models/Seller.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';


const Seller = sequelize.define('Seller', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: { // New password field
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

export default Seller;