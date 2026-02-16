import { z } from 'zod';

export const maintenanceIdParam = z.object({
  id: z.string().uuid('Invalid maintenance record ID'),
});

export const createMaintenanceBody = z.object({
  vehicleId: z.string().uuid('Invalid vehicle ID'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  description: z.string().min(1, 'Description required').max(500).trim(),
  cost: z.number().min(0).default(0),
  garage: z.string().max(100).trim().default(''),
  remarks: z.string().max(500).trim().default(''),
});

export const updateMaintenanceBody = createMaintenanceBody.partial().passthrough();

export const maintenanceQuerySchema = z.object({
  vehicleId: z.string().uuid().optional(),
});
