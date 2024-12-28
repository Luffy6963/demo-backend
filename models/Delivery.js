// server/models/Delivery.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Delivery = sequelize.define('Delivery', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  brand_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

export default Delivery;