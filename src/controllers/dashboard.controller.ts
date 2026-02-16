import type { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service.js';
import { sendSuccess } from '../utils/response.js';

export const dashboardController = {
  async getStats(_req: Request, res: Response): Promise<void> {
    const stats = await dashboardService.getStats();
    sendSuccess(res, stats);
  },
};
