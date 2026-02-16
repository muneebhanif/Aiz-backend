import { Router } from 'express';
import { rentalsController } from '../controllers/rentals.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { rentalIdParam, createRentalBody, updateRentalBody, endRentalBody } from '../validators/rentals.validator.js';

const router = Router();

// All rental routes require authentication
router.use(authenticate);

// GET /api/v1/rentals
router.get('/', rentalsController.getAll);

// GET /api/v1/rentals/:id
router.get(
  '/:id',
  validate({ params: rentalIdParam }),
  rentalsController.getById,
);

// GET /api/v1/rentals/vehicle/:vehicleId
router.get(
  '/vehicle/:vehicleId',
  rentalsController.getByVehicleId,
);

// POST /api/v1/rentals
router.post(
  '/',
  validate({ body: createRentalBody }),
  rentalsController.create,
);

// PATCH /api/v1/rentals/:id
router.patch(
  '/:id',
  validate({ params: rentalIdParam, body: updateRentalBody }),
  rentalsController.update,
);

// POST /api/v1/rentals/:id/end
router.post(
  '/:id/end',
  validate({ params: rentalIdParam, body: endRentalBody }),
  rentalsController.endRental,
);

export default router;
