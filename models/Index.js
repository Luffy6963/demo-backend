// server/models/index.js

// import sequelize from '../config/db.js';
import Seller from './Seller.js';
import Order from './Order.js';
import Delivery from './Delivery.js'; // Import Delivery model

// Define Associations
Seller.hasMany(Order, { foreignKey: 'seller_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Order.belongsTo(Seller, { foreignKey: 'seller_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Delivery.hasMany(Order, { foreignKey: 'delivery_partner_id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Order.belongsTo(Delivery, { foreignKey: 'delivery_partner_id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

// Export all models
export {
  Seller,
  Order,
  Delivery
};