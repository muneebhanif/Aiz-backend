import type { Request, Response } from 'express';
import { rentalsService } from '../services/rentals.service.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import type { RentalRow } from '../repositories/rentals.repository.js';

// snake_case DB row → camelCase API response
function toApiRental(row: RentalRow) {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    status: row.status,
    driverName: row.driver_name,
    driverPhone: row.driver_phone,
    driverEmail: row.driver_email,
    driverLicense: row.driver_license,
    driverAddress: row.driver_address,
    weeklyRent: row.weekly_rent,
    deposit: row.deposit,
    startDate: row.start_date,
    endDate: row.end_date,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const rentalsController = {
  async getAll(_req: Request, res: Response): Promise<void> {
    const rentals = await rentalsService.getAll();
    sendSuccess(res, rentals.map(toApiRental));
  },

  async getById(req: Request, res: Response): Promise<void> {
    const rental = await rentalsService.getById(req.params.id as string);
    sendSuccess(res, toApiRental(rental));
  },

  async getByVehicleId(req: Request, res: Response): Promise<void> {
    const rentals = await rentalsService.getByVehicleId(req.params.vehicleId as string);
    sendSuccess(res, rentals.map(toApiRental));
  },

  async create(req: Request, res: Response): Promise<void> {
    const rental = await rentalsService.create({
      vehicle_id: req.body.vehicleId,
      driver_name: req.body.driverName,
      driver_phone: req.body.driverPhone,
      driver_email: req.body.driverEmail,
      driver_license: req.body.driverLicense,
      driver_address: req.body.driverAddress,
      weekly_rent: req.body.weeklyRent,
      deposit: req.body.deposit,
      start_date: req.body.startDate,
      notes: req.body.notes ?? '',
    });
    sendCreated(res, toApiRental(rental));
  },

  async update(req: Request, res: Response): Promise<void> {
    const updates: Record<string, unknown> = {};
    if (req.body.driverName !== undefined) updates.driver_name = req.body.driverName;
    if (req.body.driverPhone !== undefined) updates.driver_phone = req.body.driverPhone;
    if (req.body.driverEmail !== undefined) updates.driver_email = req.body.driverEmail;
    if (req.body.driverLicense !== undefined) updates.driver_license = req.body.driverLicense;
    if (req.body.driverAddress !== undefined) updates.driver_address = req.body.driverAddress;
    if (req.body.weeklyRent !== undefined) updates.weekly_rent = req.body.weeklyRent;
    if (req.body.deposit !== undefined) updates.deposit = req.body.deposit;
    if (req.body.startDate !== undefined) updates.start_date = req.body.startDate;
    if (req.body.notes !== undefined) updates.notes = req.body.notes;

    const rental = await rentalsService.update(req.params.id as string, updates);
    sendSuccess(res, toApiRental(rental));
  },

  async endRental(req: Request, res: Response): Promise<void> {
    const rental = await rentalsService.endRental(req.params.id as string, req.body.endDate);
    sendSuccess(res, toApiRental(rental));
  },
};
