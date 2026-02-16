import type { Request, Response } from 'express';
import { paymentsService } from '../services/payments.service.js';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response.js';
import type { PaymentRow } from '../repositories/payments.repository.js';

// snake_case DB row → camelCase API response
function toApiPayment(row: PaymentRow) {
  return {
    id: row.id,
    rentalId: row.rental_id,
    vehicleId: row.vehicle_id,
    weekNumber: row.week_number,
    weekStartDate: row.week_start_date,
    weekEndDate: row.week_end_date,
    amountDue: row.amount_due,
    deduction: row.deduction,
    amountPaid: row.amount_paid,
    status: row.status,
    paymentDate: row.payment_date,
    method: row.method,
    remarks: row.remarks,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const paymentsController = {
  async getAll(req: Request, res: Response): Promise<void> {
    const filters = {
      rental_id: req.query.rentalId as string | undefined,
      vehicle_id: req.query.vehicleId as string | undefined,
      method: req.query.method as string | undefined,
      status: req.query.status as string | undefined,
      date_from: req.query.dateFrom as string | undefined,
      date_to: req.query.dateTo as string | undefined,
    };

    // Strip undefined values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined)
    );

    const payments = await paymentsService.getAll(cleanFilters);
    sendSuccess(res, payments.map(toApiPayment));
  },

  async getById(req: Request, res: Response): Promise<void> {
    const payment = await paymentsService.getById(req.params.id as string);
    sendSuccess(res, toApiPayment(payment));
  },

  async create(req: Request, res: Response): Promise<void> {
    const payment = await paymentsService.create({
      rental_id: req.body.rentalId,
      vehicle_id: req.body.vehicleId,
      week_number: req.body.weekNumber,
      week_start_date: req.body.weekStartDate,
      week_end_date: req.body.weekEndDate,
      amount_due: req.body.amountDue,
      deduction: req.body.deduction ?? 0,
      amount_paid: req.body.amountPaid ?? 0,
      status: req.body.status ?? 'unpaid',
      payment_date: req.body.paymentDate ?? null,
      method: req.body.method ?? '',
      remarks: req.body.remarks ?? '',
    });
    sendCreated(res, toApiPayment(payment));
  },

  async update(req: Request, res: Response): Promise<void> {
    const updates: Record<string, unknown> = {};
    if (req.body.deduction !== undefined) updates.deduction = req.body.deduction;
    if (req.body.amountPaid !== undefined) updates.amount_paid = req.body.amountPaid;
    if (req.body.status !== undefined) updates.status = req.body.status;
    if (req.body.paymentDate !== undefined) updates.payment_date = req.body.paymentDate;
    if (req.body.method !== undefined) updates.method = req.body.method;
    if (req.body.remarks !== undefined) updates.remarks = req.body.remarks;

    const payment = await paymentsService.update(req.params.id as string, updates);
    sendSuccess(res, toApiPayment(payment));
  },

  async delete(req: Request, res: Response): Promise<void> {
    await paymentsService.delete(req.params.id as string);
    sendNoContent(res);
  },
};
