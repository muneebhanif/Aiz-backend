import { Router } from 'express';
import authRoutes from './auth.routes.js';
import vehiclesRoutes from './vehicles.routes.js';
import rentalsRoutes from './rentals.routes.js';
import paymentsRoutes from './payments.routes.js';
import maintenanceRoutes from './maintenance.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import todosRoutes from './todos.routes.js';
import rentalPhotosRoutes from './rental-photos.routes.js';
import settingsRoutes from './settings.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/vehicles', vehiclesRoutes);
router.use('/rentals', rentalsRoutes);
router.use('/payments', paymentsRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/todos', todosRoutes);
router.use('/rental-photos', rentalPhotosRoutes);
router.use('/settings', settingsRoutes);

export default router;
