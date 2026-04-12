import { z } from 'zod';

export const savingsAccountIdParam = z.object({
  id: z.string().uuid('Invalid savings account ID'),
});

export const savingsEntryIdParam = z.object({
  id: z.string().uuid('Invalid savings entry ID'),
});

export const createSavingsAccountBody = z.object({
  name: z.string().min(1, 'Name required').max(120).trim(),
  openingBalance: z.number().min(0).default(0),
});

export const updateSavingsAccountBody = createSavingsAccountBody.partial();

const savingsEntryType = z.enum(['income', 'expense']);

export const createSavingsEntryBody = z.object({
  accountId: z.string().uuid('Invalid savings account ID'),
  type: savingsEntryType,
  amount: z.number().positive('Amount must be greater than 0'),
  note: z.string().max(1000).trim().default(''),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
});

export const updateSavingsEntryBody = z.object({
  type: savingsEntryType,
  amount: z.number().positive('Amount must be greater than 0'),
  note: z.string().max(1000).trim(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
}).partial();
