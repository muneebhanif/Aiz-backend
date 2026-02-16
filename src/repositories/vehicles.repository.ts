import { getSupabase } from '../database/supabase.js';
import { InternalError, NotFoundError, ConflictError } from '../utils/errors.js';

export interface VehicleRow {
  id: string;
  registration: string;
  make: string;
  model: string;
  year: number;
  color: string;
  status: 'available' | 'rented';
  road_tax_expiry: string | null;
  mot_expiry: string | null;
  taxi_plate_expiry: string | null;
  created_at: string;
  updated_at: string;
}

type VehicleInsert = Omit<VehicleRow, 'id' | 'created_at' | 'updated_at'>;
type VehicleUpdate = Partial<VehicleInsert>;

const TABLE = 'vehicles';

export const vehiclesRepository = {
  async findAll(): Promise<VehicleRow[]> {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .select('*')
      .order('registration', { ascending: true });

    if (error) throw new InternalError(`Failed to fetch vehicles: ${error.message}`);
    return (data ?? []) as VehicleRow[];
  },

  async findById(id: string): Promise<VehicleRow> {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundError('Vehicle');
    return data as VehicleRow;
  },

  async findByRegistration(registration: string): Promise<VehicleRow | null> {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .select('*')
      .eq('registration', registration)
      .maybeSingle();

    if (error) throw new InternalError(`Failed to look up registration: ${error.message}`);
    return (data as VehicleRow | null);
  },

  async create(input: VehicleInsert): Promise<VehicleRow> {
    // Check for duplicate registration
    const existing = await this.findByRegistration(input.registration);
    if (existing) throw new ConflictError(`Vehicle with registration ${input.registration} already exists`);

    const { data, error } = await getSupabase()
      .from(TABLE)
      .insert(input)
      .select()
      .single();

    if (error) throw new InternalError(`Failed to create vehicle: ${error.message}`);
    return data as VehicleRow;
  },

  async update(id: string, input: VehicleUpdate): Promise<VehicleRow> {
    // Ensure vehicle exists first
    await this.findById(id);

    // If registration is changing, check for conflicts
    if (input.registration) {
      const existing = await this.findByRegistration(input.registration);
      if (existing && existing.id !== id) {
        throw new ConflictError(`Registration ${input.registration} already in use`);
      }
    }

    const { data, error } = await getSupabase()
      .from(TABLE)
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalError(`Failed to update vehicle: ${error.message}`);
    return data as VehicleRow;
  },

  async delete(id: string): Promise<void> {
    await this.findById(id); // ensure exists

    const { error } = await getSupabase()
      .from(TABLE)
      .delete()
      .eq('id', id);

    if (error) throw new InternalError(`Failed to delete vehicle: ${error.message}`);
  },

  async updateStatus(id: string, status: 'available' | 'rented'): Promise<VehicleRow> {
    return this.update(id, { status });
  },
};
