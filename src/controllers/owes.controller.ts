import type { Request, Response } from 'express';
import { owesService } from '../services/owes.service.js';
import { sendCreated, sendNoContent, sendSuccess } from '../utils/response.js';
import type { OwesEntryRow } from '../repositories/owes.repository.js';

function toApiOwesEntry(row: OwesEntryRow) {
  return {
    id: row.id,
    rentalId: row.rental_id,
    driverName: row.driver_name,
    registration: row.registration,
    type: row.entry_type,
    amount: row.amount,
    note: row.note,
    date: row.entry_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const owesController = {
  async getAll(_req: Request, res: Response): Promise<void> {
    const rows = await owesService.getAll();
    sendSuccess(res, rows.map(toApiOwesEntry));
  },

  async getById(req: Request, res: Response): Promise<void> {
    const row = await owesService.getById(req.params.id as string);
    sendSuccess(res, toApiOwesEntry(row));
  },

  async create(req: Request, res: Response): Promise<void> {
    const row = await owesService.create({
      rental_id: req.body.rentalId,
      driver_name: req.body.driverName,
      registration: req.body.registration,
      entry_type: req.body.type,
      amount: req.body.amount,
      note: req.body.note ?? '',
      entry_date: req.body.date,
    });
    sendCreated(res, toApiOwesEntry(row));
  },

  async update(req: Request, res: Response): Promise<void> {
    const updates: Record<string, unknown> = {};
    if (req.body.type !== undefined) updates.entry_type = req.body.type;
    if (req.body.amount !== undefined) updates.amount = req.body.amount;
    if (req.body.note !== undefined) updates.note = req.body.note;
    if (req.body.date !== undefined) updates.entry_date = req.body.date;

    const row = await owesService.update(req.params.id as string, updates);
    sendSuccess(res, toApiOwesEntry(row));
  },

  async delete(req: Request, res: Response): Promise<void> {
    await owesService.delete(req.params.id as string);
    sendNoContent(res);
  },
};
