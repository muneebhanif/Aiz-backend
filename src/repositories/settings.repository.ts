import { getSupabase } from '../database/supabase.js';
import { InternalError, NotFoundError } from '../utils/errors.js';

export interface SettingRow {
  key: string;
  value: string;
  updated_at: string;
}

const TABLE = 'settings';

export const settingsRepository = {
  async findByKey(key: string): Promise<SettingRow> {
    const { data, error } = await getSupabase()
      .from(TABLE).select('*').eq('key', key).single();
    if (error || !data) throw new NotFoundError(`Setting '${key}'`);
    return data as SettingRow;
  },

  async upsert(key: string, value: string): Promise<SettingRow> {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
      .select()
      .single();
    if (error) throw new InternalError(`Failed to save setting '${key}': ${error.message}`);
    return data as SettingRow;
  },
};
