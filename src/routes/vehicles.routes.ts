import { Router } from 'express';
import { vehiclesController } from '../controllers/vehicles.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { vehicleIdParam, createVehicleBody, updateVehicleBody } from '../validators/vehicles.validator.js';

const router = Router();

// All vehicle routes require authentication
router.use(authenticate);

// GET /api/v1/vehicles
router.get('/', vehiclesController.getAll);

// GET /api/v1/vehicles/:id
router.get(
  '/:id',
  validate({ params: vehicleIdParam }),
  vehiclesController.getById,
);

// POST /api/v1/vehicles
router.post(
  '/',
  validate({ body: createVehicleBody }),
  vehiclesController.create,
);

// PATCH /api/v1/vehicles/:id
router.patch(
  '/:id',
  validate({ params: vehicleIdParam, body: updateVehicleBody }),
  vehiclesController.update,
);

// DELETE /api/v1/vehicles/:id
router.delete(
  '/:id',
  validate({ params: vehicleIdParam }),
  vehiclesController.delete,
);

export default router;
