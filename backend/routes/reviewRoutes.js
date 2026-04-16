import express from 'express';
import { createReview, getProviderReviews, getServiceReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, restrictTo('user'), createReview);
router.get('/provider/:providerId', protect, getProviderReviews);
router.get('/service/:serviceId', getServiceReviews);
router.get('/service/:serviceId', protect, getServiceReviews);

export default router;
