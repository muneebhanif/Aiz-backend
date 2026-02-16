import { Router } from 'express';
import { paymentsController } from '../controllers/payments.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  paymentIdParam,
  createPaymentBody,
  updatePaymentBody,
  paymentQuerySchema,
} from '../validators/payments.validator.js';

const router = Router();

// All payment routes require authentication
router.use(authenticate);

// GET /api/v1/payments?rentalId=...&vehicleId=...&status=...
router.get(
  '/',
  validate({ query: paymentQuerySchema }),
  paymentsController.getAll,
);

// GET /api/v1/payments/:id
router.get(
  '/:id',
  validate({ params: paymentIdParam }),
  paymentsController.getById,
);

// POST /api/v1/payments
router.post(
  '/',
  validate({ body: createPaymentBody }),
  paymentsController.create,
);

// PATCH /api/v1/payments/:id
router.patch(
  '/:id',
  validate({ params: paymentIdParam, body: updatePaymentBody }),
  paymentsController.update,
);

// DELETE /api/v1/payments/:id
router.delete(
  '/:id',
  validate({ params: paymentIdParam }),
  paymentsController.delete,
);

export default router;
