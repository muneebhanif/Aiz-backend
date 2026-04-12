import type { Request, Response } from 'express';
import { savingsService } from '../services/savings.service.js';
import { sendCreated, sendNoContent, sendSuccess } from '../utils/response.js';
import type { SavingsAccountRow, SavingsEntryRow } from '../repositories/savings.repository.js';

function toApiSavingsAccount(row: SavingsAccountRow) {
  return {
    id: row.id,
    name: row.name,
    openingBalance: row.opening_balance,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toApiSavingsEntry(row: SavingsEntryRow) {
  return {
    id: row.id,
    accountId: row.account_id,
    type: row.entry_type,
    amount: row.amount,
    note: row.note,
    date: row.entry_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const savingsController = {
  async getAccounts(_req: Request, res: Response): Promise<void> {
    const rows = await savingsService.getAllAccounts();
    sendSuccess(res, rows.map(toApiSavingsAccount));
  },

  async getAccountById(req: Request, res: Response): Promise<void> {
    const row = await savingsService.getAccountById(req.params.id as string);
    sendSuccess(res, toApiSavingsAccount(row));
  },

  async createAccount(req: Request, res: Response): Promise<void> {
    const row = await savingsService.createAccount({
      name: req.body.name,
      opening_balance: req.body.openingBalance ?? 0,
    });
    sendCreated(res, toApiSavingsAccount(row));
  },

  async updateAccount(req: Request, res: Response): Promise<void> {
    const updates: Record<string, unknown> = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.openingBalance !== undefined) updates.opening_balance = req.body.openingBalance;

    const row = await savingsService.updateAccount(req.params.id as string, updates);
    sendSuccess(res, toApiSavingsAccount(row));
  },

  async deleteAccount(req: Request, res: Response): Promise<void> {
    await savingsService.deleteAccount(req.params.id as string);
    sendNoContent(res);
  },

  async getEntries(_req: Request, res: Response): Promise<void> {
    const rows = await savingsService.getAllEntries();
    sendSuccess(res, rows.map(toApiSavingsEntry));
  },

  async getEntryById(req: Request, res: Response): Promise<void> {
    const row = await savingsService.getEntryById(req.params.id as string);
    sendSuccess(res, toApiSavingsEntry(row));
  },

  async createEntry(req: Request, res: Response): Promise<void> {
    const row = await savingsService.createEntry({
      account_id: req.body.accountId,
      entry_type: req.body.type,
      amount: req.body.amount,
      note: req.body.note ?? '',
      entry_date: req.body.date,
    });
    sendCreated(res, toApiSavingsEntry(row));
  },

  async updateEntry(req: Request, res: Response): Promise<void> {
    const updates: Record<string, unknown> = {};
    if (req.body.type !== undefined) updates.entry_type = req.body.type;
    if (req.body.amount !== undefined) updates.amount = req.body.amount;
    if (req.body.note !== undefined) updates.note = req.body.note;
    if (req.body.date !== undefined) updates.entry_date = req.body.date;

    const row = await savingsService.updateEntry(req.params.id as string, updates);
    sendSuccess(res, toApiSavingsEntry(row));
  },

  async deleteEntry(req: Request, res: Response): Promise<void> {
    await savingsService.deleteEntry(req.params.id as string);
    sendNoContent(res);
  },
};
