// server/routes/deliveryRoutes.js

import { Router } from 'express';
import { createDelivery, getDeliveries } from '../controllers/deliveryController.js';
// import authMiddleware from '../middleware/authMiddleware.js'; // Protect routes if needed

const router = Router();

// Create a new Delivery Partner
router.post('/createDelivery', createDelivery);

// Get all Delivery Partners
router.get('/getDelivery', getDeliveries);

// Export the router
export default router;