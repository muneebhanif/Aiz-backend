import { z } from 'zod';

export const settingKeyParam = z.object({
  key: z.string().min(1, 'Setting key is required'),
});

export const upsertSettingBody = z.object({
  value: z.string(),
});
