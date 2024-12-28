import { Router } from 'express';
import { registerSeller, loginSeller } from '../controllers/authController.js';

const router = Router();

router.post('/register', registerSeller);
router.post('/login', loginSeller);

export default router;