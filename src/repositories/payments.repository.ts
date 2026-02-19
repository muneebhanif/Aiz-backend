import { getSupabase } from '../database/supabase.js';
import { InternalError, NotFoundError, ConflictError } from '../utils/errors.js';

export interface PaymentRow {
  id: string;
  rental_id: string;
  vehicle_id: string;
  week_number: number;
  week_start_date: string;
  week_end_date: string;
  amount_due: number;
  deduction: number;
  amount_paid: number;
  status: 'paid' | 'partial' | 'unpaid';
  payment_date: string | null;
  method: string;
  remarks: string;
  created_at: string;
  updated_at: string;
}

type PaymentInsert = Omit<PaymentRow, 'id' | 'created_at' | 'updated_at'>;
type PaymentUpdate = Partial<Pick<PaymentRow, 'amount_due' | 'deduction' | 'amount_paid' | 'status' | 'payment_date' | 'method' | 'remarks'>>;

export interface PaymentFilters {
  rental_id?: string;
  vehicle_id?: string;
  method?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
}

const TABLE = 'weekly_payments';

export const paymentsRepository = {
  async findAll(filters: PaymentFilters = {}): Promise<PaymentRow[]> {
    let query = getSupabase()
      .from(TABLE)
      .select('*');

    if (filters.rental_id) query = query.eq('rental_id', filters.rental_id);
    if (filters.vehicle_id) query = query.eq('vehicle_id', filters.vehicle_id);
    if (filters.method) query = query.eq('method', filters.method);
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.date_from) query = query.gte('payment_date', filters.date_from);
    if (filters.date_to) query = query.lte('payment_date', filters.date_to);

    const { data, error } = await query.order('week_number', { ascending: true });

    if (error) throw new InternalError(`Failed to fetch payments: ${error.message}`);
    return (data ?? []) as PaymentRow[];
  },

  async findById(id: string): Promise<PaymentRow> {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundError('Payment');
    return data as PaymentRow;
  },

  async findByRentalAndWeek(rentalId: string, weekNumber: number): Promise<PaymentRow | null> {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .select('*')
      .eq('rental_id', rentalId)
      .eq('week_number', weekNumber)
      .maybeSingle();

    if (error) throw new InternalError(`Failed to check payment: ${error.message}`);
    return (data as PaymentRow | null);
  },

  async create(input: PaymentInsert): Promise<PaymentRow> {
    // Prevent duplicate week payment for same rental
    const existing = await this.findByRentalAndWeek(input.rental_id, input.week_number);
    if (existing) throw new ConflictError(`Payment for week ${input.week_number} already exists on this rental`);

    const { data, error } = await getSupabase()
      .from(TABLE)
      .insert(input)
      .select()
      .single();

    if (error) throw new InternalError(`Failed to create payment: ${error.message}`);
    return data as PaymentRow;
  },

  async update(id: string, input: PaymentUpdate): Promise<PaymentRow> {
    await this.findById(id);

    const { data, error } = await getSupabase()
      .from(TABLE)
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalError(`Failed to update payment: ${error.message}`);
    return data as PaymentRow;
  },

  async delete(id: string): Promise<void> {
    await this.findById(id);

    const { error } = await getSupabase()
      .from(TABLE)
      .delete()
      .eq('id', id);

    if (error) throw new InternalError(`Failed to delete payment: ${error.message}`);
  },
};
