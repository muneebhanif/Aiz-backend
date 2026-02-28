import { getSupabase } from '../database/supabase.js';
import { InternalError, NotFoundError, ConflictError } from '../utils/errors.js';

export interface RentalRow {
  id: string;
  vehicle_id: string;
  status: 'active' | 'ended';
  driver_name: string;
  driver_phone: string;
  driver_email: string;
  driver_license: string;
  driver_address: string;
  weekly_rent: number;
  deposit: number;
  start_date: string;
  end_date: string | null;
  notes: string;
  driver_signature: string;
  created_at: string;
  updated_at: string;
}

type RentalInsert = Omit<RentalRow, 'id' | 'status' | 'end_date' | 'created_at' | 'updated_at'>;
type RentalUpdate = Partial<Omit<RentalInsert, 'vehicle_id'>>;

const TABLE = 'rentals';

export const rentalsRepository = {
  async findAll(): Promise<RentalRow[]> {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .select('*')
      .order('start_date', { ascending: false });

    if (error) throw new InternalError(`Failed to fetch rentals: ${error.message}`);
    return (data ?? []) as RentalRow[];
  },

  async findById(id: string): Promise<RentalRow> {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundError('Rental');
    return data as RentalRow;
  },

  async findByVehicleId(vehicleId: string): Promise<RentalRow[]> {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('start_date', { ascending: false });

    if (error) throw new InternalError(`Failed to fetch rentals for vehicle: ${error.message}`);
    return (data ?? []) as RentalRow[];
  },

  async findActiveByVehicleId(vehicleId: string): Promise<RentalRow | null> {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .select('*')
      .eq('vehicle_id', vehicleId)
      .eq('status', 'active')
      .maybeSingle();

    if (error) throw new InternalError(`Failed to check active rental: ${error.message}`);
    return (data as RentalRow | null);
  },

  async create(input: RentalInsert): Promise<RentalRow> {
    // Prevent double-renting
    const active = await this.findActiveByVehicleId(input.vehicle_id);
    if (active) throw new ConflictError('Vehicle already has an active rental');

    const { data, error } = await getSupabase()
      .from(TABLE)
      .insert({ ...input, status: 'active' as const })
      .select()
      .single();

    if (error) throw new InternalError(`Failed to create rental: ${error.message}`);
    return data as RentalRow;
  },

  async update(id: string, input: RentalUpdate): Promise<RentalRow> {
    await this.findById(id);

    const { data, error } = await getSupabase()
      .from(TABLE)
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalError(`Failed to update rental: ${error.message}`);
    return data as RentalRow;
  },

  async endRental(id: string, endDate: string): Promise<RentalRow> {
    const rental = await this.findById(id);
    if (rental.status === 'ended') throw new ConflictError('Rental is already ended');

    const { data, error } = await getSupabase()
      .from(TABLE)
      .update({ status: 'ended' as const, end_date: endDate })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalError(`Failed to end rental: ${error.message}`);
    return data as RentalRow;
  },

  async delete(id: string): Promise<void> {
    await this.findById(id); // ensure exists

    const { error } = await getSupabase()
      .from(TABLE)
      .delete()
      .eq('id', id);

    if (error) throw new InternalError(`Failed to delete rental: ${error.message}`);
  },
};
