import { settingsRepository, type SettingRow } from '../repositories/settings.repository.js';

export const settingsService = {
  async get(key: string): Promise<SettingRow> {
    return settingsRepository.findByKey(key);
  },

  async set(key: string, value: string): Promise<SettingRow> {
    return settingsRepository.upsert(key, value);
  },
};
