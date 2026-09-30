import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller.js';
import { authenticate, complianceAccessGuard } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.use(complianceAccessGuard);

// GET /api/v1/dashboard/stats
router.get('/stats', dashboardController.getStats);

export default router;
