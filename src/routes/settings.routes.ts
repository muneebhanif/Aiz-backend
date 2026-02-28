import { Router } from 'express';
import { settingsController } from '../controllers/settings.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { settingKeyParam, upsertSettingBody } from '../validators/settings.validator.js';

const router = Router();
router.use(authenticate);

// GET /api/v1/settings/:key
router.get('/:key', validate({ params: settingKeyParam }), settingsController.get);

// PUT /api/v1/settings/:key
router.put('/:key', validate({ params: settingKeyParam, body: upsertSettingBody }), settingsController.set);

export default router;
