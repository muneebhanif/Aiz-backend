import type { Request, Response } from 'express';
import { maintenanceService } from '../services/maintenance.service.js';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response.js';
import type { MaintenanceRow } from '../repositories/maintenance.repository.js';

// snake_case DB row → camelCase API response
function toApiMaintenance(row: MaintenanceRow) {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    date: row.date,
    description: row.description,
    cost: row.cost,
    garage: row.garage,
    remarks: row.remarks,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const maintenanceController = {
  async getAll(req: Request, res: Response): Promise<void> {
    const vehicleId = req.query.vehicleId as string | undefined;
    const records = await maintenanceService.getAll(vehicleId);
    sendSuccess(res, records.map(toApiMaintenance));
  },

  async getById(req: Request, res: Response): Promise<void> {
    const record = await maintenanceService.getById(req.params.id as string);
    sendSuccess(res, toApiMaintenance(record));
  },

  async create(req: Request, res: Response): Promise<void> {
    const record = await maintenanceService.create({
      vehicle_id: req.body.vehicleId,
      date: req.body.date,
      description: req.body.description,
      cost: req.body.cost,
      garage: req.body.garage ?? '',
      remarks: req.body.remarks ?? '',
    });
    sendCreated(res, toApiMaintenance(record));
  },

  async update(req: Request, res: Response): Promise<void> {
    const updates: Record<string, unknown> = {};
    if (req.body.date !== undefined) updates.date = req.body.date;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.cost !== undefined) updates.cost = req.body.cost;
    if (req.body.garage !== undefined) updates.garage = req.body.garage;
    if (req.body.remarks !== undefined) updates.remarks = req.body.remarks;

    const record = await maintenanceService.update(req.params.id as string, updates);
    sendSuccess(res, toApiMaintenance(record));
  },

  async delete(req: Request, res: Response): Promise<void> {
    await maintenanceService.delete(req.params.id as string);
    sendNoContent(res);
  },
};
