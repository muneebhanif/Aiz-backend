import { z } from 'zod';

const paymentMethod = z.enum(['cash', 'aiz-account', 'tide-account', 'personal-other', 'other-account', '']);

export const paymentIdParam = z.object({
  id: z.string().uuid('Invalid payment ID'),
});

export const createPaymentBody = z.object({
  rentalId: z.string().uuid('Invalid rental ID'),
  vehicleId: z.string().uuid('Invalid vehicle ID'),
  weekNumber: z.number().int().positive(),
  weekStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  weekEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  amountDue: z.number().min(0),
  deduction: z.number().min(0).default(0),
  amountPaid: z.number().min(0).default(0),
  status: z.enum(['paid', 'partial', 'unpaid']).default('unpaid'),
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().default(null),
  method: paymentMethod.default(''),
  remarks: z.string().max(500).trim().default(''),
});

export const updatePaymentBody = z.object({
  amountDue: z.number().min(0),
  deduction: z.number().min(0),
  amountPaid: z.number().min(0),
  status: z.enum(['paid', 'partial', 'unpaid']),
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  method: paymentMethod,
  remarks: z.string().max(500).trim(),
}).partial().passthrough();

export const paymentQuerySchema = z.object({
  rentalId: z.string().uuid().optional(),
  vehicleId: z.string().uuid().optional(),
  method: paymentMethod.optional(),
  status: z.enum(['paid', 'partial', 'unpaid']).optional(),
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
