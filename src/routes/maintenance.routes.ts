import { Router } from 'express';
import { maintenanceController } from '../controllers/maintenance.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  maintenanceIdParam,
  createMaintenanceBody,
  updateMaintenanceBody,
  maintenanceQuerySchema,
} from '../validators/maintenance.validator.js';

const router = Router();

// All maintenance routes require authentication
router.use(authenticate);

// GET /api/v1/maintenance?vehicleId=...
router.get(
  '/',
  validate({ query: maintenanceQuerySchema }),
  maintenanceController.getAll,
);

// GET /api/v1/maintenance/:id
router.get(
  '/:id',
  validate({ params: maintenanceIdParam }),
  maintenanceController.getById,
);

// POST /api/v1/maintenance
router.post(
  '/',
  validate({ body: createMaintenanceBody }),
  maintenanceController.create,
);

// PATCH /api/v1/maintenance/:id
router.patch(
  '/:id',
  validate({ params: maintenanceIdParam, body: updateMaintenanceBody }),
  maintenanceController.update,
);

// DELETE /api/v1/maintenance/:id
router.delete(
  '/:id',
  validate({ params: maintenanceIdParam }),
  maintenanceController.delete,
);

export default router;
