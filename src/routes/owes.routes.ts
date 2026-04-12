import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { owesController } from '../controllers/owes.controller.js';
import { createOwesEntryBody, owesEntryIdParam, updateOwesEntryBody } from '../validators/owes.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', owesController.getAll);
router.get('/:id', validate({ params: owesEntryIdParam }), owesController.getById);
router.post('/', validate({ body: createOwesEntryBody }), owesController.create);
router.patch('/:id', validate({ params: owesEntryIdParam, body: updateOwesEntryBody }), owesController.update);
router.delete('/:id', validate({ params: owesEntryIdParam }), owesController.delete);

export default router;
