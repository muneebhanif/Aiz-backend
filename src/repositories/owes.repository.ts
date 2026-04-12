import { getSupabase } from '../database/supabase.js';
import { InternalError, NotFoundError } from '../utils/errors.js';

export interface OwesEntryRow {
  id: string;
  rental_id: string;
  driver_name: string;
  registration: string;
  entry_type: 'increase' | 'decrease';
  amount: number;
  note: string;
  entry_date: string;
  created_at: string;
  updated_at: string;
}

type OwesEntryInsert = Omit<OwesEntryRow, 'id' | 'created_at' | 'updated_at'>;
type OwesEntryUpdate = Partial<Pick<OwesEntryRow, 'entry_type' | 'amount' | 'note' | 'entry_date'>>;

const TABLE = 'owes_entries';

export const owesRepository = {
  async findAll(): Promise<OwesEntryRow[]> {
    const { data, error } = await getSupabase().from(TABLE).select('*').order('entry_date', { ascending: false });
    if (error) throw new InternalError(`Failed to fetch owes entries: ${error.message}`);
    return (data ?? []) as OwesEntryRow[];
  },

  async findById(id: string): Promise<OwesEntryRow> {
    const { data, error } = await getSupabase().from(TABLE).select('*').eq('id', id).single();
    if (error || !data) throw new NotFoundError('Owes entry');
    return data as OwesEntryRow;
  },

  async create(input: OwesEntryInsert): Promise<OwesEntryRow> {
    const { data, error } = await getSupabase().from(TABLE).insert(input).select().single();
    if (error) throw new InternalError(`Failed to create owes entry: ${error.message}`);
    return data as OwesEntryRow;
  },

  async update(id: string, input: OwesEntryUpdate): Promise<OwesEntryRow> {
    await this.findById(id);
    const { data, error } = await getSupabase().from(TABLE).update(input).eq('id', id).select().single();
    if (error) throw new InternalError(`Failed to update owes entry: ${error.message}`);
    return data as OwesEntryRow;
  },

  async delete(id: string): Promise<void> {
    await this.findById(id);
    const { error } = await getSupabase().from(TABLE).delete().eq('id', id);
    if (error) throw new InternalError(`Failed to delete owes entry: ${error.message}`);
  },
};
