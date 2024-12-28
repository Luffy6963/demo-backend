import { Router } from 'express';
import { createOrder, verifyPayment, getOrders } from '../controllers/orderController.js';

const router = Router();


router.post('/createAll', getOrders);
router.post('/create', createOrder);
router.get('/created', createOrder);
router.post('/verify', verifyPayment);

export default router;