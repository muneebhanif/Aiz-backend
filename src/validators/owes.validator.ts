import { z } from 'zod';

const owesEntryType = z.enum(['increase', 'decrease']);

export const owesEntryIdParam = z.object({
  id: z.string().uuid('Invalid owes entry ID'),
});

export const createOwesEntryBody = z.object({
  rentalId: z.string().uuid('Invalid rental ID'),
  driverName: z.string().min(1).max(120).trim(),
  registration: z.string().min(1).max(30).trim(),
  type: owesEntryType,
  amount: z.number().positive('Amount must be greater than 0'),
  note: z.string().max(1000).trim().default(''),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
});

export const updateOwesEntryBody = z.object({
  type: owesEntryType,
  amount: z.number().positive('Amount must be greater than 0'),
  note: z.string().max(1000).trim(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
}).partial();
