import express from 'express';
import {
  createService,
  getAvailableServices,
  getMyRequests,
  getMyTasks,
  acceptService,
  updateServiceStatus,
} from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();

// User routes
router.post('/', protect, restrictTo('user'), createService);
router.get('/my-requests', protect, restrictTo('user'), getMyRequests);

// Provider routes
router.get('/available', protect, restrictTo('provider'), getAvailableServices);
router.get('/my-tasks', protect, restrictTo('provider'), getMyTasks);
router.put('/:id/accept', protect, restrictTo('provider'), acceptService);
router.put('/:id/status', protect, restrictTo('provider'), updateServiceStatus);

export default router;
