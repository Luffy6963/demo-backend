import { Router } from 'express';
import { getSellerInfo,getAllSellerInfo} from '../controllers/sellerController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.get('/info', authMiddleware, getSellerInfo);
router.get('/infoAll', getAllSellerInfo);

export default router;



