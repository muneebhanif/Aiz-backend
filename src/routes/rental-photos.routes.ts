import { Router } from 'express';
import { rentalPhotosController } from '../controllers/rental-photos.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { rentalIdParam, photoIdParam, createPhotosBody } from '../validators/rental-photos.validator.js';

const router = Router();

router.use(authenticate);

// GET /api/v1/rental-photos/:rentalId
router.get('/:rentalId', validate({ params: rentalIdParam }), rentalPhotosController.getByRentalId);

// POST /api/v1/rental-photos/:rentalId
router.post('/:rentalId', validate({ params: rentalIdParam, body: createPhotosBody }), rentalPhotosController.create);

// DELETE /api/v1/rental-photos/:rentalId/:photoId
router.delete('/:rentalId/:photoId', validate({ params: photoIdParam }), rentalPhotosController.delete);

export default router;
