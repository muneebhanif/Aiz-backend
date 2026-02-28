import { z } from 'zod';

export const rentalIdParam = z.object({
  id: z.string().uuid('Invalid rental ID'),
});

export const createRentalBody = z.object({
  vehicleId: z.string().uuid('Invalid vehicle ID'),
  driverName: z.string().min(1, 'Driver name required').max(100).trim(),
  driverPhone: z.string().max(30).trim().default(''),
  driverEmail: z.string().email().or(z.literal('')).default(''),
  driverLicense: z.string().max(50).trim().default(''),
  driverAddress: z.string().max(200).trim().default(''),
  weeklyRent: z.number().positive('Weekly rent must be positive'),
  deposit: z.number().min(0).default(0),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be YYYY-MM-DD'),
  notes: z.string().max(500).trim().default(''),
  driverSignature: z.string().default(''),
});

export const updateRentalBody = z.object({
  driverName: z.string().min(1).max(100).trim(),
  driverPhone: z.string().max(30).trim(),
  driverEmail: z.string().email().or(z.literal('')),
  driverLicense: z.string().max(50).trim(),
  driverAddress: z.string().max(200).trim(),
  weeklyRent: z.number().positive(),
  deposit: z.number().min(0),
  notes: z.string().max(500).trim(),
  driverSignature: z.string(),
}).partial().passthrough();

export const endRentalBody = z.object({
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be YYYY-MM-DD').optional(),
}).passthrough();
