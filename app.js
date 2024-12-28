import express from 'express';
import cors from 'cors';
import sequelize from './config/db.js';
// Import route files
import authRoutes from './routes/authRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js'; // If applicable

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test DB connection
sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('DB connection error:', err));

// Sync models with the database
sequelize.sync({ alter: true })
  .then(() => console.log('Database synced'))
  .catch(err => console.error('DB sync error:', err));

// Define routes
app.use('/auth', authRoutes);
app.use('/seller', sellerRoutes);
app.use('/order', orderRoutes);
app.use('/delivery', deliveryRoutes); // If you have delivery routes

// Health Check Route
app.get('/', (req, res) => {
  res.send('Welcome to the API. It is working!');
});

export default app;
