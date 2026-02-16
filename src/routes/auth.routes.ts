import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { loginBody, signupBody } from '../validators/auth.validator.js';

const router = Router();

// POST /api/v1/auth/login
router.post(
  '/login',
  validate({ body: loginBody }),
  authController.login,
);

// POST /api/v1/auth/signup
router.post(
  '/signup',
  validate({ body: signupBody }),
  authController.signup,
);

// POST /api/v1/auth/refresh
router.post(
  '/refresh',
  authController.refresh,
);

// POST /api/v1/auth/logout  (requires valid token)
router.post(
  '/logout',
  authenticate,
  authController.logout,
);

export default router;
