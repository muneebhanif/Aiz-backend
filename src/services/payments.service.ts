import { paymentsRepository, type PaymentRow, type PaymentFilters } from '../repositories/payments.repository.js';
import { rentalsRepository } from '../repositories/rentals.repository.js';
import { BadRequestError } from '../utils/errors.js';

type CreatePaymentInput = Omit<PaymentRow, 'id' | 'created_at' | 'updated_at'>;
type UpdatePaymentInput = Partial<Pick<PaymentRow, 'deduction' | 'amount_paid' | 'status' | 'payment_date' | 'method' | 'remarks'>>;

export const paymentsService = {
  async getAll(filters: PaymentFilters): Promise<PaymentRow[]> {
    return paymentsRepository.findAll(filters);
  },

  async getById(id: string): Promise<PaymentRow> {
    return paymentsRepository.findById(id);
  },

  async create(input: CreatePaymentInput): Promise<PaymentRow> {
    // Business rule: rental must exist
    const rental = await rentalsRepository.findById(input.rental_id);

    // Business rule: vehicle_id must match the rental's vehicle
    if (rental.vehicle_id !== input.vehicle_id) {
      throw new BadRequestError('Vehicle ID does not match the rental');
    }

    // Business rule: deduction cannot exceed amount_due
    if (input.deduction > input.amount_due) {
      throw new BadRequestError('Deduction cannot exceed amount due');
    }

    // Business rule: amount_paid cannot be negative
    if (input.amount_paid < 0) {
      throw new BadRequestError('Amount paid cannot be negative');
    }

    // Auto-derive status if not set correctly
    const netDue = input.amount_due - input.deduction;
    let status = input.status;
    if (input.amount_paid >= netDue) status = 'paid';
    else if (input.amount_paid > 0) status = 'partial';
    else status = 'unpaid';

    // Server-generated payment date for paid/partial
    const paymentDate = status !== 'unpaid'
      ? (input.payment_date || new Date().toISOString().split('T')[0]!)
      : null;

    return paymentsRepository.create({
      ...input,
      status,
      payment_date: paymentDate,
    });
  },

  async update(id: string, input: UpdatePaymentInput): Promise<PaymentRow> {
    const existing = await paymentsRepository.findById(id);

    // Re-derive status if amount fields change
    const amountPaid = input.amount_paid ?? existing.amount_paid;
    const deduction = input.deduction ?? existing.deduction;
    const netDue = existing.amount_due - deduction;

    let status = input.status;
    if (input.amount_paid !== undefined || input.deduction !== undefined) {
      if (amountPaid >= netDue) status = 'paid';
      else if (amountPaid > 0) status = 'partial';
      else status = 'unpaid';
    }

    const paymentDate = status && status !== 'unpaid'
      ? (input.payment_date || existing.payment_date || new Date().toISOString().split('T')[0]!)
      : (input.payment_date ?? existing.payment_date);

    return paymentsRepository.update(id, {
      ...input,
      status,
      payment_date: paymentDate,
    });
  },

  async delete(id: string): Promise<void> {
    return paymentsRepository.delete(id);
  },
};
