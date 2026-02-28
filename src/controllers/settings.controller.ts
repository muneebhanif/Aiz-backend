import type { Request, Response } from 'express';
import { settingsService } from '../services/settings.service.js';
import { sendSuccess } from '../utils/response.js';
import type { SettingRow } from '../repositories/settings.repository.js';

function toApiSetting(row: SettingRow) {
  return {
    key: row.key,
    value: row.value,
    updatedAt: row.updated_at,
  };
}

export const settingsController = {
  async get(req: Request, res: Response): Promise<void> {
    const row = await settingsService.get(req.params.key as string);
    sendSuccess(res, toApiSetting(row));
  },

  async set(req: Request, res: Response): Promise<void> {
    const row = await settingsService.set(req.params.key as string, req.body.value);
    sendSuccess(res, toApiSetting(row));
  },
};
