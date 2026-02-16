import { getSupabase } from '../database/supabase.js';
import { InternalError, NotFoundError } from '../utils/errors.js';

export interface MaintenanceRow {
  id: string;
  vehicle_id: string;
  date: string;
  description: string;
  cost: number;
  garage: string;
  remarks: string;
  created_at: string;
  updated_at: string;
}

type MaintenanceInsert = Omit<MaintenanceRow, 'id' | 'created_at' | 'updated_at'>;
type MaintenanceUpdate = Partial<MaintenanceInsert>;

const TABLE = 'maintenance_records';

export const maintenanceRepository = {
  async findAll(vehicleId?: string): Promise<MaintenanceRow[]> {
    let query = getSupabase()
      .from(TABLE)
      .select('*');

    if (vehicleId) query = query.eq('vehicle_id', vehicleId);

    const { data, error } = await query.order('date', { ascending: false });

    if (error) throw new InternalError(`Failed to fetch maintenance records: ${error.message}`);
    return (data ?? []) as MaintenanceRow[];
  },

  async findById(id: string): Promise<MaintenanceRow> {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundError('Maintenance record');
    return data as MaintenanceRow;
  },

  async create(input: MaintenanceInsert): Promise<MaintenanceRow> {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .insert(input)
      .select()
      .single();

    if (error) throw new InternalError(`Failed to create maintenance record: ${error.message}`);
    return data as MaintenanceRow;
  },

  async update(id: string, input: MaintenanceUpdate): Promise<MaintenanceRow> {
    await this.findById(id);

    const { data, error } = await getSupabase()
      .from(TABLE)
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalError(`Failed to update maintenance record: ${error.message}`);
    return data as MaintenanceRow;
  },

  async delete(id: string): Promise<void> {
    await this.findById(id);

    const { error } = await getSupabase()
      .from(TABLE)
      .delete()
      .eq('id', id);

    if (error) throw new InternalError(`Failed to delete maintenance record: ${error.message}`);
  },
};
