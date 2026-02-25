import type { Request, Response } from 'express';
import { todosService } from '../services/todos.service.js';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response.js';
import type { TodoRow } from '../repositories/todos.repository.js';

// snake_case DB row → camelCase API response
function toApiTodo(row: TodoRow) {
  return {
    id: row.id,
    title: row.title,
    dueDate: row.due_date,
    completed: row.completed,
    priority: row.priority,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const todosController = {
  async getAll(_req: Request, res: Response): Promise<void> {
    const records = await todosService.getAll();
    sendSuccess(res, records.map(toApiTodo));
  },

  async getById(req: Request, res: Response): Promise<void> {
    const record = await todosService.getById(req.params.id as string);
    sendSuccess(res, toApiTodo(record));
  },

  async create(req: Request, res: Response): Promise<void> {
    const record = await todosService.create({
      title: req.body.title,
      due_date: req.body.dueDate,
      completed: req.body.completed ?? false,
      priority: req.body.priority ?? 'medium',
    });
    sendCreated(res, toApiTodo(record));
  },

  async update(req: Request, res: Response): Promise<void> {
    const updates: Record<string, unknown> = {};
    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.dueDate !== undefined) updates.due_date = req.body.dueDate;
    if (req.body.completed !== undefined) updates.completed = req.body.completed;
    if (req.body.priority !== undefined) updates.priority = req.body.priority;

    const record = await todosService.update(req.params.id as string, updates);
    sendSuccess(res, toApiTodo(record));
  },

  async delete(req: Request, res: Response): Promise<void> {
    await todosService.delete(req.params.id as string);
    sendNoContent(res);
  },
};
