import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { savingsController } from '../controllers/savings.controller.js';
import {
  savingsAccountIdParam,
  savingsEntryIdParam,
  createSavingsAccountBody,
  updateSavingsAccountBody,
  createSavingsEntryBody,
  updateSavingsEntryBody,
} from '../validators/savings.validator.js';

const router = Router();

router.use(authenticate);

router.get('/accounts', savingsController.getAccounts);
router.get('/accounts/:id', validate({ params: savingsAccountIdParam }), savingsController.getAccountById);
router.post('/accounts', validate({ body: createSavingsAccountBody }), savingsController.createAccount);
router.patch('/accounts/:id', validate({ params: savingsAccountIdParam, body: updateSavingsAccountBody }), savingsController.updateAccount);
router.delete('/accounts/:id', validate({ params: savingsAccountIdParam }), savingsController.deleteAccount);

router.get('/entries', savingsController.getEntries);
router.get('/entries/:id', validate({ params: savingsEntryIdParam }), savingsController.getEntryById);
router.post('/entries', validate({ body: createSavingsEntryBody }), savingsController.createEntry);
router.patch('/entries/:id', validate({ params: savingsEntryIdParam, body: updateSavingsEntryBody }), savingsController.updateEntry);
router.delete('/entries/:id', validate({ params: savingsEntryIdParam }), savingsController.deleteEntry);

export default router;
