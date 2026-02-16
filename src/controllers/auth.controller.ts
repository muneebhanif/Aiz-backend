import type { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { sendSuccess, sendCreated } from '../utils/response.js';

export const authController = {
  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    sendSuccess(res, {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      expiresAt: result.expires_at,
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      },
    });
  },

  async signup(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const result = await authService.signup(email, password);

    sendCreated(res, {
      user: {
        id: result.id,
        email: result.email,
        role: result.role,
      },
    });
  },

  async refresh(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);

    sendSuccess(res, {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      expiresAt: result.expires_at,
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      },
    });
  },

  async logout(req: Request, res: Response): Promise<void> {
    const userId = req.user!.sub;
    await authService.logout(userId);
    sendSuccess(res, { message: 'Logged out successfully' });
  },
};
