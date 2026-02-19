import type { Request, Response } from 'express';
import { vehiclesService } from '../services/vehicles.service.js';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response.js';
import type { VehicleRow } from '../repositories/vehicles.repository.js';

// snake_case DB row → camelCase API response
function toApiVehicle(row: VehicleRow) {
  return {
    id: row.id,
    registration: row.registration,
    make: row.make,
    model: row.model,
    year: row.year,
    color: row.color,
    company: row.company,
    status: row.status,
    roadTaxExpiry: row.road_tax_expiry,
    motExpiry: row.mot_expiry,
    taxiPlateExpiry: row.taxi_plate_expiry,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const vehiclesController = {
  async getAll(_req: Request, res: Response): Promise<void> {
    const vehicles = await vehiclesService.getAll();
    sendSuccess(res, vehicles.map(toApiVehicle));
  },

  async getById(req: Request, res: Response): Promise<void> {
    const vehicle = await vehiclesService.getById(req.params.id as string);
    sendSuccess(res, toApiVehicle(vehicle));
  },

  async create(req: Request, res: Response): Promise<void> {
    const vehicle = await vehiclesService.create({
      registration: req.body.registration,
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      color: req.body.color,
      company: req.body.company ?? 'aiz-cars',
      status: req.body.status ?? 'available',
      road_tax_expiry: req.body.roadTaxExpiry ?? null,
      mot_expiry: req.body.motExpiry ?? null,
      taxi_plate_expiry: req.body.taxiPlateExpiry ?? null,
    });
    sendCreated(res, toApiVehicle(vehicle));
  },

  async update(req: Request, res: Response): Promise<void> {
    // Map camelCase request body → snake_case for repository
    const updates: Record<string, unknown> = {};
    if (req.body.registration !== undefined) updates.registration = req.body.registration;
    if (req.body.make !== undefined) updates.make = req.body.make;
    if (req.body.model !== undefined) updates.model = req.body.model;
    if (req.body.year !== undefined) updates.year = req.body.year;
    if (req.body.color !== undefined) updates.color = req.body.color;
    if (req.body.company !== undefined) updates.company = req.body.company;
    if (req.body.status !== undefined) updates.status = req.body.status;
    if (req.body.roadTaxExpiry !== undefined) updates.road_tax_expiry = req.body.roadTaxExpiry;
    if (req.body.motExpiry !== undefined) updates.mot_expiry = req.body.motExpiry;
    if (req.body.taxiPlateExpiry !== undefined) updates.taxi_plate_expiry = req.body.taxiPlateExpiry;

    const vehicle = await vehiclesService.update(req.params.id as string, updates);
    sendSuccess(res, toApiVehicle(vehicle));
  },

  async delete(req: Request, res: Response): Promise<void> {
    await vehiclesService.delete(req.params.id as string);
    sendNoContent(res);
  },
};
