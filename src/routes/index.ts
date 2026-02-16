import { Router } from 'express';
import authRoutes from './auth.routes.js';
import vehiclesRoutes from './vehicles.routes.js';
import rentalsRoutes from './rentals.routes.js';
import paymentsRoutes from './payments.routes.js';
import maintenanceRoutes from './maintenance.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/vehicles', vehiclesRoutes);
router.use('/rentals', rentalsRoutes);
router.use('/payments', paymentsRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
