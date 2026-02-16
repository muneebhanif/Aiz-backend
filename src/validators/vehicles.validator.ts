import { z } from 'zod';

/** Reusable UUID param validator */
export const uuidParam = z.object({
  id: z.string().uuid('Invalid ID format'),
});

/** Optional date string in YYYY-MM-DD format */
const optionalDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').nullish();

// ── Vehicles ─────────────────────────────────────────────────
// Frontend sends camelCase; controller maps to snake_case for the DB.
export const createVehicleBody = z.object({
  registration: z.string().min(2).max(20).trim(),
  make: z.string().min(1).max(50).trim(),
  model: z.string().min(1).max(50).trim(),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  color: z.string().max(30).trim().default(''),
  status: z.enum(['available', 'rented']).default('available'),
  roadTaxExpiry: optionalDate,
  motExpiry: optionalDate,
  taxiPlateExpiry: optionalDate,
});

// .passthrough() allows extra fields (id, createdAt, updatedAt) from the frontend
// without rejecting the request — the controller only picks what it needs.
export const updateVehicleBody = createVehicleBody.partial().passthrough();

export const vehicleIdParam = z.object({
  id: z.string().uuid('Invalid vehicle ID'),
});
